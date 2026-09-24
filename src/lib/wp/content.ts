import type { WPEntry, WPMedia, WPTerm } from "./types";

const linkOrigins = [
  process.env.WORDPRESS_URL,
  ...(process.env.WORDPRESS_LINK_ORIGINS ?? "https://sriramakrishna.in,https://www.sriramakrishna.in").split(","),
]
  .map((o) => o?.trim().replace(/\/$/, ""))
  .filter((o): o is string => Boolean(o));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const originRe = linkOrigins.length
  ? new RegExp(`(?:${linkOrigins.map(escapeRe).join("|")})(?=/|$|[\\s,)])`, "gi")
  : null;

/** Strips the WordPress origins from a URL (or srcset/style value). */
export function relativeUrl(value: string): string {
  if (!originRe) return value;
  const out = value.replace(originRe, "");
  return out === "" ? "/" : out;
}

const attrRe = /(\s(?:href|src|srcset|data-src|data-srcset|poster|style)=)(["'])([\s\S]*?)\2/gi;

/**
 * Makes links in WordPress HTML relative so they stay on this site. Uploads
 * keep working because /wp-content is proxied to WordPress in next.config.ts.
 */
export function rewriteContentLinks(html: string): string {
  if (!originRe) return html;
  return html.replace(attrRe, (_, attr: string, q: string, value: string) => `${attr}${q}${relativeUrl(value)}${q}`);
}

/** Path part of a WordPress permalink, e.g. "/2026/09/24/sample-post/". */
export function toPath(link: string): string {
  try {
    const pathname = decodeURIComponent(new URL(link).pathname);
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  } catch {
    return link;
  }
}

export function isElementor(entry: WPEntry): boolean {
  return /\bdata-elementor-type=|class=["'][^"']*\belementor\b/.test(entry.content.rendered);
}

export function featuredImage(entry: WPEntry): WPMedia | null {
  const media = entry._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url ? { ...media, source_url: relativeUrl(media.source_url) } : null;
}

export function entryTerms(entry: WPEntry): { categories: WPTerm[]; tags: WPTerm[] } {
  const groups = entry._embedded?.["wp:term"] ?? [];
  return {
    categories: groups.flat().filter((t) => t.taxonomy === "category"),
    tags: groups.flat().filter((t) => t.taxonomy === "post_tag"),
  };
}

const entities: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&nbsp;": " ", "&hellip;": "…", "&#8217;": "’", "&#8216;": "‘", "&#8220;": "“",
  "&#8221;": "”", "&#8211;": "–", "&#8212;": "—", "&#8230;": "…", "&#038;": "&",
};

/** Plain text from rendered HTML, for titles, excerpts and metadata. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#?\w+;/g, (e) => entities[e] ?? (e.startsWith("&#") ? String.fromCodePoint(Number(e.slice(2, -1)) || 32) : e))
    .replace(/\s+/g, " ")
    .replace(/\s*\[(?:…|&hellip;|\.\.\.)\]\s*$/, "…")
    .trim();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(plainText(html).split(" ").length / 200));
}
