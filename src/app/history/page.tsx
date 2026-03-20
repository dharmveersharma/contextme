"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryItem } from "@/lib/types";
import {
  getHistory,
  searchHistory,
  deleteFromHistory,
  clearHistory,
  formatRelativeTime,
} from "@/lib/history";
import { copyToClipboard, downloadAsMarkdown, printAsPdf } from "@/lib/export";

// ─── Icons ──────────────────────────────────────────────────
const icons = {
  brain: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  search: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  bolt: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  tag: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  ),
  link: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  ),
  trash: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  sparkles: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  clock: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  chevronDown: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  chevronUp: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  ),
  close: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
            ContextMe
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <Link href="/extract" className="hover:text-white transition-colors">
            Extract
          </Link>
          <Link href="/history" className="text-violet-400 font-medium">
            History
          </Link>
        </div>
      </div>
    </nav>
  );
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

  return (
    <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent transition-all hover:border-violet-500/25">
      {/* Card Header — always visible */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
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
              <span>{formatRelativeTime(item.extractedAt)}</span>
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
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
          {/* Full Summary */}
          <div>
            <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1 font-medium">
              Summary
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>
          </div>

          {/* Key Insights */}
          {item.keyPoints.length > 0 && (
            <div>
              <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1.5 font-medium">
                Key Insights
              </p>
              <ul className="space-y-1.5">
                {item.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {icons.bolt("w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5")}
                    <span className="text-xs text-gray-300 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
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
            {icons.link("w-3 h-3 text-gray-500 shrink-0")}
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-gray-500 hover:text-violet-400 transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {item.sourceUrl}
            </a>
          </div>

          {/* Export + Delete Actions */}
          <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(item);
                  if (ok) {
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 2000);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Copy to clipboard"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copy
              </button>
              <button
                onClick={() => downloadAsMarkdown(item)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Download as Markdown"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Markdown
              </button>
              <button
                onClick={() => printAsPdf(item)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:border-violet-500/30 text-gray-500 hover:text-violet-300 text-[10px] transition-all hover:bg-violet-500/5"
                title="Download as PDF"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
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
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
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
          <p className="text-xs text-gray-600">Try a different search term</p>
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

  // Load history on mount (client-only)
  useEffect(() => {
    setMounted(true);
    setItems(getHistory());
  }, []);

  // Filter items based on search
  const filteredItems = searchQuery.trim()
    ? searchHistory(searchQuery)
    : items;

  function handleDelete(id: string) {
    deleteFromHistory(id);
    setItems(getHistory());
    if (expandedId === id) setExpandedId(null);
  }

  function handleClearAll() {
    clearHistory();
    setItems([]);
    setExpandedId(null);
    setShowClearConfirm(false);
  }

  // Don't render until mounted (avoid hydration mismatch with localStorage)
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-20 max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
                <div className="h-4 w-2/3 bg-white/5 rounded animate-shimmer mb-2" />
                <div className="h-3 w-full bg-white/5 rounded animate-shimmer mb-1" />
                <div className="h-3 w-4/5 bg-white/5 rounded animate-shimmer" />
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
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
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
            <div className="relative mb-6">
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

          {/* Search Results Count */}
          {searchQuery.trim() && filteredItems.length > 0 && (
            <p className="text-xs text-gray-500 mb-3">
              {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* History Cards */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        {filteredItems.length === 0 ? (
          <EmptyState hasSearchQuery={!!searchQuery.trim()} />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
