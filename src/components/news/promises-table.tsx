"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type PromiseRow = { empresa: string; promessa: string; data: string; status: string; href: string; title: string; date: string };
export const STATUS: Record<string, string> = { ficha: "🟢 Na ficha", corte: "🟡 Com corte", adiado: "🔴 Adiado", papel: "🔴 No papel" };

export function PromisesTable({ rows }: { rows: PromiseRow[] }) {
  const [empresa, setEmpresa] = useState("");
  const [status, setStatus] = useState("");
  const empresas = useMemo(() => [...new Set(rows.map((r) => r.empresa))].sort(), [rows]);
  const shown = rows.filter((r) => (!empresa || r.empresa === empresa) && (!status || r.status === status));
  const field = "mt-1 rounded border border-border bg-bg p-2 text-sm";
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">Empresa<br />
          <select className={field} value={empresa} onChange={(e) => setEmpresa(e.target.value)}>
            <option value="">Todas</option>
            {empresas.map((e) => <option key={e}>{e}</option>)}
          </select>
        </label>
        <label className="text-sm">Status<br />
          <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-surface font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase">
            <tr><th className="px-3 py-2">Empresa</th><th className="px-3 py-2">Prometido</th><th className="px-3 py-2">Data esperada</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Matéria</th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={`${r.href}-${r.promessa}`} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{r.empresa}</td>
                <td className="px-3 py-2">{r.promessa}</td>
                <td className="px-3 py-2 tabular-nums">{r.data || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{STATUS[r.status]}</td>
                <td className="px-3 py-2"><Link href={r.href} className="underline">{r.title}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
