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
  /** Perguntas frequentes: aparecem na página e viram FAQPage. */
  faq?: { q: string; a: string }[];
};

export const TOOLS = [
  { href: "/ferramentas/meu-pc-roda", label: "Meu PC roda?", text: "Compara seu processador, placa e RAM com os requisitos oficiais de 11 jogos." },
  { href: "/ferramentas/calculadora-de-fonte", label: "Calculadora de fonte", text: "Quantos watts sua fonte precisa, com o consumo oficial de cada peça." },
  { href: "/ferramentas/montar-pc", label: "Montar PC por orçamento", text: "Três configurações conferidas na KaBuM, de entrada a avançada." },
  { href: "/ferramentas/imposto-portateis", label: "Imposto de importação de portáteis", text: "II do Remessa Conforme e ICMS do seu estado, com a fonte oficial de cada alíquota." },
  { href: "/ferramentas/bateria-portateis", label: "Bateria de portáteis", text: "Quanto dura a bateria: Wh oficial dividido pelo consumo que você escolher." },
  { href: "/ferramentas/custo-api-ia", label: "Custo de API de IA", text: "Tokens de texto, áudio e vídeo, histórico reenviado a cada turno, em US$ e R$." },
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
        faq={meta.faq}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: meta.title,
            description: meta.description,
            url: `https://www.thezero.com.br${meta.path}`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Qualquer navegador",
            inLanguage: "pt-BR",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
            dateModified: meta.updatedIso,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { href: "/ferramentas", label: "Ferramentas" }, { label: meta.title }]} />
      <p className="eyebrow page-kicker">Ferramenta</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{meta.title}</h1>
      <p className="lede mt-4">{meta.lede}</p>
      <Image src={meta.cover} alt={meta.coverAlt} width={1200} height={630} priority className="mt-8 h-auto w-full rounded-lg border border-border" />
      <div className="legal-prose mt-10">
        {children}
        {meta.faq?.length ? (
          <>
            <h2>Perguntas frequentes</h2>
            {meta.faq.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </>
        ) : null}
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
