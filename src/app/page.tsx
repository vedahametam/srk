import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { SacredImage } from "@/components/SacredImage";
import { Diya, LotusDivider, Mandala } from "@/components/ornaments";
import { images } from "@/content/images";
import { milestones, pranamMantra, sacredPlaces, teachings, trinity } from "@/content/master";
import { site } from "@/lib/site";
import { getPosts } from "@/lib/wp/client";

export default async function Home() {
  const { items: latest } = await getPosts({ perPage: 3 });
  const [featured, ...moreTeachings] = teachings;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="temple-night relative isolate overflow-hidden">
        <Mandala className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[72rem] max-w-none -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.09] animate-slow-spin" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-20">
          <div className="text-center lg:text-left">
            <p className="font-deva text-xl text-gold-soft/90 sm:text-2xl">ॐ नमो भगवते श्रीरामकृष्णाय</p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] sm:text-7xl xl:text-8xl">
              <span className="block text-2xl font-medium italic tracking-wide text-ivory/80 sm:text-3xl">Bhagavan</span>
              <span className="text-gilded">Sri Ramakrishna</span>
            </h1>
            <p className="eyebrow mt-5 !text-gold">Paramahamsa of Dakshineswar · 1836 – 1886</p>
            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <p className="font-bangla text-3xl text-gold-soft sm:text-4xl">যত মত তত পথ</p>
              <p className="mt-2 font-display text-2xl italic text-ivory/85">“As many faiths, so many paths.”</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/life/"
                className="rounded-full bg-gradient-to-b from-saffron to-saffron-deep px-7 py-3 font-medium text-ivory shadow-lg shadow-saffron/30 transition hover:shadow-saffron/50"
              >
                Read His Life
              </Link>
              <Link
                href="/teachings/"
                className="rounded-full border border-gold/60 px-7 py-3 font-medium text-gold-soft transition hover:bg-gold/10"
              >
                Words of the Master
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-saffron/30 blur-3xl animate-glow" />
            <div className="arch rounded-b-[2rem] border border-gold/50 p-3 shadow-2xl shadow-black/50">
              <SacredImage slot={images.masterPortrait} tone="dark" labelAt="top" priority className="arch rounded-b-[1.4rem]" sizes="(min-width: 1024px) 28rem, 90vw" />
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

      {/* ---------- Life timeline ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">His Divine Life</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">From Kamarpukur to Cossipore</h2>
          <p className="mt-4 text-ink-soft">
            Fifty years in which the eternal truths of every tradition were lived again, in a village-born priest of
            Mother Kali.
          </p>
        </div>

        <ol className="relative mt-16 space-y-14 before:absolute before:left-5 before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-gold before:via-gold/60 before:to-transparent md:before:left-1/2">
          {milestones.map((m, i) => (
            <li key={m.year} className="reveal relative grid gap-6 pl-14 md:grid-cols-2 md:gap-16 md:pl-0">
              <span className="absolute left-5 top-2 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-saffron ring-4 ring-ivory md:left-1/2" />
              <div className={`${i % 2 ? "md:order-2" : "md:text-right"}`}>
                <p className="font-display text-5xl font-semibold text-saffron-deep/90">{m.year}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-maroon">{m.title}</h3>
                <p className="mt-2 text-ink-soft">{m.text}</p>
              </div>
              {m.image && (
                <div className={i % 2 ? "md:order-1" : ""}>
                  <SacredImage slot={m.image} aspect="aspect-[16/10]" className="rounded-3xl border border-gold/30" sizes="(min-width: 768px) 40vw, 90vw" />
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-14 text-center">
          <Link href="/life/" className="font-display text-xl text-vermilion underline decoration-gold underline-offset-4 hover:text-maroon">
            Read the full life →
          </Link>
        </div>
      </section>

      {/* ---------- Teachings ---------- */}
      <section className="temple-night relative overflow-hidden py-24">
        <Mandala className="pointer-events-none absolute -left-48 top-10 w-[40rem] text-gold opacity-[0.07]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-4xl text-center">
            <p className="eyebrow !text-gold">Words of the Master</p>
            <blockquote className="mt-8">
              <p className="font-display text-3xl italic leading-snug text-ivory sm:text-4xl">“{featured.text}”</p>
              <footer className="mt-6 text-gold-soft">— Sri Ramakrishna</footer>
            </blockquote>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreTeachings.map((t) => (
              <figure key={t.text} className="reveal flex flex-col rounded-3xl border border-gold/25 bg-white/[0.03] p-7 backdrop-blur-sm transition hover:border-gold/50 hover:bg-white/[0.06]">
                <span className="font-display text-6xl leading-none text-saffron/80" aria-hidden="true">“</span>
                <blockquote className="-mt-4 flex-1 font-display text-xl leading-relaxed text-ivory/90">{t.text}</blockquote>
                <figcaption className="eyebrow mt-6 !text-gold/90">{t.theme}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/teachings/" className="rounded-full border border-gold/60 px-7 py-3 text-gold-soft transition hover:bg-gold/10">
              More teachings
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Holy Trinity ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">The Holy Trinity</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Thakur, Ma &amp; Swamiji</h2>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {trinity.map((p) => (
            <Link key={p.name} href={p.href} className="group reveal block text-center">
              <div className="arch mx-auto max-w-xs border border-gold/40 bg-parchment p-2.5 transition group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-saffron/20">
                <SacredImage slot={p.image} className="arch" sizes="(min-width: 768px) 20rem, 80vw" />
              </div>
              <p className="eyebrow mt-6">{p.epithet}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-maroon group-hover:text-vermilion">{p.name}</h3>
              <p className="text-sm tracking-wider text-ink-soft">{p.dates}</p>
              <p className="mx-auto mt-3 max-w-sm text-ink-soft">{p.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Sacred places ---------- */}
      <section className="border-y border-gold/30 bg-parchment py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <p className="eyebrow">Tirtha</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Sacred Places</h2>
            </div>
            <Link href="/sacred-places/" className="font-display text-xl text-vermilion underline decoration-gold underline-offset-4 hover:text-maroon">
              Visit the holy sites →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sacredPlaces.map((place) => (
              <div key={place.name} className="group reveal relative overflow-hidden rounded-3xl">
                <SacredImage slot={place.image} labelAt="top" aspect="aspect-[3/4]" className="transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent p-6 pt-20">
                  <h3 className="font-display text-2xl font-semibold text-ivory">{place.name}</h3>
                  <p className="text-sm text-gold-soft">{place.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Latest articles ---------- */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow">From the Journal</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-maroon sm:text-5xl">Latest Articles</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={site.postsIndexPath} className="rounded-full bg-maroon px-7 py-3 text-ivory transition hover:bg-vermilion">
              All articles
            </Link>
          </div>
        </section>
      )}

      {/* ---------- Closing invocation ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-sandal/60 pb-24 pt-8">
        <div className="reveal mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Diya className="mx-auto h-24 w-24" />
          <p className="mt-6 font-display text-3xl italic leading-snug text-maroon sm:text-4xl">
            “Longing is like the rosy dawn. After the dawn out comes the sun. Longing is followed by the vision of God.”
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-ink-soft">— Sri Ramakrishna</p>
        </div>
      </section>
    </>
  );
}
