// ─── Shared Types ──────────────────────────────────────────

export interface ExtractedInsights {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  sourceUrl: string;
}

export interface HistoryItem extends ExtractedInsights {
  id: string;          // unique ID (timestamp-based)
  extractedAt: string; // ISO date string
}
