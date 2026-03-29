// ─── Shared Types ──────────────────────────────────────────

// Used by the API route, extract page, and export functions (camelCase)
export interface ExtractedInsights {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  sourceUrl: string;
}

// Matches the Supabase `extractions` table schema (snake_case)
export interface HistoryItem {
  id: string;            // UUID from Supabase
  user_id: string;       // UUID from auth.users
  title: string;
  summary: string;
  key_points: string[];  // Postgres TEXT[] array
  tags: string[];
  source_url: string;
  created_at: string;    // ISO timestamp from DB
}
