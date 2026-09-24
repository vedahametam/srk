"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/site";

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // Remember where the menu was opened, so navigating anywhere closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-10 w-10 place-items-center rounded-full text-maroon hover:bg-parchment"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="paper absolute inset-x-0 top-full h-[calc(100dvh-6rem)] overflow-y-auto border-t border-gold/30 px-6 pb-12 pt-4"
        >
          <ul className="divide-y divide-gold/20">
            {items.map((item) => (
              <li key={item.href} className="py-2">
                <Link href={item.href} className="block py-2 font-display text-2xl text-maroon">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-4 border-l border-gold/40 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-1.5 text-ink-soft">
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
      )}
    </div>
  );
}
