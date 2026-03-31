"use client";

import { useState } from "react";
import Link from "next/link";
import { ExtractedInsights } from "@/lib/types";
import { saveToHistory } from "@/lib/history";
import { copyToClipboard, downloadAsMarkdown, printAsPdf } from "@/lib/export";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";

function LoadingSkeleton() {
  return (
    <div className="mx-auto mt-8 max-w-3xl space-y-4 px-4">
      <p className="text-center text-sm text-[#a8a29e] animate-fade-in-up">
        Gently reading the page and gathering the best ideas for you&hellip;
      </p>
      {[1, 2, 3].map((card) => (
        <div key={card} className="glass-card p-5 animate-fade-in-up">
          <div className="h-3 w-24 skeleton-block rounded mb-4" />
          <div className="h-5 w-2/3 skeleton-block rounded mb-3" />
          <div className="space-y-2">
            <div className="h-3.5 w-full skeleton-block rounded" />
            <div className="h-3.5 w-5/6 skeleton-block rounded" />
            <div className="h-3.5 w-2/3 skeleton-block rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

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
    <div className="mx-auto mt-8 max-w-3xl space-y-4 px-4 pb-12">
      <div className="glass-card p-6 animate-fade-in-up">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Saved page</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#2f241d]">{data.title}</h2>
        <div className="mt-3 flex items-center gap-2">
          {icons.externalLink("w-4 h-4 text-[#8a817b] shrink-0")}
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm text-[#8a817b] transition-colors hover:text-[#4f46e5]"
          >
            {data.sourceUrl}
          </a>
        </div>
      </div>

      <div className="glass-card p-6 animate-fade-in-up stagger-1">
        <div className="mb-3 flex items-center gap-2">
          {icons.document("w-4 h-4 text-[#4f46e5]")}
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Summary</p>
        </div>
        <p className="text-sm leading-7 text-[#5d4e43]">{data.summary}</p>
      </div>

      <div className="glass-card p-6 animate-fade-in-up stagger-2">
        <div className="mb-4 flex items-center gap-2">
          {icons.bolt("w-4 h-4 text-[#d97706]")}
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Key takeaways</p>
        </div>
        <div className="space-y-3">
          {data.keyPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-[22px] border border-[rgba(28,25,23,0.08)] bg-[#fffdf9] p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-xs font-semibold text-[#4f46e5]">
                {index + 1}
              </span>
              <span className="text-sm leading-7 text-[#5d4e43]">{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up stagger-3">
        <div className="mb-2 flex items-center gap-2 px-1">
          {icons.tag("w-4 h-4 text-[#d97706]")}
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Tags</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-full px-3 py-1.5 text-xs ${index % 2 === 0 ? "bg-[#eef0ff] text-[#4f46e5]" : "bg-[#fff3e0] text-[#d97706]"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 animate-fade-in-up stagger-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
          >
            {copied ? icons.check("w-3.5 h-3.5 text-[#d97706]") : icons.clipboard("w-3.5 h-3.5")}
            <span>{copied ? "Copied" : "Copy All"}</span>
          </button>
          <button
            onClick={() => downloadAsMarkdown(data)}
            className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
          >
            {icons.document("w-3.5 h-3.5")}
            <span>Markdown</span>
          </button>
          <button
            onClick={() => printAsPdf(data)}
            className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
          >
            {icons.download("w-3.5 h-3.5")}
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
          // Keep the extracted result visible even if history save fails.
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

      <section className="relative px-4 pt-32 pb-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,70,229,0.12)] bg-[#eef0ff] px-4 py-2 text-xs text-[#4f46e5] animate-fade-in-up">
            {icons.sparkles("w-3.5 h-3.5")}
            AI-assisted capture
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-[#2f241d] sm:text-4xl animate-fade-in-up stagger-1">
            Turn any page into something worth{" "}
            <span className="gradient-text-warm">remembering</span>.
          </h1>
          <p className="mt-4 text-base leading-8 text-[#6f5e52] animate-fade-in-up stagger-2">
            Paste a URL and ContextMe will pull out the important ideas, tags, and takeaways in a format that feels easy to revisit later.
          </p>
          <p className="mt-2 text-sm text-[#a8a29e] animate-fade-in-up stagger-3">
            What&apos;s worth keeping today?
          </p>

          <form onSubmit={handleExtract} className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in-up stagger-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                {icons.link("w-4 h-4 text-[#a8a29e]")}
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL to save and summarize..."
                disabled={loading}
                className="w-full rounded-[24px] border border-[rgba(28,25,23,0.08)] bg-white py-3 pl-11 pr-4 text-sm text-[#1c1917] placeholder:text-[#a8a29e] transition-all focus:border-[rgba(79,70,229,0.2)] focus:ring-1 focus:ring-[rgba(79,70,229,0.14)] focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-[#4f46e5] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-50"
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

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-500 animate-fade-in-up">
              {icons.warning("w-4 h-4")}
              {error}
            </div>
          )}
        </div>
      </section>

      {savedToast && (
        <div className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(79,70,229,0.12)] bg-[#eef0ff] px-4 py-2 text-xs font-medium text-[#4f46e5] animate-fade-in">
          {icons.check("w-3.5 h-3.5")}
          Saved to history
          <Link href="/history" className="underline transition-colors hover:text-[#4338ca]">View</Link>
        </div>
      )}

      {loading && <LoadingSkeleton />}
      {result && <InsightResults data={result} />}

      {!loading && !result && !error && (
        <div className="mx-auto mt-8 max-w-3xl px-4 pb-16 animate-fade-in-up">
          {/* Warm welcome card */}
          <div className="rounded-[32px] border border-[rgba(79,70,229,0.08)] bg-[linear-gradient(150deg,rgba(255,255,255,0.98)_0%,rgba(238,240,255,0.45)_60%,rgba(255,243,224,0.35)_100%)] p-10 text-center shadow-[0_12px_40px_rgba(28,25,23,0.05)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#eef0ff]">
              {icons.brain("w-10 h-10 text-[#4f46e5] animate-breathe")}
            </div>
            <h3 className="text-lg font-semibold text-[#1c1917]">Ready to capture something worth keeping?</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#6b645f]">
              Paste any link above. We&apos;ll quietly extract the key ideas, tags, and takeaways — so you can read less and remember more.
            </p>

            {/* Suggestion chips */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "📰 A news article",
                "📚 A blog post",
                "🔬 A research paper",
                "💡 An inspiring essay",
              ].map((example) => (
                <span
                  key={example}
                  className="rounded-full border border-[rgba(28,25,23,0.08)] bg-white px-4 py-2 text-xs text-[#6b645f]"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>

          {/* Affirmation */}
          <p className="mt-6 text-center text-xs italic text-[#a8a29e]">
            &ldquo;Every saved note is a small gift to your future self.&rdquo;
          </p>
          <p className="mt-2 text-center text-xs text-[#c4bdb8]">
            Your notes stay private — only you can see them.
          </p>
        </div>
      )}
    </main>
  );
}
