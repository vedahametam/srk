/*
 * Designed versions of the site's WordPress pages. Their text and links still
 * come from WordPress, so edits there keep showing up here.
 */
import Image from "next/image";
import Link from "next/link";
import { parse } from "node-html-parser";
import { galleryPhotos } from "@/content/gallery";
import { images } from "@/content/images";
import { getCategoryBySlug, getPosts, wpAsset } from "@/lib/wp/client";
import { featuredImage, plainText, relativeUrl, toPath } from "@/lib/wp/content";
import type { WPEntry } from "@/lib/wp/types";
import { chapterTitle } from "./BookViews";
import { EntryContent, prepareContent } from "./EntryContent";
import { Lightbox } from "./Lightbox";
import { PageHero } from "./PageHero";
import { SacredImage } from "./SacredImage";
import { Lotus, LotusDivider } from "./ornaments";

const explore = [
  { label: "The Gospel of Sri Ramakrishna", href: "/category/ebooks/the-gospel-of-sri-ramakrishna/" },
  { label: "Sri Ramakrishna, The Great Master", href: "/category/ebooks/the-great-master/" },
  { label: "The Disciples", href: "/disciples/" },
  { label: "Temples & Sacred Places", href: "/temples/" },
];

/* ---------------- About (/about-2/) ---------------- */

