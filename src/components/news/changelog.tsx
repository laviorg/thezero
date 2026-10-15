const day = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" }).format(new Date(iso));

/** Histórico recolhível. Só entradas reais: changelog do frontmatter ou publicação/atualização. */
export function Changelog({ entries }: { entries: { date: string; note: string }[] }) {
  if (entries.length < 2) return null;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <details className="my-6 rounded-md border border-border bg-surface px-4 py-2 text-sm">
      <summary className="cursor-pointer font-mono text-[0.75rem] tracking-[0.04em] tabular-nums">
        Histórico da matéria ({sorted.length}) · atualizada em {day(sorted[0].date)}
      </summary>
      <ol className="mt-2 space-y-1 font-mono text-[0.75rem] tabular-nums">
        {sorted.map((e) => (
          <li key={`${e.date}-${e.note}`}><time dateTime={e.date}>{day(e.date)}</time> · <span className="font-sans">{e.note}</span></li>
        ))}
      </ol>
    </details>
  );
}
