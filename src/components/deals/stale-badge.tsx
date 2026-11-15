"use client";

import { useEffect, useState } from "react";

/** Marca o preço como desatualizado quando a última checagem boa passou de 48 h. */
export function StaleBadge({ checkedAt, hours = 48 }: { checkedAt?: string; hours?: number }) {
  // O HTML é estático: a idade só é calculada no navegador, depois da hidratação.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!checkedAt) return <span className="text-accent">sem checagem</span>;
  const stale = now !== null && now - new Date(checkedAt).getTime() > hours * 3600 * 1000;
  return stale ? <span className="ml-1 font-semibold text-accent">· desatualizado</span> : null;
}
