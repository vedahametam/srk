import Link from "next/link";
import { pageHref } from "@/lib/routing";

/** WordPress-style pagination: /base/, /base/page/2/, … */
export function Pagination({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const item = "grid h-11 min-w-11 place-items-center rounded-full px-3 transition";
  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2 font-display text-lg">
      {page > 1 && (
        <Link prefetch={false} href={pageHref(base, page - 1)} rel="prev" className={`${item} text-maroon hover:bg-parchment`}>
          ← Newer
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-ink-soft">…</span>}
          {p === page ? (
            <span aria-current="page" className={`${item} bg-maroon text-ivory`}>
              {p}
            </span>
          ) : (
            <Link prefetch={false} href={pageHref(base, p)} className={`${item} text-maroon hover:bg-parchment`}>
              {p}
            </Link>
          )}
        </span>
      ))}
      {page < totalPages && (
        <Link prefetch={false} href={pageHref(base, page + 1)} rel="next" className={`${item} text-maroon hover:bg-parchment`}>
          Older →
        </Link>
      )}
    </nav>
  );
}
