/**
 * Injeta uma unidade in-article do AdSense no corpo MDX, depois do N-ésimo
 * parágrafo de prosa no nível de topo (mesma contagem da newsletter: não
 * vale título, lista, JSX, imagem, citação, tabela nem bloco de código).
 */

export const AD_IN_ARTICLE_MIN_WORDS = 600;

export function injectInArticleAdAfterNthParagraph(
  source: string,
  paragraph: number,
): string {
  const blocks = source.split(/\n{2,}/);
  let count = 0;
  let inFence = false;
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i].trim();
    const fences = (block.match(/^```/gm) || []).length;
    if (fences % 2 === 1) inFence = !inFence;
    if (inFence || fences > 0) continue;
    if (!block || /^(#|<|!\[|[-*+] |\d+\. |>|\||import |export )/.test(block)) continue;
    count += 1;
    if (count === paragraph) {
      blocks.splice(i + 1, 0, "<AdInArticle />");
      return blocks.join("\n\n");
    }
  }
  return source;
}
