import { getElementorStyles } from "@/lib/wp/client";
import { isElementor, localizeFootnotes, rewriteContentLinks } from "@/lib/wp/content";
import { simplifyElementor, stripDeadShortcodes } from "@/lib/wp/elementor";
import type { WPEntry } from "@/lib/wp/types";

export type PreparedContent = { html: string; mode: "prose" | "elementor" };

/**
 * Cleans WordPress HTML for display. Simple Elementor layouts are flattened
 * into prose so they take the site's design; complex ones keep Elementor.
 */
export function prepareContent(entry: WPEntry): PreparedContent {
  let html = entry.content.rendered;
  let mode: PreparedContent["mode"] = "prose";
  if (isElementor(entry)) {
    const simple = simplifyElementor(html);
    if (simple === null) mode = "elementor";
    else html = simple;
  }
  html = localizeFootnotes(rewriteContentLinks(stripDeadShortcodes(html)));
  return { html, mode };
}

export async function EntryContent({
  entry,
  content = prepareContent(entry),
  dropCap,
}: {
  entry: WPEntry;
  content?: PreparedContent;
  dropCap?: boolean;
}) {
  if (content.mode === "elementor") {
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
        <div className="elementor-host" dangerouslySetInnerHTML={{ __html: content.html }} />
      </>
    );
  }

  return (
    <div
      className={`wp-prose mx-auto max-w-3xl px-4 sm:px-6 ${dropCap ? "drop-cap" : ""}`}
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
}
