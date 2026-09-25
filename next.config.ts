import type { NextConfig } from "next";

const wordpress = process.env.WORDPRESS_URL?.replace(/\/$/, "");

const imageOrigins = [
  wordpress,
  ...(process.env.WORDPRESS_LINK_ORIGINS ?? "https://sriramakrishna.in,https://www.sriramakrishna.in").split(","),
]
  .map((o) => o?.trim())
  .filter((o): o is string => Boolean(o));

const nextConfig: NextConfig = {
  // WordPress permalinks end with a slash; keep every URL identical.
  trailingSlash: true,

  images: {
    remotePatterns: [
      ...imageOrigins.map((origin) => {
        const u = new URL(origin);
        return {
          protocol: u.protocol.replace(":", "") as "http" | "https",
          hostname: u.hostname,
          pathname: "/wp-content/**",
        };
      }),
      { protocol: "https", hostname: "*.wp.com", pathname: "/**" },
    ],
  },

  async redirects() {
    return [
      // WordPress's pretty search URLs: /search/term/
      { source: "/search/:term/", destination: "/search/?s=:term", permanent: true },
      // Editors' old bookmarks: the dashboard now lives on the WordPress host.
      ...(wordpress
        ? [
            { source: "/wp-admin/:path*", destination: `${wordpress}/wp-admin/:path*`, permanent: false },
            { source: "/wp-login.php", destination: `${wordpress}/wp-login.php`, permanent: false },
          ]
        : []),
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        // WordPress search: /?s=term
        { source: "/", has: [{ type: "query", key: "s" }], destination: "/search/" },
        // Query-string links WordPress still answers: /?p=123, /?page_id=8, /?cat=10, /?feed=rss2 …
        ...(wordpress
          ? ["p", "page_id", "cat", "tag", "author", "attachment_id", "feed", "m"].map((key) => ({
              source: "/",
              has: [{ type: "query" as const, key }],
              destination: "/wp-legacy/",
            }))
          : []),
        // Feeds and XML sitemaps are served by WordPress with links rewritten to this site.
        ...(wordpress
          ? [
              { source: "/feed/", destination: "/wp-proxy/feed/" },
              { source: "/:path+/feed/", destination: "/wp-proxy/:path+/feed/" },
              { source: "/sitemap_index.xml", destination: "/wp-proxy/sitemap_index.xml" },
              { source: "/:name(.+-sitemap\\d*\\.xml)", destination: "/wp-proxy/:name" },
              { source: "/:name(wp-sitemap.*\\.(?:xml|xsl))", destination: "/wp-proxy/:name" },
              { source: "/:name(main-sitemap\\.xsl)", destination: "/wp-proxy/:name" },
            ]
          : []),
      ],
      // Checked before dynamic routes, so the catch-all page route never sees these.
      // Uploads and plugin assets referenced from WordPress content.
      afterFiles: wordpress
        ? [
            { source: "/wp-content/:path*", destination: `${wordpress}/wp-content/:path*` },
            { source: "/wp-includes/:path*", destination: `${wordpress}/wp-includes/:path*` },
          ]
        : [],
      fallback: [],
    };
  },
};

export default nextConfig;
