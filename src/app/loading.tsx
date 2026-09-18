export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="h-3 w-40 bg-surface" />
      <div className="mt-6 h-16 w-full max-w-3xl bg-surface" />
      <div className="mt-4 h-16 w-2/3 bg-surface" />
      <p className="mt-10 text-sm text-muted">Carregando o newsroom…</p>
    </div>
  );
}
