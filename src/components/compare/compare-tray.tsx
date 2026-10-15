"use client";

import data from "@/data/handhelds.json";
import { readCompare, writeCompare } from "@/lib/compare-store";
import Link from "next/link";
import { useEffect, useState } from "react";

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));
const hours = (wh: number | null) => {
  if (!wh) return "—";
  const h = wh / 15;
  return `${Math.floor(h)} h ${String(Math.round((h % 1) * 60)).padStart(2, "0")} min`;
};

export default function CompareTray() {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () => setIds(readCompare());
    sync();
    window.addEventListener("tz-compare", sync);
    return () => window.removeEventListener("tz-compare", sync);
  }, []);
  const items = ids.map((id) => data.items.find((i) => i.article === id)).filter((i): i is (typeof data.items)[number] => Boolean(i));
  if (items.length === 0) return null;
  const rows: [string, (i: (typeof data.items)[number]) => string][] = [
    ["Tela", (i) => dash(i.tela)],
    ["Bateria real", (i) => (i.wh ? `${String(i.wh).replace(".", ",")} Wh · ${hours(i.wh)} a 15 W` : "—")],
    ["Custo no Brasil", (i) => dash(i.preco)],
    ["Importado com taxas", () => "—"],
    ["Garantia / suporte", () => "—"],
    ["Veredito", (i) => dash(i.veredito)],
  ];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-raised shadow-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="font-mono text-[0.75rem] font-semibold">
          Comparar ({items.length}/3) {open ? "▾" : "▴"}
        </button>
        <button type="button" onClick={() => writeCompare([])} className="font-mono text-[0.7rem] text-muted hover:text-fg">Limpar</button>
      </div>
      {open ? (
        <div className="mx-auto max-h-[60vh] max-w-6xl overflow-auto px-4 pb-4">
          <table className="w-full min-w-[36rem] text-left text-sm tabular-nums">
            <thead>
              <tr>
                <th className="w-40" />
                {items.map((i) => (
                  <th key={i.article} className="px-3 py-2 align-bottom font-display">
                    <Link href={i.article} className="hover:text-accent">{i.name}</Link>
                    <button type="button" aria-label={`Remover ${i.name}`} onClick={() => writeCompare(ids.filter((x) => x !== i.article))} className="ml-2 text-muted">×</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label} className="border-t border-border">
                  <th className="py-2 pr-3 font-mono text-[0.7rem] font-medium tracking-[0.06em] text-muted uppercase">{label}</th>
                  {items.map((i) => <td key={i.article} className="px-3 py-2">{get(i)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted">Dados das matérias do The Zero. Duração a 15 W é teórica (Wh ÷ 15). — = sem dado publicado.</p>
        </div>
      ) : null}
    </div>
  );
}
