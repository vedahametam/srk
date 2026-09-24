import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

/**
 * Webhook for WordPress to call on publish/update, e.g. from WP Webhooks or a
 * small mu-plugin hooked to `save_post`:
 *   POST /api/revalidate/?secret=…   body: { "slug": "sample-post", "type": "post" }
 * With no body, all WordPress content is refreshed.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { slug?: string; type?: string };
  const tags =
    body.slug && body.type
      ? [body.type === "page" ? "pages" : "posts", `${body.type === "page" ? "page" : "post"}:${body.slug}`]
      : ["wordpress"];
  for (const tag of tags) revalidateTag(tag, "max");
  return Response.json({ revalidated: true, tags });
}
