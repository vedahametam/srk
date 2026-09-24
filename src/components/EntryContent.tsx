import { getElementorStyles } from "@/lib/wp/client";
import { isElementor, rewriteContentLinks } from "@/lib/wp/content";
import type { WPEntry } from "@/lib/wp/types";

/**
 * Renders WordPress HTML. Classic/Gutenberg content gets the site's reading
 * typography; Elementor content keeps its own layout and stylesheets.
 */
export async function EntryContent({ entry, dropCap }: { entry: WPEntry; dropCap?: boolean }) {
  const html = rewriteContentLinks(entry.content.rendered);

  if (isElementor(entry)) {
    const { links, inline } = await getElementorStyles(entry);
    return (
      <>
        {links.map((href) => (
          // React 19 hoists these into <head> and dedupes them.
          <link key={href} rel="stylesheet" href={href} precedence="default" />
        ))}
        {inline.map((css, i) => (
          <style key={i} href={`elementor-inline-${entry.id}-${i}`} precedence="default">
            {css}
          </style>
        ))}
        <div className="elementor-host" dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }

  return (
    <div
      className={`wp-prose mx-auto max-w-3xl px-4 sm:px-6 ${dropCap ? "drop-cap" : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
