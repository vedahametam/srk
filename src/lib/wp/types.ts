export type Rendered = { rendered: string };

export type WPMedia = {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
};

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
  link: string;
  taxonomy: "category" | "post_tag" | string;
  description?: string;
  count?: number;
  parent?: number;
};

export type WPAuthor = {
  id: number;
  name: string;
  slug: string;
  link: string;
  description?: string;
};

/** Subset of Yoast SEO's `yoast_head_json` REST field. Present only when Yoast is installed. */
export type YoastHead = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: Record<string, string>;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
};

export type WPEntry = {
  id: number;
  type: "post" | "page" | string;
  slug: string;
  link: string;
  date: string;
  modified: string;
  parent?: number;
  title: Rendered;
  content: Rendered;
  excerpt: Rendered;
  featured_media: number;
  categories?: number[];
  tags?: number[];
  yoast_head_json?: YoastHead;
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

export type Paged<T> = { items: T[]; total: number; totalPages: number };

export type WPComment = {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_url: string;
  date: string;
  content: Rendered;
};
