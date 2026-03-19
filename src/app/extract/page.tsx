"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────
interface ExtractedInsights {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  sourceUrl: string;
}

// ─── Icons ──────────────────────────────────────────────────
const icons = {
  brain: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  sparkles: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  bolt: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  link: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  ),
  tag: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  ),
  spinner: (cls: string) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

// ─── Navbar ─────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          {icons.brain("w-5 h-5 text-violet-400")}
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">ContextMe</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-300 hover:text-white transition-colors px-3 py-1.5">Log In</button>
          <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-full transition-colors font-medium">Sign Up</button>
        </div>
      </div>
    </nav>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-3">
      {/* Title skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <div className="h-2 w-12 bg-violet-500/20 rounded mb-2 animate-pulse" />
        <div className="h-5 w-3/4 bg-white/5 rounded animate-shimmer" />
      </div>
      {/* Summary skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <div className="h-2 w-16 bg-violet-500/20 rounded mb-2 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded animate-shimmer" />
          <div className="h-3 w-5/6 bg-white/5 rounded animate-shimmer" />
          <div className="h-3 w-2/3 bg-white/5 rounded animate-shimmer" />
        </div>
      </div>
      {/* Key Points skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <div className="h-2 w-20 bg-violet-500/20 rounded mb-3 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-violet-500/10 animate-pulse" />
              <div className="h-3 flex-1 bg-white/5 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
      {/* Tags skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-16 rounded-full bg-violet-500/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ─── Results Display ────────────────────────────────────────
function InsightResults({ data }: { data: ExtractedInsights }) {
  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-3">
      {/* Title */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1 font-medium">Title</p>
        <h2 className="text-base font-bold text-white">{data.title}</h2>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1 font-medium">Summary</p>
        <p className="text-sm text-gray-300 leading-relaxed">{data.summary}</p>
      </div>

      {/* Key Insights */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-2 font-medium">Key Insights</p>
        <ul className="space-y-2">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              {icons.bolt("w-4 h-4 text-indigo-400 shrink-0 mt-0.5")}
              <span className="text-sm text-gray-300 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {data.tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs"
          >
            {icons.tag("w-3 h-3")}
            {tag}
          </span>
        ))}
      </div>

      {/* Source */}
      <div className="flex items-center gap-1.5 pt-2 pb-12">
        {icons.link("w-3 h-3 text-gray-500 shrink-0")}
        <a
          href={data.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors truncate max-w-full"
        >
          Source: {data.sourceUrl}
        </a>
      </div>
    </div>
  );
}

// ─── Main Extract Page ──────────────────────────────────────
export default function ExtractPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractedInsights | null>(null);

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    // Client-side validation
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Header + Input Section */}
      <section className="pt-20 pb-4 relative">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-4">
            {icons.sparkles("w-3 h-3")}
            <span>AI-Powered Extraction</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Extract Insights from{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Any URL
            </span>
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Paste an article, blog post, or web page — AI will extract the key takeaways instantly.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleExtract} className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icons.link("w-4 h-4 text-gray-500")}
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL to extract insights..."
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              {loading ? (
                <>
                  {icons.spinner("w-4 h-4 animate-spin")}
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  {icons.sparkles("w-4 h-4")}
                  <span>Extract</span>
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-red-400 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results or Loading */}
      {loading && <LoadingSkeleton />}
      {result && <InsightResults data={result} />}

      {/* Empty state when no results yet */}
      {!loading && !result && !error && (
        <div className="max-w-2xl mx-auto px-4 mt-8 text-center">
          <div className="rounded-xl border border-dashed border-white/10 p-8">
            {icons.brain("w-10 h-10 text-gray-700 mx-auto mb-3")}
            <p className="text-sm text-gray-600 mb-1">Your insights will appear here</p>
            <p className="text-xs text-gray-700">Try pasting a blog post, news article, or any web page URL above</p>
          </div>
        </div>
      )}
    </main>
  );
}
