import "server-only";
import { site } from "../site";
import { getCategories, getCategoryToc, type TocEntry } from "./client";
import type { WPTerm } from "./types";

/*
 * Books are categories under "ebooks" (The Gospel of Sri Ramakrishna, The
 * Great Master); a book's parts are its child categories. Chapters were
 * published last-to-first, so newest-first order is reading order.
 */

function ancestors(term: WPTerm, byId: Map<number, WPTerm>): WPTerm[] {
  const chain: WPTerm[] = [];
  let current: WPTerm | undefined = term;
  while (current?.parent) {
    current = byId.get(current.parent);
    if (current) chain.push(current);
  }
  return chain;
}

/** The book (a direct child of the books category) that a category belongs to, if any. */
export async function findBook(categoryIds: number[]): Promise<WPTerm | null> {
  const all = await getCategories();
  const byId = new Map(all.map((c) => [c.id, c]));
  for (const id of categoryIds) {
    const term = byId.get(id);
    if (!term) continue;
    const chain = [term, ...ancestors(term, byId)];
    const rootIndex = chain.findIndex((c) => c.slug === site.booksCategorySlug);
    if (rootIndex > 0) return chain[rootIndex - 1];
  }
  return null;
}

export type BookToc = { book: WPTerm; parts: { part: WPTerm | null; chapters: TocEntry[] }[] };

/** Table of contents for a book, grouped by part when the book has parts. */
export async function getBookToc(book: WPTerm): Promise<BookToc> {
  const all = await getCategories();
  const parts = all.filter((c) => c.parent === book.id);
  const chapters = await getCategoryToc(book.id);
  if (parts.length === 0) return { book, parts: [{ part: null, chapters }] };

  const partChapters = await Promise.all(parts.map((p) => getCategoryToc(p.id)));
  const inPart = new Set(partChapters.flat().map((c) => c.id));
  const front = chapters.filter((c) => !inPart.has(c.id));
  // Order parts like their chapters: by their newest chapter, newest first.
  const grouped = parts
    .map((part, i) => ({ part: part as WPTerm | null, chapters: partChapters[i] }))
    .filter((g) => g.chapters.length > 0)
    .sort((a, b) => b.chapters[0].date.localeCompare(a.chapters[0].date));
  return { book, parts: front.length ? [{ part: null, chapters: front }, ...grouped] : grouped };
}
