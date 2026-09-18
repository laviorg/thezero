export const site = {
  name: "The Zero",
  domain: "thezero.com.br",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thezero.com.br",
  locale: "pt_BR",
  language: "pt-BR",
  description:
    "The Zero é o newsroom de tech do Brasil que mostra o que funciona de verdade — IA, software, hardware, consoles, gadgets e games. Opinião sem filtro, zero hype de lançamento.",
  bio: "Demos, opinião, setup. O que funciona de verdade — e o que não.",
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
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
