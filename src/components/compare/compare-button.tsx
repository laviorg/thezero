"use client";

import { MAX_COMPARE, readCompare, writeCompare } from "@/lib/compare-store";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CompareTray = dynamic(() => import("@/components/compare/compare-tray"), { ssr: false });

/** [+ Comparar] nos cards de portáteis. A gaveta só carrega com 1+ item. */
export function CompareButton({ id }: { id: string }) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setList(readCompare());
    sync();
    window.addEventListener("tz-compare", sync);
    return () => window.removeEventListener("tz-compare", sync);
  }, []);
  const on = list.includes(id);
  const full = !on && list.length >= MAX_COMPARE;
  return (
    <button
      type="button"
      disabled={full}
      aria-pressed={on}
      onClick={() => writeCompare(on ? list.filter((x) => x !== id) : [...list, id])}
      className="mt-2 rounded border border-border px-2 py-1 font-mono text-[0.68rem] tracking-[0.04em] text-muted hover:border-accent hover:text-accent disabled:opacity-40"
    >
      {on ? "✓ Comparando" : full ? "Máx. 3" : "+ Comparar"}
    </button>
  );
}

/** Montado uma vez no layout: abre a gaveta quando há seleção. */
export function CompareHost() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(readCompare().length);
    sync();
    window.addEventListener("tz-compare", sync);
    return () => window.removeEventListener("tz-compare", sync);
  }, []);
  return n > 0 ? <CompareTray /> : null;
}
