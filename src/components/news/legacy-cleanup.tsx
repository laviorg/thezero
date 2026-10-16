"use client";

import { useEffect } from "react";

/** Modo "Só os números" foi removido. Só limpa resquícios antigos (localStorage e atributo). */
export function LegacyReadingCleanup() {
  useEffect(() => {
    try {
      localStorage.removeItem("tz-reading-mode");
    } catch {}
    document.documentElement.removeAttribute("data-so-numeros");
  }, []);
  return null;
}
