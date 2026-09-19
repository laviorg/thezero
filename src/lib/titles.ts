import type { Category, Subcategory } from "./categories.ts";
import { site } from "./site.ts";

/** Visible range we write toward. Desktop SERP is ~580–600px, not a char cap. */
export const TITLE_SOFT_MAX = 60;

/** Never emit a document/OG title longer than this. Truncate at a word boundary. */
export const TITLE_HARD_MAX = 70;

/** Brand delimiter. Matches kickers and the previous template; Google accepts ·, | or -. */
export const TITLE_SEPARATOR = " · ";

export const BRAND_NAME = site.name;

export const HOME_TITLE = "The Zero — o que funciona de verdade em tech";
export const ABOUT_TITLE = "Sobre o The Zero — newsroom de tech sem hype";
export const PRIVACY_TITLE = "Privacidade no The Zero — dados, cookies e LGPD";
export const CONTACT_TITLE = "Fale com a redação do The Zero";
export const TERMS_TITLE = "Termos de uso do The Zero";
export const SEARCH_HUB_CORE = "Busca no newsroom";
export const NOT_FOUND_CORE = "Página não encontrada";

export type BrandMode = "auto" | "always" | "never";

export function titleLength(value: string): number {
  return [...value].length;
}

export function normalizeTitle(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function stripTrailingDots(value: string): string {
  return value.replace(/[.]+$/u, "").trim();
}

export function includesBrand(value: string): boolean {
  return value
    .toLocaleLowerCase("pt-BR")
    .includes(BRAND_NAME.toLocaleLowerCase("pt-BR"));
}

function brandSuffix(): string {
  return `${TITLE_SEPARATOR}${BRAND_NAME}`;
}

/**
 * Shorten to `max` without cutting a word in half and without a dangling
 * ellipsis — Google adds its own. Prefers keeping the first sentence when
 * that sentence already carries the entity.
 */
export function fitTitle(value: string, max: number): string {
  const text = stripTrailingDots(normalizeTitle(value));
  if (max <= 0) return "";
  if (titleLength(text) <= max) return text;

  const firstSentence = text.match(/^(.+?[.!?])(?:\s+|$)/);
  if (firstSentence) {
    const clause = stripTrailingDots(firstSentence[1]);
    if (titleLength(clause) >= 28 && titleLength(clause) <= max) {
      return clause;
    }
  }

  const slice = [...text].slice(0, max).join("");
  const separators = [" — ", " – ", " - ", ": ", "; ", ", ", " "];
  let best = "";
  for (const sep of separators) {
    const idx = slice.lastIndexOf(sep);
    if (idx < 24) continue;
    const candidate = stripTrailingDots(slice.slice(0, idx).trim());
    if (titleLength(candidate) > titleLength(best)) best = candidate;
  }
  if (best) return best;

  const lastSpace = slice.lastIndexOf(" ");
  const fallback = lastSpace > 20 ? slice.slice(0, lastSpace) : slice;
  return stripTrailingDots(fallback.trim());
}

/**
 * Build the final `<title>` / OG / Twitter string.
 *
 * - `always`: append ` · The Zero` (hubs, utility pages). Core is fitted so
 *   the brand still fits inside the hard max.
 * - `auto`: append brand only when the composed string stays within the
 *   soft max. Long article titles keep the claim and drop the suffix —
 *   Google already shows the site name beside the result.
 * - `never`: no suffix.
 * - If `core` already contains the brand, it is treated as absolute.
 */
export function composePageTitle(
  core: string,
  brand: BrandMode = "auto",
): string {
  const title = stripTrailingDots(normalizeTitle(core));
  if (!title) return BRAND_NAME;
  if (includesBrand(title)) return fitTitle(title, TITLE_HARD_MAX);

  const suffix = brandSuffix();
  const suffixLen = titleLength(suffix);

  if (brand === "never") return fitTitle(title, TITLE_HARD_MAX);

  if (brand === "always") {
    const fitted = fitTitle(title, TITLE_HARD_MAX - suffixLen);
    return `${fitted}${suffix}`;
  }

  if (titleLength(title) + suffixLen <= TITLE_SOFT_MAX) {
    return `${title}${suffix}`;
  }

  return fitTitle(title, TITLE_HARD_MAX);
}

export function homePageTitle(): string {
  return composePageTitle(HOME_TITLE, "never");
}

export function aboutPageTitle(): string {
  return composePageTitle(ABOUT_TITLE, "never");
}

export function privacyPageTitle(): string {
  return composePageTitle(PRIVACY_TITLE, "never");
}

export function contactPageTitle(): string {
  return composePageTitle(CONTACT_TITLE, "never");
}

export function termsPageTitle(): string {
  return composePageTitle(TERMS_TITLE, "never");
}

export function notFoundPageTitle(): string {
  return composePageTitle(NOT_FOUND_CORE, "always");
}

export function searchPageTitle(query?: string): string {
  const q = query?.replace(/\s+/g, " ").trim();
  if (!q) return composePageTitle(SEARCH_HUB_CORE, "always");

  const prefix = "Busca: ";
  const budget =
    TITLE_HARD_MAX - titleLength(prefix) - titleLength(brandSuffix());
  return composePageTitle(`${prefix}${fitTitle(q, Math.max(8, budget))}`, "always");
}

export function categoryPageTitle(
  category: Pick<Category, "seoTitle">,
): string {
  return composePageTitle(category.seoTitle, "always");
}

export function subcategoryPageTitle(
  subcategory: Pick<Subcategory, "seoTitle">,
): string {
  return composePageTitle(subcategory.seoTitle, "always");
}

export function articlePageTitle(post: {
  title: string;
  seoTitle?: string;
}): string {
  const core = post.seoTitle?.trim() || post.title;
  return composePageTitle(core, "auto");
}

export function articleHeadline(post: { title: string }): string {
  return normalizeTitle(post.title);
}
