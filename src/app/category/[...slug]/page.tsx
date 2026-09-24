import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArchiveView } from "@/components/views";
import { safeDecode, splitPagination } from "@/lib/routing";
import { getCategoryBySlug, getPosts } from "@/lib/wp/client";
import { plainText, toPath } from "@/lib/wp/content";

// /category/<parent>/<child>/page/<n>/
const load = cache(async (key: string) => {
  const split = splitPagination(key.split("/").map(safeDecode));
  if (!split || split.segments.length === 0) return null;
  const term = await getCategoryBySlug(split.segments[split.segments.length - 1]);
  if (!term || toPath(term.link) !== `/category/${split.segments.join("/")}/`) return null;
  const result = await getPosts({ category: term.id, page: split.page });
  if (split.page > 1 && result.items.length === 0) return null;
  return { term, result, page: split.page };
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
  return (
    <ArchiveView
      eyebrow="Category"
      title={data.term.name}
      description={data.term.description ? plainText(data.term.description) : undefined}
      result={data.result}
      base={toPath(data.term.link)}
      page={data.page}
    />
  );
}
