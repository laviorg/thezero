import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { TOOLS } from "@/components/tools/tool-page";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Ferramentas pra montar e atualizar o PC";
const description = "Meu PC roda?, calculadora de fonte, montagem de PC, imposto e bateria de portáteis e custo de API de IA: ferramentas grátis do The Zero com a fonte de cada número.";

export const metadata: Metadata = buildPageMetadata({ title, description, path: "/ferramentas", imagePath: "/images/pages/meu-pc-roda.png", imageAlt: title });

export default function ToolsHub() {
  return (
    <PageShell width="narrow">
      <GuidePageJsonLd path="/ferramentas" name={title} description={description} image="/images/pages/meu-pc-roda.png" dateModified="2026-10-15T20:00:00-03:00" items={TOOLS.map((t) => ({ name: t.label, url: `https://www.thezero.com.br${t.href}` }))} />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Ferramentas" }]} />
      <h1 className="page-title mt-3 font-extrabold text-balance">{title}</h1>
      <p className="lede mt-4">{description}</p>
      <ul className="legal-prose mt-8">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href}>{t.label}</Link>: {t.text}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
