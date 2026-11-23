/** Path redirects shared by the Next server build and the Cloudflare Pages `_redirects` file. */
export const APEX_HOST = "thezero.com.br";

/** `status` defaults to 308; set 301 where a classic permanent redirect is wanted. */
export const PATH_REDIRECTS: { source: string; destination: string; status?: 301 | 308 }[] = [
  { source: "/black-friday-2026", destination: "/black-friday", status: 301 },
  { source: "/noticia/iphone-18-pro-brasil-hoje-preco", destination: "/noticia/iphone-18-pro-vale-a-pena-brasil", status: 301 },
  { source: "/noticia/iphone-18-pro-abertura-variavel-nao-e-megapixel", destination: "/noticia/iphone-18-pro-vale-a-pena-brasil", status: 301 },
  { source: "/noticia/meta-muse-mac-agente-no-computador", destination: "/noticia/meta-anuncia-modelos-muse-wonder-full", status: 301 },
  // Truncated off-site slugs. Only prefixes that match a single live post.
  // `call-of-duty-modern-warfare` also prefixes the noindex announcement;
  // the indexable canonical is the early-access story.
  {
    source: "/noticia/node-js-corrige-falha-brotli-exe",
    destination: "/noticia/node-js-corrige-falha-brotli-execucao-remota",
    status: 301,
  },
  {
    source: "/noticia/block-dessa-modelo-voz",
    destination: "/noticia/block-dessa-modelo-voz-local-treinado-so-fala",
    status: 301,
  },
  {
    source: "/noticia/claude-duet-",
    destination: "/noticia/claude-duet-agente-anthropic",
    status: 301,
  },
  {
    source: "/noticia/openai-decisions-",
    destination: "/noticia/openai-decisions-api-gpt-6-luna-decisoes-rapidas",
    status: 301,
  },
  {
    source: "/noticia/sidetrack-tiny-trains-desk",
    destination: "/noticia/sidetrack-tiny-trains-desktop-steam",
    status: 301,
  },
  {
    source: "/noticia/geely-g",
    destination: "/noticia/geely-google-gemini-maps-play-painel-2027",
    status: 301,
  },
  {
    source: "/noticia/call-of-duty-modern-warfare",
    destination: "/noticia/call-of-duty-modern-warfare-4-acesso-antecipado",
    status: 301,
  },
  {
    source: "/noticia/honor",
    destination: "/noticia/honor-win2-ventoinhas-bateria-10100-mah",
    status: 301,
  },
  { source: "/autor/nicholas-nishimura", destination: "/autores/nicholas", status: 301 },
  { source: "/autor/nicholas", destination: "/autores/nicholas", status: 301 },
  { source: "/autor", destination: "/autores", status: 301 },
  { source: "/autores/mavi", destination: "/autores", status: 301 },
  { source: "/noticia/freakopoly-lancamento-steam-preco-brasil", destination: "/", status: 301 },
  { source: "/noticia", destination: "/", status: 301 },
  { source: "/thezero", destination: "/", status: 301 },
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

  // Hubs da taxonomia antiga (relatório de indexação do Search Console,
  // nov/2026). Não são mais gerados; o 301 limpa o resíduo no índice e
  // manda quem chega neles para o hub atual equivalente.
  { source: "/aplicativos/ferramentas-de-produtividade", destination: "/aplicativos/produtividade", status: 301 },
  { source: "/aplicativos/midias-sociais", destination: "/aplicativos/comunicacao", status: 301 },
  { source: "/aplicativos/entretenimento-e-streaming", destination: "/aplicativos/servicos-digitais", status: 301 },
  { source: "/aplicativos/edicao-e-criacao", destination: "/aplicativos/criacao", status: 301 },
  { source: "/aplicativos/utilitarios-e-sistema", destination: "/aplicativos/sistemas-operacionais", status: 301 },
  { source: "/aplicativos/seguranca-e-privacidade", destination: "/aplicativos/seguranca-digital", status: 301 },
  { source: "/aplicativos/educacao-e-aprendizado", destination: "/aplicativos/produtividade", status: 301 },
  { source: "/aplicativos/saude-e-bem-estar", destination: "/aplicativos/servicos-digitais", status: 301 },
  { source: "/aplicativos/financas-e-negocios", destination: "/aplicativos/servicos-digitais", status: 301 },
  { source: "/aplicativos/inteligencia-artificial", destination: "/ia/ferramentas", status: 301 },
  { source: "/aplicativos/nao-categorizado", destination: "/aplicativos", status: 301 },
  { source: "/aplicativos/testes", destination: "/reviews", status: 301 },
  { source: "/jogos/acao-e-aventura", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/rpg-e-mmorpg", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/estrategia-e-simulacao", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/esportes-e-corrida", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/puzzle-e-casual", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/multiplayer-e-coop", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/retro-e-classicos", destination: "/jogos/lancamentos", status: 301 },
  { source: "/jogos/indie", destination: "/jogos/lancamentos", status: 301 },
  { source: "/tecnologia/gadgets-e-dispositivos", destination: "/dispositivos", status: 301 },
  { source: "/tecnologia/software-e-sistemas", destination: "/aplicativos/sistemas-operacionais", status: 301 },
  { source: "/tecnologia/internet-e-conectividade", destination: "/tecnologia/infraestrutura", status: 301 },
  { source: "/tecnologia/ciencia-e-inovacao", destination: "/tecnologia/ciencia-aplicada", status: 301 },
] as const;
