import type { ReactNode } from "react";

export function RespostaCurta({ children }: { children: ReactNode }) {
  return (
    <aside className="resposta-curta my-8 min-w-0 border-l-[5px] border-accent bg-accent-soft px-5 py-5">
      <p className="eyebrow page-kicker">Resposta curta</p>
      <div className="mt-2.5 text-[1.05rem] leading-7 text-fg">{children}</div>
    </aside>
  );
}
