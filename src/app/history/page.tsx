"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HistoryItem, ExtractedInsights } from "@/lib/types";
import {
  getHistory,
  deleteFromHistory,
  clearHistory,
  formatRelativeTime,
} from "@/lib/history";
import { copyToClipboard, downloadAsMarkdown, printAsPdf } from "@/lib/export";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";

function toExtractedInsights(item: HistoryItem): ExtractedInsights {
  return {
    title: item.title,
    summary: item.summary,
    keyPoints: item.key_points,
    tags: item.tags,
    sourceUrl: item.source_url,
  };
}

function HistoryCard({
  item,
  isExpanded,
  onToggle,
  onDelete,
}: {
  item: HistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const exportData = toExtractedInsights(item);

  return (
    <div className="glass-card-hover overflow-hidden">
      <button type="button" className="w-full p-5 text-left" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-medium text-[#2f241d]">{item.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#6f5e52]">{item.summary}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1 text-xs text-[#8a817b]">
              {icons.clock("w-3.5 h-3.5")}
              <span>{formatRelativeTime(item.created_at)}</span>
            </div>
            <div className="mt-2 flex justify-end text-[#8a817b]">
              {isExpanded ? icons.chevronUp("w-4 h-4") : icons.chevronDown("w-4 h-4")}
            </div>
          </div>
        </div>

        {item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#eef0ff] px-3 py-1 text-xs text-[#4f46e5]"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 5 && (
              <span className="px-2 py-1 text-xs text-[#8a817b]">+{item.tags.length - 5} more</span>
            )}
          </div>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-[rgba(114,84,62,0.1)] px-5 pb-5 pt-4 animate-slide-down">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Summary</p>
            <p className="mt-2 text-sm leading-7 text-[#5d4e43]">{item.summary}</p>
          </div>

          {item.key_points.length > 0 && (
            <div className="mt-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Key takeaways</p>
              <div className="mt-3 space-y-3">
                {item.key_points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-[20px] bg-[#fffdf9] p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-xs font-semibold text-[#4f46e5]">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-7 text-[#5d4e43]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            {item.source_url.startsWith("pdf://")
              ? icons.document("w-4 h-4 text-[#8a817b] shrink-0")
              : icons.externalLink("w-4 h-4 text-[#8a817b] shrink-0")}
            {item.source_url.startsWith("pdf://") ? (
              <span className="truncate text-sm text-[#8a817b]">
                {item.source_url.replace("pdf://", "")}
              </span>
            ) : (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm text-[#8a817b] transition-colors hover:text-[#4f46e5]"
              >
                {item.source_url}
              </a>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(exportData);
                  if (ok) {
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 2000);
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
              >
                {icons.clipboard("w-3.5 h-3.5")}
                Copy
              </button>
              <button
                onClick={() => downloadAsMarkdown(exportData)}
                className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
              >
                {icons.document("w-3.5 h-3.5")}
                Markdown
              </button>
              <button
                onClick={() => printAsPdf(exportData)}
                className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:bg-[#eef0ff] hover:text-[#4f46e5]"
              >
                {icons.download("w-3.5 h-3.5")}
                PDF
              </button>
            </div>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">Delete this note?</span>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full border border-[rgba(28,25,23,0.08)] px-3 py-1.5 text-xs text-[#6b645f]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-xl border border-[rgba(28,25,23,0.08)] px-4 py-2 text-xs text-[#8a817b] transition-all hover:border-red-200 hover:text-red-500"
              >
                {icons.trash("w-3.5 h-3.5")}
                Delete
              </button>
            )}
          </div>

          {copiedToast && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#d97706]">
              {icons.check("w-3.5 h-3.5")}
              Copied to clipboard
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="mx-auto max-w-xl text-center animate-fade-in-up">
        <div className="rounded-[32px] border border-[rgba(79,70,229,0.08)] bg-[linear-gradient(150deg,rgba(255,255,255,0.98),rgba(238,240,255,0.4))] p-10 shadow-[0_12px_40px_rgba(28,25,23,0.04)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eef0ff]">
            {icons.search("w-8 h-8 text-[#4f46e5]")}
          </div>
          <p className="text-base font-medium text-[#1c1917]">Nothing found for that search.</p>
          <p className="mt-2 text-sm leading-7 text-[#8a786a]">
            Try different words or clear the filter to see everything you&apos;ve saved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-center animate-fade-in-up">
      <div className="rounded-[32px] border border-[rgba(79,70,229,0.08)] bg-[linear-gradient(150deg,rgba(255,255,255,0.98)_0%,rgba(238,240,255,0.45)_60%,rgba(255,243,224,0.35)_100%)] p-10 shadow-[0_12px_40px_rgba(28,25,23,0.04)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eef0ff]">
          {icons.brain("w-8 h-8 text-[#4f46e5] animate-breathe")}
        </div>
        <h3 className="text-base font-semibold text-[#1c1917]">Your library is ready to be filled.</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-[#8a786a]">
          Every article, idea, or page you save will find a quiet home here — ready to resurface when you need it most.
        </p>
        <Link
          href="/extract"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4f46e5] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca]"
        >
          {icons.sparkles("w-4 h-4")}
          Save Your First Note
        </Link>
        <p className="mt-5 text-xs italic text-[#a8a29e]">
          &ldquo;A second brain doesn&apos;t have to be a second job.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    setMounted(true);
    getHistory()
      .then(setItems)
      .catch((err) => console.error("Failed to load history:", err));
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [items]);

  const displayItems = useMemo(() => {
    let result = items;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.summary.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedTag) {
      result = result.filter((item) =>
        item.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (sortOrder === "oldest") {
      result = [...result].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return result;
  }, [items, searchQuery, selectedTag, sortOrder]);

  async function handleDelete(id: string) {
    try {
      await deleteFromHistory(id);
      const updated = await getHistory();
      setItems(updated);
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleClearAll() {
    try {
      await clearHistory();
      setItems([]);
      setExpandedId(null);
      setShowClearConfirm(false);
      setSelectedTag(null);
    } catch (err) {
      console.error("Failed to clear:", err);
    }
  }

  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 pt-32">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-card p-6 animate-fade-in-up">
                <div className="h-5 w-1/3 skeleton-block rounded mb-3" />
                <div className="h-3.5 w-full skeleton-block rounded mb-2" />
                <div className="h-3.5 w-5/6 skeleton-block rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-4 pt-32 pb-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">Your library</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#2f241d] sm:text-4xl">
                A calm home for what you want to remember.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f5e52]">
                {items.length === 0
                  ? "Your library is ready — save your first note anytime."
                  : `${items.length} saved item${items.length === 1 ? "" : "s"} ready to revisit.`}
              </p>
              {items.length > 0 && (
                <p className="mt-3 text-sm italic text-[#a8a29e]">
                  Your past reading is a gift to your future self.
                </p>
              )}
            </div>

            {items.length > 0 && (
              <div>
                {showClearConfirm ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-red-500">Clear all saved notes?</span>
                    <button
                      onClick={handleClearAll}
                      className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-2 text-sm text-[#6b645f]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-2 text-sm text-[#6b645f] transition-all hover:border-red-200 hover:text-red-500"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <div className="relative mt-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {icons.search("w-4 h-4 text-[#a8a29e]")}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, summary, or tags..."
                  className="w-full rounded-[24px] border border-[rgba(28,25,23,0.08)] bg-white py-3 pl-11 pr-11 text-sm text-[#1c1917] placeholder:text-[#a8a29e] transition-all focus:border-[rgba(79,70,229,0.2)] focus:ring-1 focus:ring-[rgba(79,70,229,0.14)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a817b] transition-colors hover:text-[#1c1917]"
                  >
                    {icons.close("w-4 h-4")}
                  </button>
                )}
              </div>

              {allTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="rounded-full border border-[rgba(28,25,23,0.08)] px-3 py-1.5 text-xs text-[#6b645f]"
                    >
                      Clear filter
                    </button>
                  )}
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                        selectedTag === tag
                          ? "bg-[#4f46e5] text-white"
                          : "bg-[#eef0ff] text-[#4f46e5]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#8a817b] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {displayItems.length} result{displayItems.length === 1 ? "" : "s"}
                  {searchQuery.trim() && ` for "${searchQuery}"`}
                  {selectedTag && ` in ${selectedTag}`}
                </p>
                <button
                  onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                  className="flex items-center gap-2 rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-2 text-sm text-[#6b645f]"
                >
                  {icons.sort("w-4 h-4")}
                  {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-12">
        {displayItems.length === 0 ? (
          <EmptyState filtered={Boolean(searchQuery.trim() || selectedTag)} />
        ) : (
          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 0.04, 0.24)}s` }}>
                <HistoryCard
                  item={item}
                  isExpanded={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
