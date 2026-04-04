// ─── YouTube URL Utilities & API Helpers ─────────────────────────────────────
// isYouTubeUrl / extractVideoId are pure functions — safe to use in client components.
// fetchYouTubeMetadata / fetchYouTubeTranscript are server-only (use process.env).

// ── URL patterns ─────────────────────────────────────────────────────────────
const YOUTUBE_PATTERNS: RegExp[] = [
  // youtube.com/watch?v=ID  (with or without other params)
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})/,
  // youtu.be/ID
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // youtube.com/shorts/ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  // youtube.com/embed/ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
];

/** Returns true if the URL is any recognisable YouTube video URL. */
export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Extracts the 11-character video ID from a YouTube URL.
 * Returns null if the URL is not a recognised YouTube URL.
 */
export function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

// ── Video metadata via oEmbed (free, no API key) ──────────────────────────────
export interface YouTubeMetadata {
  title: string;
  channelName: string;
  thumbnailUrl: string;
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata> {
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

  const response = await fetch(oEmbedUrl, { next: { revalidate: 3600 } });
  if (!response.ok) {
    // Graceful fallback — not critical if oEmbed fails
    return { title: "YouTube Video", channelName: "Unknown Channel", thumbnailUrl: "" };
  }

  const data = await response.json();
  return {
    title: data.title ?? "YouTube Video",
    channelName: data.author_name ?? "Unknown Channel",
    thumbnailUrl: data.thumbnail_url ?? "",
  };
}

// ── Transcript via Supadata ───────────────────────────────────────────────────
const MAX_TRANSCRIPT_CHARS = 12000;

interface SupadataSegment {
  text: string;
  offset?: number;
  duration?: number;
}

interface SupadataResponse {
  content: string | SupadataSegment[];
  videoId?: string;
  lang?: string;
}

export async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) {
    throw new Error("SUPADATA_API_KEY is not configured on the server.");
  }

  const response = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "No transcript found for this video. It may have captions disabled or be a private/deleted video."
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Supadata API key is invalid or unauthorised.");
    }
    throw new Error(
      `Transcript service returned an error (status ${response.status}). Please try again.`
    );
  }

  const data: SupadataResponse = await response.json();

  // Supadata can return either plain text or an array of timed segments
  let fullText: string;
  if (typeof data.content === "string") {
    fullText = data.content;
  } else if (Array.isArray(data.content)) {
    fullText = data.content.map((seg) => seg.text).join(" ");
  } else {
    throw new Error("Unexpected response format from transcript service.");
  }

  fullText = fullText.replace(/\s+/g, " ").trim();

  if (fullText.length < 100) {
    throw new Error(
      "The transcript for this video is too short to extract meaningful insights."
    );
  }

  // Smart truncation: keep first 10k + last 2k chars to capture intro & conclusion
  if (fullText.length > MAX_TRANSCRIPT_CHARS) {
    const head = fullText.substring(0, 10000);
    const tail = fullText.substring(fullText.length - 2000);
    fullText = `${head}\n\n[...transcript continues...]\n\n${tail}`;
  }

  return fullText;
}
