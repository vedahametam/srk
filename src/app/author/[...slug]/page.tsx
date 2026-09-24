import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArchiveView } from "@/components/views";
import { safeDecode, splitPagination } from "@/lib/routing";
import { getAuthorBySlug, getPosts } from "@/lib/wp/client";
import { toPath } from "@/lib/wp/content";

// /author/<slug>/page/<n>/
const load = cache(async (key: string) => {
  const split = splitPagination(key.split("/").map(safeDecode));
  if (!split || split.segments.length !== 1) return null;
  const author = await getAuthorBySlug(split.segments[0]);
  if (!author) return null;
  const result = await getPosts({ author: author.id, page: split.page });
  if (split.page > 1 && result.items.length === 0) return null;
  return { author, result, page: split.page };
});

// Rendered on first request, then cached and refreshed in the background (ISR).
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/author/[...slug]">): Promise<Metadata> {
  const data = await load((await params).slug.join("/"));
  if (!data) return {};
  return { title: data.author.name, alternates: { canonical: toPath(data.author.link) } };
}

export default async function AuthorArchive({ params }: PageProps<"/author/[...slug]">) {
  const data = await load((await params).slug.join("/"));
  if (!data) notFound();
  return (
    <ArchiveView
      eyebrow="Author"
      title={data.author.name}
      description={data.author.description || undefined}
      result={data.result}
      base={toPath(data.author.link)}
      page={data.page}
    />
  );
}
