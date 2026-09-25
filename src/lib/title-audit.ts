import { categoryList, subcategoryList } from "./categories";
import { getAllPosts, getPostsByCategory, getReviewPosts } from "./posts";
import {
  BRAND_NAME,
  TITLE_HARD_MAX,
  aboutPageTitle,
  articlePageTitle,
  categoryPageTitle,
  contactPageTitle,
  homePageTitle,
  notFoundPageTitle,
  privacyPageTitle,
  reviewsPageTitle,
  searchPageTitle,
  subcategoryPageTitle,
  termsPageTitle,
  titleLength,
} from "./titles";

export type TitledPath = {
  path: string;
  title: string;
  indexable: boolean;
};

export function collectDocumentTitles(): TitledPath[] {
  const rows: TitledPath[] = [
    { path: "/", title: homePageTitle(), indexable: true },
    { path: "/sobre", title: aboutPageTitle(), indexable: true },
    { path: "/privacidade", title: privacyPageTitle(), indexable: true },
    { path: "/contato", title: contactPageTitle(), indexable: true },
    { path: "/termos", title: termsPageTitle(), indexable: true },
    { path: "/busca", title: searchPageTitle(), indexable: false },
    {
      path: "/reviews",
      title: reviewsPageTitle(),
      indexable: getReviewPosts().length > 0,
    },
    { path: "/404", title: notFoundPageTitle(), indexable: false },
  ];

  for (const category of categoryList) {
    rows.push({
      path: category.href,
      title: categoryPageTitle(category),
      indexable: getPostsByCategory(category.slug).length > 0,
    });
  }

  for (const subcategory of subcategoryList) {
    rows.push({
      path: subcategory.href,
      title: subcategoryPageTitle(subcategory),
      indexable: true,
    });
  }

  for (const post of getAllPosts()) {
    rows.push({
      path: post.href,
      title: articlePageTitle(post),
      indexable: true,
    });
  }

  return rows;
}

export function assertUniqueDocumentTitles(rows = collectDocumentTitles()) {
  const byTitle = new Map<string, string[]>();
  const tooLong: TitledPath[] = [];

  for (const row of rows) {
    if (titleLength(row.title) > TITLE_HARD_MAX) tooLong.push(row);
    const list = byTitle.get(row.title) ?? [];
    list.push(row.path);
    byTitle.set(row.title, list);
  }

  const duplicates = [...byTitle.entries()].filter(
    ([, paths]) => paths.length > 1,
  );

  if (tooLong.length || duplicates.length) {
    const lines = [
      ...tooLong.map(
        (row) =>
          `title > ${TITLE_HARD_MAX} (${titleLength(row.title)}): ${row.path} → ${row.title}`,
      ),
      ...duplicates.map(
        ([title, paths]) => `title duplicado “${title}”: ${paths.join(", ")}`,
      ),
    ];
    throw new Error(`Títulos de página inválidos:\n${lines.join("\n")}`);
  }

  if (homePageTitle() === BRAND_NAME) {
    throw new Error("A home não pode usar só o nome da marca como <title>.");
  }
}
