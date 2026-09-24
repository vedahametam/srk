import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/wp/client";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

// WordPress search URLs (/?s=term) are rewritten here by src/proxy.ts.
export default async function Search({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = (typeof sp.s === "string" ? sp.s : "").trim();
  const page = Math.max(1, Number(typeof sp.paged === "string" ? sp.paged : 1) || 1);
  const result = q ? await getPosts({ search: q, page }) : null;

  return (
    <>
      <PageHero eyebrow="Search" title={q ? `“${q}”` : "Search the site"}>
        <form action="/search/" className="mx-auto mt-2 flex max-w-xl gap-2" role="search">
          <label htmlFor="s" className="sr-only">
            Search
          </label>
          <input
            id="s"
            name="s"
            defaultValue={q}
            placeholder="Teachings, places, disciples…"
            className="min-w-0 flex-1 rounded-full border border-gold/50 bg-white/10 px-5 py-3 text-ivory placeholder:text-ivory/50 focus:border-gold focus:outline-none"
          />
          <button className="rounded-full bg-gradient-to-b from-saffron to-saffron-deep px-6 py-3 font-medium text-ivory">Search</button>
        </form>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {result && (
          <>
            <p className="mb-8 text-center text-ink-soft">
              {result.total} {result.total === 1 ? "result" : "results"}
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {result.totalPages > 1 && (
              <nav className="mt-12 flex justify-center gap-4 font-display text-lg text-maroon" aria-label="Pagination">
                {page > 1 && <a href={`/search/?s=${encodeURIComponent(q)}&paged=${page - 1}`}>← Previous</a>}
                <span className="text-ink-soft">
                  Page {page} of {result.totalPages}
                </span>
                {page < result.totalPages && <a href={`/search/?s=${encodeURIComponent(q)}&paged=${page + 1}`}>Next →</a>}
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}
