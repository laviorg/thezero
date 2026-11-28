/**
 * Páginas fixas de datas de compra (Black Friday, Prime Day, 11.11).
 * Nenhum preço aqui: preço só aparece no rastreador, com data e hora da checagem.
 * Produtos: só ids do catálogo KaBuM verificado (src/data/kabum-catalog.json)
 * e ASINs abertos na amazon.com.br antes de entrar.
 */

export type DealCategory = "gpu" | "ssd" | "console" | "notebook";

export type GuideLink = { href: string; label: string };

export type CategoryBlock = {
  category: DealCategory;
  heading: string;
  intro: string;
  criteria: string[];
  watch: string[];
  picks: { id: string; why: string }[];
  guides: GuideLink[];
};

export type AmazonPick = { asin: string; name: string; why: string; seller: string };

export type DealEvent = {
  slug: string;
  path: string;
  title: string;
  documentTitle: string;
  kicker: string;
  lede: string;
  description: string;
  cover: string;
  coverAlt: string;
  updatedIso: string;
  updatedLabel: string;
  dateHeading: string;
  dateText: string[];
  howTo: string[];
  categories: CategoryBlock[];
  amazonPicks?: AmazonPick[];
  faq: { q: string; a: string }[];
};

const G = {
  rtx4060vs5060: { href: "/noticia/rtx-4060-vs-5060-brasil", label: "RTX 4060 vs 5060 no Brasil" },
  rx7600vs4060: { href: "/noticia/rx-7600-vs-rtx-4060-brasil", label: "RX 7600 vs RTX 4060" },
  gpuUsada: { href: "/noticia/placa-de-video-usada-brasil-checklist", label: "Checklist de placa de vídeo usada" },
  rtx4070s: { href: "/noticia/rtx-4070-super-usada-vs-5070-nova", label: "RTX 4070 Super usada vs 5070 nova" },
  fonte: { href: "/noticia/fonte-650w-80-plus-o-que-nao-economizar", label: "Fonte 650 W: onde não economizar" },
  ssd1tb: { href: "/noticia/ssd-nvme-1tb-brasil-o-que-olhar", label: "SSD NVMe de 1 TB: o que olhar" },
  pcie: { href: "/noticia/pcie-4-vs-5-ssd-vale-a-diferenca", label: "PCIe 4.0 vs 5.0 em SSD" },
  ssdPs5: { href: "/noticia/ssd-no-ps5-upgrade", label: "Como pôr SSD no PS5" },
  hdVsSsd: { href: "/noticia/hd-externo-vs-ssd-portatil", label: "HD externo vs SSD portátil" },
  ps5Slim: { href: "/noticia/ps5-slim-vale-a-pena-2026-brasil", label: "PS5 Slim vale a pena em 2026?" },
  ps5VsX: { href: "/noticia/ps5-vs-series-x-exclusivo-game-pass-preco", label: "PS5 vs Series X" },
  switch2Deck: { href: "/noticia/switch-2-vs-steam-deck-oled-preco-brasil", label: "Switch 2 vs Steam Deck OLED" },
  portatil: { href: "/noticia/qual-console-portatil-comprar-2026-brasil", label: "Qual console portátil comprar" },
  deck: { href: "/noticia/steam-deck-oled-ainda-vale-a-pena-2026", label: "Steam Deck OLED no Brasil" },
  noteGamer: { href: "/noticia/notebook-gamer-ate-7-mil-brasil", label: "Notebook gamer até R$ 7 mil" },
  rtx3050vs4050: { href: "/noticia/rtx-3050-vs-4050-notebook", label: "RTX 3050 vs 4050 em notebook" },
  ramSoldada: { href: "/noticia/ram-soldada-notebook-arrependimento", label: "RAM soldada no notebook" },
  macVsWin: { href: "/noticia/macbook-air-m3-vs-notebook-windows-8-mil", label: "MacBook Air vs Windows até R$ 8 mil" },
  pc4mil: { href: "/noticia/pc-gamer-ate-4-mil-2026", label: "PC gamer até R$ 4 mil" },
  antesBfGpu: {
    href: "/noticia/antes-de-comprar-placa-de-video-black-friday-2026",
    label: "Antes de comprar placa de vídeo na Black Friday 2026",
  },
  antesBfSsd: {
    href: "/noticia/antes-de-comprar-ssd-black-friday-2026",
    label: "Antes de comprar SSD na Black Friday 2026",
  },
  antesBfNote: {
    href: "/noticia/antes-de-comprar-notebook-black-friday-2026",
    label: "Antes de comprar notebook na Black Friday 2026",
  },
  antesBfConsole: {
    href: "/noticia/antes-de-comprar-console-black-friday-2026",
    label: "Antes de comprar console na Black Friday 2026",
  },
} satisfies Record<string, GuideLink>;

