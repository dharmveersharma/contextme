import { NextResponse } from "next/server";
import OpenAI from "openai";

interface ExtractedInsights {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  sourceUrl: string;
}

// Simple HTML to text extractor (no external dependencies)
function extractTextFromHtml(html: string): string {
  let text = html;

  // Remove script and style blocks entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");
  text = text.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  text = text.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, "");
  text = text.replace(/<form[\s\S]*?<\/form>/gi, "");

  // Try to extract content from article or main tags first
  const articleMatch = text.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  const mainMatch = text.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);

  if (articleMatch) {
    text = articleMatch[1];
  } else if (mainMatch) {
    text = mainMatch[1];
  }

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&#x27;/g, "'");
  text = text.replace(/&#\d+;/g, "");

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format. Please include http:// or https://" },
        { status: 400 }
      );
    }

    // 2. Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // 3. Fetch URL content with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let htmlContent: string;
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: `The URL returned an error (status ${response.status}). Please check the link.` },
          { status: 400 }
        );
      }

      htmlContent = await response.text();
    } catch (fetchError: unknown) {
      clearTimeout(timeout);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "Request timed out. The website took too long to respond." },
          { status: 408 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Could not fetch the URL. Please check the link and try again." },
        { status: 400 }
      );
    }

    // 4. Check for error pages before extracting text
    // Detect error pages by HTTP status codes in title/heading or common error patterns
    const errorPagePatterns = [
      /<title[^>]*>[^<]*(404|not found|page not found|error|403|forbidden|500|server error|unavailable|does not exist|couldn't find|page missing)[^<]*<\/title>/i,
      /<h1[^>]*>[^<]*(404|not found|page not found|error|forbidden|unavailable)[^<]*<\/h1>/i,
      /<h2[^>]*>[^<]*(404|not found|page not found|error)[^<]*<\/h2>/i,
    ];

    const isErrorPage = errorPagePatterns.some((pattern) => pattern.test(htmlContent));
    if (isErrorPage) {
      return NextResponse.json(
        { success: false, error: "This URL leads to an error page (404/Not Found). Please check the link and try again." },
        { status: 400 }
      );
    }

    // Also check if the page is a login/auth wall
    const authPatterns = [
      /(<title[^>]*>[^<]*(sign in|log in|login|sign up|register|authentication)[^<]*<\/title>)/i,
    ];
    const isAuthPage = authPatterns.some((pattern) => pattern.test(htmlContent));
    if (isAuthPage) {
      return NextResponse.json(
        { success: false, error: "This URL requires login/authentication. We can't extract content from protected pages." },
        { status: 400 }
      );
    }

    // 5. Extract text from HTML
    let textContent = extractTextFromHtml(htmlContent);

    if (textContent.length < 100) {
      return NextResponse.json(
        { success: false, error: "Not enough content found on this page to extract insights." },
        { status: 400 }
      );
    }

    // Check for very low content-to-noise ratio (likely not a real article)
    const wordCount = textContent.split(/\s+/).length;
    if (wordCount < 50) {
      return NextResponse.json(
        { success: false, error: "Not enough meaningful content found on this page. Try a different URL with more text content." },
        { status: 400 }
      );
    }

    // Truncate to ~6000 characters to save tokens
    if (textContent.length > 6000) {
      textContent = textContent.substring(0, 6000) + "...";
    }

    // 5. Call OpenAI
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert content analyst. Given the text content from a web page, extract detailed and accurate structured insights.

IMPORTANT: First, determine if this is actual article/blog/meaningful content. If the text appears to be an error page (404, 500, "page not found"), a login/signup page, a cookie consent page, mostly navigation/menu text, or otherwise NOT a real article with substantial content, then return:
{"isErrorPage": true, "error": "Brief description of why this isn't extractable content"}

If it IS real content, return a JSON object with exactly these fields:
- "isErrorPage": false
- "title": The main title or topic of the content (string)
- "summary": A detailed 4-6 sentence summary that captures the main argument, key findings, and conclusion. Be specific with names, numbers, and facts mentioned in the content. (string)
- "keyPoints": An array of 5-7 key insights or takeaways. Each point should be a detailed sentence, not just a phrase. Include specific details, data points, or examples from the content. (string[])
- "tags": An array of 4-8 relevant topic tags, lowercase (string[])

Return ONLY valid JSON. No other text.`,
        },
        {
          role: "user",
          content: `Extract insights from this web page content:\n\n${textContent}`,
        },
      ],
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      return NextResponse.json(
        { success: false, error: "AI analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // 6. Parse AI response
    let insights: { isErrorPage?: boolean; error?: string; title?: string; summary?: string; keyPoints?: string[]; tags?: string[] };
    try {
      insights = JSON.parse(aiResponse);
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Check if AI detected this as an error/non-content page
    if (insights.isErrorPage) {
      return NextResponse.json(
        { success: false, error: insights.error || "This page doesn't contain extractable article content. Please try a different URL." },
        { status: 400 }
      );
    }

    // 7. Return structured response
    const result: ExtractedInsights = {
      title: insights.title || "Untitled",
      summary: insights.summary || "No summary available.",
      keyPoints: insights.keyPoints || [],
      tags: insights.tags || [],
      sourceUrl: url,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
