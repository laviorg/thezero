import data from "@/data/precos-brasil.json";

/**
 * Tabela de /precos-no-brasil. Cada preço foi lido na página da loja
 * brasileira no momento de `checkedAt`. Atualização semanal: ver
 * docs/precos-no-brasil.md. Preço que não deu para conferir não entra.
 */
export type BrazilPrice = {
  group: "consoles" | "portateis" | "celulares" | "computadores" | "placas" | "leitura";
  name: string;
  store: string;
  seller: string;
  url: string;
  price: number;
  priceNote: string;
  checkedAt: string;
};

export const brazilPrices = data as { checkedAt: string; items: BrazilPrice[] };

export const BRAZIL_PRICE_GROUPS: { id: BrazilPrice["group"]; heading: string }[] = [
  { id: "consoles", heading: "Consoles" },
  { id: "portateis", heading: "PCs portáteis" },
  { id: "celulares", heading: "Celulares" },
  { id: "computadores", heading: "Tablets e notebooks" },
  { id: "placas", heading: "Placas de vídeo" },
  { id: "leitura", heading: "Leitores digitais" },
];

export function brazilPricesByGroup(group: BrazilPrice["group"]) {
  return brazilPrices.items
    .filter((item) => item.group === group)
    .sort((a, b) => b.price - a.price);
}
