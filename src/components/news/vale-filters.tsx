"use client";

import { useEffect, useState } from "react";

/** Filtros de /vale-a-pena. Os cards estão no HTML; aqui só alternamos `hidden`. */
export function ValeFilters({ categories }: { categories: string[] }) {
  const [cat, setCat] = useState("");
  const [verdict, setVerdict] = useState("");
  const [range, setRange] = useState("");
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const [min, max] = range ? range.split("-").map(Number) : [0, Infinity];
    let n = 0;
    document.querySelectorAll<HTMLElement>("[data-vale]").forEach((el) => {
      const price = el.dataset.price ? Number(el.dataset.price) : null;
      const ok =
        (!cat || el.dataset.cat === cat) &&
        (!verdict || el.dataset.verdict === verdict) &&
        (!range || (price !== null && price >= min && price < max));
      el.hidden = !ok;
      if (ok) n++;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- contagem depende do DOM
    setShown(n);
  }, [cat, verdict, range]);

  const field = "mt-1 rounded border border-border bg-bg p-2 text-sm";
  return (
    <div className="mt-6 flex flex-wrap items-end gap-4">
      <label className="text-sm">Editoria<br />
        <select className={field} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="text-sm">Veredito<br />
        <select className={field} value={verdict} onChange={(e) => setVerdict(e.target.value)}>
          <option value="">Todos</option>
          <option value="comprar">Comprar</option>
          <option value="esperar">Esperar</option>
          <option value="pular">Pular</option>
        </select>
      </label>
      <label className="text-sm">Preço (R$, rastreador)<br />
        <select className={field} value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="">Qualquer</option>
          <option value="0-2000">Até R$ 2.000</option>
          <option value="2000-4000">R$ 2.000 a 4.000</option>
          <option value="4000-100000">Acima de R$ 4.000</option>
        </select>
      </label>
      {shown !== null ? <p className="pb-2 font-mono text-[0.72rem] text-muted tabular-nums">{shown} resultado(s)</p> : null}
    </div>
  );
}
