import { PageShell } from "@/components/layout/page-shell";
import type { ReactNode } from "react";

type LegalDocumentProps = {
  kicker: string;
  title: string;
  lede?: string;
  updated?: string;
  jsonLd?: ReactNode;
  children: ReactNode;
};

export function LegalDocument({
  kicker,
  title,
  lede,
  updated,
  jsonLd,
  children,
}: LegalDocumentProps) {
  return (
    <PageShell width="narrow">
      {jsonLd}
      <p className="eyebrow page-kicker">{kicker}</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{title}</h1>
      {lede ? <p className="lede mt-4">{lede}</p> : null}
      {updated ? (
        <p className="mt-3 text-sm text-muted">Atualizado em {updated}.</p>
      ) : null}
      <div className="legal-prose mt-10">{children}</div>
    </PageShell>
  );
}
