import Link from "next/link";

export function RelatedTools({ links }: { links: { href: string; label: string }[] }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label="Ferramentas e guias relacionados" className="mt-8 rounded-md border border-border bg-surface px-5 py-4">
      <p className="font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-accent">FICHAS E FERRAMENTAS</p>
      <ul className="mt-2 space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium hover:text-accent">{l.label} →</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
