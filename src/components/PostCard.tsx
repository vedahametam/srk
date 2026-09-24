import Image from "next/image";
import Link from "next/link";
import { entryTerms, featuredImage, formatDate, plainText, toPath } from "@/lib/wp/content";
import type { WPEntry } from "@/lib/wp/types";
import { chapterTitle } from "./BookViews";
import { SacredImage } from "./SacredImage";

export function PostCard({ post, priority }: { post: WPEntry; priority?: boolean }) {
  const href = toPath(post.link);
  const image = featuredImage(post);
  const title = chapterTitle(post.title.rendered);
  // Many older uploads are small scanned portraits: show them whole instead of a blurry crop.
  const small = (image?.media_details?.width ?? 1000) < 500;
  const category = entryTerms(post).categories[0];

  return (
    <article className="group reveal flex flex-col overflow-hidden rounded-[1.75rem] border border-gold/25 bg-ivory shadow-sm shadow-maroon/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-maroon/10">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        {image ? (
          <div className={`relative aspect-[16/10] overflow-hidden ${small ? "bg-parchment" : ""}`}>
            <Image
              src={image.source_url}
              alt={image.alt_text || title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`${small ? "object-contain py-3" : "object-cover"} transition duration-700 group-hover:scale-105`}
            />
          </div>
        ) : (
          <SacredImage slot={{ alt: title, label: "Featured image" }} aspect="aspect-[16/10]" decorative />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          {category && (
            <Link href={toPath(category.link)} className="eyebrow !text-[0.7rem] hover:text-maroon">
              {category.name}
            </Link>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-maroon">
          <Link href={href} className="hover:text-vermilion">
            {title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[1.02rem] leading-relaxed text-ink-soft">{plainText(post.excerpt.rendered)}</p>
        <span className="mt-auto pt-5 text-sm font-medium tracking-wide text-saffron-deep">
          <Link href={href} className="inline-flex items-center gap-2 hover:gap-3 hover:text-maroon">
            Read <span aria-hidden="true">→</span>
          </Link>
        </span>
      </div>
    </article>
  );
}
