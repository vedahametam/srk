import Image from "next/image";
import Link from "next/link";
import { EntryContent } from "./EntryContent";
import { PageHero } from "./PageHero";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";
import { LotusDivider } from "./ornaments";
import { getPosts } from "@/lib/wp/client";
import { entryTerms, featuredImage, formatDate, isElementor, plainText, readingMinutes, toPath } from "@/lib/wp/content";
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
  const title = plainText(post.title.rendered);
  const image = featuredImage(post);
  const { categories, tags } = entryTerms(post);
  const author = post._embedded?.author?.[0];
  const elementor = isElementor(post);
  const related = categories[0]
    ? (await getPosts({ category: categories[0].id, perPage: 4 })).items.filter((p) => p.id !== post.id).slice(0, 3)
    : [];

  return (
    <article>
      <PageHero
        eyebrow={
          categories[0] ? (
            <Link href={toPath(categories[0].link)} className="hover:text-gold-soft">
              {categories[0].name}
            </Link>
          ) : (
            "Article"
          )
        }
        title={title}
      >
        <p className="text-sm uppercase tracking-[0.2em]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {author && (
            <>
              <span className="mx-3 opacity-50">·</span>
              <Link href={toPath(author.link)} className="hover:text-gold-soft">
                {author.name}
              </Link>
            </>
          )}
          <span className="mx-3 opacity-50">·</span>
          {readingMinutes(post.content.rendered)} min read
        </p>
      </PageHero>

      {image && !elementor && (
        <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border-4 border-ivory shadow-2xl shadow-maroon/20">
            <Image src={image.source_url} alt={image.alt_text || title} fill priority sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="py-14 sm:py-20">
        <EntryContent entry={post} dropCap />
      </div>

      {tags.length > 0 && (
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2 px-4 sm:px-6">
          {tags.map((t) => (
            <Link key={t.id} href={toPath(t.link)} className="rounded-full border border-gold/40 bg-parchment px-4 py-1 text-sm text-maroon hover:border-saffron">
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      <LotusDivider className="my-16 text-gold" />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <h2 className="text-center font-display text-3xl font-semibold text-maroon">Continue reading</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export function PageView({ page }: { page: WPEntry }) {
  const title = plainText(page.title.rendered);
  // Elementor pages usually design their own title band; keep the WordPress layout intact.
  if (isElementor(page)) {
    return <EntryContent entry={page} />;
  }
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
        <EntryContent entry={page} />
      </div>
    </article>
  );
}
