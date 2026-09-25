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
| `/?p=123`, `/?page_id=8`, `/?cat=10`, `/?author=…`, `/?attachment_id=…`, `/?feed=rss2` | Looked up in WordPress and redirected to the permalink, as WordPress does (`src/app/wp-legacy/route.ts`) |
| Old or shortened URLs (`/about/`, `/gallery/`, a post's old slug) | Any URL that matches nothing is checked with WordPress; if WordPress would redirect it, so does this site |
| `/YYYY/MM/DD/post/<anything>/` | Attachment pages, `/comment-page-N/`, `/amp/`: redirect to the post |
| `/search/term/` | Redirects to `/search/?s=term` |
| `/wp-admin/`, `/wp-login.php` | Redirect to the WordPress host, for editors' bookmarks |

## Content handling

- **Books.** "The Gospel of Sri Ramakrishna" and "The Great Master" (categories under `ebooks`) show a numbered table of contents, grouped into Part I–V where the book has parts. Each chapter has previous/next chapter navigation. Chapters were published last-to-first, so newest-first is reading order.
- **Footnotes.** 1,339 footnote links in the imported books pointed at the source websites (`greatmaster.info`, `ramakrishnavivekananda.info`) even though the note is on the same page. They now jump to the note on the page. The 63 whose note is not on the page are left as they are.
- **Elementor.** Posts don't use Elementor. The About and Disciples pages use only simple widgets, so their content is rendered in the site's design. Any page with complex widgets keeps Elementor's layout and loads Elementor's stylesheets from WordPress (`src/components/EntryContent.tsx`).
- **Temples page.** Live, it shows a raw `[put_wpgm id=2]` shortcode from a deactivated map plugin. Here it lists the "Important Places" posts, each with a Directions link, plus Belur Math.
- **Gallery page.** A photo grid with a lightbox, built from the media library (`src/content/gallery.ts`), plus a link to the existing Flickr album.
- **Uploads** load straight from WordPress; page links inside content are rewritten to stay on this site.
- **Titles** imported in capitals ("THE HOLY MOTHER") are shown in title case.
- **Comments.** Existing comments are shown read-only and threaded under each post and page (`src/components/Comments.tsx`). There is no comment form yet; the section says "Comments are closed."

## Images

The designed pages use photos from the WordPress media library, copied to `public/images/` and registered in `src/content/images.ts`. A slot without `src` shows an ornamental placeholder saying what belongs there. Still wanted:

- a portrait of **Swami Vivekananda** (none in the media library)
- the **Panchavati** at Dakshineswar
- a **higher-resolution Holy Mother** portrait (the current one is 189×256)

## Going live: WordPress on www, this site on the root domain

The root domain `sriramakrishna.in` (the address Google has indexed) serves this site from Vercel. WordPress keeps running on Hostinger at `www.sriramakrishna.in`, for the admin, the API and uploads. Do the steps in this order:

1. **WordPress plugin.** Upload `wordpress/mu-plugins/headless-frontend.php` to `wp-content/mu-plugins/` on Hostinger. Create the folder if it doesn't exist. It is active as soon as it's uploaded.
2. **Vercel environment variables** (Production and Preview), then redeploy:
   - `WORDPRESS_URL=https://www.sriramakrishna.in`
   - `NEXT_PUBLIC_SITE_URL=https://sriramakrishna.in`
   - `REVALIDATE_SECRET=<random>`
   - `WORDPRESS_REVALIDATE_SECONDS` is optional; empty means 300.
3. **Vercel domain.** Add `sriramakrishna.in` to the project. Do not add `www`.
4. **DNS (Hostinger → Domains → DNS):**
   - `www`: replace the CNAME (→ `sriramakrishna.in`) with **A `145.79.210.98`** and **AAAA `2a02:4780:11:2054:0:28ef:bfdd:9`**, so `www` stays on Hostinger.
   - `@` (root): replace the A/AAAA records with the values Vercel shows when you add the domain (usually **A `76.76.21.21`**, and no AAAA).
   - Leave the MX records (email) and everything else unchanged.
5. **WordPress → Settings → General**, once the root domain shows the new site:
   - WordPress Address (URL): `https://www.sriramakrishna.in`
   - Site Address (URL): `https://sriramakrishna.in` (unchanged)

   Links WordPress generates keep pointing at the root domain. Anyone opening a page on `www` is redirected to the same page on the root domain, so each page keeps a single address for search engines. The admin is at `https://www.sriramakrishna.in/wp-admin/`, and `/wp-admin/` on the root domain redirects there.
6. **Check:** `https://sriramakrishna.in/api/wp-health/?secret=…` shows `"ok": true`; `/feed/` and `/wp-sitemap.xml` load; a post opened on `www` redirects to the root domain.
7. **SSL on Hostinger:** after a day, check in hPanel that `www.sriramakrishna.in` still has a valid certificate. If the certificate also covered the root domain, its renewal may fail now that the root points to Vercel; reissue it for `www` only.

Other notes:
- WordPress's "Preview" and "View post" buttons open the root domain. Published content shows up within `WORDPRESS_REVALIDATE_SECONDS`, or immediately with the publish webhook (`POST /api/revalidate/?secret=…`). Previews of unpublished drafts are not supported.
- The menu lives in `src/lib/site.ts`, because WordPress menus aren't in the public API.

## Project layout

```
src/app/            routes: home, catch-all permalinks, archives, search, feeds proxy, revalidate API
src/components/     header, footer, ornaments, cards, post/page/book views, designed pages, lightbox
src/content/        editorial content: teachings, timeline, image slots, gallery
src/lib/wp/         WordPress client, books, Elementor simplifier, HTML/link helpers, sample data
src/lib/routing.ts  permalink parser
```
