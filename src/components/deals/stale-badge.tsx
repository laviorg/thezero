"use client";

import { useEffect, useState } from "react";

/** Marca o preço como desatualizado quando a última checagem boa passou de 48 h. */
export function StaleBadge({ checkedAt, hours = 48 }: { checkedAt?: string; hours?: number }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    if (!checkedAt) return;
    const age = Date.now() - new Date(checkedAt).getTime();
    setStale(age > hours * 3600 * 1000);
  }, [checkedAt, hours]);
  if (!checkedAt) return <span className="text-accent">sem checagem</span>;
  return stale ? <span className="ml-1 font-semibold text-accent">· desatualizado</span> : null;
}