export function AboutPage({ page }: { page: WPEntry }) {
  const content = prepareContent(page);
  return (
    <article>
      <PageHero eyebrow="The Prophet of the Modern Age" title="About Sri Ramakrishna" />
      <div className="py-14 sm:py-20">
        <EntryContent entry={page} content={content} dropCap />
      </div>
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <LotusDivider className="mb-12 text-gold" />
        <p className="eyebrow text-center">Continue exploring</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {explore.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group flex items-center justify-between rounded-2xl border border-gold/30 bg-ivory px-6 py-5 font-display text-xl text-maroon transition hover:border-saffron hover:shadow-lg hover:shadow-saffron/10"
            >
              {e.label}
              <span className="text-gold transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

/* ---------------- Disciples (/disciples/) ---------------- */

type Person = { name: string; href: string; image?: string };

function groupOf(name: string): "mother" | "monastic" | "women" | "householder" {
  if (/holy mother/i.test(name)) return "mother";
  if (/^swami\b/i.test(name)) return "monastic";
  if (/\b(ma|mother)\b/i.test(name)) return "women";
  return "householder";
}

const groups = [
  { key: "monastic", title: "Monastic Disciples", text: "The young men who renounced the world and became the first monks of the Ramakrishna Order." },
  { key: "householder", title: "Householder Devotees", text: "Great souls who lived in the world, yet were wholly the Master’s." },
  { key: "women", title: "Women Disciples", text: "Devoted women who served the Master and the Holy Mother." },
] as const;

export async function DisciplesPage({ page }: { page: WPEntry }) {
  // The WordPress page is a list of links to each disciple's post; keep its order.
  const links = parse(page.content.rendered)
    .querySelectorAll("a[href]")
    .map((a) => ({ name: a.text.trim(), href: toPath(a.getAttribute("href")!) }))
    .filter((l) => l.name);
  const category = await getCategoryBySlug("disciples");
  const posts = category ? (await getPosts({ category: category.id, perPage: 50 })).items : [];
  const byPath = new Map(posts.map((p) => [toPath(p.link), p]));
  const people: Person[] = links.map((l) => {
    const post = byPath.get(l.href);
    return { name: l.name, href: l.href, image: post ? featuredImage(post)?.source_url : undefined };
  });
  const mother = people.find((p) => groupOf(p.name) === "mother");

  return (
    <article>
      <PageHero eyebrow="The Master’s Circle" title="Disciples of Sri Ramakrishna">
        <p className="mx-auto max-w-2xl text-lg">
          Those who were blessed to live with the Master, and who carried his message into the world.
        </p>
      </PageHero>

      {mother && (
        <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20">
          <Link href={mother.href} className="group grid items-center gap-10 rounded-[2rem] border border-gold/40 bg-parchment p-8 shadow-xl shadow-maroon/5 sm:grid-cols-[14rem_1fr] sm:p-10">
            <div className="arch mx-auto w-48 border border-gold/50 bg-ivory p-2 sm:w-full">
              <SacredImage slot={images.holyMother} className="arch" sizes="14rem" />
            </div>
            <div className="text-center sm:text-left">
              <p className="eyebrow">1853 – 1920</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-maroon group-hover:text-vermilion">Sri Sarada Devi, the Holy Mother</h2>
              <p className="mt-4 text-lg text-ink-soft">
                The Master’s spiritual consort and first disciple, whom he worshipped as the Divine Mother — and the
                Mother of all who came to her.
              </p>
              <p className="mt-5 text-vermilion">Read her life →</p>
            </div>
          </Link>
        </section>
      )}

      {groups.map((g) => {
        const list = people.filter((p) => groupOf(p.name) === g.key);
        if (list.length === 0) return null;
        return (
          <section key={g.key} className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
            <div className="reveal text-center">
              <Lotus className="mx-auto h-7 w-14 text-gold" />
              <h2 className="mt-3 font-display text-4xl font-semibold text-maroon">{g.title}</h2>
              <p className="mx-auto mt-2 max-w-xl text-ink-soft">{g.text}</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {list.map((p) => (
                <Link key={p.href} href={p.href} className="group reveal text-center">
                  <div className="arch relative aspect-[3/4] overflow-hidden border border-gold/40 bg-white shadow-md shadow-maroon/10 transition group-hover:-translate-y-1 group-hover:shadow-xl">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 12rem, 45vw" className="object-contain px-1 pt-3" />
                    ) : (
                      <SacredImage slot={{ alt: p.name, label: "Portrait" }} aspect="aspect-[3/4]" />
                    )}
                  </div>
                  <p className="mt-3 font-display text-lg leading-tight text-maroon group-hover:text-vermilion">{p.name}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      <div className="pb-24" />
    </article>
  );
}

/* ---------------- Temples (/temples/) ---------------- */

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Search terms for directions, keyed by post slug; falls back to the post title. */
const placeQueries: Record<string, string> = {
  "dakshineshwar-kali-temple-place-of-sadhana": "Dakshineswar Kali Temple",
  "balaram-mandir": "Balaram Mandir, Baghbazar, Kolkata",
  "cossipore-garden-house": "Ramakrishna Math Cossipore",
  "kamarpukur-the-birthplace": "Ramakrishna Math Kamarpukur",
};

export async function TemplesPage({ page }: { page: WPEntry }) {
  const content = prepareContent(page);
  const hasText = plainText(content.html).length > 0;
  const category = await getCategoryBySlug("important-places");
  const places = category ? (await getPosts({ category: category.id, perPage: 50 })).items : [];

  return (
    <article>
      <PageHero eyebrow="Tirtha" title="Temples & Sacred Places">
        <p className="mx-auto max-w-2xl text-lg">
          The places sanctified by the Master’s presence — from the village of his birth to the temple garden of his
          sadhana and the garden house of his last days.
        </p>
      </PageHero>
      {hasText && (
        <div className="pt-14">
          <EntryContent entry={page} content={content} />
        </div>
      )}
      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 sm:py-20">
        {places.map((post, i) => {
          const image = featuredImage(post);
          const title = chapterTitle(post.title.rendered);
          return (
            <div key={post.id} className="reveal grid items-center gap-8 overflow-hidden rounded-[2rem] border border-gold/30 bg-ivory shadow-sm shadow-maroon/5 md:grid-cols-2">
              <div className={`relative aspect-[4/3] h-full ${i % 2 ? "md:order-2" : ""}`}>
                {image ? (
                  <Image src={image.source_url} alt={image.alt_text || title} fill sizes="(min-width: 768px) 36rem, 100vw" className="object-cover" />
                ) : (
                  <SacredImage slot={{ alt: title, label: title }} aspect="aspect-[4/3]" />
                )}
              </div>
              <div className="p-8 md:p-10">
                <p className="eyebrow">Sacred place</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-maroon">{title}</h2>
                <p className="mt-4 text-ink-soft">{plainText(post.excerpt.rendered)}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={toPath(post.link)} className="rounded-full bg-maroon px-6 py-2.5 text-ivory transition hover:bg-vermilion">
                    Read more
                  </Link>
                  <a
                    href={mapsUrl(placeQueries[post.slug] ?? title)}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-maroon/30 px-6 py-2.5 text-maroon transition hover:bg-parchment"
                  >
                    Directions ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        <div className="reveal grid items-center gap-8 overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-maroon to-maroon-deep text-ivory shadow-xl md:grid-cols-2">
          <SacredImage slot={images.belurMath} aspect="aspect-[4/3]" sizes="(min-width: 768px) 36rem, 100vw" />
          <div className="p-8 md:p-10">
            <p className="eyebrow !text-gold">Headquarters</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-gilded">Belur Math</h2>
            <p className="mt-4 text-ivory/80">
              The headquarters of the Ramakrishna Math and Ramakrishna Mission, founded by Swami Vivekananda on the
              banks of the Ganga, where the sacred relics of the Master are enshrined.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://belurmath.org/" target="_blank" rel="noopener" className="rounded-full bg-gradient-to-b from-saffron to-saffron-deep px-6 py-2.5 text-ivory">
                Official website ↗
              </a>
              <a href={mapsUrl("Belur Math")} target="_blank" rel="noopener" className="rounded-full border border-gold/50 px-6 py-2.5 text-gold-soft hover:bg-gold/10">
                Directions ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ---------------- Gallery (/gallery-2/) ---------------- */

export function GalleryPage({ page }: { page: WPEntry }) {
  // The WordPress page embeds a Flickr album; link to it rather than loading Flickr's script.
  const flickr = parse(page.content.rendered).querySelector("a[data-flickr-embed]");
  const photos = galleryPhotos.map((p) => ({ ...p, src: wpAsset(p.src) }));

  return (
    <article>
      <PageHero eyebrow="Darshan" title="Gallery">
        <p className="mx-auto max-w-2xl text-lg">Sacred images of the Master and the places of his divine play.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Lightbox photos={photos} />
        {flickr && (
          <div className="mt-16 rounded-[2rem] border border-gold/40 bg-parchment p-10 text-center">
            <Lotus className="mx-auto h-7 w-14 text-gold" />
            <h2 className="mt-3 font-display text-3xl font-semibold text-maroon">{flickr.getAttribute("title") ?? "Photo album"}</h2>
            <p className="mt-2 text-ink-soft">More photographs in our album on Flickr.</p>
            <a
              href={relativeUrl(flickr.getAttribute("href")!)}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion"
            >
              Open the Flickr album ↗
            </a>
          </div>
        )}
      </section>
    </article>
  );
}
