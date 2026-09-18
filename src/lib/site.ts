const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thezero.com.br"
).replace(/\/$/, "");

export const site = {
  name: "The Zero",
  domain: "thezero.com.br",
  url: siteUrl,
  locale: "pt_BR",
  language: "pt-BR",
  tagline: "tech sem hype",
  description:
    "The Zero é o newsroom de tech do Brasil que mostra o que funciona de verdade — IA, software, hardware, consoles, gadgets e games. Opinião sem filtro, zero hype de lançamento.",
  bio: "tech sem hype · demos, opinião, setup. O que funciona de verdade — e o que não.",
  email: "redacao@thezero.com.br",
  social: {
    instagram: "https://www.instagram.com/hello.the.zero/",
    instagramHandle: "@hello.the.zero",
    youtube: "https://www.youtube.com/@TheZero_Media",
    youtubeHandle: "@TheZero_Media",
  },
  storeUrl: "https://loja.thezero.com.br",
  defaultAuthor: "The Zero",
} as const;

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return site.url;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
