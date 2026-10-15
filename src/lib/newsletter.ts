/**
 * Newsletter Zero Hora Tech.
 * O formulário do Kit ainda não está pronto: enquanto NEXT_PUBLIC_KIT_FORM_ACTION
 * não estiver definido, as caixas ficam no HTML como placeholder escondido.
 * Para ligar: defina NEXT_PUBLIC_KIT_FORM_ACTION com a URL de action do
 * formulário do Kit (ex.: https://app.kit.com/forms/<ID>/subscriptions) e rode o build.
 */
export const NEWSLETTER_NAME = "Zero Hora Tech";
export const KIT_FORM_ACTION = process.env.NEXT_PUBLIC_KIT_FORM_ACTION?.trim() || "";
export const NEWSLETTER_ENABLED = KIT_FORM_ACTION.length > 0;

/** Guia longo: recebe uma segunda caixa depois do 3º parágrafo. */
export const LONG_GUIDE_MIN_WORDS = 1200;

/**
 * Insere <Newsletter /> depois do 3º parágrafo de texto do corpo MDX.
 * Só conta blocos de prosa no nível de topo (não título, lista, JSX, imagem).
 */
export function injectNewsletterAfterThirdParagraph(source: string): string {
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
    if (count === 3) {
      blocks.splice(i + 1, 0, '<Newsletter placement="guia-meio" />');
      return blocks.join("\n\n");
    }
  }
  return source;
}
