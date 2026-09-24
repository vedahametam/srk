import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { ArchiveView, PageView, PostView } from "@/components/views";
import { dateRange, parseRoute } from "@/lib/routing";
import { entryMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getPagesBySlug, getPostBySlug, getPosts } from "@/lib/wp/client";
import { toPath } from "@/lib/wp/content";

/** Resolves any WordPress permalink. Shared by the page and its metadata. */
const resolve = cache(async (key: string) => {
  const route = parseRoute(key.split("/"));
  if (!route) return null;

  switch (route.kind) {
    case "redirect":
      return route;
    case "post": {
      const post = await getPostBySlug(route.slug);
      if (!post) return null;
      const canonical = toPath(post.link);
      const requested = `/${route.year}/${route.month}/${route.day}/${route.slug}/`;
      return canonical === requested ? { ...route, post } : { kind: "redirect" as const, to: canonical };
    }
    case "page": {
      const pages = await getPagesBySlug(route.slug);
      const page = pages.find((p) => toPath(p.link) === route.path);
      if (page) return { ...route, page };
      // Like WordPress, send stale or shortened URLs to the one matching entry.
      if (pages.length === 1) return { kind: "redirect" as const, to: toPath(pages[0].link) };
      if (route.path === `/${route.slug}/`) {
        const post = await getPostBySlug(route.slug);
        if (post) return { kind: "redirect" as const, to: toPath(post.link) };
      }
      return null;
    }
    case "date": {
      const result = await getPosts({ page: route.page, ...dateRange(route.year, route.month, route.day) });
      if (route.page > 1 && result.items.length === 0) return null;
      return { ...route, result };
    }
    case "postsIndex": {
      const result = await getPosts({ page: route.page });
      if (route.page > 1 && result.items.length === 0) return null;
      return { ...route, result };
    }
  }
});

function dateLabel(year: string, month?: string, day?: string) {
  const d = new Date(Date.UTC(Number(year), month ? Number(month) - 1 : 0, day ? Number(day) : 1));
  const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC", year: "numeric" };
  if (month) opts.month = "long";
  if (day) opts.day = "numeric";
  return d.toLocaleDateString("en-IN", opts);
}

// Rendered on first request, then cached and refreshed in the background (ISR).
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/[...uri]">): Promise<Metadata> {
  const { uri } = await params;
  const r = await resolve(uri.join("/"));
  if (!r || r.kind === "redirect") return {};
  switch (r.kind) {
    case "post":
      return entryMetadata(r.post);
    case "page":
      return entryMetadata(r.page);
    case "date":
      return { title: `Archive: ${dateLabel(r.year, r.month, r.day)}`, robots: { index: false, follow: true } };
    case "postsIndex":
      return { title: r.page > 1 ? `Articles — page ${r.page}` : "Articles", alternates: { canonical: site.postsIndexPath ?? undefined } };
  }
}

export default async function CatchAll({ params }: PageProps<"/[...uri]">) {
  const { uri } = await params;
  const r = await resolve(uri.join("/"));
  if (!r) notFound();

  switch (r.kind) {
    case "redirect":
      permanentRedirect(r.to);
    case "post":
      return <PostView post={r.post} />;
    case "page":
      return <PageView page={r.page} />;
    case "date": {
      const base = `/${[r.year, r.month, r.day].filter(Boolean).join("/")}/`;
      return <ArchiveView eyebrow="Archive" title={dateLabel(r.year, r.month, r.day)} result={r.result} base={base} page={r.page} />;
    }
    case "postsIndex":
      return (
        <ArchiveView
          eyebrow="The Journal"
          title="Articles"
          description="Reflections, episodes and teachings from the life of Sri Ramakrishna and his circle."
          result={r.result}
          base={site.postsIndexPath ?? "/"}
          page={r.page}
        />
      );
  }
}
