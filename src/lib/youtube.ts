// ─── YouTube URL Detection, Video ID Extraction & Transcript Fetching ───

/**
 * All recognized YouTube URL patterns:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */

const YOUTUBE_PATTERNS = [
  // youtu.be/VIDEO_ID
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // youtube.com/watch?v=VIDEO_ID (with optional www., m.)
  /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  // youtube.com/embed/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // youtube.com/v/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  // youtube.com/shorts/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

/** Check if a URL is a YouTube video URL */
export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_PATTERNS.some((pattern) => pattern.test(url));
}

/** Extract the 11-character video ID from any YouTube URL format */
export function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// ─── Transcript Fetching (zero dependencies) ────────────────

export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
}

const INNERTUBE_URL = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const ANDROID_VERSION = "20.10.38";
const ANDROID_USER_AGENT = `com.google.android.youtube/${ANDROID_VERSION} (Linux; U; Android 14)`;
const WEB_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";

/** Decode HTML entities in transcript text */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)));
}

/** Parse transcript XML into segments (supports both srv3 <p> and classic <text> formats) */
function parseTranscriptXml(xml: string): TranscriptSegment[] {
  // Try srv3 format first: <p t="ms" d="ms">text</p>
  const srv3Regex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  const segments: TranscriptSegment[] = [];
  let match;

  while ((match = srv3Regex.exec(xml)) !== null) {
    const offset = parseInt(match[1], 10);
    const duration = parseInt(match[2], 10);
    const rawContent = match[3];

    // Extract text from <s> tags if present, otherwise use raw content
    let text = "";
    const sTagRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch;
    while ((sMatch = sTagRegex.exec(rawContent)) !== null) {
      text += sMatch[1];
    }
    if (!text) {
      text = rawContent.replace(/<[^>]+>/g, "");
    }

    text = decodeEntities(text).trim();
    if (text) {
      segments.push({ text, duration, offset });
    }
  }

  if (segments.length > 0) return segments;

  // Fallback: classic format <text start="s" dur="s">text</text>
  const classicRegex = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
  while ((match = classicRegex.exec(xml)) !== null) {
    segments.push({
      text: decodeEntities(match[3]),
      duration: parseFloat(match[2]),
      offset: parseFloat(match[1]),
    });
  }

  return segments;
}

/** Extract caption tracks from the InnerTube player response */
interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

/** Fetch transcript via YouTube InnerTube API (Android client) */
async function fetchViaInnerTube(videoId: string): Promise<TranscriptSegment[] | null> {
  try {
    const response = await fetch(INNERTUBE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": ANDROID_USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: ANDROID_VERSION,
          },
        },
        videoId,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks as CaptionTrack[] | undefined;

    if (!Array.isArray(captionTracks) || captionTracks.length === 0) return null;

    return await fetchFromCaptionTrack(captionTracks[0].baseUrl);
  } catch {
    return null;
  }
}

/** Fetch transcript via web page scraping (fallback) */
async function fetchViaWebPage(videoId: string): Promise<TranscriptSegment[]> {
  const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": WEB_USER_AGENT },
  });
  const html = await pageResponse.text();

  if (html.includes('class="g-recaptcha"')) {
    throw new Error("Too many requests — YouTube is requiring captcha verification.");
  }

  if (!html.includes('"playabilityStatus":')) {
    throw new Error("This video is no longer available.");
  }

  // Extract ytInitialPlayerResponse JSON
  const marker = "var ytInitialPlayerResponse = ";
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    throw new Error("No transcripts are available for this video.");
  }

  const jsonStart = startIdx + marker.length;
  let braceCount = 0;
  let endIdx = jsonStart;

  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === "{") braceCount++;
    else if (html[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  let playerResponse: { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] } } };
  try {
    playerResponse = JSON.parse(html.slice(jsonStart, endIdx));
  } catch {
    throw new Error("No transcripts are available for this video.");
  }

  const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
    throw new Error("Transcript is disabled on this video.");
  }

  return await fetchFromCaptionTrack(captionTracks[0].baseUrl);
}

/** Fetch and parse transcript XML from a caption track URL */
async function fetchFromCaptionTrack(trackUrl: string): Promise<TranscriptSegment[]> {
  // Validate URL points to YouTube
  try {
    const parsed = new URL(trackUrl);
    if (!parsed.hostname.endsWith(".youtube.com")) {
      throw new Error("No transcripts are available for this video.");
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("No transcripts")) throw err;
    throw new Error("No transcripts are available for this video.");
  }

  const response = await fetch(trackUrl, {
    headers: { "User-Agent": WEB_USER_AGENT },
  });

  if (!response.ok) {
    throw new Error("No transcripts are available for this video.");
  }

  const xml = await response.text();
  return parseTranscriptXml(xml);
}

/**
 * Fetch transcript for a YouTube video.
 * Tries InnerTube API first, falls back to web page scraping.
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  // Try InnerTube API first (faster, more reliable)
  const innerTubeResult = await fetchViaInnerTube(videoId);
  if (innerTubeResult && innerTubeResult.length > 0) {
    return innerTubeResult;
  }

  // Fallback to web page scraping
  return fetchViaWebPage(videoId);
}
