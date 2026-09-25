import Image from "next/image";
import Link from "next/link";
import { appLinks, footerNav, site } from "@/lib/site";
import { Diya, LotusDivider, Mandala } from "./ornaments";

export function SiteFooter() {
  return (
    <footer className="temple-night relative overflow-hidden">
      <Mandala className="pointer-events-none absolute -right-40 -top-40 w-[34rem] text-gold opacity-[0.08] animate-slow-spin" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Diya className="h-20 w-20" />
          <p className="mt-4 max-w-2xl font-display text-2xl italic leading-snug text-gold-soft sm:text-3xl">
            “The winds of grace are always blowing, but you have to raise your sail.”
          </p>
          <LotusDivider className="mt-8 text-gold/70" />
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-gold-soft">{site.name}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/70">{site.description}</p>
          </div>
          {footerNav.map((group) => (
            <div key={group.heading}>
              <p className="eyebrow !text-gold">{group.heading}</p>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link prefetch={false} href={item.href} className="text-ivory/80 transition hover:text-gold-soft">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 rounded-[2rem] border border-gold/25 bg-white/[0.03] px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div>
            <p className="font-display text-2xl text-gold-soft">Download the Sri Ramakrishna App</p>
            <p className="mt-1 text-sm text-ivory/65">The Master’s life and teachings, on your phone.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Official store badges; Apple and Google require them unaltered. */}
            <a href={appLinks.googlePlay} target="_blank" rel="noopener" className="transition hover:opacity-85">
              <Image
                src="/images/badges/google-play.png"
                alt="Get it on Google Play"
                width={161}
                height={48}
                unoptimized
                className="h-12 w-auto"
              />
            </a>
            <a href={appLinks.appStore} target="_blank" rel="noopener" className="transition hover:opacity-85">
              <Image
                src="/images/badges/app-store.svg"
                alt="Download on the App Store"
                width={144}
                height={48}
                unoptimized
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>

        <div className="gold-rule mt-12 opacity-40" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-sm text-ivory/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-bangla">জয় ঠাকুর · জয় মা · জয় স্বামীজী</p>
        </div>
      </div>
    </footer>
  );
}
