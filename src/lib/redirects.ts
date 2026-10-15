/** Path redirects shared by the Vercel app and the Cloudflare Pages `_redirects` file. */
export const APEX_HOST = "thezero.com.br";

/** `status` defaults to 308; set 301 where a classic permanent redirect is wanted. */
export const PATH_REDIRECTS: { source: string; destination: string; status?: 301 | 308 }[] = [
  { source: "/black-friday-2026", destination: "/black-friday", status: 301 },
  { source: "/autores/mavi", destination: "/autores", status: 301 },
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
  {
    source: "/noticia/setup-produtividade-overrated",
    destination: "/noticia/teclado-mecanico-ate-400-abnt",
  },
  {
    source: "/noticia/teclado-caro-atalhos-baratos",
    destination: "/noticia/teclado-mecanico-ate-400-abnt",
  },
  {
    source: "/noticia/switch-2-hype-vs-frame-rate",
    destination: "/noticia/switch-2-vs-steam-deck-oled-preco-brasil",
  },
  {
    source: "/noticia/cursor-nao-e-ia-que-escreve-codigo",
    destination: "/noticia/contexto-maior-que-prompt",
  },
  {
    source: "/noticia/pc-portatil-vs-android-odin-ayaneo",
    destination: "/noticia/qual-console-portatil-comprar-2026-brasil",
  },
  {
    source: "/noticia/ayn-odin-2-android-vs-pc-portatil",
    destination: "/noticia/qual-console-portatil-comprar-2026-brasil",
  },
  {
    source: "/noticia/rog-xbox-ally-o-que-muda",
    destination: "/noticia/rog-xbox-ally-vale-a-pena-brasil",
  },
  {
    source: "/noticia/rog-xbox-ally-x-potencia-preco",
    destination: "/noticia/rog-xbox-ally-vale-a-pena-brasil",
  },
  {
    source: "/noticia/rog-ally-z1-extreme-2026-brasil",
    destination: "/noticia/rog-xbox-ally-vale-a-pena-brasil",
  },
  {
    source: "/noticia/rog-ally-x-brasil-preco-desempenho",
    destination: "/noticia/rog-xbox-ally-vale-a-pena-brasil",
  },
  {
    source: "/noticia/ayaneo-2s-vs-rog-ally",
    destination: "/noticia/rog-xbox-ally-vale-a-pena-brasil",
  },
  {
    source: "/noticia/steam-deck-oled-brasil-preco-doi",
    destination: "/noticia/steam-deck-oled-ainda-vale-a-pena-2026",
  },
  {
    source: "/noticia/steam-deck-lcd-usado-ainda-vale",
    destination: "/noticia/steam-deck-oled-ainda-vale-a-pena-2026",
  },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/feed", destination: "/rss.xml" },
  { source: "/rss", destination: "/rss.xml" },
  { source: "/feed.xml", destination: "/rss.xml" },
  { source: "/atom.xml", destination: "/rss.xml" },
] as const;
