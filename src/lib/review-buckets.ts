import { isReviewArchiveFormat } from "./post-format.ts";

/**
 * Linhas de produto do hub `/reviews`.
 *
 * Formato (`review` | `guia` | `comparativo`) é ortogonal à editoria
 * (`docs/TAXONOMY.md`). Este mapa não cria categoria e não compete com
 * `/ia`, `/jogos` ou `/dispositivos/celulares`. Notícia não entra.
 * `vale-a-pena` e `tutorial` também ficam de fora: têm hub próprio.
 * Linha sem matéria não entra no menu, na rota nem no sitemap — isso fica
 * com `getActiveReviewBuckets`.
 *
 * A primeira regra que casa ganha. A subcategoria manda. Título e slug só
 * cortam dois casos:
 *
 * - `notebooks-e-pcs` e `componentes`: token de notebook no slug ou no
 *   título (`notebook`, `ultrabook`, `macbook`, `laptop`, `2-em-1`,
 *   `ram-soldada`) → Notebooks. O resto (desktop, mini PC, all-in-one,
 *   peça, montagem) → PCs.
 * - `pcs-portateis` cujo slug é acessório (`acessorios-`, `dock`,
 *   `power-bank`) → Acessórios, não o aparelho.
 *
 * Comparativo arquivado em `jogos/consoles` (Switch vs Steam Deck) fica
 * em Consoles. Steam Deck, Ally, Legion Go e Zeenix em
 * `computadores/pcs-portateis` ficam em Consoles portáteis.
 *
 * `aplicativos` → Software e serviços. `ia` → IA.
 * `jogos/lojas-e-assinaturas` → Lojas e assinaturas.
 * Cabo, USB-C e carregamento que sobraram em Tecnologia → Acessórios.
 *
 * Pré-venda, patch day, action cam, fibra e garantia estendida não têm
 * linha. Continuam só em `/reviews`.
 */
export const REVIEW_BUCKET_SLUGS = [
  "consoles",
  "consoles-portateis",
  "notebooks",
  "pcs",
  "celulares",
  "acessorios",
  "tablets",
  "vestiveis",
  "tv-e-streaming",
  "casa-conectada",
  "software-e-servicos",
  "ia",
  "lojas-e-assinaturas",
] as const;

export type ReviewBucketSlug = (typeof REVIEW_BUCKET_SLUGS)[number];

export type ReviewBucket = {
  slug: ReviewBucketSlug;
  label: string;
  href: string;
  description: string;
  /** Núcleo do `<title>` sem marca. Ver docs/SEO_TITLES.md. */
  seoTitle: string;
};

export type ReviewBucketInput = {
  format?: string;
  category: string;
  subcategory?: string;
  title: string;
  slug: string;
};

const NOTEBOOK_PATTERN = /notebook|ultrabook|macbook|laptop|2-em-1|ram-soldada/u;

function bucket(
  slug: ReviewBucketSlug,
  label: string,
  description: string,
  seoTitle: string,
): ReviewBucket {
  return {
    slug,
    label,
    href: `/reviews/${slug}`,
    description,
    seoTitle,
  };
}

