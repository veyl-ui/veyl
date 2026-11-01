/**
 * Where the registry is served from. Set NEXT_PUBLIC_SITE_URL in your hosting
 * settings once the site has a real address (for example https://veyl.style).
 * Until then the commands on the docs pages point at your local server.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** The address people pass to `shadcn add` for one component. */
export const registryUrl = (slug: string) => `${siteUrl}/r/${slug}.json`;
