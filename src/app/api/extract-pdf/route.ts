import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
// Import from the lib path to avoid pdf-parse's internal test-file require() issues in Next.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_CHARS = 12000; // chars sent to OpenAI (~3 000 tokens)

export async function POST(request: Request) {
  try {
    // ── 1. Auth check ──────────────────────────────────────────────
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // ── 2. Parse FormData ───────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request format." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No PDF file provided." },
        { status: 400 }
      );
    }

    // ── 3. Validate file ────────────────────────────────────────────
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a PDF under 5 MB.`,
        },
        { status: 400 }
      );
    }

    // ── 4. Extract text from PDF ────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());

    let rawText: string;
    try {
      const pdfData = await pdfParse(buffer);
      rawText = pdfData.text ?? "";
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not read this PDF. It may be encrypted, corrupted, or contain only scanned images.",
        },
        { status: 400 }
      );
    }

    // Clean up excessive whitespace
    const pdfText = rawText.replace(/\s+/g, " ").trim();

    if (pdfText.length < 150) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Not enough readable text in this PDF. It may be a scanned document — please use a PDF with selectable text.",
        },
        { status: 400 }
      );
    }

    // Truncate to stay well within OpenAI token limits
    const truncatedText =
      pdfText.length > MAX_TEXT_CHARS
        ? pdfText.substring(0, MAX_TEXT_CHARS) + "…"
        : pdfText;

    // ── 5. Check API key ────────────────────────────────────────────
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // ── 6. Call OpenAI ──────────────────────────────────────────────
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert content analyst. Given text extracted from a PDF document, return a JSON object with exactly these fields:
- "title": The main title or topic of the document (string)
- "summary": A detailed 4-6 sentence summary covering the main argument, key findings, and conclusions. Be specific — include names, numbers, and facts from the text. (string)
- "keyPoints": An array of 5-7 key insights or takeaways. Each must be a full, detailed sentence. Include specific data points or examples. (string[])
- "tags": An array of 4-8 relevant lowercase topic tags (string[])

Return ONLY valid JSON. No extra text or markdown.`,
        },
        {
          role: "user",
          content: `Extract insights from this PDF document:\n\n${truncatedText}`,
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

    // ── 7. Parse AI response ────────────────────────────────────────
    let insights: {
      title?: string;
      summary?: string;
      keyPoints?: string[];
      tags?: string[];
    };

    try {
      insights = JSON.parse(aiResponse);
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // ── 8. Return result ────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      data: {
        title: insights.title || file.name.replace(/\.pdf$/i, ""),
        summary: insights.summary || "No summary available.",
        keyPoints: insights.keyPoints || [],
        tags: insights.tags || [],
        // "pdf://" prefix lets the UI distinguish PDFs from URLs
        sourceUrl: `pdf://${file.name}`,
      },
    });
  } catch (error: unknown) {
    console.error("Extract-PDF API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
