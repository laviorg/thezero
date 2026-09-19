import { PageShell } from "@/components/layout/page-shell";

export default function Loading() {
  return (
    <PageShell>
      <div className="flex justify-between border-b border-border pb-4">
        <div className="h-3 w-28 bg-surface" />
        <div className="h-3 w-36 bg-surface" />
      </div>
      <div className="grid gap-8 py-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="aspect-video w-full bg-surface" />
          <div className="mt-4 h-8 w-5/6 bg-surface" />
          <div className="mt-3 h-8 w-2/3 bg-surface" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-16 bg-surface" />
          <div className="h-16 bg-surface" />
          <div className="h-16 bg-surface" />
        </div>
      </div>
      <p className="text-sm text-muted">Carregando o newsroom…</p>
    </PageShell>
  );
}
