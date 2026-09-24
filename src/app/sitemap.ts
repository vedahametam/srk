import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllLinks } from "@/lib/wp/client";
import { toPath } from "@/lib/wp/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([getAllLinks("posts"), getAllLinks("pages")]);
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    ...pages.map((p) => ({ url: `${site.url}${encodeURI(toPath(p.link))}`, lastModified: p.modified, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}${encodeURI(toPath(p.link))}`, lastModified: p.modified, priority: 0.6 })),
  ];
}
