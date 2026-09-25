import { getComments } from "@/lib/wp/client";
import { formatDate } from "@/lib/wp/content";
import type { WPComment } from "@/lib/wp/types";
import { Lotus } from "./ornaments";

/**
 * Readers' comments from WordPress, shown read-only and threaded. Avatars are
 * initials rather than Gravatar images, so no reader data goes to a third party.
 */
export async function Comments({ entryId, className = "" }: { entryId: number; className?: string }) {
  // Comments are secondary: if WordPress can't be reached, just leave them out.
  const comments = await getComments(entryId).catch(() => []);
  if (comments.length === 0) return null;

  const ids = new Set(comments.map((c) => c.id));
  const children = new Map<number, WPComment[]>();
  for (const c of comments) {
    // Replies to a comment that isn't visible are shown at the top level.
    const parent = ids.has(c.parent) ? c.parent : 0;
    children.set(parent, [...(children.get(parent) ?? []), c]);
  }

  return (
    <section aria-labelledby="comments-heading" className={`mx-auto max-w-3xl px-4 pb-16 sm:px-6 ${className}`}>
      <div className="text-center">
        <Lotus className="mx-auto h-7 w-14 text-gold" />
        <h2 id="comments-heading" className="mt-3 font-display text-3xl font-semibold text-maroon">
          Reflections from Readers
        </h2>
        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-ink-soft">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </p>
      </div>
      <Thread items={children.get(0) ?? []} childrenOf={children} />
      <p className="mt-8 text-center text-sm italic text-ink-soft">Comments are closed.</p>
    </section>
  );
}

function Thread({ items, childrenOf, depth = 0 }: { items: WPComment[]; childrenOf: Map<number, WPComment[]>; depth?: number }) {
  return (
    <ol className={depth === 0 ? "mt-10 space-y-6" : "mt-5 space-y-5 border-l-2 border-gold/40 pl-5 sm:pl-8"}>
      {items.map((c) => (
        <li key={c.id} id={`comment-${c.id}`} className="scroll-mt-32">
          <article className={depth === 0 ? "rounded-3xl border border-gold/25 bg-ivory p-6 shadow-sm shadow-maroon/5" : ""}>
            <header className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron to-maroon font-display text-lg text-ivory"
              >
                {initial(c.author_name)}
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-maroon">
                  {c.author_url ? (
                    <a href={c.author_url} rel="nofollow ugc noopener" target="_blank" className="hover:text-vermilion">
                      {c.author_name}
                    </a>
                  ) : (
                    c.author_name
                  )}
                </p>
                <time dateTime={c.date} className="text-sm text-ink-soft">
                  {formatDate(c.date)}
                </time>
              </div>
            </header>
            <div
              className="mt-3 break-words text-[1.05rem] leading-relaxed text-ink [&_a]:text-vermilion [&_a]:underline [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: c.content.rendered }}
            />
          </article>
          {childrenOf.has(c.id) && <Thread items={childrenOf.get(c.id)!} childrenOf={childrenOf} depth={depth + 1} />}
        </li>
      ))}
    </ol>
  );
}

function initial(name: string) {
  return (name.trim().match(/\p{L}/u)?.[0] ?? "॰").toUpperCase();
}
