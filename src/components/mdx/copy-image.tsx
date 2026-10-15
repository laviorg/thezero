"use client";

import { useState } from "react";

/**
 * [Copiar imagem]: PNG 2x do bloco (html-to-image carregado só no clique),
 * com rodapé thezero.com.br. Clipboard quando dá; senão, download.
 */
export function CopyImageButton({ name }: { name: string }) {
  const [state, setState] = useState<"idle" | "busy" | "copied" | "saved">("idle");

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const block = e.currentTarget.closest<HTMLElement>("[data-copiavel]");
    if (!block) return;
    setState("busy");
    block.setAttribute("data-capturando", "");
    try {
      const { toBlob } = await import("html-to-image");
      const bg = getComputedStyle(document.body).backgroundColor;
      const blob = await toBlob(block, {
        pixelRatio: 2,
        backgroundColor: bg,
        filter: (node) => !(node instanceof HTMLElement && node.dataset.naoCopiar !== undefined),
      });
      if (!blob) throw new Error("sem imagem");
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setState("copied");
      } catch {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `thezero-${name}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
        setState("saved");
      }
    } catch {
      setState("idle");
    } finally {
      block.removeAttribute("data-capturando");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      type="button"
      data-nao-copiar=""
      onClick={copy}
      disabled={state === "busy"}
      className="absolute top-2 right-2 rounded border border-border bg-surface px-2 py-0.5 font-mono text-[0.65rem] text-muted opacity-70 transition hover:text-fg hover:opacity-100"
    >
      {state === "busy" ? "Gerando…" : state === "copied" ? "Copiada ✓" : state === "saved" ? "Baixada ✓" : "Copiar imagem"}
    </button>
  );
}

/** Rodapé que só aparece na imagem copiada. */
export function CopyFooter() {
  return (
    <p className="copy-footer mt-3 hidden font-mono text-[0.7rem] tracking-[0.08em] text-muted">thezero.com.br</p>
  );
}
