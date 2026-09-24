import { site } from "@/lib/site";
import { wordpressOrigin } from "@/lib/wp/client";

/**
 * Serves WordPress feeds and XML sitemaps (reached via rewrites in
 * next.config.ts) with the WordPress origin replaced by this site's.
 */
export async function GET(_req: Request, ctx: RouteContext<"/wp-proxy/[...path]">) {
  if (!wordpressOrigin) return new Response("Not found", { status: 404 });
  const { path } = await ctx.params;
  const last = path[path.length - 1] ?? "";
  // Only feeds and sitemaps; this is not a general-purpose proxy.
  if (last !== "feed" && !/sitemap.*\.(xml|xsl)$/.test(last)) return new Response("Not found", { status: 404 });
  const url = `${wordpressOrigin}/${path.map(encodeURIComponent).join("/")}${last.includes(".") ? "" : "/"}`;

  const res = await fetch(url, { next: { revalidate: 600, tags: ["wordpress"] } });
  if (!res.ok) return new Response("Not found", { status: res.status === 404 ? 404 : 502 });

  const body = (await res.text()).split(wordpressOrigin).join(site.url);
  return new Response(body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/xml; charset=UTF-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
