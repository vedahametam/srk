import type { ReactNode } from "react";
import { LotusDivider, Mandala } from "./ornaments";

/** Title band used at the top of pages, posts and archives. */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="temple-night relative overflow-hidden">
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 w-[46rem] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.12] animate-slow-spin" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        {eyebrow && <p className="eyebrow !text-gold">{eyebrow}</p>}
        <h1 className="text-gilded mt-4 font-display text-4xl font-semibold leading-[1.1] sm:text-6xl">{title}</h1>
        {children && <div className="mt-5 text-ivory/80">{children}</div>}
        <LotusDivider className="mt-8 text-gold/80" />
      </div>
    </section>
  );
}
