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
const WEB_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// YouTube consent cookie to bypass consent pages on cloud servers (EU regions etc.)
const YT_CONSENT_COOKIE = "CONSENT=PENDING+987; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwODI5LjA3X3AxGgJlbiACGgYIgJnBlwY";

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
        "X-YouTube-Client-Name": "3",
        "X-YouTube-Client-Version": ANDROID_VERSION,
        "Origin": "https://www.youtube.com",
        "Referer": "https://www.youtube.com/",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: ANDROID_VERSION,
            hl: "en",
            gl: "US",
            androidSdkVersion: 34,
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
    headers: {
      "User-Agent": WEB_USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Cookie": YT_CONSENT_COOKIE,
    },
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

/** Fetch transcript via InnerTube get_transcript endpoint (works better from cloud servers) */
async function fetchViaInnerTubeTranscript(videoId: string): Promise<TranscriptSegment[] | null> {
  try {
    // First, get the video page to extract a valid API key
    const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": WEB_USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": YT_CONSENT_COOKIE,
      },
    });
    const html = await pageResponse.text();

    // Extract the innertube API key from the page
    const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
    if (!apiKeyMatch) return null;
    const apiKey = apiKeyMatch[1];

    // Extract serialized share entity (for get_transcript)
    // Try to find caption tracks from ytInitialPlayerResponse first
    const marker = "var ytInitialPlayerResponse = ";
    const startIdx = html.indexOf(marker);
    if (startIdx === -1) return null;

    const jsonStart = startIdx + marker.length;
    let braceCount = 0;
    let endIdx = jsonStart;
    for (let i = jsonStart; i < html.length; i++) {
      if (html[i] === "{") braceCount++;
      else if (html[i] === "}") {
        braceCount--;
        if (braceCount === 0) { endIdx = i + 1; break; }
      }
    }

    let playerResponse: { captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] } } };
    try {
      playerResponse = JSON.parse(html.slice(jsonStart, endIdx));
    } catch {
      return null;
    }

    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      // Try the InnerTube get_transcript API as last resort
      const transcriptResponse = await fetch(
        `https://www.youtube.com/youtubei/v1/get_transcript?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": WEB_USER_AGENT,
            "Cookie": YT_CONSENT_COOKIE,
          },
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB",
                clientVersion: "2.20240313.00.00",
                hl: "en",
                gl: "US",
              },
            },
            params: Buffer.from(`\n\x0b${videoId}`).toString("base64"),
          }),
        }
      );

      if (!transcriptResponse.ok) return null;

      interface TranscriptCue {
        transcriptCueGroupRenderer?: {
          cues?: Array<{
            transcriptCueRenderer?: {
              cue?: { simpleText?: string };
              startOffsetMs?: string;
              durationMs?: string;
            };
          }>;
        };
      }

      const transcriptData = await transcriptResponse.json() as {
        actions?: Array<{
          updateEngagementPanelAction?: {
            content?: {
              transcriptRenderer?: {
                body?: {
                  transcriptBodyRenderer?: {
                    cueGroups?: TranscriptCue[];
                  };
                };
              };
            };
          };
        }>;
      };

      const cueGroups = transcriptData?.actions?.[0]?.updateEngagementPanelAction
        ?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups;

      if (!Array.isArray(cueGroups) || cueGroups.length === 0) return null;

      const segments: TranscriptSegment[] = [];
      for (const group of cueGroups) {
        const cue = group.transcriptCueGroupRenderer?.cues?.[0]?.transcriptCueRenderer;
        if (cue?.cue?.simpleText) {
          segments.push({
            text: cue.cue.simpleText,
            offset: parseInt(cue.startOffsetMs || "0", 10),
            duration: parseInt(cue.durationMs || "0", 10),
          });
        }
      }

      return segments.length > 0 ? segments : null;
    }

    // We have caption tracks — fetch the transcript XML
    return await fetchFromCaptionTrack(captionTracks[0].baseUrl);
  } catch {
    return null;
  }
}

/**
 * Fetch transcript for a YouTube video.
 * Tries multiple methods: InnerTube Android API → InnerTube Web transcript → Web page scraping.
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  // Method 1: InnerTube Android API (fastest, works well locally)
  const innerTubeResult = await fetchViaInnerTube(videoId);
  if (innerTubeResult && innerTubeResult.length > 0) {
    return innerTubeResult;
  }

  // Method 2: InnerTube Web with get_transcript API (better from cloud servers)
  const webInnerTubeResult = await fetchViaInnerTubeTranscript(videoId);
  if (webInnerTubeResult && webInnerTubeResult.length > 0) {
    return webInnerTubeResult;
  }

  // Method 3: Direct web page scraping (last resort)
  return fetchViaWebPage(videoId);
}
