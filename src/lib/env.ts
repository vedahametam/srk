/**
 * Settings from environment variables. A variable that is set but empty (as
 * hosting dashboards easily leave them) counts as not set, so defaults apply.
 */
const read = (value: string | undefined) => value?.trim() || undefined;

const DEFAULT_LINK_ORIGINS = "https://sriramakrishna.in,https://www.sriramakrishna.in";

/** WordPress origin without trailing slash; empty string means sample-content mode. */
export const WORDPRESS_URL = read(process.env.WORDPRESS_URL)?.replace(/\/$/, "") ?? "";

/** Origins whose absolute links in WordPress content belong to this site. */
export const LINK_ORIGINS = (read(process.env.WORDPRESS_LINK_ORIGINS) ?? DEFAULT_LINK_ORIGINS)
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

/**
 * Seconds before cached WordPress responses refresh (default: a day). Publishing in
 * WordPress refreshes sooner through /api/revalidate. Must be positive: 0 disables caching.
 */
export const REVALIDATE_SECONDS = (() => {
  const n = Number(read(process.env.WORDPRESS_REVALIDATE_SECONDS));
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 86400;
})();
