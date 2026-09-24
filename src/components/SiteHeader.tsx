import Link from "next/link";
import { mainNav, site } from "@/lib/site";
import { MobileNav } from "./MobileNav";
import { Lotus } from "./ornaments";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-maroon-deep text-center text-[0.8rem] tracking-wide text-gold-soft">
        <p className="mx-auto max-w-7xl truncate px-4 py-1.5">
          <span className="font-deva">ॐ नमो भगवते श्रीरामकृष्णाय</span>
          <span className="mx-3 opacity-50">·</span>
          <span className="italic">Om Namo Bhagavate Sri Ramakrishnaya</span>
        </p>
      </div>
      <div className="border-b border-gold/30 bg-ivory/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 bg-parchment text-saffron-deep shadow-[0_0_24px_-6px] shadow-saffron/50 transition group-hover:shadow-saffron">
              <Lotus className="h-5 w-9" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-2xl font-semibold text-maroon">{site.name}</span>
              <span className="hidden text-[0.68rem] uppercase tracking-[0.3em] text-ink-soft sm:block">Paramahamsa of Dakshineswar</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="rounded-full px-3 py-2 text-[0.98rem] text-ink transition hover:bg-parchment hover:text-maroon"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="invisible absolute left-0 top-full min-w-60 translate-y-1 rounded-2xl border border-gold/30 bg-ivory p-2 opacity-0 shadow-xl shadow-maroon/10 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block rounded-xl px-3 py-2 text-[0.95rem] hover:bg-parchment hover:text-maroon">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search/"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-maroon transition hover:bg-parchment"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </Link>
            <MobileNav items={mainNav} />
          </div>
        </div>
      </div>
    </header>
  );
}
