import data from "@/data/black-friday-2026.json";

/**
 * Preços da página /black-friday: lidos na página de cada produto na data de `checkedAt`.
 * `ref` é o preço do mesmo anúncio numa checagem anterior (arquivo /menor-preco ou /precos-no-brasil).
 * Item esgotado na checagem fica sem preço.
 */
export type BfItem = {
  name: string;
  detail: string;
  store: "KaBuM" | "Amazon";
  seller: string;
  url: string;
  asin?: string;
  price: number | null;
  priceNote: string;
  available: boolean;
  ref: { price: number; date: string } | null;
};

export type BfGroup = { id: "gpu" | "ssd" | "console" | "notebook"; heading: string; items: BfItem[] };

export const bfPrices = data as { checkedAt: string; groups: BfGroup[] };

export function bfChange(item: BfItem): number | null {
  if (item.price === null || !item.ref) return null;
  return Math.round((item.price / item.ref.price - 1) * 100);
}

export function bfCheckedCount(): number {
  return bfPrices.groups.reduce((total, group) => total + group.items.length, 0);
}

export const shortDate = (iso: string) => {
  const [, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}`;
};
