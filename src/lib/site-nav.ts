import { categoryList } from "./categories.ts";

export type NavMenuLink = {
  href: string;
  label: string;
};

export type NavMenuSection = {
  id: string;
  href: string;
  label: string;
  /** Rótulo visível do submenu: "Assuntos" nas editorias, "Por produto" em Reviews. */
  menuLabel: string;
  links: readonly NavMenuLink[];
};

type ActiveSubcategory = {
  parent: string;
  href: string;
  label: string;
};

/**
 * Um item por editoria, na ordem de `categoryList`.
 * `active` vem de `getActiveSubcategories()`: ordem da taxonomia, só
 * subcategorias com matéria. Editoria sem subcategoria viva fica no menu
 * como link simples (`links` vazio). Os hrefs são os hubs já existentes.
 */
export function categoryMenus(
  active: readonly ActiveSubcategory[],
): NavMenuSection[] {
  return categoryList.map((category) => ({
    id: category.slug,
    href: category.href,
    label: category.label,
    menuLabel: "Assuntos",
    links: active
      .filter((sub) => sub.parent === category.slug)
      .map((sub) => ({ href: sub.href, label: sub.label })),
  }));
}
