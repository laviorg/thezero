import fs from "node:fs";
import path from "node:path";

// Lido por fs (não import de JSON): o build da Cloudflare carrega posts.ts em Node puro.
function readPrices(): { items: Record<string, PriceItem> } {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "prices.json"), "utf8"));
  } catch {
    return { items: {} };
  }
}

// Mesmo deeplink de src/lib/affiliate.ts (Awin KaBuM).
function kabumAffiliateUrl(productUrl: string) {
  return `https://www.awin1.com/cread.php?awinmid=17729&awinaffid=3116936&ued=${encodeURIComponent(productUrl)}`;
}

export const VERDICT_DECISIONS = ["comprar", "esperar", "pular"] as const;
export type VerdictDecision = (typeof VERDICT_DECISIONS)[number];

export const VERDICT_LABEL: Record<VerdictDecision, string> = {
  comprar: "Comprar",
  esperar: "Esperar",
  pular: "Pular",
};

export const AFFILIATE_CARD_NOTICE =
  "Link de afiliado: podemos ganhar comissão, sem custo pra você e sem influência no veredito";

/** Frontmatter `veredito:` de reviews e páginas "Vale a pena?". */
export type VerdictCardData = {
  decisao: VerdictDecision;
  pros: string[];
  contras: string[];
  praQuem: string;
  /** id do item em src/data/prices.json. Sem id, o card sai sem preço. */
  precoId?: string;
};

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "").map((v) => v.trim())
    : [];
}

export function parseVerdictCard(value: unknown): VerdictCardData | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const decisao = typeof raw.decisao === "string" ? raw.decisao.toLowerCase() : "";
  if (!(VERDICT_DECISIONS as readonly string[]).includes(decisao)) return undefined;
  const praQuem = typeof raw.praQuem === "string" ? raw.praQuem.trim() : "";
  return {
    decisao: decisao as VerdictDecision,
    pros: strings(raw.pros).slice(0, 3),
    contras: strings(raw.contras).slice(0, 3),
    praQuem,
    precoId: typeof raw.precoId === "string" ? raw.precoId : undefined,
  };
}

type PriceItem = {
  id: string;
  price: number | null;
  checkedAt?: string;
  url?: string;
  source?: string;
  error?: string | null;
};

export type VerdictPrice = { amount: number; date: string; store: string; href?: string };

/**
 * Preço só vem do rastreador (src/data/prices.json), com a data da consulta.
 * Sem preço válido, o card não mostra preço. Nunca inventa.
 */
export function verdictPrice(precoId?: string): VerdictPrice | undefined {
  if (!precoId) return undefined;
  const items = readPrices().items;
  const item = items[precoId];
  if (!item || typeof item.price !== "number" || !item.checkedAt || item.error) return undefined;
  const isKabum = item.url?.includes("kabum.com.br") ?? false;
  return {
    amount: item.price,
    date: item.checkedAt,
    store: isKabum ? "KaBuM" : (item.source ?? "loja"),
    href: item.url ? (isKabum ? kabumAffiliateUrl(item.url) : item.url) : undefined,
  };
}
