import type { Metadata } from "next";
import { featuredImage, plainText, relativeUrl, toPath } from "./wp/content";
import type { WPEntry } from "./wp/types";
import { site } from "./site";

/**
 * Metadata for a WordPress entry. Uses Yoast SEO's fields when the plugin is
 * installed so existing titles, descriptions and canonicals carry over.
 */
export function entryMetadata(entry: WPEntry): Metadata {
  const y = entry.yoast_head_json;
  const title = y?.title ?? `${plainText(entry.title.rendered)} | ${site.name}`;
  const description = y?.description ?? plainText(entry.excerpt.rendered).slice(0, 160);
  const canonical = y?.canonical ? relativeUrl(y.canonical) : toPath(entry.link);
  const image = y?.og_image?.[0]?.url ?? featuredImage(entry)?.source_url;
  const noindex = y?.robots?.index === "noindex";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: y?.robots?.follow !== "nofollow" } : undefined,
    openGraph: {
      type: entry.type === "post" ? "article" : "website",
      title: y?.og_title ?? plainText(entry.title.rendered),
      description: y?.og_description ?? description,
      url: canonical,
      images: image ? [relativeUrl(image)] : undefined,
      ...(entry.type === "post" ? { publishedTime: entry.date, modifiedTime: entry.modified } : {}),
    },
  };
}
