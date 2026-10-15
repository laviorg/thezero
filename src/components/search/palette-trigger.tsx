"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const CommandPalette = dynamic(() => import("@/components/search/command-palette"), { ssr: false });

/** Lupa + atalho Ctrl/Cmd+K. A paleta e o índice só carregam quando abrem. */
export function PaletteTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar matérias (Ctrl+K)"
        title="Buscar (Ctrl+K)"
        className={`inline-flex size-9 items-center justify-center rounded-md text-fg hover:bg-surface-raised ${className ?? ""}`}
      >
        <Search className="size-4" />
      </button>
      {open ? <CommandPalette onClose={close} /> : null}
    </>
  );
}
