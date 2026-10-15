import prices from "@/data/prices.json";
import type { CatalogItem } from "@/lib/affiliate";

export type PriceRecord = {
  id: string;
  name: string;
  category: CatalogItem["category"];
  url: string;
  source: string;
  price?: number;
  availability?: string;
  checkedAt?: string;
  priceSince?: string;
  error?: string | null;
  lastErrorAt?: string;
  lowest?: { price: number; at: string };
};

export const priceData = prices as { generatedAt: string; source: string; items: Record<string, PriceRecord> };

export function priceList(category: CatalogItem["category"]) {
  return Object.values(priceData.items)
    .filter((item) => item.category === category)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (value: number) => brl.format(value);

const when = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
export const formatBRT = (iso: string) => `${when.format(new Date(iso))} (Brasília)`;

export const AVAILABILITY_LABEL: Record<string, string> = {
  InStock: "Em estoque",
  OutOfStock: "Esgotado",
  PreOrder: "Pré-venda",
  BackOrder: "Sob encomenda",
  LimitedAvailability: "Estoque limitado",
};
