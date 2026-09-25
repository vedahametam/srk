export const site = {
  name: "Sri Ramakrishna",
  title: "Sri Ramakrishna Paramahamsa",
  tagline: "The Prophet of the Modern Age",
  description:
    "The life, teachings, disciples and sacred places of Sri Ramakrishna Paramahamsa, with The Gospel of Sri Ramakrishna and Sri Ramakrishna, The Great Master.",
  /**
   * WordPress "Posts page" (Settings → Reading), paginated as <path>page/2/.
   * The site uses a static front page and has no posts page, so this is off.
   */
  postsIndexPath: null as string | null,
  /** Slug of the WordPress page set as the static front page; WordPress redirects it to "/". */
  frontPageSlug: "homepage",
  /** Parent category whose children are books, shown as a table of contents. */
  booksCategorySlug: "ebooks",
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sriramakrishna.in").replace(/\/$/, ""),
};

/** The Sri Ramakrishna mobile app, linked from the footer. */
export const appLinks = {
  googlePlay: "https://play.google.com/store/apps/details?id=com.karthavya.sriramakrishna&hl=en_IN",
  appStore: "https://apps.apple.com/in/app/sri-ramakrishna/id1352795521",
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Primary navigation, mirroring the live WordPress "Main Menu" (the public
 * REST API does not expose menus). The live "Audio" and "Video" items point
 * to "#" and are left out.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-2/" },
  { label: "Temples", href: "/temples/" },
  { label: "Disciples", href: "/disciples/" },
  {
    label: "Books",
    href: "/category/ebooks/the-gospel-of-sri-ramakrishna/",
    children: [
      { label: "The Gospel of Sri Ramakrishna", href: "/category/ebooks/the-gospel-of-sri-ramakrishna/" },
      { label: "The Great Master", href: "/category/ebooks/the-great-master/" },
    ],
  },
  {
    label: "Category",
    href: "/category/reminiscences/",
    children: [
      { label: "Reminiscences", href: "/category/reminiscences/" },
      { label: "Articles", href: "/category/public-articles/" },
      { label: "Vedanta Kesari", href: "/category/vedanta-kesari/" },
      { label: "Important Places", href: "/category/important-places/" },
      { label: "Bhajans", href: "/category/bhajans/" },
      { label: "Bhava Prachar Parishads", href: "/category/bpp/" },
    ],
  },
  { label: "Gallery", href: "/gallery-2/" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The Master",
    items: [
      { label: "About", href: "/about-2/" },
      { label: "Disciples", href: "/disciples/" },
      { label: "Temples", href: "/temples/" },
      { label: "Gallery", href: "/gallery-2/" },
    ],
  },
  {
    heading: "Library",
    items: [
      { label: "The Gospel of Sri Ramakrishna", href: "/category/ebooks/the-gospel-of-sri-ramakrishna/" },
      { label: "The Great Master", href: "/category/ebooks/the-great-master/" },
      { label: "Reminiscences", href: "/category/reminiscences/" },
      { label: "Vedanta Kesari", href: "/category/vedanta-kesari/" },
    ],
  },
  {
    heading: "Belur Math",
    items: [
      { label: "Official website", href: "https://belurmath.org/" },
      { label: "YouTube", href: "https://www.youtube.com/user/belurmathorg" },
      { label: "Instagram", href: "https://www.instagram.com/rkmbelurmath/" },
      { label: "Facebook", href: "https://www.facebook.com/rkmbelur" },
    ],
  },
];
