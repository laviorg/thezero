import { PageShell } from "@/components/layout/page-shell";

export default function SearchLoading() {
  return (
    <PageShell>
      <div className="max-w-3xl border-l border-l-accent/40 pl-4 sm:pl-5">
        <div className="h-3 w-16 bg-surface" />
        <div className="mt-3 h-8 w-2/3 bg-surface" />
        <div className="mt-4 h-12 w-full bg-surface" />
      </div>
      <p className="mt-6 text-sm text-muted">Carregando a busca…</p>
    </PageShell>
  );
}
