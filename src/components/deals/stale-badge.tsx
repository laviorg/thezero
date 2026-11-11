"use client";

import { useState } from "react";

/** Marca o preço como desatualizado quando a última checagem boa passou de 48 h. */
export function StaleBadge({ checkedAt, hours = 48 }: { checkedAt?: string; hours?: number }) {
  const [stale] = useState(
    () => !!checkedAt && Date.now() - new Date(checkedAt).getTime() > hours * 3600 * 1000,
  );
  if (!checkedAt) return <span className="text-accent">sem checagem</span>;
  return stale ? <span className="ml-1 font-semibold text-accent">· desatualizado</span> : null;
}
