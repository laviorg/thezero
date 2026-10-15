import catalog from "@/data/kabum-catalog.json";

export const AWIN_KABUM_MID = "17729";
export const AWIN_AFFID = "3116936";
export const AMAZON_TAG = "thezero04-20";

export const KABUM_DISCLOSURE =
  "Este conteúdo tem links de afiliado da KaBuM: se você comprar por eles, o The Zero pode receber uma comissão, sem custo extra pra você. O preço e o estoque mudam com data e CEP; confira na loja antes de fechar.";
export const AMAZON_DISCLOSURE =
  "Como participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas.";
export const STOCK_NOTICE = "Sujeito a disponibilidade de estoque.";
export const AFFILIATE_REL = "sponsored nofollow";

export type CatalogItem = {
  id: string;
  category: "gpu" | "ssd" | "console" | "notebook";
  short: string;
  use: string;
  name: string;
  kabumId: string;
  url: string;
};

export const kabumCatalog = catalog as CatalogItem[];

export function kabumAffiliateUrl(productUrl: string) {
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_KABUM_MID}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(productUrl)}`;
}

export function amazonAffiliateUrl(asin: string) {
  return `https://www.amazon.com.br/dp/${asin}?tag=${AMAZON_TAG}`;
}

export function catalogItem(id: string): CatalogItem {
  const item = kabumCatalog.find((entry) => entry.id === id);
  if (!item) throw new Error(`Item fora do catálogo KaBuM: ${id}`);
  return item;
}

export const CATEGORY_LABEL: Record<CatalogItem["category"], string> = {
  gpu: "Placa de vídeo",
  ssd: "SSD",
  console: "Console",
  notebook: "Notebook",
};
