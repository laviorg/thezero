export const CATEGORY_SLUGS = [
  "tecnologia",
  "ia",
  "computadores",
  "dispositivos",
  "aplicativos",
  "jogos",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const SUBCATEGORY_SLUGS = [
  "ciencia-aplicada",
  "tendencias",
  "negocios",
  "ferramentas",
  "agentes",
  "modelos",
  "infraestrutura",
  "seguranca",
  "negocios-e-politica",
  "notebooks-e-pcs",
  "componentes",
  "perifericos",
  "pcs-portateis",
  "espaco-de-trabalho",
  "celulares",
  "tablets",
  "vestiveis",
  "audio-pessoal",
  "casa-conectada",
  "tv-e-streaming",
  "cameras-e-drones",
  "produtividade",
  "desenvolvimento",
  "comunicacao",
  "criacao",
  "sistemas-operacionais",
  "servicos-digitais",
  "seguranca-digital",
  "lancamentos",
  "consoles",
  "industria",
  "lojas-e-assinaturas",
  "esports",
] as const;

export type SubcategorySlug = (typeof SUBCATEGORY_SLUGS)[number];

export type Subcategory = {
  slug: SubcategorySlug;
  parent: CategorySlug;
  label: string;
  href: string;
  description: string;
  /** Núcleo do `<title>` sem marca. Ver docs/SEO_TITLES.md. */
  seoTitle: string;
};

export type Category = {
  slug: CategorySlug;
  label: string;
  href: string;
  description: string;
  kicker: string;
  /** Núcleo do `<title>` sem marca. Ver docs/SEO_TITLES.md. */
  seoTitle: string;
  subcategories: readonly Subcategory[];
};

function subcategory(
  parent: CategorySlug,
  slug: SubcategorySlug,
  label: string,
  description: string,
  seoTitle: string,
): Subcategory {
  return {
    slug,
    parent,
    label,
    href: `/${parent}/${slug}`,
    description,
    seoTitle,
  };
}

export const categories: Record<CategorySlug, Category> = {
  tecnologia: {
    slug: "tecnologia",
    label: "Tecnologia",
    href: "/tecnologia",
    description:
      "Indústria, ciência aplicada, infraestrutura e tendências que atravessam o setor. Contexto, consequência e número — sem futurologia de palco.",
    kicker: "Além do produto",
    seoTitle: "Tecnologia: indústria e tendências",
    subcategories: [
      subcategory(
        "tecnologia",
        "industria",
        "Indústria",
        "Fabricação, cadeias produtivas, padrões e bastidores que movem o setor.",
        "Indústria de tecnologia",
      ),
      subcategory(
        "tecnologia",
        "ciencia-aplicada",
        "Ciência aplicada",
        "Pesquisa e protótipos quando saem do laboratório e encostam no uso real.",
        "Ciência aplicada em tech",
      ),
      subcategory(
        "tecnologia",
        "infraestrutura",
        "Infraestrutura",
        "Internet, redes, nuvem, data centers e energia fora de uma pauta específica de IA.",
        "Infraestrutura de internet e nuvem",
      ),
      subcategory(
        "tecnologia",
        "tendencias",
        "Tendências",
        "Mudanças transversais de uso e comportamento sustentadas por adoção ou dados.",
        "Tendências de tecnologia",
      ),
      subcategory(
        "tecnologia",
        "negocios",
        "Negócios",
        "Empresas, aquisições, regulação, trabalho e modelos de negócio em tecnologia.",
        "Negócios de tecnologia",
      ),
    ],
  },
  ia: {
    slug: "ia",
    label: "IA",
    href: "/ia",
    description:
      "Ferramentas, modelos, agentes e infraestrutura postos em uso. Demo, limite e custo antes da promessa.",
    kicker: "Demo antes da promessa",
    seoTitle: "IA: ferramentas, modelos e limites",
    subcategories: [
      subcategory(
        "ia",
        "ferramentas",
        "Ferramentas",
        "Assistentes, busca e automações avaliados no trabalho real.",
        "Ferramentas de IA",
      ),
      subcategory(
        "ia",
        "agentes",
        "Agentes",
        "Sistemas que executam tarefas, as permissões que pedem e o que fazem sozinhos.",
        "Agentes de IA",
      ),
      subcategory(
        "ia",
        "modelos",
        "Modelos",
        "Capacidades, limites, benchmarks e custo dos modelos de IA.",
        "Modelos de IA",
      ),
      subcategory(
        "ia",
        "infraestrutura",
        "Infraestrutura",
        "Chips, nuvem, borda, data centers e a operação por trás da IA.",
        "Infraestrutura de IA",
      ),
      subcategory(
        "ia",
        "seguranca",
        "Segurança",
        "Falhas, abuso, privacidade e proteção em produtos e sistemas de IA.",
        "Segurança em IA",
      ),
      subcategory(
        "ia",
        "negocios-e-politica",
        "Negócios e política",
        "Empresas, regulação, trabalho e poder econômico na corrida da IA.",
        "IA: negócios e política",
      ),
    ],
  },
  computadores: {
    slug: "computadores",
    label: "Computadores",
    href: "/computadores",
    description:
      "PCs, notebooks, peças e periféricos medidos pelo uso — não pela caixa nem pela ficha.",
    kicker: "Ficha vs. uso",
    seoTitle: "Computadores: PCs, peças e periféricos",
    subcategories: [
      subcategory(
        "computadores",
        "notebooks-e-pcs",
        "Notebooks e PCs",
        "Máquinas prontas para trabalho, estudo, criação ou jogo.",
        "Notebooks e PCs",
      ),
      subcategory(
        "computadores",
        "componentes",
        "Componentes",
        "Processadores, placas de vídeo, memória, armazenamento e refrigeração.",
        "Componentes de PC",
      ),
      subcategory(
        "computadores",
        "perifericos",
        "Periféricos",
        "Teclados, mouses, monitores, webcams, docks e acessórios de mesa.",
        "Periféricos de computador",
      ),
      subcategory(
        "computadores",
        "pcs-portateis",
        "PCs portáteis",
        "Steam Deck e outros computadores de mão com ecossistema de PC.",
        "PCs portáteis e Steam Deck",
      ),
      subcategory(
        "computadores",
        "espaco-de-trabalho",
        "Espaço de trabalho",
        "Ergonomia, mesas, múltiplas telas e escolhas físicas para trabalhar melhor.",
        "Espaço de trabalho e mesa",
      ),
    ],
  },
  dispositivos: {
    slug: "dispositivos",
    label: "Dispositivos",
    href: "/dispositivos",
    description:
      "Celular, relógio, fone, TV e casa conectada. Produto no bolso ou na sala, sem unboxing emocional.",
    kicker: "No bolso ou na sala",
    seoTitle: "Dispositivos: celular, TV e casa",
    subcategories: [
      subcategory(
        "dispositivos",
        "celulares",
        "Celulares",
        "Smartphones, câmeras, bateria, acessórios e o preço praticado no Brasil.",
        "Celulares e smartphones",
      ),
      subcategory(
        "dispositivos",
        "tablets",
        "Tablets",
        "Tablets, canetas, teclados e os usos que justificam a tela extra.",
        "Tablets",
      ),
      subcategory(
        "dispositivos",
        "vestiveis",
        "Vestíveis",
        "Relógios, anéis, óculos e sensores usados no corpo.",
        "Relógios e vestíveis",
      ),
      subcategory(
        "dispositivos",
        "audio-pessoal",
        "Áudio pessoal",
        "Fones, caixas portáteis e áudio que acompanha o usuário.",
        "Fones e áudio pessoal",
      ),
      subcategory(
        "dispositivos",
        "casa-conectada",
        "Casa conectada",
        "Automação, segurança, eletrodomésticos e dispositivos domésticos conectados.",
        "Casa conectada",
      ),
      subcategory(
        "dispositivos",
        "tv-e-streaming",
        "TV e streaming",
        "Telas, projetores, aparelhos de streaming e experiência audiovisual da sala.",
        "TV e streaming",
      ),
      subcategory(
        "dispositivos",
        "cameras-e-drones",
        "Câmeras e drones",
        "Imagem dedicada, captação aérea e acessórios fora do celular.",
        "Câmeras e drones",
      ),
    ],
  },
  aplicativos: {
    slug: "aplicativos",
    label: "Aplicativos",
    href: "/aplicativos",
    description:
      "Programas, sistemas e serviços que resolvem uma tarefa. Sete dias sem abrir ainda é desinstalação.",
    kicker: "Abriu, resolveu, ficou",
    seoTitle: "Aplicativos: o que resolve a tarefa",
    subcategories: [
      subcategory(
        "aplicativos",
        "produtividade",
        "Produtividade",
        "Organização, foco, notas e fluxos de trabalho que economizam passos.",
        "Apps de produtividade",
      ),
      subcategory(
        "aplicativos",
        "desenvolvimento",
        "Desenvolvimento",
        "Editores, ferramentas de código, repositórios e operação de software.",
        "Apps de desenvolvimento",
      ),
      subcategory(
        "aplicativos",
        "comunicacao",
        "Comunicação",
        "Mensagens, reuniões, e-mail e redes usadas para conversar ou publicar.",
        "Apps de comunicação",
      ),
      subcategory(
        "aplicativos",
        "criacao",
        "Criação",
        "Foto, vídeo, áudio, design e ferramentas para produzir conteúdo.",
        "Apps de criação",
      ),
      subcategory(
        "aplicativos",
        "sistemas-operacionais",
        "Sistemas operacionais",
        "Windows, macOS, Linux, Android, iOS e as camadas que comandam o aparelho.",
        "Sistemas operacionais",
      ),
      subcategory(
        "aplicativos",
        "servicos-digitais",
        "Serviços digitais",
        "Comércio, bancos, mobilidade, nuvem e outros serviços que vivem na tela.",
        "Serviços digitais",
      ),
      subcategory(
        "aplicativos",
        "seguranca-digital",
        "Segurança digital",
        "Privacidade, autenticação, golpes e proteção no uso cotidiano.",
        "Segurança digital",
      ),
    ],
  },
  jogos: {
    slug: "jogos",
    label: "Jogos",
    href: "/jogos",
    description:
      "Jogo, patch, console, loja e indústria. O que roda e custa no Brasil; trailer só depois do teste.",
    kicker: "Patch, não trailer",
    seoTitle: "Jogos: patch, console e preço no Brasil",
    subcategories: [
      subcategory(
        "jogos",
        "lancamentos",
        "Lançamentos",
        "Jogos novos, atualizações e o estado real do que chegou para jogar.",
        "Lançamentos de jogos",
      ),
      subcategory(
        "jogos",
        "consoles",
        "Consoles e portáteis",
        "Aparelhos dedicados, sistema, desempenho, acessórios e preço no Brasil.",
        "Consoles e portáteis",
      ),
      subcategory(
        "jogos",
        "industria",
        "Indústria",
        "Estúdios, publicadoras, negócios, trabalho e decisões por trás dos jogos.",
        "Indústria de jogos",
      ),
      subcategory(
        "jogos",
        "lojas-e-assinaturas",
        "Lojas e assinaturas",
        "Steam, eShop, PS Store, Game Pass, PS Plus, preços e acesso.",
        "Lojas e assinaturas de jogos",
      ),
      subcategory(
        "jogos",
        "esports",
        "Esports",
        "Competição, equipes e audiência quando há jogo ou número para analisar.",
        "Esports",
      ),
    ],
  },
};

export const categoryList = CATEGORY_SLUGS.map((slug) => categories[slug]);
export const subcategoryList = categoryList.flatMap(
  (category) => category.subcategories,
);

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function isSubcategorySlug(value: string): value is SubcategorySlug {
  return (SUBCATEGORY_SLUGS as readonly string[]).includes(value);
}

export function getCategory(slug: string): Category | undefined {
  if (!isCategorySlug(slug)) return undefined;
  return categories[slug];
}

export function getSubcategory(
  categorySlug: string,
  subcategorySlug: string,
): Subcategory | undefined {
  const category = getCategory(categorySlug);
  return category?.subcategories.find(
    (subcategory) => subcategory.slug === subcategorySlug,
  );
}
