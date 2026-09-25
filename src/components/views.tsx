import Image from "next/image";
import Link from "next/link";
import { EntryContent, prepareContent } from "./EntryContent";
import { AboutPage, DisciplesPage, GalleryPage, TemplesPage } from "./pages";
import { PageHero } from "./PageHero";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";
import { findBook } from "@/lib/wp/books";
import { getAdjacentPosts, getPosts } from "@/lib/wp/client";
import { ChapterNav, chapterTitle } from "./BookViews";
import { Comments } from "./Comments";
import { entryTerms, featuredImage, formatDate, isElementor, plainText, readingMinutes, toPath } from "@/lib/wp/content";
import type React from "react";
import type { Paged, WPEntry } from "@/lib/wp/types";

export function ArchiveView({
  eyebrow,
  title,
  description,
  result,
  base,
  page,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  result: Paged<WPEntry>;
  base: string;
  page: number;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        {description && <p className="mx-auto max-w-2xl text-lg">{description}</p>}
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        {result.items.length === 0 ? (
          <p className="text-center font-display text-2xl text-ink-soft">Nothing has been published here yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {result.items.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i < 3} />
            ))}
          </div>
        )}
        <Pagination base={base} page={page} totalPages={result.totalPages} />
      </section>
    </>
  );
}

export async function PostView({ post }: { post: WPEntry }) {
  const title = chapterTitle(post.title.rendered);
  const image = featuredImage(post);
  const { categories, tags } = entryTerms(post);
  const author = post._embedded?.author?.[0];
  const elementor = isElementor(post);
  // Navigation extras are optional: a WordPress hiccup here shouldn't take the article down.
  const book = await findBook(post.categories ?? []).catch(() => null);
  const section = book ?? categories[0] ?? null;
  const [adjacent, related] = await Promise.all([
    section ? getAdjacentPosts(post, section.id).catch(() => null) : null,
    !book && categories[0]
      ? getPosts({ category: categories[0].id, perPage: 4 })
          .then((r) => r.items.filter((p) => p.id !== post.id).slice(0, 3))
          .catch(() => [])
      : [],
  ]);
  // Chapter parts (e.g. "Part II") are more specific than the book itself.
  const part = book ? categories.find((c) => c.parent === book.id) : undefined;

  return (
    <article>
      <PageHero
        eyebrow={
          section ? (
            <>
              <Link prefetch={false} href={toPath(section.link)} className="hover:text-gold-soft">
                {section.name}
              </Link>
              {part && (
                <>
                  <span className="mx-2 opacity-60">·</span>
                  <Link prefetch={false} href={toPath(part.link)} className="hover:text-gold-soft">
                    {part.name}
                  </Link>
                </>
              )}
            </>
          ) : (
            "Article"
          )
        }
        title={title}
      >
        <p className="text-sm uppercase tracking-[0.2em]">
          {!book && (
            <>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {author && author.slug !== "admin" && (
                <>
                  <span className="mx-3 opacity-50">·</span>
                  <Link prefetch={false} href={toPath(author.link)} className="hover:text-gold-soft">
                    {author.name}
                  </Link>
                </>
              )}
              <span className="mx-3 opacity-50">·</span>
            </>
          )}
          {readingMinutes(post.content.rendered)} min read
        </p>
      </PageHero>

      {image && !elementor && (
        <div className="relative z-10 mx-auto -mt-10 max-w-3xl px-4 sm:px-6">
          <div className="relative mx-auto aspect-[16/10] overflow-hidden rounded-[2rem] border-4 border-ivory bg-parchment shadow-2xl shadow-maroon/20">
            <Image
              src={image.source_url}
              alt={image.alt_text || title}
              fill
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className={isSmall(image) ? "object-contain" : "object-cover"}
            />
          </div>
        </div>
      )}

      <div className="py-14 sm:py-20">
        <EntryContent entry={post} dropCap />
      </div>

      {tags.length > 0 && (
        <div className="mx-auto mb-12 flex max-w-3xl flex-wrap gap-2 px-4 sm:px-6">
          {tags.map((t) => (
            <Link prefetch={false} key={t.id} href={toPath(t.link)} className="rounded-full border border-gold/40 bg-parchment px-4 py-1 text-sm text-maroon hover:border-saffron">
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      <Comments entryId={post.id} />

      {adjacent && (
        <ChapterNav
          previous={adjacent.previous}
          next={adjacent.next}
          contents={book}
          unit={book ? "chapter" : "article"}
        />
      )}

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold text-maroon">More in {categories[0].name}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      ) : (
        <div className="pb-24" />
      )}
    </article>
  );
}

/** Many older uploads are small portraits; show them whole rather than cropped and blurry. */
function isSmall(image: { media_details?: { width?: number } }) {
  return (image.media_details?.width ?? 1000) < 700;
}

const designedPages: Record<string, (props: { page: WPEntry }) => Promise<React.ReactNode> | React.ReactNode> = {
  "about-2": AboutPage,
  disciples: DisciplesPage,
  temples: TemplesPage,
  "gallery-2": GalleryPage,
};

export function PageView({ page }: { page: WPEntry }) {
  const Designed = designedPages[page.slug];
  if (Designed) {
    return (
      <>
        <Designed page={page} />
        <Comments entryId={page.id} className="pt-4" />
      </>
    );
  }

  const content = prepareContent(page);
  // Complex Elementor pages design their own title band; keep the WordPress layout intact.
  if (content.mode === "elementor") {
    return (
      <>
        <EntryContent entry={page} content={content} />
        <Comments entryId={page.id} className="pt-16" />
      </>
    );
  }

  const title = plainText(page.title.rendered);
  const image = featuredImage(page);
  return (
    <article>
      <PageHero title={title} />
      {image && (
        <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border-4 border-ivory shadow-2xl shadow-maroon/20">
            <Image src={image.source_url} alt={image.alt_text || title} fill priority sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <div className="py-14 sm:py-20">
        <EntryContent entry={page} content={content} />
      </div>
      <Comments entryId={page.id} />
    </article>
  );
}
