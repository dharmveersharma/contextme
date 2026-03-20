import { ExtractedInsights, HistoryItem } from "./types";

const STORAGE_KEY = "contextme_history";

/**
 * Save extracted insights to localStorage history.
 * Returns the created HistoryItem with id and timestamp.
 */
export function saveToHistory(insights: ExtractedInsights): HistoryItem {
  const item: HistoryItem = {
    ...insights,
    id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    extractedAt: new Date().toISOString(),
  };

  try {
    const existing = getHistory();
    existing.unshift(item); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error: unknown) {
    // Handle quota exceeded or other localStorage errors
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // Remove oldest items to make space, then retry
      const existing = getHistory();
      const trimmed = existing.slice(0, Math.max(existing.length - 10, 0));
      trimmed.unshift(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }

  return item;
}

/**
 * Get all history items, sorted by newest first.
 */
export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const items: HistoryItem[] = JSON.parse(data);
    return items.sort(
      (a, b) => new Date(b.extractedAt).getTime() - new Date(a.extractedAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Delete a single item from history by id.
 */
export function deleteFromHistory(id: string): void {
  try {
    const items = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silently fail
  }
}

/**
 * Clear all history items.
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}

/**
 * Search history by title, summary, or tags.
 */
export function searchHistory(query: string): HistoryItem[] {
  const items = getHistory();
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.summary.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get the total count of saved items.
 */
export function getHistoryCount(): number {
  return getHistory().length;
}

/**
 * Format a relative time string (e.g., "2 hours ago", "Yesterday").
 */
export function formatRelativeTime(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
