"use client";

import { useState, useEffect, useMemo } from "react";
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

// Helper: convert HistoryItem (snake_case) to ExtractedInsights (camelCase) for export functions
function toExtractedInsights(item: HistoryItem): ExtractedInsights {
  return {
    title: item.title,
    summary: item.summary,
    keyPoints: item.key_points,
    tags: item.tags,
    sourceUrl: item.source_url,
  };
}

// ─── History Card ───────────────────────────────────────────
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
    <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent transition-all hover:border-violet-500/25 hover:bg-violet-500/[0.03]">
      {/* Card Header — always visible */}
      <div className="p-4 cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-gray-600 text-[10px]">
              {icons.clock("w-3 h-3")}
              <span>{formatRelativeTime(item.created_at)}</span>
            </div>
            {isExpanded
              ? icons.chevronUp("w-4 h-4 text-gray-500")
              : icons.chevronDown("w-4 h-4 text-gray-500")}
          </div>
        </div>

        {/* Tags — always visible */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px]"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 5 && (
              <span className="text-[10px] text-gray-500">+{item.tags.length - 5} more</span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3 animate-slide-down">
          {/* Full Summary */}
          <div>
            <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1 font-medium">
              Summary
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>
          </div>

          {/* Key Insights — numbered badges */}
          {item.key_points.length > 0 && (
            <div>
              <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1.5 font-medium">
                Key Insights
              </p>
              <div className="space-y-2">
                {item.key_points.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border-l-2 border-violet-500/25"
                  >
                    <span className="shrink-0 w-5 h-5 rounded bg-violet-500/15 flex items-center justify-center text-[10px] font-bold text-violet-300">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-300 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Tags */}
          {item.tags.length > 0 && (
            <div>
              <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1.5 font-medium">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px]"
                  >
                    {icons.tag("w-2.5 h-2.5")}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source URL */}
          <div className="flex items-center gap-1.5 pt-1">
            {icons.externalLink("w-3 h-3 text-gray-500 shrink-0")}
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {item.source_url}
            </a>
          </div>

          {/* Export + Delete Actions */}
          <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(exportData);
                  if (ok) {
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 2000);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Copy to clipboard"
              >
                {icons.clipboard("w-3 h-3")}
                Copy
              </button>
              <button
                onClick={() => downloadAsMarkdown(exportData)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Download as Markdown"
              >
                {icons.document("w-3 h-3")}
                Markdown
              </button>
              <button
                onClick={() => printAsPdf(exportData)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Download as PDF"
              >
                {icons.download("w-3 h-3")}
                PDF
              </button>
            </div>

            {/* Delete Button */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-red-400">Delete?</span>
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 font-medium px-2 py-0.5 rounded border border-red-500/30 hover:border-red-500/50 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[10px] text-gray-500 hover:text-gray-300 px-2 py-0.5 rounded border border-white/10 hover:border-white/20 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                title="Delete this item"
              >
                {icons.trash("w-3.5 h-3.5")}
              </button>
            )}
          </div>

          {/* Copied Toast inside card */}
          {copiedToast && (
            <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-medium pt-1">
              {icons.check("w-3 h-3")}
              Copied to clipboard!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────
function EmptyState({ hasSearchQuery }: { hasSearchQuery: boolean }) {
  if (hasSearchQuery) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="rounded-xl border border-dashed border-white/10 p-8">
          {icons.search("w-10 h-10 text-gray-700 mx-auto mb-3")}
          <p className="text-sm text-gray-500 mb-1">No results found</p>
          <p className="text-xs text-gray-600">Try a different search term or clear filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="rounded-xl border border-dashed border-white/10 p-8">
        {icons.brain("w-10 h-10 text-gray-700 mx-auto mb-3")}
        <p className="text-sm text-gray-500 mb-1">No extractions yet</p>
        <p className="text-xs text-gray-600 mb-4">
          Start building your knowledge base by extracting insights from URLs
        </p>
        <Link
          href="/extract"
          className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-xs font-medium transition-all hover:scale-105"
        >
          {icons.sparkles("w-3.5 h-3.5")}
          Extract Your First URL
        </Link>
      </div>
    </div>
  );
}

// ─── Main History Page ──────────────────────────────────────
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

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [items]);

  // Apply search, tag filter, and sort (all client-side on fetched items)
  const displayItems = useMemo(() => {
    let result = items;

    // Client-side text search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.summary.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((item) =>
        item.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sort order
    if (sortOrder === "oldest") {
      result = [...result].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return result;
  }, [searchQuery, items, selectedTag, sortOrder]);

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

  // Pre-mount loading skeleton
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-20 max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-4 w-2/3 skeleton-block rounded mb-2" />
                <div className="h-3 w-full skeleton-block rounded mb-1" />
                <div className="h-3 w-4/5 skeleton-block rounded" />
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

      {/* Header Section */}
      <section className="pt-20 pb-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold">
                Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                  Knowledge Base
                </span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {items.length === 0
                  ? "No extractions saved yet"
                  : `${items.length} extraction${items.length === 1 ? "" : "s"} saved`}
              </p>
            </div>

            {/* Clear All Button */}
            {items.length > 0 && (
              <div>
                {showClearConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-red-400">Clear all?</span>
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] text-red-400 hover:text-red-300 font-medium px-2.5 py-1 rounded border border-red-500/30 hover:border-red-500/50 transition-colors"
                    >
                      Yes, clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-[10px] text-gray-500 hover:text-gray-300 px-2.5 py-1 rounded border border-white/10 hover:border-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30 transition-all"
                  >
                    {icons.trash("w-3 h-3")}
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          {items.length > 0 && (
            <div className="relative mb-4 animate-fade-in-up stagger-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icons.search("w-4 h-4 text-gray-500")}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, summary, or tags..."
                className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {icons.close("w-4 h-4")}
                </button>
              )}
            </div>
          )}

          {/* Tag Filter Bar */}
          {items.length > 0 && allTags.length > 0 && (
            <div className="mb-4 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-2 mb-2">
                {icons.tag("w-3 h-3 text-gray-500")}
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Filter by tag</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/10 text-gray-400 hover:text-white text-[10px] transition-all hover:border-white/20"
                  >
                    {icons.close("w-2.5 h-2.5")}
                    Clear
                  </button>
                )}
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-all ${
                      selectedTag === tag
                        ? "bg-violet-500/20 border border-violet-500/40 text-violet-300 font-medium"
                        : "bg-violet-500/5 border border-violet-500/15 text-gray-400 hover:text-violet-300 hover:border-violet-500/25"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort + Results Count Row */}
          {items.length > 0 && (
            <div className="flex items-center justify-between mb-3 animate-fade-in-up stagger-3">
              <p className="text-xs text-gray-500">
                {searchQuery.trim() || selectedTag
                  ? `${displayItems.length} result${displayItems.length === 1 ? "" : "s"}`
                  : `${items.length} total`}
                {searchQuery.trim() && ` for \u201c${searchQuery}\u201d`}
                {selectedTag && ` tagged \u201c${selectedTag}\u201d`}
              </p>
              <button
                onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-violet-300 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/25 transition-all"
              >
                {icons.sort("w-3 h-3")}
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* History Cards */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        {displayItems.length === 0 ? (
          <EmptyState hasSearchQuery={!!(searchQuery.trim() || selectedTag)} />
        ) : (
          <div className="space-y-3">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                <HistoryCard
                  item={item}
                  isExpanded={expandedId === item.id}
                  onToggle={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
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
