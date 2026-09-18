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
};

export type Category = {
  slug: CategorySlug;
  label: string;
  href: string;
  description: string;
  kicker: string;
  subcategories: readonly Subcategory[];
};

function subcategory(
  parent: CategorySlug,
  slug: SubcategorySlug,
  label: string,
  description: string,
): Subcategory {
  return {
    slug,
    parent,
    label,
    href: `/${parent}/${slug}`,
    description,
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
    subcategories: [
      subcategory(
        "tecnologia",
        "industria",
        "Indústria",
        "Fabricação, cadeias produtivas, padrões e bastidores que movem o setor.",
      ),
      subcategory(
        "tecnologia",
        "ciencia-aplicada",
        "Ciência aplicada",
        "Pesquisa e protótipos quando saem do laboratório e encostam no uso real.",
      ),
      subcategory(
        "tecnologia",
        "infraestrutura",
        "Infraestrutura",
        "Internet, redes, nuvem, data centers e energia fora de uma pauta específica de IA.",
      ),
      subcategory(
        "tecnologia",
        "tendencias",
        "Tendências",
        "Mudanças transversais de uso e comportamento sustentadas por adoção ou dados.",
      ),
      subcategory(
        "tecnologia",
        "negocios",
        "Negócios",
        "Empresas, aquisições, regulação, trabalho e modelos de negócio em tecnologia.",
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
    subcategories: [
      subcategory(
        "ia",
        "ferramentas",
        "Ferramentas",
        "Assistentes, busca e automações avaliados no trabalho real.",
      ),
      subcategory(
        "ia",
        "agentes",
        "Agentes",
        "Sistemas que executam tarefas, as permissões que pedem e o que fazem sozinhos.",
      ),
      subcategory(
        "ia",
        "modelos",
        "Modelos",
        "Capacidades, limites, benchmarks e custo dos modelos de IA.",
      ),
      subcategory(
        "ia",
        "infraestrutura",
        "Infraestrutura",
        "Chips, nuvem, borda, data centers e a operação por trás da IA.",
      ),
      subcategory(
        "ia",
        "seguranca",
        "Segurança",
        "Falhas, abuso, privacidade e proteção em produtos e sistemas de IA.",
      ),
      subcategory(
        "ia",
        "negocios-e-politica",
        "Negócios e política",
        "Empresas, regulação, trabalho e poder econômico na corrida da IA.",
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
    subcategories: [
      subcategory(
        "computadores",
        "notebooks-e-pcs",
        "Notebooks e PCs",
        "Máquinas prontas para trabalho, estudo, criação ou jogo.",
      ),
      subcategory(
        "computadores",
        "componentes",
        "Componentes",
        "Processadores, placas de vídeo, memória, armazenamento e refrigeração.",
      ),
      subcategory(
        "computadores",
        "perifericos",
        "Periféricos",
        "Teclados, mouses, monitores, webcams, docks e acessórios de mesa.",
      ),
      subcategory(
        "computadores",
        "pcs-portateis",
        "PCs portáteis",
        "Steam Deck e outros computadores de mão com ecossistema de PC.",
      ),
      subcategory(
        "computadores",
        "espaco-de-trabalho",
        "Espaço de trabalho",
        "Ergonomia, mesas, múltiplas telas e escolhas físicas para trabalhar melhor.",
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
    subcategories: [
      subcategory(
        "dispositivos",
        "celulares",
        "Celulares",
        "Smartphones, câmeras, bateria, acessórios e o preço praticado no Brasil.",
      ),
      subcategory(
        "dispositivos",
        "tablets",
        "Tablets",
        "Tablets, canetas, teclados e os usos que justificam a tela extra.",
      ),
      subcategory(
        "dispositivos",
        "vestiveis",
        "Vestíveis",
        "Relógios, anéis, óculos e sensores usados no corpo.",
      ),
      subcategory(
        "dispositivos",
        "audio-pessoal",
        "Áudio pessoal",
        "Fones, caixas portáteis e áudio que acompanha o usuário.",
      ),
      subcategory(
        "dispositivos",
        "casa-conectada",
        "Casa conectada",
        "Automação, segurança, eletrodomésticos e dispositivos domésticos conectados.",
      ),
      subcategory(
        "dispositivos",
        "tv-e-streaming",
        "TV e streaming",
        "Telas, projetores, aparelhos de streaming e experiência audiovisual da sala.",
      ),
      subcategory(
        "dispositivos",
        "cameras-e-drones",
        "Câmeras e drones",
        "Imagem dedicada, captação aérea e acessórios fora do celular.",
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
    subcategories: [
      subcategory(
        "aplicativos",
        "produtividade",
        "Produtividade",
        "Organização, foco, notas e fluxos de trabalho que economizam passos.",
      ),
      subcategory(
        "aplicativos",
        "desenvolvimento",
        "Desenvolvimento",
        "Editores, ferramentas de código, repositórios e operação de software.",
      ),
      subcategory(
        "aplicativos",
        "comunicacao",
        "Comunicação",
        "Mensagens, reuniões, e-mail e redes usadas para conversar ou publicar.",
      ),
      subcategory(
        "aplicativos",
        "criacao",
        "Criação",
        "Foto, vídeo, áudio, design e ferramentas para produzir conteúdo.",
      ),
      subcategory(
        "aplicativos",
        "sistemas-operacionais",
        "Sistemas operacionais",
        "Windows, macOS, Linux, Android, iOS e as camadas que comandam o aparelho.",
      ),
      subcategory(
        "aplicativos",
        "servicos-digitais",
        "Serviços digitais",
        "Comércio, bancos, mobilidade, nuvem e outros serviços que vivem na tela.",
      ),
      subcategory(
        "aplicativos",
        "seguranca-digital",
        "Segurança digital",
        "Privacidade, autenticação, golpes e proteção no uso cotidiano.",
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
    subcategories: [
      subcategory(
        "jogos",
        "lancamentos",
        "Lançamentos",
        "Jogos novos, atualizações e o estado real do que chegou para jogar.",
      ),
      subcategory(
        "jogos",
        "consoles",
        "Consoles e portáteis",
        "Aparelhos dedicados, sistema, desempenho, acessórios e preço no Brasil.",
      ),
      subcategory(
        "jogos",
        "industria",
        "Indústria",
        "Estúdios, publicadoras, negócios, trabalho e decisões por trás dos jogos.",
      ),
      subcategory(
        "jogos",
        "lojas-e-assinaturas",
        "Lojas e assinaturas",
        "Steam, eShop, PS Store, Game Pass, PS Plus, preços e acesso.",
      ),
      subcategory(
        "jogos",
        "esports",
        "Esports",
        "Competição, equipes e audiência quando há jogo ou número para analisar.",
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
