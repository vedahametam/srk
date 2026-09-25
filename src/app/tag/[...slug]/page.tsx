import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArchiveView } from "@/components/views";
import { safeDecode, splitPagination } from "@/lib/routing";
import { getPosts, getTagBySlug } from "@/lib/wp/client";
import { plainText, toPath } from "@/lib/wp/content";

// /tag/<slug>/page/<n>/
const load = cache(async (key: string) => {
  const split = splitPagination(key.split("/").map(safeDecode));
  if (!split || split.segments.length !== 1) return null;
  const term = await getTagBySlug(split.segments[0]);
  if (!term) return null;
  const result = await getPosts({ tag: term.id, page: split.page });
  if (split.page > 1 && result.items.length === 0) return null;
  return { term, result, page: split.page };
});

// Rendered on first request, then cached and refreshed in the background (ISR).
export const revalidate = 86400; // a day; publishing in WordPress refreshes sooner via /api/revalidate
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/tag/[...slug]">): Promise<Metadata> {
  const data = await load((await params).slug.join("/"));
  if (!data) return {};
  return {
    title: `#${data.term.name}`,
    alternates: { canonical: toPath(data.term.link) },
    robots: { index: false, follow: true },
  };
}

export default async function TagArchive({ params }: PageProps<"/tag/[...slug]">) {
  const data = await load((await params).slug.join("/"));
  if (!data) notFound();
  return (
    <ArchiveView
      eyebrow="Tag"
      title={data.term.name}
      description={data.term.description ? plainText(data.term.description) : undefined}
      result={data.result}
      base={toPath(data.term.link)}
      page={data.page}
    />
  );
}
