/**
 * Maps WordPress permalinks onto the kinds of views this site renders.
 * Permalink structure: /%year%/%monthnum%/%day%/%postname%/
 */
import { site } from "./site";

export type Route =
  | { kind: "post"; year: string; month: string; day: string; slug: string }
  | { kind: "date"; year: string; month?: string; day?: string; page: number }
  | { kind: "postsIndex"; page: number }
  | { kind: "redirect"; to: string }
  | { kind: "page"; path: string; slug: string };

/** Splits a trailing "/page/N" off the segments, as WordPress paginates archives. */
export function splitPagination(segments: string[]): { segments: string[]; page: number } | null {
  const n = segments.length;
  if (n >= 2 && segments[n - 2] === "page") {
    const page = Number(segments[n - 1]);
    if (!Number.isInteger(page) || page < 1) return null;
    return { segments: segments.slice(0, -2), page };
  }
  return { segments, page: 1 };
}

export function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

const isYear = (s?: string) => !!s && /^\d{4}$/.test(s);
const isTwoDigit = (s?: string) => !!s && /^\d{2}$/.test(s);

export function parseRoute(rawSegments: string[]): Route | null {
  const decoded = rawSegments.map(safeDecode);
  const split = splitPagination(decoded);
  if (!split) return null;
  const { segments, page } = split;
  const path = `/${segments.join("/")}/`;

  if (site.postsIndexPath && path === site.postsIndexPath) return { kind: "postsIndex", page };
  // Static front page: WordPress serves /page/N/ as the home page and redirects the front page's own slug.
  if (segments.length === 0 && page > 1) return { kind: "redirect", to: "/" };
  if (path === `/${site.frontPageSlug}/`) return { kind: "redirect", to: "/" };

  const [y, m, d, slug, ...rest] = segments;
  // Sub-pages of a post: attachment pages, /comment-page-N/, /2/, /amp/ … WordPress
  // serves these under the post; send them to the post itself.
  if (isYear(y) && slug && isTwoDigit(m) && isTwoDigit(d) && rest.length === 1 && page === 1) {
    return { kind: "redirect", to: `/${y}/${m}/${d}/${slug}/` };
  }
  if (isYear(y)) {
    if (slug && isTwoDigit(m) && isTwoDigit(d) && rest.length === 0 && page === 1) {
      return { kind: "post", year: y, month: m, day: d, slug };
    }
    if (!slug && (!m || isTwoDigit(m)) && (!d || isTwoDigit(d))) {
      return { kind: "date", year: y, month: m, day: d, page };
    }
  }

  // Everything else is a (possibly nested) WordPress page. Pages are not paginated.
  if (page !== 1 || segments.length === 0) return null;
  return { kind: "page", path, slug: segments[segments.length - 1] };
}

/** ISO bounds for a date archive, as WordPress `after` / `before` query args. */
export function dateRange(year: string, month?: string, day?: string) {
  const y = Number(year);
  const m = month ? Number(month) - 1 : 0;
  const start = new Date(Date.UTC(y, m, day ? Number(day) : 1));
  const end = new Date(start);
  if (day) end.setUTCDate(end.getUTCDate() + 1);
  else if (month) end.setUTCMonth(end.getUTCMonth() + 1);
  else end.setUTCFullYear(end.getUTCFullYear() + 1);
  const iso = (d: Date) => d.toISOString().slice(0, 19);
  // WordPress `after` is exclusive, so step back one second.
  return { after: iso(new Date(start.getTime() - 1000)), before: iso(end) };
}

export function pageHref(base: string, page: number): string {
  return page <= 1 ? base : `${base}page/${page}/`;
}
