import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type ToolMeta = {
  path: string;
  title: string;
  description: string;
  lede: string;
  cover: string;
  coverAlt: string;
  updatedIso: string;
};

export const TOOLS = [
  { href: "/ferramentas/meu-pc-roda", label: "Meu PC roda?", text: "Compara seu processador, placa e RAM com os requisitos oficiais de 11 jogos." },
  { href: "/ferramentas/calculadora-de-fonte", label: "Calculadora de fonte", text: "Quantos watts sua fonte precisa, com o consumo oficial de cada peça." },
  { href: "/ferramentas/montar-pc", label: "Montar PC por orçamento", text: "Três configurações conferidas na KaBuM, de entrada a avançada." },
];

export function ToolPage({ meta, children }: { meta: ToolMeta; children: ReactNode }) {
  return (
    <PageShell width="narrow">
      <GuidePageJsonLd
        path={meta.path}
        name={meta.title}
        description={meta.description}
        image={meta.cover}
        dateModified={meta.updatedIso}
        items={[]}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { href: "/ferramentas", label: "Ferramentas" }, { label: meta.title }]} />
      <p className="eyebrow page-kicker">Ferramenta</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{meta.title}</h1>
      <p className="lede mt-4">{meta.lede}</p>
      <Image src={meta.cover} alt={meta.coverAlt} width={1200} height={630} priority className="mt-8 h-auto w-full rounded-lg border border-border" />
      <div className="legal-prose mt-10">
        {children}
        <h2>Outras ferramentas</h2>
        <ul>
          {TOOLS.filter((t) => t.href !== meta.path).map((t) => (
            <li key={t.href}>
              <Link href={t.href}>{t.label}</Link>: {t.text}
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
