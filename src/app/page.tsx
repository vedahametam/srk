import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { SacredImage } from "@/components/SacredImage";
import { Diya, Lotus, LotusDivider, Mandala } from "@/components/ornaments";
import { images } from "@/content/images";
import {
  aboutIntro,
  belurMath,
  books,
  featuredTeaching,
  milestones,
  pranamMantra,
  sacredPlaces,
  teachings,
  testimonials,
  videos,
} from "@/content/master";
import { getCategories, getCategoryBySlug, getPosts, wpAsset } from "@/lib/wp/client";
import { featuredImage, plainText, toPath } from "@/lib/wp/content";

export default async function Home() {
  // WordPress-backed sections are hidden if WordPress is briefly unreachable; ISR fills them in again.
  const empty = { items: [], total: 0, totalPages: 0 };
  const [latest, disciplesCategory, categories] = await Promise.all([
    getPosts({ perPage: 3 }).catch(() => empty),
    getCategoryBySlug("disciples").catch(() => null),
    getCategories().catch(() => []),
  ]);
  const disciples = disciplesCategory
    ? (await getPosts({ category: disciplesCategory.id, perPage: 30 }).catch(() => empty)).items
    : [];
  const holyMother = disciples.find((d) => d.slug === "the-holy-mother");
  const circle = disciples.filter((d) => d !== holyMother && featuredImage(d)).slice(0, 8);
  const chapterCount = (href: string) => categories.find((c) => toPath(c.link) === href)?.count;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="temple-night relative isolate overflow-hidden">
        <Mandala className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[72rem] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.09] animate-slow-spin" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-20">
          <div className="text-center lg:text-left">
            <p className="font-deva text-xl text-gold-soft/90 sm:text-2xl">ॐ नमो भगवते श्रीरामकृष्णाय</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] sm:text-7xl xl:text-8xl">
              <span className="text-gilded">Sri Ramakrishna</span>
              <span className="mt-1 block text-3xl font-medium italic tracking-wide text-ivory/85 sm:text-4xl">Paramahamsa</span>
            </h1>
            <p className="eyebrow mt-6 !text-gold">The Prophet of the Modern Age · 1836 – 1886</p>
            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <p className="font-bangla text-3xl text-gold-soft sm:text-4xl">যত মত তত পথ</p>
              <p className="mt-2 font-display text-2xl italic text-ivory/85">“As many faiths, so many paths.”</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/about-2/"
                className="rounded-full bg-gradient-to-b from-saffron to-saffron-deep px-7 py-3 font-medium text-ivory shadow-lg shadow-saffron/30 transition hover:shadow-saffron/50"
              >
                About the Master
              </Link>
              <Link
                href={books[0].href}
                className="rounded-full border border-gold/60 px-7 py-3 font-medium text-gold-soft transition hover:bg-gold/10"
              >
                Read the Gospel
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-saffron/30 blur-3xl animate-glow" />
            <div className="arch rounded-b-[2rem] border border-gold/50 p-3 shadow-2xl shadow-black/50">
              <SacredImage slot={images.masterShrine} tone="dark" labelAt="top" priority className="arch rounded-b-[1.4rem]" sizes="(min-width: 1024px) 28rem, 90vw" />
            </div>
            <Diya className="absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* ---------- Pranam mantra ---------- */}
      <section className="relative overflow-hidden border-y border-gold/30 bg-parchment">
        <div className="reveal mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="eyebrow">Pranam Mantra</p>
          <div className="mt-6 font-deva text-2xl leading-relaxed text-maroon sm:text-3xl">
            {pranamMantra.devanagari.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-5 italic text-ink-soft">{pranamMantra.transliteration}</p>
          <LotusDivider className="my-6 text-gold" />
          <p className="mx-auto max-w-2xl font-display text-xl text-ink sm:text-2xl">{pranamMantra.meaning}</p>
          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-ink-soft">— {pranamMantra.source}</p>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div className="reveal relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 -z-10 rounded-full bg-gold-soft/40 blur-3xl" />
          <div className="arch border border-gold/40 bg-parchment p-3 shadow-xl shadow-maroon/10">
            <SacredImage slot={images.masterSeated} className="arch" sizes="(min-width: 1024px) 28rem, 90vw" />
          </div>
        </div>
        <div className="reveal">
          <p className="eyebrow">About the Master</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-maroon sm:text-5xl">
            An uninterrupted contemplation of God
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{aboutIntro}</p>
          <figure className="mt-8 border-l-2 border-gold pl-6">
            <blockquote className="font-display text-2xl italic leading-snug text-maroon">“{featuredTeaching.text}”</blockquote>
            <figcaption className="mt-3 text-sm uppercase tracking-[0.2em] text-ink-soft">— Sri Ramakrishna</figcaption>
          </figure>
          <Link href="/about-2/" className="mt-8 inline-block rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion">
            Read more
          </Link>
        </div>
      </section>

      {/* ---------- Life timeline ---------- */}
      <section className="border-t border-gold/20 bg-gradient-to-b from-parchment/60 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow">His Divine Life</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">From Kamarpukur to Cossipore</h2>
          </div>

          <ol className="relative mt-16 space-y-14 before:absolute before:left-5 before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-gold before:via-gold/60 before:to-transparent md:before:left-1/2">
            {milestones.map((m, i) => (
              <li key={m.year} className="reveal relative grid gap-6 pl-14 md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="absolute left-5 top-2 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-saffron ring-4 ring-ivory md:left-1/2" />
                <div className={`${i % 2 ? "md:order-2" : "md:text-right"}`}>
                  <p className="font-display text-5xl font-semibold text-saffron-deep/90">{m.year}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-maroon">{m.title}</h3>
                  <p className="mt-2 text-ink-soft">{m.text}</p>
                  {m.href && (
                    <Link href={m.href} className="mt-3 inline-block text-vermilion underline decoration-gold underline-offset-4 hover:text-maroon">
                      Read more →
                    </Link>
                  )}
                </div>
                {m.image && (
                  <div className={i % 2 ? "md:order-1" : ""}>
                    <SacredImage
                      slot={m.image}
                      aspect="aspect-[16/10]"
                      className="rounded-3xl border border-gold/30 shadow-lg shadow-maroon/5"
                      sizes="(min-width: 768px) 40vw, 90vw"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Sacred books ---------- */}
      <section className="temple-night relative overflow-hidden py-24">
        <Mandala className="pointer-events-none absolute -right-60 top-1/2 w-[46rem] -translate-y-1/2 text-gold opacity-[0.07] animate-slow-spin" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-gold">The Sacred Books</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">Read the Master’s Life and Words</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {books.map((b) => {
              const count = chapterCount(b.href);
              return (
                <Link
                  key={b.href}
                  href={b.href}
                  className="group reveal relative flex flex-col overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-maroon to-maroon-deep p-10 shadow-2xl shadow-black/40 transition hover:-translate-y-1 hover:border-gold"
                >
                  <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-gold/25" />
                  <Lotus className="h-8 w-16 text-gold" />
                  <p className="mt-6 font-bangla text-xl text-gold-soft/80">{b.bengali}</p>
                  <h3 className="text-gilded mt-2 font-display text-3xl font-semibold sm:text-4xl">{b.title}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gold-soft/80">{b.author}</p>
                  <p className="mt-5 flex-1 text-ivory/80">{b.text}</p>
                  <p className="mt-8 flex items-center justify-between text-gold-soft">
                    <span>{count ? `${count} chapters` : "Contents"}</span>
                    <span className="transition group-hover:translate-x-1">Open the book →</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Teachings ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Words of the Master</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Nectar of His Teachings</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachings.map((t) => (
            <figure
              key={t.text}
              className="reveal flex flex-col rounded-3xl border border-gold/30 bg-ivory p-7 shadow-sm shadow-maroon/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-saffron/10"
            >
              <span className="font-display text-6xl leading-none text-saffron" aria-hidden="true">
                “
              </span>
              <blockquote className="-mt-4 flex-1 font-display text-xl leading-relaxed text-ink">{t.text}</blockquote>
              <figcaption className="eyebrow mt-6">{t.theme}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- Holy Mother & disciples ---------- */}
      {disciples.length > 0 && (
        <section className="border-y border-gold/30 bg-parchment py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="reveal mx-auto max-w-2xl text-center">
              <p className="eyebrow">The Master’s Circle</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">The Holy Mother &amp; the Disciples</h2>
              <p className="mt-4 text-ink-soft">
                The young men who became the monks of the Ramakrishna Order, the great householder devotees, and the
                women disciples — gathered around the Master and the Holy Mother.
              </p>
            </div>
            <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              {holyMother && (
                <Link href={toPath(holyMother.link)} className="group reveal mx-auto block w-full max-w-xs text-center">
                  <div className="arch border border-gold/50 bg-ivory p-2.5 shadow-xl shadow-maroon/10 transition group-hover:-translate-y-1">
                    <SacredImage slot={images.holyMother} className="arch" sizes="20rem" />
                  </div>
                  <p className="eyebrow mt-5">1853 – 1920</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold text-maroon group-hover:text-vermilion">Sri Sarada Devi</h3>
                  <p className="text-ink-soft">The Holy Mother</p>
                </Link>
              )}
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {circle.map((d) => {
                  const img = featuredImage(d)!;
                  return (
                    <Link key={d.id} href={toPath(d.link)} className="group reveal text-center">
                      <div className="arch relative aspect-[3/4] overflow-hidden border border-gold/40 bg-white shadow-md shadow-maroon/10 transition group-hover:-translate-y-1 group-hover:shadow-xl">
                        <Image src={img.source_url} alt={plainText(d.title.rendered)} fill sizes="12rem" className="object-contain px-1 pt-3" />
                      </div>
                      <p className="mt-3 font-display text-lg leading-tight text-maroon group-hover:text-vermilion">
                        {titleCase(plainText(d.title.rendered))}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="mt-14 text-center">
              <Link href="/disciples/" className="rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion">
                All disciples
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Sacred places ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="reveal flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="eyebrow">Tirtha</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Sacred Places</h2>
          </div>
          <Link href="/category/important-places/" className="font-display text-xl text-vermilion underline decoration-gold underline-offset-4 hover:text-maroon">
            All important places →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sacredPlaces.map((place) => (
            <Link key={place.name} href={place.href} className="group reveal relative block overflow-hidden rounded-3xl">
              <SacredImage slot={place.image} labelAt="top" aspect="aspect-[3/4]" className="transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent p-6 pt-20">
                <h3 className="font-display text-2xl font-semibold text-ivory">{place.name}</h3>
                <p className="text-sm text-gold-soft">{place.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Reminiscences ---------- */}
      <section className="temple-night relative overflow-hidden py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-gold">Reminiscences</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl">What Great Souls Said of Him</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group reveal flex flex-col items-center gap-6 rounded-[2rem] border border-gold/25 bg-white/[0.03] p-8 text-center backdrop-blur-sm transition hover:border-gold/60 sm:flex-row sm:text-left"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold/60">
                  <Image src={wpAsset(t.image)} alt={t.name} fill sizes="7rem" className="object-cover grayscale" />
                </div>
                <div>
                  <blockquote className="font-display text-2xl italic leading-snug text-ivory">“{t.quote}”</blockquote>
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gold group-hover:text-gold-soft">— {t.name}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/category/reminiscences/" className="rounded-full border border-gold/60 px-7 py-3 text-gold-soft transition hover:bg-gold/10">
              Read all reminiscences
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Videos ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Videos</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">From Belur Math</h2>
          <p className="mt-4 text-ink-soft">The official YouTube channel of the Ramakrishna Math and Ramakrishna Mission, Belur Math.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {videos.ids.map((id) => (
            <div key={id} className="reveal overflow-hidden rounded-3xl border border-gold/30 bg-night shadow-xl shadow-maroon/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title="Video from Belur Math"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={videos.channel} className="rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion" target="_blank" rel="noopener">
            Go to the channel
          </a>
        </div>
      </section>

      {/* ---------- Latest ---------- */}
      {latest.items.length > 0 && (
        <section className="border-t border-gold/20 bg-parchment/60">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
            <div className="reveal mx-auto max-w-2xl text-center">
              <p className="eyebrow">Recently Published</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Latest Articles</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latest.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/category/public-articles/" className="rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion">
                All articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Belur Math ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-sandal/60 pb-24 pt-16">
        <div className="reveal mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Diya className="mx-auto h-24 w-24" />
          <p className="mt-6 font-display text-3xl italic leading-snug text-maroon sm:text-4xl">
            “Longing is like the rosy dawn. After the dawn out comes the sun. Longing is followed by the vision of God.”
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-ink-soft">— Sri Ramakrishna</p>
          <LotusDivider className="my-10 text-gold" />
          <p className="text-lg text-ink-soft">Follow the official pages of Belur Math</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {[
              ["Official website", belurMath.site],
              ["Instagram", belurMath.instagram],
              ["Facebook", belurMath.facebook],
              ["YouTube", videos.channel],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-maroon/30 px-5 py-2 text-maroon transition hover:bg-maroon hover:text-ivory"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function titleCase(s: string) {
  return s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s(’'-])(\p{L})/gu, (_, p: string, c: string) => p + c.toUpperCase()) : s;
}
