import { ExtractedInsights } from "./types";

/**
 * Format insights as plain text for clipboard copy.
 */
function formatAsText(data: ExtractedInsights): string {
  let text = "";
  text += `${data.title}\n`;
  text += `${"=".repeat(data.title.length)}\n\n`;
  text += `Summary\n`;
  text += `${data.summary}\n\n`;
  text += `Key Insights\n`;
  data.keyPoints.forEach((point, i) => {
    text += `${i + 1}. ${point}\n`;
  });
  text += `\nTags: ${data.tags.join(", ")}\n`;
  text += `\nSource: ${data.sourceUrl}\n`;
  text += `\n— Extracted with ContextMe`;
  return text;
}

/**
 * Format insights as Markdown.
 */
function formatAsMarkdown(data: ExtractedInsights): string {
  let md = "";
  md += `# ${data.title}\n\n`;
  md += `## Summary\n\n`;
  md += `${data.summary}\n\n`;
  md += `## Key Insights\n\n`;
  data.keyPoints.forEach((point) => {
    md += `- ${point}\n`;
  });
  md += `\n## Tags\n\n`;
  md += data.tags.map((tag) => `\`${tag}\``).join(" ") + "\n\n";
  md += `---\n\n`;
  md += `**Source:** [${data.sourceUrl}](${data.sourceUrl})\n\n`;
  md += `*Extracted with [ContextMe](https://contextme.vercel.app)*\n`;
  return md;
}

/**
 * Copy insights to clipboard as formatted text.
 * Returns true if successful, false if failed.
 */
export async function copyToClipboard(data: ExtractedInsights): Promise<boolean> {
  try {
    const text = formatAsText(data);
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const text = formatAsText(data);
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Download insights as a Markdown (.md) file.
 */
export function downloadAsMarkdown(data: ExtractedInsights): void {
  const md = formatAsMarkdown(data);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  // Clean filename from title
  const filename = data.title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 50);
  a.download = `${filename || "insights"}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open print dialog with a clean, styled version of the insights.
 * This lets the user "Save as PDF" from the browser's print dialog.
 */
export function printAsPdf(data: ExtractedInsights): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${data.title} — ContextMe</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; padding: 40px; max-width: 700px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 24px; margin-bottom: 8px; color: #1a1a2e; }
    .meta { font-size: 11px; color: #888; margin-bottom: 24px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7c3aed; font-weight: 600; margin-bottom: 8px; margin-top: 24px; }
    .summary { font-size: 14px; color: #333; line-height: 1.7; }
    .key-points { list-style: none; padding: 0; }
    .key-points li { font-size: 13px; color: #333; padding: 6px 0; padding-left: 20px; position: relative; line-height: 1.6; }
    .key-points li::before { content: "\\2022"; color: #7c3aed; font-weight: bold; position: absolute; left: 4px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .tag { font-size: 11px; background: #f3f0ff; color: #7c3aed; padding: 3px 10px; border-radius: 12px; }
    .source { font-size: 11px; color: #888; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; }
    .source a { color: #7c3aed; text-decoration: none; }
    .footer { font-size: 10px; color: #bbb; margin-top: 16px; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(data.title)}</h1>
  <p class="meta">Extracted from ${escapeHtml(data.sourceUrl)}</p>

  <p class="section-title">Summary</p>
  <p class="summary">${escapeHtml(data.summary)}</p>

  <p class="section-title">Key Insights</p>
  <ul class="key-points">
    ${data.keyPoints.map((p) => `<li>${escapeHtml(p)}</li>`).join("\n    ")}
  </ul>

  <p class="section-title">Tags</p>
  <div class="tags">
    ${data.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("\n    ")}
  </div>

  <div class="source">
    Source: <a href="${escapeHtml(data.sourceUrl)}">${escapeHtml(data.sourceUrl)}</a>
  </div>
  <p class="footer">Extracted with ContextMe — contextme.vercel.app</p>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Escape HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