const BF_CATEGORIES: CategoryBlock[] = [
  {
    category: "gpu",
    heading: "Placa de vídeo: compre pela resolução, não pelo nome",
    intro:
      "Placa de vídeo é o item em que o desconto de Black Friday mais engana, porque o preço de referência muda toda semana com o dólar e com o estoque de memória. Defina antes a resolução do seu monitor; é ela que diz o tamanho da placa.",
    criteria: [
      "1080p: RX 7600 ou RTX 5060 resolvem. Acima disso você paga por desempenho que o monitor não mostra.",
      "1440p ou jogos recentes com textura alta: priorize 12 a 16 GB de VRAM (RTX 5060 Ti 16 GB, RX 9060 XT 16 GB, RTX 5070).",
      "Confira a fonte antes: placa nova com fonte genérica é o upgrade que mais volta pra assistência.",
      "Modelo com 8 GB e 16 GB do mesmo chip têm nomes quase iguais. Leia a memória no título do anúncio.",
    ],
    watch: [
      "Compare o preço de hoje com o de outubro na tabela desta página. O preço riscado da loja não é referência.",
      "Kit placa + fonte só compensa se a fonte do kit for de marca e potência que você usaria de qualquer jeito.",
      "Marketplace dentro da loja tem outra garantia e outro prazo. Veja quem vende e quem entrega.",
    ],
    picks: [
      { id: "rx-7600", why: "Entrada honesta pra 1080p sem gastar com recurso que você não vai usar." },
      { id: "rtx-5060", why: "Entrada da NVIDIA com DLSS 4; boa se você joga títulos que suportam geração de quadros." },
      { id: "rtx-5060-ti-16", why: "16 GB de VRAM no meio da tabela; folga pra texturas altas por mais tempo." },
      { id: "rx-9060-xt-16", why: "Alternativa AMD com 16 GB pra quem quer 1440p sem ir pra faixa de cima." },
      { id: "rtx-5070", why: "Degrau de 1440p alto; compare com a 5060 Ti 16 GB antes de pagar a diferença." },
      { id: "rx-9070-xt", why: "Faixa de 1440p alto e 4K com upscaling, pra quem já tem fonte e gabinete à altura." },
    ],
    guides: [G.antesBfGpu, G.rtx4060vs5060, G.rx7600vs4060, G.rtx4070s, G.gpuUsada, G.fonte],
  },
  {
    category: "ssd",
    heading: "SSD: o upgrade que mais rende por real gasto",
    intro:
      "SSD é o item com desconto mais previsível e o que mais muda a sensação de uso num PC ou notebook antigo. O erro comum é pagar por velocidade de pico que o seu computador nem aceita.",
    criteria: [
      "PC ou notebook sem slot M.2: SSD SATA de 2,5\" já tira o HD do caminho e resolve.",
      "Placa com M.2 PCIe 3.0 ou 4.0: um NVMe PCIe 4.0 de 1 TB é o ponto de equilíbrio pra sistema e jogos.",
      "PS5: precisa de NVMe PCIe 4.0 M.2 2280, idealmente com dissipador. Veja o passo a passo antes de comprar.",
      "Capacidade antes de velocidade: 1 TB enche rápido com jogos atuais.",
    ],
    watch: [
      "Compare o preço por TB, não o preço da unidade.",
      "Desconfie de marca desconhecida com velocidade anunciada de topo e preço de entrada.",
      "Leia a sigla do modelo: versões com o mesmo nome comercial podem ter cache e memória diferentes.",
    ],
    picks: [
      { id: "a400-480", why: "Ressuscita PC ou notebook com HD, sem exigir slot M.2." },
      { id: "nv3-1tb", why: "NVMe PCIe 4.0 de 1 TB pra sistema e biblioteca média de jogos." },
      { id: "990pro-1tb", why: "Topo de linha PCIe 4.0; faz sentido em PS5 ou pra quem move arquivos grandes." },
      { id: "990pro-2tb", why: "Mesma linha em 2 TB, pra biblioteca grande de jogos." },
    ],
    guides: [G.antesBfSsd, G.ssd1tb, G.pcie, G.ssdPs5, G.hdVsSsd],
  },
  {
    category: "console",
    heading: "Console: escolha a biblioteca, depois o modelo",
    intro:
      "Console raramente cai muito no Brasil; o ganho costuma vir de pacote com jogo ou de parcelamento maior. Decida primeiro onde estão os jogos que você quer jogar.",
    criteria: [
      "PS5 Digital vs com leitor: o com leitor permite comprar e revender mídia física, que costuma ficar mais barata com o tempo.",
      "PS5 Pro só faz diferença com TV 4K e jogos com modo Pro.",
      "Switch 2 é a escolha pra exclusivos Nintendo e pra jogar na TV e fora dela.",
      "Steam Deck OLED faz sentido se você já tem biblioteca na Steam.",
    ],
    watch: [
      "Veja se o pacote traz jogo em mídia física ou código digital, e se o jogo te interessa.",
      "Confirme modelo nacional (tomada e garantia no Brasil).",
      "Conte o preço da assinatura online do ano no custo total.",
    ],
    picks: [
      { id: "ps5-digital", why: "Entrada no PS5 pra quem compra tudo digital." },
      { id: "ps5-disco", why: "Leitor de discos e 1 TB; mídia física abre o mercado de usados." },
      { id: "ps5-pro", why: "Pra TV 4K e jogos com modo Pro." },
      { id: "switch-2", why: "Exclusivos Nintendo, híbrido TV e portátil." },
      { id: "xbox-series-x", why: "Pra quem vive de Game Pass na TV." },
      { id: "steam-deck-oled", why: "PC portátil pra quem já tem biblioteca na Steam." },
    ],
    guides: [G.antesBfConsole, G.ps5Slim, G.ps5VsX, G.switch2Deck, G.portatil, G.deck],
  },
  {
    category: "notebook",
    heading: "Notebook: olhe RAM, tela e TGP antes do processador",
    intro:
      "Notebook é onde a ficha técnica mais esconde o que importa. Dois modelos com a mesma placa de vídeo podem render bem diferente por causa do limite de energia (TGP) e da memória.",
    criteria: [
      "8 GB de RAM é pouco pra jogo em 2026. Confira se dá pra expandir ou se a memória é soldada.",
      "Na mesma GPU, o TGP (potência liberada pro chip gráfico) muda o desempenho. Procure o número na ficha do fabricante.",
      "Tela de 144 Hz ou mais só faz diferença se a GPU entregar os quadros.",
      "Notebook com Linux ou sem sistema sai mais barato; some o Windows se for precisar dele.",
    ],
    watch: [
      "Compare o código exato do modelo (ex.: ANV15-41-R6J0). A mesma linha tem versões com RAM e GPU diferentes.",
      "Veja se o upgrade de RAM e SSD é permitido sem perder garantia.",
      "Notebook gamer pesa e esquenta. Se a ideia é levar todo dia, considere isso antes do preço.",
    ],
    picks: [
      { id: "nitro-v15-4050", why: "Entrada com RTX 4050 e tela de 165 Hz; vem com 8 GB, planeje expandir." },
      { id: "nitro-v15-4060", why: "Degrau com RTX 4060 e 16 GB de RAM." },
      { id: "tuf-f16", why: "Tela de 16 polegadas e RTX 4050; confira a RAM antes de fechar." },
    ],
    guides: [G.antesBfNote, G.noteGamer, G.rtx3050vs4050, G.ramSoldada, G.macVsWin],
  },
];

