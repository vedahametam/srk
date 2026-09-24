/**
 * Sample content used when WORDPRESS_URL is not set, so the frontend can be
 * developed and previewed without a live WordPress. Shapes mirror the REST API.
 */
import type { WPAuthor, WPEntry, WPTerm } from "./types";

const ORIGIN = "https://sriramakrishna.in";

export const mockAuthors: WPAuthor[] = [
  { id: 1, name: "Editorial Team", slug: "editor", link: `${ORIGIN}/author/editor/` },
];

export const mockCategories: WPTerm[] = [
  { id: 2, name: "Articles", slug: "public-articles", link: `${ORIGIN}/category/public-articles/`, taxonomy: "category", count: 3 },
  { id: 3, name: "Reminiscences", slug: "reminiscences", link: `${ORIGIN}/category/reminiscences/`, taxonomy: "category", count: 2 },
  { id: 4, name: "Disciples", slug: "disciples", link: `${ORIGIN}/category/disciples/`, taxonomy: "category", count: 1 },
];

export const mockTags: WPTerm[] = [
  { id: 10, name: "Dakshineswar", slug: "dakshineswar", link: `${ORIGIN}/tag/dakshineswar/`, taxonomy: "post_tag" },
  { id: 11, name: "Kathamrita", slug: "kathamrita", link: `${ORIGIN}/tag/kathamrita/`, taxonomy: "post_tag" },
  { id: 12, name: "Mother Kali", slug: "mother-kali", link: `${ORIGIN}/tag/mother-kali/`, taxonomy: "post_tag" },
];

const para = (t: string) => `<p>${t}</p>`;
const sample = [
  "This is sample content shown while the site is not connected to WordPress. Once <code>WORDPRESS_URL</code> is configured, the real article from sriramakrishna.in is rendered here with the same URL it has today.",
  "Sri Ramakrishna taught that God may be realised through every sincere path, and that the goal of human life is the direct experience of the Divine. His words, recorded by devotees in the parlour and on the verandah at Dakshineswar, continue to console and awaken seekers everywhere.",
  "“You see many stars in the sky at night, but not when the sun rises. Can you therefore say that there are no stars in the heavens during the day? O man, because you cannot find God in the days of your ignorance, say not that there is no God.”",
];

function post(
  id: number,
  slug: string,
  title: string,
  date: string,
  categories: number[],
  tags: number[],
  excerpt: string,
): WPEntry {
  const [y, m, d] = date.slice(0, 10).split("-");
  return {
    id,
    type: "post",
    slug,
    link: `${ORIGIN}/${y}/${m}/${d}/${slug}/`,
    date,
    modified: date,
    title: { rendered: title },
    excerpt: { rendered: para(excerpt) },
    content: {
      rendered:
        para(excerpt) +
        para(sample[0]) +
        `<h2>From the Master’s words</h2>` +
        `<blockquote>${para(sample[2])}</blockquote>` +
        para(sample[1]),
    },
    featured_media: 0,
    categories,
    tags,
    _embedded: {
      author: [mockAuthors[0]],
      "wp:term": [
        mockCategories.filter((c) => categories.includes(c.id)),
        mockTags.filter((t) => tags.includes(t.id)),
      ],
    },
  };
}

export const mockPosts: WPEntry[] = [
  post(101, "as-many-faiths-so-many-paths", "As Many Faiths, So Many Paths", "2026-09-20T06:00:00", [2], [11], "Having practised the disciplines of many traditions, the Master declared that all religions lead to the same God."),
  post(102, "the-temple-at-dakshineswar", "The Temple Garden at Dakshineswar", "2026-09-12T06:00:00", [3], [10, 12], "On the eastern bank of the Ganga, Rani Rasmani’s temple garden became the stage of the Master’s divine play."),
  post(103, "the-first-meeting-with-narendra", "The First Meeting with Narendra", "2026-08-30T06:00:00", [4, 3], [10], "In 1881 a young Narendranath Datta asked, “Sir, have you seen God?” The answer changed his life."),
  post(104, "parable-of-the-salt-doll", "The Parable of the Salt Doll", "2026-08-15T06:00:00", [2], [11], "A salt doll went to measure the depth of the ocean — and never returned to tell the tale."),
  post(105, "the-holy-mother-at-nahabat", "The Holy Mother at the Nahabat", "2026-07-28T06:00:00", [4], [10], "In a tiny room of the music tower, Sri Sarada Devi served the Master and his devotees in silence."),
  post(106, "woman-and-gold", "On Renunciation and the Inner Life", "2026-07-10T06:00:00", [2], [11], "The Master’s counsel for householders: live in the world like a maidservant in a rich man’s house."),
];

function page(id: number, slug: string, title: string, parent = 0, parentPath = ""): WPEntry {
  const path = `${parentPath}/${slug}/`;
  return {
    id,
    type: "page",
    slug,
    link: `${ORIGIN}${path}`,
    date: "2026-01-01T00:00:00",
    modified: "2026-01-01T00:00:00",
    parent,
    title: { rendered: title },
    excerpt: { rendered: para(sample[1]) },
    content: {
      rendered:
        para(sample[0]) +
        para(sample[1]) +
        `<h2>A section heading</h2>` +
        para(sample[1]) +
        `<blockquote>${para(sample[2])}</blockquote>`,
    },
    featured_media: 0,
    _embedded: { author: [mockAuthors[0]] },
  };
}

export const mockPages: WPEntry[] = [
  page(201, "about-2", "About"),
  page(202, "temples", "Temples"),
  page(203, "disciples", "Disciples"),
  page(204, "gallery-2", "Gallery"),
];
