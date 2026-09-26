/**
 * Grupos da página `/tutoriais`. Não são editorias e não ganham rota:
 * plataforma sem matéria não entra no hub, no menu nem no sitemap.
 * O campo `platform` só existe em `format: tutorial`. Ver docs/TAXONOMY.md.
 */
export const TUTORIAL_PLATFORM_SLUGS = [
  "iphone",
  "android",
  "windows",
  "jogos",
  "servicos",
] as const;

export type TutorialPlatform = (typeof TUTORIAL_PLATFORM_SLUGS)[number];

export type TutorialGroup = {
  slug: TutorialPlatform;
  label: string;
  description: string;
};

export const TUTORIAL_GROUP_LIST: readonly TutorialGroup[] = [
  {
    slug: "iphone",
    label: "iPhone",
    description: "iOS e o que muda no aparelho da Apple antes de tocar em Atualizar.",
  },
  {
    slug: "android",
    label: "Android",
    description: "Galaxy, Google e os menus que o fabricante esconde em Configurações.",
  },
  {
    slug: "windows",
    label: "Windows",
    description: "PC e notebook. O passo a passo do sistema, não o anúncio da Microsoft.",
  },
  {
    slug: "jogos",
    label: "Jogos",
    description: "Lojas, resgate e o que fica na conta depois que a promoção acaba.",
  },
  {
    slug: "servicos",
    label: "Serviços",
    description: "App de governo, banco e serviço digital que pede dado de verdade.",
  },
];

export function parseTutorialPlatform(
  value: unknown,
  slug: string,
): TutorialPlatform | undefined {
  if (value == null || value === "") return undefined;
  if (
    typeof value === "string" &&
    (TUTORIAL_PLATFORM_SLUGS as readonly string[]).includes(value)
  ) {
    return value as TutorialPlatform;
  }
  throw new Error(
    `Frontmatter inválido em ${slug}: platform deve ser ${TUTORIAL_PLATFORM_SLUGS.join("|")}.`,
  );
}

export function groupTutorialPosts<T extends { platform?: string }>(
  posts: readonly T[],
): { group: TutorialGroup; posts: T[] }[] {
  return TUTORIAL_GROUP_LIST.flatMap((group) => {
    const items = posts.filter((post) => post.platform === group.slug);
    return items.length > 0 ? [{ group, posts: items }] : [];
  });
}
