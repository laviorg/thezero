/**
 * Links automáticos de matéria para ferramentas e hubs. Regras simples sobre
 * editoria, subeditoria e texto; no máximo 3 por matéria.
 */
type PostLike = { category: string; subcategory?: string; title: string; content: string; href: string };
type Rule = { href: string; label: string; test: (p: PostLike, text: string) => boolean };

const PORTABLE = (p: PostLike, t: string) =>
  p.subcategory === "pcs-portateis" || /steam deck|rog (xbox )?ally|legion go|switch 2|console port[aá]til|handheld/i.test(t);

export const RELATED_RULES: Rule[] = [
  { href: "/ferramentas/imposto-portateis", label: "Calculadora de imposto pra importar portátil", test: (p, t) => PORTABLE(p, t) && /import|remessa conforme|aliexpress|taxa(ção)?|US\$/i.test(t) },
  { href: "/ferramentas/bateria-portateis", label: "Calculadora de bateria de portáteis", test: (p, t) => PORTABLE(p, t) && /\bWh\b|bateria/i.test(t) },
  { href: "/ferramentas/custo-api-ia", label: "Calculadora de custo de API de IA", test: (p, t) => p.category === "ia" && /\bAPI\b|tokens?\b/i.test(t) },
];

export function relatedLinks(post: PostLike, extra: Rule[] = []) {
  const text = `${post.title}\n${post.content}`;
  return [...extra, ...RELATED_RULES]
    .filter((r) => r.href !== post.href && r.test(post, text))
    .slice(0, 3)
    .map(({ href, label }) => ({ href, label }));
}
