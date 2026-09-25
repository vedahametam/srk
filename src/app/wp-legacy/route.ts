import { permanentRedirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { askWordPressRedirect } from "@/lib/wp/client";

/**
 * Old query-string URLs such as "/?p=1891", "/?page_id=8" or "/?cat=10"
 * (rewritten here in next.config.ts). WordPress resolves them to a permalink,
 * which this site serves at the same path.
 */
export async function GET(req: NextRequest) {
  const to = await askWordPressRedirect(`/${req.nextUrl.search}`);
  if (!to) return new Response("Not found", { status: 404 });
  permanentRedirect(to);
}
