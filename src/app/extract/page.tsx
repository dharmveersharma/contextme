"use client";

import { useState } from "react";
import Link from "next/link";
import { ExtractedInsights } from "@/lib/types";
import { saveToHistory } from "@/lib/history";
import { copyToClipboard, downloadAsMarkdown, printAsPdf } from "@/lib/export";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";

// ─── Loading Skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-3 px-4">
      {/* Title + Source skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up">
        <div className="h-2.5 w-16 skeleton-block rounded mb-3" />
        <div className="h-5 w-3/4 skeleton-block rounded mb-2" />
        <div className="h-3 w-1/2 skeleton-block rounded" />
      </div>
      {/* Summary skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded skeleton-block" />
          <div className="h-2.5 w-20 skeleton-block rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-full skeleton-block rounded" />
          <div className="h-3.5 w-5/6 skeleton-block rounded" />
          <div className="h-3.5 w-2/3 skeleton-block rounded" />
        </div>
      </div>
      {/* Key Insights skeleton */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up stagger-2">
        <div className="h-2.5 w-24 skeleton-block rounded mb-3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 mb-2.5">
            <div className="w-6 h-6 rounded-lg skeleton-block shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-full skeleton-block rounded" />
              <div className="h-3 w-4/5 skeleton-block rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up stagger-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-7 w-20 rounded-full skeleton-block" />
        ))}
      </div>
    </div>
  );
}

// ─── Results Display (Card Sections) ────────────────────────
function InsightResults({ data }: { data: ExtractedInsights }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(data);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-3 px-4">
      {/* ── Card 1: Title + Source ── */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up">
        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-2 font-medium">Title</p>
        <h2 className="text-lg font-bold leading-snug mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-violet-200">
          {data.title}
        </h2>
        <div className="flex items-center gap-1.5">
          {icons.externalLink("w-3 h-3 text-gray-500 shrink-0")}
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors truncate max-w-full"
          >
            {data.sourceUrl}
          </a>
        </div>
      </div>

      {/* ── Card 2: Summary ── */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-2">
          {icons.document("w-4 h-4 text-violet-400")}
          <p className="text-[10px] text-violet-400 uppercase tracking-wider font-medium">Summary</p>
        </div>
        <p className="text-[13px] text-gray-300 leading-relaxed">{data.summary}</p>
      </div>

      {/* ── Card 3: Key Insights with numbered badges ── */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-5 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 mb-3">
          {icons.bolt("w-4 h-4 text-indigo-400")}
          <p className="text-[10px] text-violet-400 uppercase tracking-wider font-medium">Key Insights</p>
        </div>
        <div className="space-y-2.5">
          {data.keyPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border-l-2 border-violet-500/30 hover:bg-white/[0.04] transition-colors"
            >
              <span className="shrink-0 w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center text-[11px] font-bold text-violet-300">
                {i + 1}
              </span>
              <span className="text-sm text-gray-300 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 4: Tags ── */}
      <div className="animate-fade-in-up stagger-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          {icons.tag("w-3.5 h-3.5 text-violet-400")}
          <p className="text-[10px] text-violet-400 uppercase tracking-wider font-medium">Tags</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs hover:bg-violet-500/15 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Card 5: Export Actions ── */}
      <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4 animate-fade-in-up stagger-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-400 hover:text-violet-300 text-xs transition-all hover:bg-violet-500/5"
          >
            {copied ? (
              <>
                {icons.check("w-3.5 h-3.5 text-green-400")}
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                {icons.clipboard("w-3.5 h-3.5")}
                <span>Copy All</span>
              </>
            )}
          </button>
          <button
            onClick={() => downloadAsMarkdown(data)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-400 hover:text-violet-300 text-xs transition-all hover:bg-violet-500/5"
          >
            {icons.document("w-3.5 h-3.5")}
            <span>Markdown</span>
          </button>
          <button
            onClick={() => printAsPdf(data)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-400 hover:text-violet-300 text-xs transition-all hover:bg-violet-500/5"
          >
            {icons.download("w-3.5 h-3.5")}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}

// ─── Main Extract Page ──────────────────────────────────────
export default function ExtractPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractedInsights | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

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
        try {
          await saveToHistory(data.data);
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 3000);
        } catch {
          // Save failed silently — user can still see results
        }
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-4 animate-fade-in-up">
            {icons.sparkles("w-3 h-3")}
            <span>AI-Powered Extraction</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in-up stagger-1">
            Extract Insights from{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Any URL
            </span>
          </h1>
          <p className="text-sm text-gray-400 mb-6 animate-fade-in-up stagger-2">
            Paste an article, blog post, or web page — AI will extract the key takeaways instantly.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleExtract} className="flex gap-2 animate-fade-in-up stagger-3">
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
            <div className="mt-3 flex items-center justify-center gap-1.5 text-red-400 text-xs animate-fade-in-up">
              {icons.warning("w-3.5 h-3.5")}
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Saved Toast */}
      {savedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-medium animate-fade-in">
          {icons.check("w-3.5 h-3.5")}
          Saved to history
          <Link href="/history" className="underline hover:text-green-300 transition-colors">View</Link>
        </div>
      )}

      {/* Results or Loading */}
      {loading && <LoadingSkeleton />}
      {result && <InsightResults data={result} />}

      {/* Empty state */}
      {!loading && !result && !error && (
        <div className="max-w-2xl mx-auto px-4 mt-8 text-center animate-fade-in-up">
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
