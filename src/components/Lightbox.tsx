"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const navButton = "rounded-full border border-gold/50 px-5 py-2 text-gold-soft hover:bg-gold/10";

type Photo = { src: string; alt: string; width: number; height: number };

/** Masonry photo grid that opens each photo full screen, with keyboard navigation. */
export function Lightbox({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  }, [step]);

  const close = () => dialog.current?.close();
  const current = index === null ? null : photos[index];

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => open(i)}
            className="group mb-5 block w-full overflow-hidden rounded-2xl border border-gold/30 bg-parchment shadow-sm shadow-maroon/5 break-inside-avoid"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition duration-700 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-night/95"
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label="Photo viewer"
      >
        {current && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="relative h-[80dvh] w-full max-w-6xl">
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="font-display text-lg text-gold-soft">{current.alt}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} className={navButton}>
                ← Previous
              </button>
              <button type="button" onClick={close} className={navButton}>
                Close
              </button>
              <button type="button" onClick={() => step(1)} className={navButton}>
                Next →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
