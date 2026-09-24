# sriramakrishna.in — headless frontend

A Next.js 16 (App Router, TypeScript, Tailwind v4) frontend for [sriramakrishna.in](https://sriramakrishna.in), with the existing WordPress running headless behind it. Every existing WordPress URL is served at the same path.

## Quick start

```bash
npm install
cp .env.example .env.local   # set WORDPRESS_URL=https://sriramakrishna.in to use the live content
npm run dev                  # http://localhost:3000
```

Without `WORDPRESS_URL` the site runs on built-in sample content (`src/lib/wp/mock.ts`).

## What the live site contains (audited)

| Content | Count | URL pattern |
| --- | --- | --- |
| Posts | 371 | `/2018/02/01/swami-brahmananda/` (`/%year%/%monthnum%/%day%/%postname%/`) |
| Pages | 6 | `/about-2/`, `/temples/`, `/disciples/`, `/gallery-2/`, front page `homepage` → `/` |
| Categories | 20, nested | `/category/ebooks/the-great-master/part-i/`, paginated `/page/N/` |
| Tags | 2 | `/tag/yoga/` |
| Authors | 23 | `/author/swami-chidekananda/` |

All 477 URLs from the live site (posts, pages, categories and their `/page/N/`, tags, authors, date archives, feeds, sitemaps) were checked against this frontend: all return 200. The exceptions are the paginated pages of the two books, which redirect (308) to the book's contents page, where every chapter is listed.

## How routes map

| URL | Served by |
| --- | --- |
| `/` | Designed home page (`src/app/page.tsx`); WordPress's `/homepage/` and `/page/N/` redirect here, as they do today |
| `/YYYY/MM/DD/slug/` | Post, via `src/app/[...uri]/page.tsx` + `src/lib/routing.ts`; a wrong date or bare `/slug/` redirects to the real permalink |
| `/YYYY/`, `/YYYY/MM/`, `/YYYY/MM/DD/` | Date archives |
| `/about-2/`, `/disciples/`, `/temples/`, `/gallery-2/` | Designed pages that still draw their text and links from WordPress (`src/components/pages.tsx`) |
| other `/page-path/` | Any other WordPress page |
| `/category/…/` | Category archives (children included, as in WordPress); books get a table of contents |
| `/tag/…/`, `/author/…/`, `/?s=` | Tag/author archives, search |
| `/feed/`, `/…/feed/`, `/wp-sitemap*.xml` | Proxied from WordPress with links rewritten |
| `/wp-content/…` | Proxied to WordPress (old links to uploads keep working) |

## Content handling

- **Books.** "The Gospel of Sri Ramakrishna" and "The Great Master" (categories under `ebooks`) show a numbered table of contents, grouped into Part I–V where the book has parts. Each chapter has previous/next chapter navigation. Chapters were published last-to-first, so newest-first is reading order.
- **Footnotes.** 1,339 footnote links in the imported books pointed at the source websites (`greatmaster.info`, `ramakrishnavivekananda.info`) even though the note is on the same page. They now jump to the note on the page. The 63 whose note is not on the page are left as they are.
- **Elementor.** Posts don't use Elementor. The About and Disciples pages use only simple widgets, so their content is rendered in the site's design. Any page with complex widgets keeps Elementor's layout and loads Elementor's stylesheets from WordPress (`src/components/EntryContent.tsx`).
- **Temples page.** Live, it shows a raw `[put_wpgm id=2]` shortcode from a deactivated map plugin. Here it lists the "Important Places" posts, each with a Directions link, plus Belur Math.
- **Gallery page.** A photo grid with a lightbox, built from the media library (`src/content/gallery.ts`), plus a link to the existing Flickr album.
- **Uploads** load straight from WordPress; page links inside content are rewritten to stay on this site.
- **Titles** imported in capitals ("THE HOLY MOTHER") are shown in title case.

## Images

The designed pages use photos from the WordPress media library, copied to `public/images/` and registered in `src/content/images.ts`. A slot without `src` shows an ornamental placeholder saying what belongs there. Still wanted:

- a portrait of **Swami Vivekananda** (none in the media library)
- the **Panchavati** at Dakshineswar
- a **higher-resolution Holy Mother** portrait (the current one is 189×256)

## Going live

1. Move WordPress to e.g. `cms.sriramakrishna.in`, with both *WordPress Address* and *Site Address* set to it.
2. Keep that host out of search results with an `X-Robots-Tag: noindex` header, and don't tick *Discourage search engines*.
3. Deploy this app (Vercel or any Node host) on `sriramakrishna.in` with the variables from `.env.example`, using `WORDPRESS_URL=https://cms.sriramakrishna.in`.
4. Optional: have WordPress call `POST /api/revalidate/?secret=…` with `{"slug":"…","type":"post"}` on publish, for instant updates. Otherwise content refreshes every `WORDPRESS_REVALIDATE_SECONDS` (default 300).
5. The menu lives in `src/lib/site.ts`, because WordPress menus aren't in the public API. It mirrors the live menu, minus "Audio" and "Video", which point to `#`.

Not carried over: comments (16 exist, and comments are open on posts). Showing them is a read-only API call; posting them from the new site would need extra work.

## Project layout

```
src/app/            routes: home, catch-all permalinks, archives, search, feeds proxy, revalidate API
src/components/     header, footer, ornaments, cards, post/page/book views, designed pages, lightbox
src/content/        editorial content: teachings, timeline, image slots, gallery
src/lib/wp/         WordPress client, books, Elementor simplifier, HTML/link helpers, sample data
src/lib/routing.ts  permalink parser
```
