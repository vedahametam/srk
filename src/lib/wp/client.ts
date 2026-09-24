import "server-only";
import { mockAuthors, mockCategories, mockPages, mockPosts, mockTags } from "./mock";
import type { Paged, WPAuthor, WPEntry, WPTerm } from "./types";

const WP_URL = process.env.WORDPRESS_URL?.replace(/\/$/, "") ?? "";
const REVALIDATE = Number(process.env.WORDPRESS_REVALIDATE_SECONDS ?? 300);

/** True when running on built-in sample content instead of a live WordPress. */
export const isMockMode = !WP_URL;

export const wordpressOrigin = WP_URL;

type Query = Record<string, string | number | undefined>;

async function wpFetch<T>(path: string, query: Query = {}, tags: string[] = []) {
  const url = new URL(`${WP_URL}/wp-json/wp/v2/${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE, tags: ["wordpress", ...tags] },
  });
  // WordPress answers 400 for a page number past the end.
  if (res.status === 400 && query.page) return { data: [] as T, total: 0, totalPages: 0 };
  if (!res.ok) throw new Error(`WordPress ${res.status} for ${url.pathname}${url.search}`);
  return {
    data: (await res.json()) as T,
    total: Number(res.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 0),
  };
}

function paginate<T>(all: T[], page: number, perPage: number): Paged<T> {
  return {
    items: all.slice((page - 1) * perPage, page * perPage),
    total: all.length,
    totalPages: Math.ceil(all.length / perPage),
  };
}

export type PostQuery = {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  author?: number;
  search?: string;
  /** ISO dates (inclusive/exclusive) for date archives. */
  after?: string;
  before?: string;
};

export async function getPosts(q: PostQuery = {}): Promise<Paged<WPEntry>> {
  const page = q.page ?? 1;
  const perPage = q.perPage ?? 9;

  if (isMockMode) {
    const s = q.search?.toLowerCase();
    const filtered = mockPosts.filter(
      (p) =>
        (!q.category || p.categories?.includes(q.category)) &&
        (!q.tag || p.tags?.includes(q.tag)) &&
        (!q.author || q.author === 1) &&
        (!s || `${p.title.rendered} ${p.content.rendered}`.toLowerCase().includes(s)) &&
        (!q.after || p.date >= q.after) &&
        (!q.before || p.date < q.before),
    );
    return paginate(filtered, page, perPage);
  }

  const { data, total, totalPages } = await wpFetch<WPEntry[]>(
    "posts",
    {
      _embed: "author,wp:featuredmedia,wp:term",
      page,
      per_page: perPage,
      categories: q.category,
      tags: q.tag,
      author: q.author,
      search: q.search,
      after: q.after,
      before: q.before,
    },
    ["posts"],
  );
  return { items: data, total, totalPages };
}

export async function getPostBySlug(slug: string): Promise<WPEntry | null> {
  if (isMockMode) return mockPosts.find((p) => p.slug === slug) ?? null;
  const { data } = await wpFetch<WPEntry[]>(
    "posts",
    { slug, _embed: "author,wp:featuredmedia,wp:term" },
    ["posts", `post:${slug}`],
  );
  return data[0] ?? null;
}

/** Pages can share a slug under different parents, so all matches are returned. */
export async function getPagesBySlug(slug: string): Promise<WPEntry[]> {
  if (isMockMode) return mockPages.filter((p) => p.slug === slug);
  const { data } = await wpFetch<WPEntry[]>(
    "pages",
    { slug, _embed: "author,wp:featuredmedia" },
    ["pages", `page:${slug}`],
  );
  return data;
}

async function getTermBySlug(
  taxonomy: "categories" | "tags",
  slug: string,
): Promise<WPTerm | null> {
  if (isMockMode) {
    return (taxonomy === "categories" ? mockCategories : mockTags).find((t) => t.slug === slug) ?? null;
  }
  const { data } = await wpFetch<WPTerm[]>(taxonomy, { slug }, [taxonomy]);
  return data[0] ?? null;
}

export const getCategoryBySlug = (slug: string) => getTermBySlug("categories", slug);
export const getTagBySlug = (slug: string) => getTermBySlug("tags", slug);

export async function getAuthorBySlug(slug: string): Promise<WPAuthor | null> {
  if (isMockMode) return mockAuthors.find((a) => a.slug === slug) ?? null;
  const { data } = await wpFetch<WPAuthor[]>("users", { slug }, ["users"]);
  return data[0] ?? null;
}

export async function getCategories(): Promise<WPTerm[]> {
  if (isMockMode) return mockCategories;
  const { data } = await wpFetch<WPTerm[]>(
    "categories",
    { per_page: 100, hide_empty: "true", orderby: "count", order: "desc" },
    ["categories"],
  );
  return data;
}

/** Posts and pages for the sitemap, fetched in pages of 100. */
export async function getAllLinks(type: "posts" | "pages"): Promise<{ link: string; modified: string }[]> {
  if (isMockMode) return (type === "posts" ? mockPosts : mockPages).map(({ link, modified }) => ({ link, modified }));
  const out: { link: string; modified: string }[] = [];
  for (let page = 1; ; page++) {
    const { data, totalPages } = await wpFetch<{ link: string; modified: string }[]>(
      type,
      { per_page: 100, page, _fields: "link,modified" },
      [type],
    );
    out.push(...data);
    if (page >= totalPages) break;
  }
  return out;
}

/**
 * Stylesheets Elementor needs for a given entry. Elementor splits its CSS
 * across the plugin, the global kit and a per-post file, and the exact set
 * depends on the widgets used, so the reliable source is the page WordPress
 * itself renders. Only Elementor's own assets are kept, never the theme's.
 */
export async function getElementorStyles(entry: WPEntry): Promise<{ links: string[]; inline: string[] }> {
  if (isMockMode) return { links: [], inline: [] };
  try {
    // Ask WordPress itself, whatever domain its permalinks use.
    const res = await fetch(`${WP_URL}${new URL(entry.link).pathname}`, {
      next: { revalidate: REVALIDATE, tags: ["wordpress", `html:${entry.id}`] },
    });
    if (!res.ok) throw new Error(String(res.status));
    const html = await res.text();
    const links: string[] = [];
    for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
      const tag = m[0];
      if (!/rel=["']stylesheet["']/i.test(tag)) continue;
      const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
      const id = tag.match(/id=["']([^"']+)["']/i)?.[1] ?? "";
      if (href && (/elementor/i.test(id) || /elementor/i.test(href))) links.push(href.replace(/&#038;/g, "&"));
    }
    const inline: string[] = [];
    for (const m of html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)) {
      if (/id=["'][^"']*elementor[^"']*["']/i.test(m[1])) inline.push(m[2]);
    }
    return { links, inline };
  } catch {
    // Fall back to the files Elementor always writes for a post.
    return {
      links: [
        `${WP_URL}/wp-content/plugins/elementor/assets/css/frontend.min.css`,
        `${WP_URL}/wp-content/uploads/elementor/css/post-${entry.id}.css`,
      ],
      inline: [],
    };
  }
}
