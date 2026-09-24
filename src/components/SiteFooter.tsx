import Link from "next/link";
import { footerNav, site } from "@/lib/site";
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
                    <Link href={item.href} className="text-ivory/80 transition hover:text-gold-soft">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
