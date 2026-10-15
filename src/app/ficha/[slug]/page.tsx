import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { FIELD_LABELS, fichaArticles, fichas, getFicha } from "@/lib/fichas";
import { buildPageMetadata } from "@/lib/metadata";
import { formatShortDate } from "@/lib/format";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;
export function generateStaticParams() {
  return fichas.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = getFicha((await params).slug);
  if (!f) return {};
  return buildPageMetadata({
    title: `${f.name}: ficha técnica e veredito`,
    description: `Chip, tela, bateria, sistema e veredito do ${f.name}, com a fonte de cada dado e as matérias do The Zero sobre ele.`,
    path: `/ficha/${f.slug}`,
  });
}

export default async function FichaPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = getFicha((await params).slug);
  if (!f) notFound();
  const articles = fichaArticles(f);
  const fields = Object.entries(f.fields) as [string, { value: string | null; source: string | null }][];
  const schema = {
    "@context": "https://schema.org",
    "@type": f.type,
    name: f.name,
    category: f.category,
    url: `https://www.thezero.com.br/ficha/${f.slug}`,
    additionalProperty: fields
      .filter(([, v]) => v.value)
      .map(([k, v]) => ({ "@type": "PropertyValue", name: FIELD_LABELS[k] ?? k, value: v.value })),
    subjectOf: articles.map((a) => ({ "@type": "NewsArticle", headline: a.title, url: `https://www.thezero.com.br${a.href}` })),
  };

  return (
    <PageShell width="narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: `Ficha: ${f.name}` }]} />
      <p className="eyebrow page-kicker">Ficha · {f.category}</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{f.name}</h1>
      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm tabular-nums">
          <tbody>
            {fields.map(([k, v]) => (
              <tr key={k} className="border-b border-border last:border-0">
                <th className="w-40 bg-surface px-4 py-2.5 font-mono text-[0.72rem] font-medium tracking-[0.06em] text-muted uppercase">{FIELD_LABELS[k] ?? k}</th>
                <td className="px-4 py-2.5">{v.value ?? "—"}{v.source ? <> · <Link href={v.source} className="text-[0.75rem] text-muted underline">fonte</Link></> : null}</td>
              </tr>
            ))}
            <tr>
              <th className="bg-surface px-4 py-2.5 font-mono text-[0.72rem] font-medium tracking-[0.06em] text-muted uppercase">Veredito</th>
              <td className="px-4 py-2.5 font-semibold">{f.veredito.value ?? "—"}{f.veredito.source ? <> · <Link href={f.veredito.source} className="text-[0.75rem] font-normal text-muted underline">review</Link></> : null}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="mt-10 font-display text-xl font-bold">Matérias sobre o {f.name}</h2>
      <ol className="mt-3 space-y-2">
        {articles.map((a) => (
          <li key={a.slug} className="text-sm">
            <time dateTime={a.dateIso} className="font-mono text-[0.72rem] text-muted tabular-nums">{formatShortDate(a.date)}</time>{" "}
            <Link href={a.href} className="font-medium hover:text-accent">{a.title}</Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
