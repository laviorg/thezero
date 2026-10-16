"use client";

import { useEffect, useState } from "react";

const LEGACY_KEY = "tz-reading-mode";

/**
 * [Texto completo · Só os números]: esconde parágrafos narrativos por classe; tudo fica no DOM.
 * Padrão SEMPRE "Texto completo": o modo não é persistido. Só vale nesta página, após clique.
 */
export function ReadingMode() {
  const [numbers, setNumbers] = useState(false);

  useEffect(() => {
    // Preferência antiga persistida escondia parágrafos em toda matéria: descarta.
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (numbers) root.setAttribute("data-so-numeros", "on");
    else root.removeAttribute("data-so-numeros");
    return () => root.removeAttribute("data-so-numeros");
  }, [numbers]);

  const btn = (active: boolean) =>
    `px-3 py-1.5 transition-colors ${active ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`;

  return (
    <div role="group" aria-label="Modo de leitura" className="mb-6 inline-flex overflow-hidden rounded-md border border-border font-mono text-[0.72rem] tracking-[0.04em]">
      <button type="button" aria-pressed={!numbers} className={btn(!numbers)} onClick={() => setNumbers(false)}>Texto completo</button>
      <button type="button" aria-pressed={numbers} className={btn(numbers)} onClick={() => setNumbers(true)}>Só os números</button>
    </div>
  );
}
