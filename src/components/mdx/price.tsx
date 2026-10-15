"use client";

import fx from "@/data/fx.json";
import { importTotal } from "@/lib/import-tax";
import { useEffect, useRef, useState } from "react";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const usdFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
const day = (iso: string) => iso.split("-").reverse().join("/");

/**
 * <Price usd={399} tipo="hardware" /> ou tipo="digital".
 * Hover no desktop, toque no celular. O popover só monta quando abre.
 */
export function Price({ usd, tipo = "hardware" }: { usd: number | string; tipo?: "hardware" | "digital" }) {
  const value = Number(usd);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!Number.isFinite(value)) return <span>—</span>;
  const converted = value * fx.usdBrl;

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-b border-dotted border-current font-mono tabular-nums"
      >
        {usdFmt.format(value)}
      </button>
      {open ? (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-30 mb-2 block w-72 max-w-[80vw] rounded-md border border-border bg-surface-raised p-3 text-left font-mono text-[0.75rem] leading-5 text-fg shadow-lg tabular-nums"
        >
          <span className="block">
            {usdFmt.format(value)} × R$ {fx.usdBrl.toFixed(4).replace(".", ",")} = {brl.format(converted)}
          </span>
          <span className="block text-muted">{fx.label} de {day(fx.date)}</span>
          {tipo === "digital" ? (
            <span className="mt-2 block">
              + IOF {fx.iof.cartao * 100}% no cartão = <strong>{brl.format(converted * (1 + fx.iof.cartao))}</strong>
              <span className="block text-muted">Fórmula: dólar × câmbio × 1,035. Fonte: {fx.iof.label}.</span>
            </span>
          ) : (
            <span className="mt-2 block">
              Importado com taxas: <strong>{brl.format(importTotal(value, 0, "SP", true, fx.usdBrl).totalBrl)}</strong> (ICMS 17%) a{" "}
              <strong>{brl.format(importTotal(value, 0, "BA", true, fx.usdBrl).totalBrl)}</strong> (ICMS 20%)
              <span className="block text-muted">Fórmula: II 60% − US$ 30 (Remessa Conforme) + ICMS por dentro, sem frete.</span>
            </span>
          )}
          <span className="mt-1 block font-sans text-[0.7rem] text-muted">Estimativa, não preço de loja.</span>
        </span>
      ) : null}
    </span>
  );
}
