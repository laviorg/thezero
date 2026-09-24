/**
 * Public host. Vercel already 308s the apex to www; canonicals, sitemaps and
 * JSON-LD have to use the URL that returns 200 or Google treats the homepage
 * as an alternate and refuses the news sitemap when it only redirects.
 */
export const CANONICAL_ORIGIN = "https://www.thezero.com.br";

export function resolveSiteUrl(raw?: string | null): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) return CANONICAL_ORIGIN;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return CANONICAL_ORIGIN;
  }
  const host = parsed.hostname.toLowerCase();
  if (host === "thezero.com.br" || host === "www.thezero.com.br") {
    return CANONICAL_ORIGIN;
  }
  return parsed.origin;
}

export const site = {
  name: "The Zero",
  domain: "thezero.com.br",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "pt_BR",
  language: "pt-BR",
  description:
    "The Zero é o newsroom de tech do Brasil que mostra o que funciona de verdade — tecnologia, IA, computadores, dispositivos, aplicativos e jogos. Opinião sem filtro, zero hype de lançamento.",
  bio: "Demos, opinião, setup. O que funciona de verdade — e o que não.",
  email: "redacao@thezero.com.br",
  social: {
    instagram: "https://www.instagram.com/hello.the.zero/",
    instagramHandle: "@hello.the.zero",
    youtube: "https://www.youtube.com/@TheZero_Media",
    youtubeHandle: "@TheZero_Media",
    /**
     * Live Threads profile, when the newsroom has one.
     * Leave empty — do not invent a handle. `sameAs` ignores this until it
     * is an https URL.
     */
    threads: "",
  },
  storeUrl: "https://loja.thezero.com.br",
  defaultAuthor: "The Zero",
} as const;

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

// deploy-trigger: slogan removed