const REVIEW_BUCKETS: Record<ReviewBucketSlug, ReviewBucket> = {
  consoles: bucket(
    "consoles",
    "Consoles",
    "PlayStation, Xbox e Nintendo no uso real, com o preço em real. Controle e upgrade entram junto.",
    "Reviews: consoles",
  ),
  "consoles-portateis": bucket(
    "consoles-portateis",
    "Consoles portáteis",
    "Steam Deck, ROG Ally, Legion Go e outros PCs de mão. O que roda, não o teraflop do anúncio.",
    "Reviews: consoles portáteis",
  ),
  notebooks: bucket(
    "notebooks",
    "Notebooks",
    "Ultrabook, notebook gamer e máquina de estudo. Bateria, tela e teclado antes da ficha.",
    "Reviews: notebooks",
  ),
  pcs: bucket(
    "pcs",
    "PCs",
    "Desktop, mini PC e montagem. Peça e gabinete quando o assunto é o computador, não o acessório.",
    "Reviews: PCs e montagem",
  ),
  celulares: bucket(
    "celulares",
    "Celulares",
    "Smartphone no Brasil: câmera, bateria, armazenamento e o preço que a loja cobra.",
    "Reviews: celulares",
  ),
  acessorios: bucket(
    "acessorios",
    "Acessórios",
    "Fone, teclado, mouse, monitor, dock, cabo e cadeira. O que acompanha o aparelho.",
    "Reviews: acessórios",
  ),
  tablets: bucket(
    "tablets",
    "Tablets",
    "Tablet para estudar e assistir. Tela e armazenamento antes da caneta.",
    "Reviews: tablets",
  ),
  vestiveis: bucket(
    "vestiveis",
    "Vestíveis",
    "Relógio e pulseira. O que o sensor mede de verdade.",
    "Reviews: vestíveis",
  ),
  "tv-e-streaming": bucket(
    "tv-e-streaming",
    "TV e streaming",
    "TV, soundbar e aparelho de streaming. O que a sala aceita.",
    "Reviews: TV e streaming",
  ),
  "casa-conectada": bucket(
    "casa-conectada",
    "Casa conectada",
    "Roteador, tomada e o que fica ligado em casa. A conta aparece no aparelho, não no anúncio.",
    "Reviews: casa conectada",
  ),
  "software-e-servicos": bucket(
    "software-e-servicos",
    "Software e serviços",
    "Programa, sistema e serviço digital. O que resolve a tarefa e o que só ocupa a tela.",
    "Reviews: software e serviços",
  ),
  ia: bucket(
    "ia",
    "IA",
    "Ferramenta e modelo no uso real. Limite e custo antes da promessa.",
    "Reviews: ferramentas de IA",
  ),
  "lojas-e-assinaturas": bucket(
    "lojas-e-assinaturas",
    "Lojas e assinaturas",
    "Game Pass, PS Plus, Steam e chave barata. A conta mensal contra comprar o jogo.",
    "Reviews: lojas de jogos",
  ),
};

export const REVIEW_BUCKET_LIST: readonly ReviewBucket[] =
  REVIEW_BUCKET_SLUGS.map((slug) => REVIEW_BUCKETS[slug]);

export function getReviewBucket(slug: string): ReviewBucket | undefined {
  if (!(REVIEW_BUCKET_SLUGS as readonly string[]).includes(slug)) {
    return undefined;
  }
  return REVIEW_BUCKETS[slug as ReviewBucketSlug];
}

export function reviewBucketDescription(bucket: ReviewBucket): string {
  return `${bucket.label} em Reviews. ${bucket.description}`;
}

function haystack(post: ReviewBucketInput): string {
  return `${post.slug} ${post.title}`.toLocaleLowerCase("pt-BR");
}

function isNotebook(post: ReviewBucketInput): boolean {
  return NOTEBOOK_PATTERN.test(haystack(post));
}

function isHandheldAccessory(slug: string): boolean {
  return (
    slug.startsWith("acessorios-") ||
    slug.includes("dock") ||
    slug.includes("power-bank")
  );
}

function isStrayAccessory(post: ReviewBucketInput): boolean {
  const text = haystack(post);
  return (
    text.includes("usb-c") ||
    text.includes("cabo") ||
    text.includes("carregador") ||
    text.includes("carregamento")
  );
}

export function assignReviewBucket(
  post: ReviewBucketInput,
): ReviewBucketSlug | null {
  if (!isReviewArchiveFormat(post)) return null;

  const subcategory = post.subcategory || undefined;

  if (
    subcategory === "perifericos" ||
    subcategory === "audio-pessoal" ||
    subcategory === "espaco-de-trabalho"
  ) {
    return "acessorios";
  }

  if (subcategory === "pcs-portateis") {
    return isHandheldAccessory(post.slug) ? "acessorios" : "consoles-portateis";
  }

  if (subcategory === "consoles") return "consoles";
  if (subcategory === "celulares") return "celulares";
  if (subcategory === "tablets") return "tablets";
  if (subcategory === "vestiveis") return "vestiveis";
  if (subcategory === "tv-e-streaming") return "tv-e-streaming";
  if (subcategory === "casa-conectada") return "casa-conectada";

  if (subcategory === "notebooks-e-pcs" || subcategory === "componentes") {
    return isNotebook(post) ? "notebooks" : "pcs";
  }

  if (post.category === "aplicativos") return "software-e-servicos";
  if (post.category === "ia") return "ia";
  if (post.category === "jogos" && subcategory === "lojas-e-assinaturas") {
    return "lojas-e-assinaturas";
  }

  if (isStrayAccessory(post)) return "acessorios";

  return null;
}
