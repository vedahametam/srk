import Image from "next/image";
import type { ImageSlot } from "@/content/images";
import { Mandala } from "./ornaments";

type Props = {
  slot: ImageSlot;
  className?: string;
  /** Tailwind aspect class, e.g. "aspect-[4/5]". Ignored when the parent sizes the image. */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
  /** Where the placeholder label sits; use "top" when a caption overlays the bottom. */
  labelAt?: "top" | "bottom";
};

/** A curated image, or an ornamental placeholder naming what belongs there. */
export function SacredImage({
  slot,
  className = "",
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  tone = "light",
  labelAt = "bottom",
}: Props) {
  if (slot.src) {
    return (
      <div className={`relative overflow-hidden ${aspect} ${className}`}>
        <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={`${slot.alt} (image coming soon)`}
      className={`relative isolate flex ${labelAt === "top" ? "items-start pt-10" : "items-end"} justify-center overflow-hidden ${aspect} ${className} ${
        dark
          ? "bg-[radial-gradient(ellipse_at_50%_35%,#7a2a18,#3a0d0b_70%)] text-gold-soft"
          : "bg-[radial-gradient(ellipse_at_50%_30%,#fbeccd,#e9d2a6_75%)] text-maroon"
      }`}
    >
      <Mandala className={`absolute left-1/2 top-[42%] w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 ${dark ? "opacity-25" : "opacity-20"}`} />
      <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 font-deva text-6xl opacity-40">ॐ</span>
      <span
        className={`relative z-10 m-4 rounded-full border px-4 py-1.5 text-center text-xs tracking-wide ${
          dark ? "border-gold/40 bg-black/25" : "border-maroon/20 bg-ivory/70"
        }`}
      >
        Image placeholder · {slot.label}
      </span>
    </div>
  );
}
