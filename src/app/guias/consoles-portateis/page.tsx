import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { HandheldTable } from "@/components/tools/handheld-table";
import data from "@/data/handhelds.json";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Consoles portáteis: tabela com sistema, chip, tela, bateria e preço";
const description = "Steam Deck, ROG Ally, Legion Go, MSI Claw, Ayaneo, GPD e Switch 2 lado a lado, com os dados das matérias do The Zero e o veredito de cada review.";
const path = "/guias/consoles-portateis";
const updated = `${data.updated}T20:00:00-03:00`;

export const metadata: Metadata = buildPageMetadata({ title, description, path, imagePath: "/images/pages/consoles-portateis.png", imageAlt: title });

export default function Page() {
  return (
    <PageShell>
      <GuidePageJsonLd path={path} name={title} description={description} image="/images/pages/consoles-portateis.png" dateModified={updated} items={data.items.map((i) => ({ name: i.name, url: `https://www.thezero.com.br${i.article}` }))} />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Consoles portáteis" }]} />
      <p className="eyebrow page-kicker">Guia vivo</p>
      <h1 className="page-title mt-2 font-extrabold text-balance">Consoles portáteis</h1>
      <p className="lede mt-3">{description}</p>
      <p className="mt-2 font-mono text-[0.75rem] text-muted">Atualizado em {data.updated.split("-").reverse().join("/")} · — = a matéria não traz o dado</p>
      <div className="mt-8"><HandheldTable /></div>
      <p className="mt-6 text-sm text-muted">
        Quanto dura a bateria no seu uso: <Link href="/ferramentas/bateria-portateis" className="text-accent">calculadora de bateria</Link>. Quanto sai importar: <Link href="/ferramentas/imposto-portateis" className="text-accent">calculadora de imposto</Link>.
      </p>
    </PageShell>
  );
}
