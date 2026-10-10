/** Path redirects shared by the Vercel app and the Cloudflare Pages `_redirects` file. */
export const APEX_HOST = "thezero.com.br";

export const PATH_REDIRECTS = [
  { source: "/hardware", destination: "/computadores" },
  { source: "/gadgets", destination: "/dispositivos" },
  { source: "/apps", destination: "/aplicativos" },
  { source: "/games", destination: "/jogos" },
  { source: "/consoles", destination: "/jogos/consoles" },
  {
    source: "/noticia/lancamento-e-trailer-jogo-e-o-patch",
    destination: "/jogos",
  },
  {
    source: "/noticia/apple-restringe-full-disk-access-macos",
    destination: "/noticia/apple-limita-full-disk-access-macos",
  },
  {
    source: "/noticia/ea-sports-fc-27-hoje",
    destination: "/noticia/ea-sports-fc-27-vale-a-pena",
  },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/feed", destination: "/rss.xml" },
  { source: "/rss", destination: "/rss.xml" },
  { source: "/feed.xml", destination: "/rss.xml" },
  { source: "/atom.xml", destination: "/rss.xml" },
] as const;
