import { parse } from "node-html-parser";

/** Widgets whose output is plain content and reads well as ordinary prose. */
const SIMPLE = new Set(["heading", "text-editor", "image", "spacer", "divider", "button"]);

/**
 * If an Elementor layout uses only simple content widgets, returns its content
 * as plain HTML so it can be shown in the site's own reading design.
 * Returns null for layouts that need Elementor's styling and scripts.
 */
export function simplifyElementor(html: string): string | null {
  const root = parse(html);
  const widgets = root.querySelectorAll(".elementor-widget");
  if (widgets.length === 0) return null;
  const types = widgets.map((w) => (w.getAttribute("data-widget_type") ?? "").split(".")[0]);
  if (!types.every((t) => SIMPLE.has(t))) return null;

  const parts: string[] = [];
  widgets.forEach((w, i) => {
    const inner = w.querySelector(".elementor-widget-container") ?? w;
    switch (types[i]) {
      case "heading": {
        const h = inner.querySelector("h1,h2,h3,h4,h5,h6,p");
        if (h?.text.trim()) parts.push(`<h2>${h.innerHTML.trim()}</h2>`);
        break;
      }
      case "text-editor":
        parts.push(inner.innerHTML.trim());
        break;
      case "image": {
        const img = inner.querySelector("img");
        if (img) parts.push(`<figure>${img.toString()}</figure>`);
        break;
      }
      case "button": {
        const a = inner.querySelector("a");
        if (a?.getAttribute("href")) parts.push(`<p><a href="${a.getAttribute("href")}">${a.text.trim()}</a></p>`);
        break;
      }
      // spacer and divider carry no content.
    }
  });
  return parts.join("\n");
}

/** Removes paragraphs that are only an unrendered shortcode, e.g. "[put_wpgm id=2]" from a deactivated plugin. */
export function stripDeadShortcodes(html: string): string {
  return html
    .replace(/<p>\s*\[[a-z_][\w-]*(?:\s[^\]]*)?\]\s*<\/p>/gi, "")
    .replace(/<p>(?:\s|&nbsp;)*<\/p>/g, "");
}
