import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { BookView } from "@/components/BookViews";
import { ArchiveView } from "@/components/views";
import { findBook, getBookToc } from "@/lib/wp/books";
import { safeDecode, splitPagination } from "@/lib/routing";
import { getCategoryBySlug, getPosts } from "@/lib/wp/client";
import { plainText, toPath } from "@/lib/wp/content";

// /category/<parent>/<child>/page/<n>/
const load = cache(async (key: string) => {
  const split = splitPagination(key.split("/").map(safeDecode));
  if (!split || split.segments.length === 0) return null;
  const term = await getCategoryBySlug(split.segments[split.segments.length - 1]);
  if (!term || toPath(term.link) !== `/category/${split.segments.join("/")}/`) return null;
  const book = await findBook([term.id]);
  if (book) {
    // Books show their whole table of contents on one page.
    return { term, page: split.page, toc: await getBookToc(book), result: null };
  }
  const result = await getPosts({ category: term.id, page: split.page });
  if (split.page > 1 && result.items.length === 0) return null;
  return { term, result, page: split.page, toc: null };
});

// Rendered on first request, then cached and refreshed in the background (ISR).
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/category/[...slug]">): Promise<Metadata> {
  const data = await load((await params).slug.join("/"));
  if (!data) return {};
  return {
    title: data.page > 1 ? `${data.term.name} — page ${data.page}` : data.term.name,
    description: data.term.description ? plainText(data.term.description) : undefined,
    alternates: { canonical: toPath(data.term.link) },
  };
}

export default async function CategoryArchive({ params }: PageProps<"/category/[...slug]">) {
  const data = await load((await params).slug.join("/"));
  if (!data) notFound();
  const description = data.term.description ? plainText(data.term.description) : undefined;
  if (data.toc) {
    if (data.page > 1) permanentRedirect(toPath(data.term.link));
    const isPart = data.toc.book.id !== data.term.id;
    return <BookView toc={data.toc} current={isPart ? data.term : undefined} description={description} />;
  }
  return (
    <ArchiveView
      eyebrow="Category"
      title={data.term.name}
      description={description}
      result={data.result}
      base={toPath(data.term.link)}
      page={data.page}
    />
  );
}
