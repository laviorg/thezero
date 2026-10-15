"use client";

import data from "@/data/fichas.json";
import Link from "next/link";
import { useState, type ReactNode } from "react";

const dash = (v: string | null | undefined) => v || "—";

/** <Ficha slug="legion-go-s">Legion Go S</Ficha>: link pontilhado + cartão no hover. */
export function FichaLink({ slug, children }: { slug: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const f = data.items.find((i) => i.slug === slug);
  if (!f) return <>{children}</>;
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      <Link href={`/ficha/${f.slug}`} className="border-b border-dotted border-current no-underline">
        {children ?? f.name}
      </Link>
      {open ? (
        <span role="tooltip" className="absolute bottom-full left-0 z-30 mb-2 block w-64 rounded-md border border-border bg-surface-raised p-3 text-left text-[0.8rem] leading-5 shadow-lg">
          <span className="block font-display font-bold">{f.name}</span>
          <span className="mt-1 block font-mono text-[0.72rem] tabular-nums">
            <span className="block">Chip: {dash(f.fields.chip.value)}</span>
            <span className="block">Preço médio: {dash(f.fields.precoMedio.value)}</span>
            <span className="block">No Brasil: {dash(f.fields.situacaoBrasil.value)}</span>
            <span className="block">Veredito: {dash(f.veredito.value)}</span>
          </span>
        </span>
      ) : null}
    </span>
  );
}
