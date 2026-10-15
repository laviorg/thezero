import data from "@/data/fichas.json";
import { getIndexablePosts, type Post } from "@/lib/posts";

export type FichaField = { value: string | null; source: string | null };
export type Ficha = (typeof data.items)[number];

export const FIELD_LABELS: Record<string, string> = {
  chip: "Chip",
  tela: "Tela",
  bateria: "Bateria",
  sistema: "Sistema",
  precoMedio: "Preço médio",
  situacaoBrasil: "Situação no Brasil",
};

export const fichas = data.items;
export const getFicha = (slug: string) => fichas.find((f) => f.slug === slug);

/** Matérias que citam a entidade, da mais antiga para a mais nova. */
export function fichaArticles(ficha: Ficha): Post[] {
  const names = ficha.match.map((n) => n.toLowerCase());
  return getIndexablePosts()
    .filter((p) => p.href === ficha.review || names.some((n) => p.title.toLowerCase().includes(n) || p.content.toLowerCase().includes(n)))
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso));
}
