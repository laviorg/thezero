"use client";

import { useEffect, useState } from "react";

const KEY = "tz-reading-mode";

/** [Texto completo · Só os números]: esconde parágrafos narrativos por classe; tudo fica no DOM. */
export function ReadingMode() {
  const [numbers, setNumbers] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preferência só existe no cliente
    setNumbers(localStorage.getItem(KEY) === "numeros");
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-so-numeros", numbers);
  }, [numbers]);

  const pick = (value: boolean) => {
    setNumbers(value);
    localStorage.setItem(KEY, value ? "numeros" : "texto");
  };
  const btn = (active: boolean) =>
    `px-3 py-1.5 transition-colors ${active ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`;

  return (
    <div role="group" aria-label="Modo de leitura" className="mb-6 inline-flex overflow-hidden rounded-md border border-border font-mono text-[0.72rem] tracking-[0.04em]">
      <button type="button" aria-pressed={!numbers} className={btn(!numbers)} onClick={() => pick(false)}>Texto completo</button>
      <button type="button" aria-pressed={numbers} className={btn(numbers)} onClick={() => pick(true)}>Só os números</button>
    </div>
  );
}
