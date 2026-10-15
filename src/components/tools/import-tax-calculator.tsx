"use client";

import prices from "@/data/prices.json";
import { importTax, importTotal, type Uf } from "@/lib/import-tax";
import { useState } from "react";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const usd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
const pct = (v: number) => `${Math.round(v * 100)}%`;
const UFS = Object.keys(importTax.icms.rates).sort() as Uf[];
/** Só itens do rastreador com preço real na loja brasileira. */
const PORTABLES = ["steam-deck-oled", "switch-2"]
  .map((id) => (prices.items as Record<string, { id: string; name: string; price?: number; checkedAt?: string; url: string }>)[id])
  .filter((item) => item && typeof item.price === "number");

export function ImportTaxCalculator() {
  const [product, setProduct] = useState(399);
  const [freight, setFreight] = useState(30);
  const [uf, setUf] = useState<Uf>("SP");
  const [certified, setCertified] = useState(true);
  const [fx, setFx] = useState(importTax.fx.usdBrl);
  const [compare, setCompare] = useState("");
  const r = importTotal(product, freight, uf, certified, fx);
  const local = PORTABLES.find((p) => p!.id === compare);
  const field = "mt-1 w-full rounded border border-border bg-bg p-2 tabular-nums";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Preço do produto (US$)
          <input type="number" min={0} step="0.01" className={field} value={product} onChange={(e) => setProduct(Number(e.target.value) || 0)} />
        </label>
        <label className="text-sm">Frete + seguro (US$)
          <input type="number" min={0} step="0.01" className={field} value={freight} onChange={(e) => setFreight(Number(e.target.value) || 0)} />
        </label>
        <label className="text-sm">Seu estado
          <select className={field} value={uf} onChange={(e) => setUf(e.target.value as Uf)}>
            {UFS.map((u) => <option key={u} value={u}>{u} — ICMS {pct(importTax.icms.rates[u])}</option>)}
          </select>
        </label>
        <label className="text-sm">Dólar (R$)
          <input type="number" min={1} step="0.0001" className={field} value={fx} onChange={(e) => setFx(Number(e.target.value) || 0)} />
          <span className="mt-1 block text-xs text-muted">Padrão: {importTax.fx.label}.</span>
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={certified} onChange={(e) => setCertified(e.target.checked)} />
          Loja certificada no Remessa Conforme
        </label>
      </div>
      <div className="mt-6 rounded-lg border border-border p-4 font-mono text-sm tabular-nums">
        <p>Valor aduaneiro: {usd.format(r.customs)}</p>
        <p>Imposto de Importação: {usd.format(r.ii)}</p>
        <p>ICMS {uf} ({pct(r.rate)}, por dentro): {usd.format(r.icms)}</p>
        <p className="mt-2 text-base font-semibold">Total: {usd.format(r.totalUsd)} ≈ {brl.format(r.totalBrl)}</p>
      </div>
      {PORTABLES.length > 0 ? (
        <div className="mt-4 text-sm">
          <label>Comparar com o preço no Brasil (rastreador do The Zero)
            <select className={field} value={compare} onChange={(e) => setCompare(e.target.value)}>
              <option value="">Não comparar</option>
              {PORTABLES.map((p) => <option key={p!.id} value={p!.id}>{p!.name}</option>)}
            </select>
          </label>
          {local ? (
            <p className="mt-2">
              Na KaBuM: <strong className="tabular-nums">{brl.format(local.price!)}</strong>
              {local.checkedAt ? ` (checado em ${new Date(local.checkedAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })})` : ""}.{" "}
              {local.price! > r.totalBrl
                ? `Importar sai ${brl.format(local.price! - r.totalBrl)} mais barato, sem contar garantia nem prazo.`
                : `Comprar aqui sai ${brl.format(r.totalBrl - local.price!)} mais barato.`}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
