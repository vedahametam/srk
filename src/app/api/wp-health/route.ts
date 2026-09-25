import type { NextRequest } from "next/server";
import { wordpressOrigin } from "@/lib/wp/client";

/**
 * Diagnostics: can this deployment reach WordPress? Open
 *   /api/wp-health/?secret=<REVALIDATE_SECRET>
 * It reports the status and timing of a few uncached WordPress requests.
 */
export async function GET(req: NextRequest) {
  if (!process.env.REVALIDATE_SECRET || req.nextUrl.searchParams.get("secret") !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  if (!wordpressOrigin) return Response.json({ ok: false, message: "WORDPRESS_URL is not set" });

  const checks = await Promise.all(
    ["/wp-json/", "/wp-json/wp/v2/posts?per_page=1&_fields=id", "/wp-content/uploads/2019/08/rkp.jpg"].map(async (path) => {
      const started = Date.now();
      try {
        const res = await fetch(`${wordpressOrigin}${path}`, { cache: "no-store", signal: AbortSignal.timeout(15000) });
        await res.arrayBuffer();
        return { path, status: res.status, ms: Date.now() - started };
      } catch (err) {
        const cause = (err as { cause?: { code?: string; message?: string } }).cause;
        return { path, error: cause?.code ?? cause?.message ?? String(err), ms: Date.now() - started };
      }
    }),
  );
  const ok = checks.every((c) => "status" in c && c.status === 200);
  return Response.json({ ok, wordpress: wordpressOrigin, region: process.env.VERCEL_REGION ?? null, checks });
}
