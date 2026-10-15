"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { t: string; h: string; c: string; s: string[]; v: string | null };
const VERDICTS: Record<string, string> = { comprar: "Comprar", esperar: "Esperar", pular: "Pular" };
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Carregado só quando o leitor abre a paleta (Ctrl/Cmd+K ou lupa). */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [verdict, setVerdict] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    fetch("/search-index.json").then((r) => r.json()).then((d) => setIndex(d.posts)).catch(() => setIndex([]));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const tags = useMemo(() => [...new Set((index ?? []).flatMap((e) => e.s))].sort(), [index]);
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return (index ?? [])
      .filter((e) => (!tag || e.s.includes(tag)) && (!verdict || e.v === verdict))
      .filter((e) => words.every((w) => norm(`${e.t} ${e.c} ${e.s.join(" ")}`).includes(w)))
      .slice(0, 12);
  }, [index, q, tag, verdict]);

  const go = (href: string) => { window.location.href = href; };
  const chip = (on: boolean) => `rounded border px-2 py-0.5 ${on ? "border-accent text-accent" : "border-border text-muted hover:text-fg"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Buscar no The Zero" className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface-raised shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          ref={input}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter" && results[active]) go(results[active].h);
          }}
          placeholder="Buscar matéria, chip, OLED, TDP, API…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-base outline-none"
        />
        <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2 font-mono text-[0.7rem]">
          {Object.entries(VERDICTS).map(([k, label]) => (
            <button key={k} type="button" className={chip(verdict === k)} onClick={() => setVerdict(verdict === k ? "" : k)}>{label}</button>
          ))}
          {tags.map((t) => (
            <button key={t} type="button" className={chip(tag === t)} onClick={() => setTag(tag === t ? "" : t)}>{t}</button>
          ))}
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-1">
          {index === null ? <li className="px-4 py-3 text-sm text-muted">Carregando…</li> : null}
          {index && results.length === 0 ? <li className="px-4 py-3 text-sm text-muted">Nada encontrado.</li> : null}
          {results.map((e, i) => (
            <li key={e.h}>
              <a href={e.h} className={`block px-4 py-2 ${i === active ? "bg-accent-soft" : ""}`} onMouseEnter={() => setActive(i)}>
                <span className="block text-sm font-medium text-fg">{e.t}</span>
                <span className="font-mono text-[0.68rem] text-muted">{e.c}{e.v ? ` · ${VERDICTS[e.v] ?? e.v}` : ""}{e.s.length ? ` · ${e.s.join(" · ")}` : ""}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-4 py-2 font-mono text-[0.65rem] text-muted">↑↓ navegar · Enter abrir · Esc fechar · <Link href="/busca" className="underline">busca completa</Link></p>
      </div>
    </div>
  );
}
