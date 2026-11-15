import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import data from "@/data/ai-api-prices.json";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Preços dos modelos de IA por 1 milhão de tokens";
const description = "Quanto custa cada modelo na API, em dólar e em reais, com janela de contexto, data de corte e a página oficial de onde saiu cada número.";
const path = "/guias/modelos-ia-precos";
const usd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const day = (iso: string) => iso.split("-").reverse().join("/");
const checked = data.models.map((m) => m.checked).sort().at(-1)!;

export const metadata: Metadata = buildPageMetadata({ title, description, path, imagePath: "/images/pages/modelos-ia-precos.png", imageAlt: title });

export default function Page() {
  return (
    <PageShell>
      <GuidePageJsonLd path={path} name={title} description={description} image="/images/pages/modelos-ia-precos.png" dateModified={`${checked}T20:00:00-03:00`} items={[]} />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Preços dos modelos de IA" }]} />
      <p className="eyebrow page-kicker">Guia vivo</p>
      <h1 className="page-title mt-2 font-extrabold text-balance">Preços dos modelos de IA</h1>
      <p className="lede mt-3">{description}</p>
      <p className="mt-2 font-mono text-[0.75rem] text-muted">Atualizado em {day(checked)} · dólar: {data.fx.label}</p>
      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[56rem] text-left text-sm tabular-nums">
          <thead className="bg-surface font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase">
            <tr>{["Modelo", "Entrada (texto)", "Entrada (áudio)", "Saída", "Saída em R$", "Contexto", "Data de corte", "Fonte"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.models.map((m) => (
              <tr key={m.id} className="border-t border-border even:bg-surface/60">
                <td className="px-3 py-2 font-mono">{m.provider} {m.id}</td>
                <td className="px-3 py-2 text-right">{usd.format(m.input.text)}</td>
                <td className="px-3 py-2 text-right">{usd.format(m.input.audio)}</td>
                <td className="px-3 py-2 text-right">{usd.format(m.output)}</td>
                <td className="px-3 py-2 text-right">{brl.format(m.output * data.fx.usdBrl)}</td>
                <td className="px-3 py-2 text-right">{m.context ? `${m.context.toLocaleString("pt-BR")} tokens` : "—"}</td>
                <td className="px-3 py-2">{m.cutoff ?? "—"}</td>
                <td className="px-3 py-2"><a href={m.source} className="underline">preços</a> · <a href={m.modelSource} className="underline">modelo</a> ({day(m.checked)})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted">
        {data.models.filter((m) => "note" in m && m.note).map((m) => <li key={m.id}><span className="font-mono">{m.id}</span>: {"note" in m ? m.note : ""}</li>)}
        <li>Preço padrão por 1 milhão de tokens, sem Batch nem cache de contexto. Data de corte em branco: a página oficial do modelo não informa.</li>
      </ul>
      <p className="mt-6 text-sm">Faça a conta da sua conversa na <Link href="/ferramentas/custo-api-ia" className="text-accent">calculadora de custo de API</Link>.</p>
    </PageShell>
  );
}
