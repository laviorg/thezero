export const CATEGORY_SLUGS = [
  "ia",
  "hardware",
  "consoles",
  "gadgets",
  "apps",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Category = {
  slug: CategorySlug;
  label: string;
  href: string;
  description: string;
  kicker: string;
};

export const categories: Record<CategorySlug, Category> = {
  ia: {
    slug: "ia",
    label: "IA",
    href: "/ia",
    description:
      "Ferramenta, atalho, número. Se não dá pra testar em 40 segundos, não entra.",
    kicker: "O que sobrevive no dock",
  },
  hardware: {
    slug: "hardware",
    label: "Hardware",
    href: "/hardware",
    description:
      "Teclado, tela, notebook, handheld. Spec sheet versus o que você usa de verdade.",
    kicker: "Spec vs. uso",
  },
  consoles: {
    slug: "consoles",
    label: "Consoles",
    href: "/consoles",
    description:
      "Frame rate, preço no Brasil, hype de trailer. Sem unboxing emocional.",
    kicker: "Trailer mentiroso",
  },
  gadgets: {
    slug: "gadgets",
    label: "Gadgets",
    href: "/gadgets",
    description:
      "Celular, fone, wearable. O app que realmente dispara — não o slide da palestra.",
    kicker: "No bolso, não no palco",
  },
  apps: {
    slug: "apps",
    label: "Apps",
    href: "/apps",
    description:
      "Software que você abre sem lembrar. O resto vai pra lixeira em 7 dias.",
    kicker: "7 dias sem abrir = fora",
  },
};

export const categoryList = CATEGORY_SLUGS.map((slug) => categories[slug]);

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function getCategory(slug: string): Category | undefined {
  if (!isCategorySlug(slug)) return undefined;
  return categories[slug];
}