function shortBlocks(
  overrides: Record<DealCategory, { heading: string; intro: string; watch: string[] }>,
): CategoryBlock[] {
  return BF_CATEGORIES.map((block) => ({
    ...block,
    heading: overrides[block.category].heading,
    intro: overrides[block.category].intro,
    watch: overrides[block.category].watch,
    criteria: block.criteria.slice(0, 2),
    picks: block.picks.slice(0, 4),
  }));
}

export const dealEvents: DealEvent[] = [
  {
    slug: "black-friday",
    path: "/black-friday",
    title: "Black Friday 2026: preços checados hoje e o que vale comprar em tech",
    documentTitle: "Black Friday 2026: preços checados e o que vale comprar em tech",
    kicker: "Black Friday 2026",
    lede:
      "Preço à vista lido hoje nas lojas, comparado com o mesmo anúncio em outubro. O que caiu de verdade, o que subiu, como pegar desconto falso e o critério pra escolher placa de vídeo, SSD, console e notebook.",
    description:
      "Black Friday 2026 no Brasil: preços de placa de vídeo, SSD, console e notebook checados na loja em 27/11, comparados com outubro, checklist de desconto falso e regras de importação.",
    cover: "/images/pages/black-friday-2026.jpg",
    coverAlt:
      "Nintendo Switch 2 em modo portátil, tela apagada, em fotografia recortada sobre fundo claro",
    updatedIso: "2026-11-27T17:04:00-03:00",
    updatedLabel: "27 de novembro de 2026, às 17h04 (Brasília); revisão do Switch 2",
    dateHeading: "Quando é a Black Friday 2026",
    dateText: [
      "A Black Friday 2026 é nesta sexta-feira, 27 de novembro, um dia depois do Dia de Ação de Graças dos EUA. Muitas lojas estendem as ofertas pelo fim de semana até a Cyber Monday, segunda-feira, 30 de novembro. O calendário de cada loja é dela: confira no site da loja.",
    ],
    howTo: [
      "Compare o preço de hoje com o histórico do mesmo anúncio, não com o preço riscado. A tabela desta página traz o valor de outubro ou de meados de novembro ao lado do de hoje.",
      "Abra pelo menos duas lojas e reconfirme modelo, vendedor e pagamento. O Switch 2 foi rechecado às 17h04 por R$ 4.199 no Pix na KaBuM; a comparação com a Amazon foi retirada por falta de reconfirmação.",
      "Veja quem vende e quem entrega: vendedor parceiro dentro da loja tem outra garantia, outro prazo e outra política de troca.",
      "Compare o preço à vista no Pix com o total parcelado. Juros escondidos no parcelamento comem o desconto.",
      "Desconfie de link recebido por WhatsApp, SMS ou e-mail. Digite o endereço da loja e pague só pelo checkout oficial. O Procon-SP mantém a lista Evite esses Sites.",
      "Guarde print do anúncio, do carrinho e do comprovante. Compra online pode ser desfeita em 7 dias a partir do recebimento (artigo 49 do Código de Defesa do Consumidor).",
    ],
    categories: BF_CATEGORIES,
    faq: [
      {
        q: "Quando é a Black Friday 2026?",
        a: "Na sexta-feira, 27 de novembro de 2026. Muitas lojas estendem as ofertas até a Cyber Monday, segunda-feira, 30 de novembro.",
      },
      {
        q: "Como saber se o desconto da Black Friday é real?",
        a: "Compare com o preço do mesmo anúncio semanas antes, não com o preço riscado da página. Na checagem de 27/11/2026, uma placa de vídeo exibia \"de R$ 3.411,75\" e 15% de desconto, mas custava R$ 1.999,99 em 16 de outubro e R$ 2.199,99 nesta sexta.",
      },
      {
        q: "O que ficou mais barato e o que ficou mais caro nesta Black Friday?",
        a: "Na KaBuM, comparando 16/10 com 27/11/2026, os SSDs Kingston caíram de 5% a 13% e a RTX 5060 da MSI caiu 10%. Na rechecagem das 17h04, o Switch 2 estava por R$ 4.199, cerca de 2% abaixo dos R$ 4.299 do arquivo de outubro. Os registros iniciais do PS5 Pro e da RTX 5070 Ti indicam altas de 10% e 36%, sem nova checagem nesta revisão.",
      },
      {
        q: "Vale comprar placa de vídeo na Black Friday 2026?",
        a: "Só se o modelo certo estiver abaixo do preço que você acompanhou. Na checagem de 27/11, a RTX 5060 estava mais barata que em outubro, mas placas de faixa alta estavam mais caras ou esgotadas. O dólar subiu 9,1% no período, segundo a PTAX do Banco Central.",
      },
      {
        q: "Comprar importado na Black Friday compensa?",
        a: "Depende do valor. Desde 12/05/2026, compra de pessoa física em site do Remessa Conforme até US$ 50 tem imposto de importação zero; acima disso, 60% com desconto de US$ 30. O ICMS de 17% a 20% vale nas duas faixas, segundo a Receita Federal. Faça a conta na calculadora antes de comparar com o preço nacional.",
      },
      {
        q: "Comprar em marketplace dentro da loja é seguro?",
        a: "Pode ser, mas a garantia, o prazo e a troca são do vendedor parceiro. Veja quem vende e quem entrega antes de pagar.",
      },
      {
        q: "Posso devolver uma compra feita na Black Friday?",
        a: "Sim. Compra feita fora da loja física, como pela internet, pode ser desfeita em até 7 dias a partir do recebimento, pelo artigo 49 do Código de Defesa do Consumidor, com devolução do valor pago.",
      },
    ],
  },
  {
    slug: "prime-day",
    path: "/prime-day",
    title: "Prime Day: o que vale comprar na Amazon em hardware e games",
    documentTitle: "Prime Day no Brasil: o que vale comprar em hardware e games",
    kicker: "Guia de compra",
    lede:
      "O Prime Day é exclusivo pra assinantes Prime e acontece só na Amazon. Como se preparar, o que olhar em placa de vídeo, SSD, console e notebook, e quais ofertas desconfiar.",
    description:
      "Guia do Prime Day no Brasil: como funciona, quem pode comprar, como checar se a oferta é boa e o que olhar em placa de vídeo, SSD, console e notebook.",
    cover: "/images/pages/prime-day.png",
    coverAlt: "Arte com o texto Prime Day e a marca The Zero sobre fundo escuro",
    updatedIso: "2026-10-14T20:00:00-03:00",
    updatedLabel: "14 de outubro de 2026",
    dateHeading: "Quando é o próximo Prime Day",
    dateText: [
      "A Amazon anuncia as datas do Prime Day perto do evento, e elas mudam de ano pra ano. Próxima edição no Brasil: data a confirmar pela Amazon.",
      "As ofertas do Prime Day são pra assinantes Amazon Prime. Se você não assina, confira se há período de teste disponível na sua conta antes do evento.",
    ],
    howTo: [
      "Monte a lista com antecedência e salve o link de cada produto. Oferta relâmpago dura pouco e esgota.",
      "Veja quem vende: na mesma página pode haver oferta da Amazon e de vendedores parceiros, com garantia e prazo diferentes.",
      "Produto importado pode aparecer com imposto e prazo maior. O total aparece no checkout.",
      "Compare com outras lojas no mesmo dia. Prime Day puxa concorrência, e nem sempre a Amazon é a mais barata.",
      "Compra online tem 7 dias de arrependimento pelo Código de Defesa do Consumidor (artigo 49).",
    ],
    categories: shortBlocks({
      gpu: {
        heading: "Placa de vídeo no Prime Day",
        intro:
          "Na Amazon, a mesma placa costuma ter vários vendedores. O preço mais baixo da página às vezes é de um parceiro com prazo longo. Os critérios completos estão no guia da Black Friday.",
        watch: [
          "Confira o vendedor e se a entrega é feita pela Amazon.",
          "Placa importada via Amazon Global tem imposto calculado no checkout.",
        ],
      },
      ssd: {
        heading: "SSD no Prime Day",
        intro:
          "SSD é a categoria que mais aparece em oferta relâmpago. Tenha o modelo e a capacidade definidos antes pra não cair em versão diferente com nome parecido.",
        watch: [
          "Compare o preço por TB.",
          "Confirme o formato (M.2 2280 ou 2,5\") e a interface (NVMe ou SATA).",
        ],
      },
      console: {
        heading: "Console no Prime Day",
        intro:
          "Console oficial vendido e entregue pela Amazon tende a ter menos dor de cabeça com garantia. Confira se o modelo é nacional.",
        watch: [
          "Modelo nacional vs importado: tomada, garantia e manual mudam.",
          "Pacote com jogo só vale se o jogo te interessa.",
        ],
      },
      notebook: {
        heading: "Notebook no Prime Day",
        intro:
          "Notebook em oferta na Amazon costuma ser de vendedor parceiro. Leia a ficha completa e o código do modelo.",
        watch: [
          "RAM soldada ou expansível? Isso decide a vida útil.",
          "Confira o sistema que vem instalado.",
        ],
      },
    }),
    amazonPicks: [
      {
        asin: "B0F6D7MQQB",
        name: "Console Nintendo Switch 2 (modelo nacional)",
        why: "Modelo nacional de tomada; confira o vendedor na página.",
        seller: "vendedor varia; confira na página",
      },
      {
        asin: "B0C626FFG2",
        name: "Placa de Vídeo ASRock Radeon RX 7600 Challenger OC 8 GB",
        why: "Entrada pra 1080p; na checagem, vendida pela KaBuM! e entregue pela Amazon.",
        seller: "KaBuM! (na checagem de 14/10/2026)",
      },
    ],
    faq: [
      {
        q: "Precisa ser Prime pra comprar no Prime Day?",
        a: "Sim. As ofertas do Prime Day são pra membros Amazon Prime. Confira na sua conta se há teste grátis disponível.",
      },
      {
        q: "Quando é o próximo Prime Day no Brasil?",
        a: "A Amazon ainda não confirmou a data da próxima edição. Esta página é atualizada quando a data for anunciada.",
      },
    ],
  },
  {
    slug: "11-11",
    path: "/11-11",
    title: "11.11: o que vale comprar no Dia dos Solteiros em hardware e games",
    documentTitle: "11.11 no Brasil: o que vale comprar em hardware e games",
    kicker: "Guia de compra",
    lede:
      "O 11 de novembro virou data de oferta no Brasil por causa dos marketplaces asiáticos. O que olhar em placa de vídeo, SSD, console e notebook, e quando é melhor esperar a Black Friday.",
    description:
      "Guia do 11.11 no Brasil: como funciona a data, importação e imposto, e o que olhar em placa de vídeo, SSD, console e notebook antes da Black Friday.",
    cover: "/images/pages/11-11.png",
    coverAlt: "Arte com o texto 11.11 e a marca The Zero sobre fundo escuro",
    updatedIso: "2026-10-14T20:00:00-03:00",
    updatedLabel: "14 de outubro de 2026",
    dateHeading: "Quando é o 11.11",
    dateText: [
      "O 11.11 é sempre em 11 de novembro. Em 2026 cai numa quarta-feira, 16 dias antes da Black Friday (27 de novembro).",
      "Nasceu na China como Dia dos Solteiros e chegou ao Brasil pelos marketplaces asiáticos. Hoje várias lojas brasileiras também fazem ofertas na data. Cada loja define o próprio período.",
    ],
    howTo: [
      "Produto importado tem imposto de importação e ICMS. Veja o total no checkout, não só o preço do anúncio.",
      "Importado demora e a garantia costuma ser do vendedor. Pra placa de vídeo e notebook, isso pesa.",
      "Use o 11.11 como termômetro: o preço que aparece agora vira sua referência pra Black Friday duas semanas depois.",
      "Compra online tem 7 dias de arrependimento pelo Código de Defesa do Consumidor (artigo 49).",
    ],
    categories: shortBlocks({
      gpu: {
        heading: "Placa de vídeo no 11.11",
        intro:
          "Placa de vídeo importada pode sair mais barata no anúncio e mais cara no total. Compare com a loja nacional somando imposto e frete. Critérios completos no guia da Black Friday.",
        watch: [
          "Garantia nacional de placa importada costuma não existir.",
          "Use o preço do 11.11 como referência pra Black Friday.",
        ],
      },
      ssd: {
        heading: "SSD no 11.11",
        intro:
          "SSD é a categoria com mais falsificação em marketplace. Compre de loja oficial da marca ou de varejista conhecido.",
        watch: [
          "Teste a capacidade real assim que chegar (ferramentas como H2testw ou f3).",
          "Desconfie de 2 TB por preço de 500 GB.",
        ],
      },
      console: {
        heading: "Console no 11.11",
        intro:
          "Console importado pode vir com tomada e garantia de fora. No Brasil, prefira modelo nacional de loja conhecida.",
        watch: [
          "Confirme o modelo e a região.",
          "Compare com o preço da Black Friday duas semanas depois.",
        ],
      },
      notebook: {
        heading: "Notebook no 11.11",
        intro:
          "Notebook importado pode vir com teclado sem ç e garantia só no exterior. Avalie se a economia compensa.",
        watch: [
          "Layout do teclado (ABNT2 ou internacional).",
          "Fonte e tomada compatíveis.",
        ],
      },
    }),
    faq: [
      {
        q: "O 11.11 é melhor que a Black Friday?",
        a: "Depende da loja e do produto. Use o preço do 11.11 como referência: se o mesmo item cair mais na Black Friday, você vai saber.",
      },
      {
        q: "Produto importado no 11.11 paga imposto?",
        a: "Sim. Há imposto de importação e ICMS, e o total aparece no checkout. Compare o valor final, não o do anúncio.",
      },
    ],
  },
];

export function dealEvent(slug: string) {
  const event = dealEvents.find((entry) => entry.slug === slug);
  if (!event) throw new Error(`Evento desconhecido: ${slug}`);
  return event;
}
