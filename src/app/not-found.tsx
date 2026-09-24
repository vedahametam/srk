import Link from "next/link";
import { Diya, LotusDivider } from "@/components/ornaments";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <Diya className="h-24 w-24" />
      <p className="eyebrow mt-6">Page not found</p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-maroon">This path leads elsewhere</h1>
      <p className="mt-5 font-display text-xl italic text-ink-soft">
        “As many faiths, so many paths” — but this one isn’t on our map. Perhaps the page has moved.
      </p>
      <LotusDivider className="my-10 text-gold" />
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-full bg-maroon px-6 py-3 text-ivory hover:bg-vermilion">
          Return home
        </Link>
        <Link href="/search/" className="rounded-full border border-maroon/30 px-6 py-3 text-maroon hover:bg-parchment">
          Search the site
        </Link>
      </div>
    </section>
  );
}
