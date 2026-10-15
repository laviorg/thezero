import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { PromisesTable, type PromiseRow } from "@/components/news/promises-table";
import { buildPageMetadata } from "@/lib/metadata";
import { getIndexablePosts } from "@/lib/posts";
import type { Metadata } from "next";

const title = "Promessas de tecnologia: o que foi anunciado e o que chegou";
const description = "Datas e recursos prometidos em anúncios de empresas de tecnologia, com o status de cada um: na ficha, com corte, adiado ou ainda no papel.";

export const metadata: Metadata = buildPageMetadata({ title, description, path: "/promessas" });

export default function PromessasPage() {
  const rows: PromiseRow[] = getIndexablePosts().flatMap((p) =>
    (p.promessas ?? []).map((pr) => ({ ...pr, href: p.href, title: p.title, date: p.dateIso })),
  );
  return (
    <PageShell>
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Promessas" }]} />
      <p className="eyebrow page-kicker">Placar</p>
      <h1 className="page-title mt-2 font-extrabold text-balance">Promessas</h1>
      <p className="lede mt-3">{description} Só entra o que a matéria registra.</p>
      <div className="mt-8"><PromisesTable rows={rows} /></div>
    </PageShell>
  );
}
