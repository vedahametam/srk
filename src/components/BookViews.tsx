import Link from "next/link";
import type { BookToc } from "@/lib/wp/books";
import { plainText, toPath } from "@/lib/wp/content";
import type { WPEntry, WPTerm } from "@/lib/wp/types";
import { PageHero } from "./PageHero";
import { Lotus, LotusDivider } from "./ornaments";

/** Chapter titles were imported in capitals; show them in title case. */
export function chapterTitle(rendered: string): string {
  const text = plainText(rendered);
  if (text !== text.toUpperCase()) return text;
  const small = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);
  const lower = text.toLowerCase();
  return lower
    .replace(/[\p{L}’']+/gu, (w, offset: number) => {
      // Small words stay lowercase unless they start the title or follow punctuation ("Chapter 1. The …").
      const before = lower.slice(0, offset).trimEnd();
      const startsPhrase = !before || /[.:;()\-–—\d]$/.test(before);
      return !startsPhrase && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .replace(/\b(Ii|Iii|Iv|Vi|Vii|Viii|Ix|Xi|Xii)\b/g, (r) => r.toUpperCase());
}

export function BookView({ toc, current, description }: { toc: BookToc; current?: WPTerm; description?: string }) {
  const parts = current ? toc.parts.filter((p) => p.part?.id === current.id) : toc.parts;
  const first = parts[0]?.chapters[0];
  const total = parts.reduce((n, p) => n + p.chapters.length, 0);
  // Chapter numbers run on across parts.
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((n, p) => n + p.chapters.length, 0));

  return (
    <>
      <PageHero eyebrow={current ? toc.book.name : "Sacred Text"} title={current ? current.name : toc.book.name}>
        {description && <p className="mx-auto max-w-2xl text-lg">{description}</p>}
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gold-soft/80">{total} chapters</p>
        {first && (
          <Link prefetch={false}
            href={toPath(first.link)}
            className="mt-8 inline-block rounded-full bg-gradient-to-b from-saffron to-saffron-deep px-7 py-3 font-medium text-ivory shadow-lg shadow-saffron/30"
          >
            Begin reading
          </Link>
        )}
      </PageHero>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        {current && (
          <p className="mb-10 text-center">
            <Link prefetch={false} href={toPath(toc.book.link)} className="text-vermilion underline decoration-gold underline-offset-4">
              ← Full contents of {toc.book.name}
            </Link>
          </p>
        )}
        {parts.map(({ part, chapters }, partIndex) => (
          <div key={part?.id ?? "front"} className="reveal mb-14 last:mb-0">
            {part && !current && (
              <h2 className="mb-6 flex items-center gap-4 font-display text-3xl font-semibold text-maroon">
                <Lotus className="h-6 w-12 text-gold" />
                <Link prefetch={false} href={toPath(part.link)} className="hover:text-vermilion">
                  {part.name}
                </Link>
              </h2>
            )}
            <ol className="overflow-hidden rounded-3xl border border-gold/30 bg-ivory/80">
              {chapters.map((ch, i) => {
                const number = offsets[partIndex] + i + 1;
                return (
                  <li key={ch.id} className="border-b border-gold/15 last:border-0">
                    <Link prefetch={false} href={toPath(ch.link)} className="group flex items-baseline gap-5 px-6 py-4 transition hover:bg-parchment">
                      <span className="w-8 shrink-0 text-right font-display text-lg text-saffron-deep/80">{number}</span>
                      <span className="flex-1 text-lg text-ink group-hover:text-maroon">{chapterTitle(ch.title.rendered)}</span>
                      <span className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}

export function ChapterNav({
  previous,
  next,
  contents,
  unit = "chapter",
}: {
  previous: WPEntry | null;
  next: WPEntry | null;
  contents?: WPTerm | null;
  unit?: string;
}) {
  if (!previous && !next) return null;
  const card = "group flex flex-1 flex-col rounded-3xl border border-gold/30 bg-ivory p-6 transition hover:border-saffron hover:shadow-lg hover:shadow-saffron/10";
  return (
    <nav aria-label={`Previous and next ${unit}`} className="mx-auto max-w-4xl px-4 sm:px-6">
      <LotusDivider className="mb-10 text-gold" />
      <div className="flex flex-col gap-4 sm:flex-row">
        {previous ? (
          <Link prefetch={false} href={toPath(previous.link)} rel="prev" className={card}>
            <span className="eyebrow">← Previous {unit}</span>
            <span className="mt-2 font-display text-xl text-maroon group-hover:text-vermilion">{chapterTitle(previous.title.rendered)}</span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
        {next ? (
          <Link prefetch={false} href={toPath(next.link)} rel="next" className={`${card} sm:text-right`}>
            <span className="eyebrow">Next {unit} →</span>
            <span className="mt-2 font-display text-xl text-maroon group-hover:text-vermilion">{chapterTitle(next.title.rendered)}</span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
      </div>
      {contents && (
        <p className="mt-8 text-center">
          <Link prefetch={false} href={toPath(contents.link)} className="font-display text-lg text-vermilion underline decoration-gold underline-offset-4">
            Contents of {contents.name}
          </Link>
        </p>
      )}
    </nav>
  );
}
