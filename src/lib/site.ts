export const site = {
  name: "Sri Ramakrishna",
  title: "Bhagavan Sri Ramakrishna",
  tagline: "As many faiths, so many paths",
  description:
    "The life, teachings and living presence of Bhagavan Sri Ramakrishna Paramahamsa, the saint of Dakshineswar.",
  /** The WordPress "Posts page" (Settings → Reading). Lists articles, paginated as /articles/page/2/. */
  postsIndexPath: "/articles/",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sriramakrishna.in").replace(/\/$/, ""),
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Primary navigation. WordPress menus are not exposed by the public REST API,
 * so the menu lives here. Keep hrefs identical to the existing WordPress routes.
 * TODO: align with the live site's menu once the route inventory is done.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "His Life",
    href: "/life/",
    children: [
      { label: "Childhood at Kamarpukur", href: "/life/kamarpukur/" },
      { label: "Dakshineswar", href: "/life/dakshineswar/" },
      { label: "Sadhana", href: "/life/sadhana/" },
      { label: "Cossipore & Mahasamadhi", href: "/life/cossipore/" },
    ],
  },
  { label: "Teachings", href: "/teachings/" },
  { label: "Holy Mother", href: "/holy-mother/" },
  { label: "Swamiji", href: "/swami-vivekananda/" },
  { label: "Articles", href: "/articles/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "The Master",
    items: [
      { label: "His Life", href: "/life/" },
      { label: "Teachings", href: "/teachings/" },
      { label: "Sacred Places", href: "/sacred-places/" },
      { label: "Gallery", href: "/gallery/" },
    ],
  },
  {
    heading: "The Holy Trinity",
    items: [
      { label: "Sri Ramakrishna", href: "/life/" },
      { label: "Sri Sarada Devi", href: "/holy-mother/" },
      { label: "Swami Vivekananda", href: "/swami-vivekananda/" },
    ],
  },
  {
    heading: "Explore",
    items: [
      { label: "Articles", href: "/articles/" },
      { label: "Search", href: "/search/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];
