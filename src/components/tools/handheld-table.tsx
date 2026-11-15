"use client";

import data from "@/data/handhelds.json";
import Link from "next/link";
import { useState } from "react";

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

export function HandheldTable() {
  const [sistema, setSistema] = useState("");
  const [veredito, setVeredito] = useState("");
  const [sort, setSort] = useState<"nome" | "wh">("nome");
  const sistemas = [...new Set(data.items.map((i) => i.sistema).filter(Boolean))].sort();
  const rows = data.items
    .filter((i) => (!sistema || i.sistema === sistema) && (!veredito || i.veredito === veredito))
    .sort((a, b) => (sort === "wh" ? (b.wh ?? 0) - (a.wh ?? 0) : a.name.localeCompare(b.name)));
  const field = "mt-1 rounded border border-border bg-bg p-2 text-sm";
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">Sistema<br />
          <select className={field} value={sistema} onChange={(e) => setSistema(e.target.value)}>
            <option value="">Todos</option>
            {sistemas.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm">Veredito<br />
          <select className={field} value={veredito} onChange={(e) => setVeredito(e.target.value)}>
            <option value="">Todos</option>
            {["Comprar", "Esperar", "Pular"].map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="text-sm">Ordenar<br />
          <select className={field} value={sort} onChange={(e) => setSort(e.target.value as "nome" | "wh")}>
            <option value="nome">Nome</option>
            <option value="wh">Maior bateria</option>
          </select>
        </label>
      </div>
      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[52rem] text-left text-sm tabular-nums">
          <thead className="bg-surface font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase">
            <tr>{["Portátil", "Sistema", "Chip", "Tela", "Bateria", "Preço BR / importação", "Veredito"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.name} className="border-t border-border even:bg-surface/60">
                <td className="px-3 py-2 font-medium"><Link href={i.article} className="hover:text-accent">{i.name}</Link></td>
                <td className="px-3 py-2">{dash(i.sistema)}</td>
                <td className="px-3 py-2">{dash(i.chip)}</td>
                <td className="px-3 py-2">{dash(i.tela)}</td>
                <td className="px-3 py-2 font-mono">{i.wh ? `${String(i.wh).replace(".", ",")} Wh` : "—"}</td>
                <td className="px-3 py-2">{dash(i.preco)}</td>
                <td className="px-3 py-2 font-semibold">{dash(i.veredito)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
