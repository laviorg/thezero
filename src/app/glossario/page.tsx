import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import glossary from "@/data/glossary.json";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Glossário de tecnologia: termos de PC, celular, console e IA";
const description = "Mais de 100 termos de hardware, games e IA explicados em poucas frases, com link para o guia do The Zero que aprofunda cada um.";
const image = "/images/pages/glossario.png";

type Term = { id: string; term: string; definition: string; guide: string };
const terms = glossary as Term[];
const letter = (t: Term) => (/[a-z]/.test(t.id[0]) ? t.id[0].toUpperCase() : "#");
const letters = Array.from(new Set(terms.map(letter)));

export const metadata: Metadata = buildPageMetadata({ title, description, path: "/glossario", imagePath: image, imageAlt: title });

export default function GlossaryPage() {
  const url = `${site.url}/glossario`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: site.language, primaryImageOfPage: `${site.url}${image}` },
      {
        "@type": "DefinedTermSet",
        "@id": `${url}#termos`,
        name: "Glossário The Zero",
        url,
        inLanguage: site.language,
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${url}#${t.id}`,
          name: t.term,
          description: t.definition,
          url: `${url}#${t.id}`,
          inDefinedTermSet: `${url}#termos`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Newsroom", item: site.url },
          { "@type": "ListItem", position: 2, name: "Glossário", item: url },
        ],
      },
    ],
  };
  return (
    <PageShell width="narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Glossário" }]} />
      <h1 className="page-title mt-3 font-extrabold text-balance">{title}</h1>
      <p className="lede mt-4">{description}</p>
      <nav aria-label="Letras" className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
        {letters.map((l) => (
          <a key={l} href={`#letra-${l}`}>{l}</a>
        ))}
      </nav>
      <div className="legal-prose mt-8">
        {letters.map((l) => (
          <section key={l} id={`letra-${l}`}>
            <h2>{l}</h2>
            <div>
              {terms.filter((t) => letter(t) === l).map((t) => (
                <div key={t.id} id={t.id} className="mb-6 scroll-mt-24">
                  <h3><a href={`#${t.id}`}>{t.term}</a></h3>
                  <p>
                    {t.definition} <Link href={`/noticia/${t.guide}`}>Leia o guia</Link>.
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-8">Para testar uma configuração, use as <Link href="/ferramentas">ferramentas</Link>.</p>
    </PageShell>
  );
}
