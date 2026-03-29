import { createClient } from "@/lib/supabase/client";
import { ExtractedInsights, HistoryItem } from "./types";

/**
 * Save extracted insights to Supabase database.
 * Maps camelCase (from API) to snake_case (DB columns).
 */
export async function saveToHistory(insights: ExtractedInsights): Promise<HistoryItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("extractions")
    .insert({
      user_id: user.id,
      title: insights.title,
      summary: insights.summary,
      key_points: insights.keyPoints,
      tags: insights.tags,
      source_url: insights.sourceUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data as HistoryItem;
}

/**
 * Get all history items for the current user, sorted by newest first.
 */
export async function getHistory(): Promise<HistoryItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("extractions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as HistoryItem[];
}

/**
 * Delete a single extraction by id.
 * RLS ensures user can only delete their own rows.
 */
export async function deleteFromHistory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("extractions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Clear all extractions for the current user.
 */
export async function clearHistory(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("extractions")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
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
