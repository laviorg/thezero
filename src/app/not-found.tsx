import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { NOT_FOUND_CORE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: NOT_FOUND_CORE,
  description: "Essa URL não existe no newsroom do The Zero.",
  path: "/404",
  brand: "always",
  noIndex: true,
  omitCanonical: true,
});

export default function NotFound() {
  return (
    <PageShell width="narrow">
      <p className="eyebrow text-alert">
        404
      </p>
      <h1 className="page-title mt-3 font-extrabold text-balance">
        Isso aqui é zero. A matéria não existe.
      </h1>
      <p className="lede mt-4 max-w-xl">
        Link morto, slug errado ou hype que a gente recusou publicar.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Voltar ao newsroom
        </Link>
        <span className="mx-3 text-hairline">/</span>
        <Link href="/busca" className="text-muted hover:text-fg">
          Buscar
        </Link>
        <span className="mx-3 text-hairline">/</span>
        <Link href="/contato" className="text-muted hover:text-fg">
          Contato
        </Link>
        <span className="mx-3 text-hairline">/</span>
        <a href={site.social.instagram} className="text-muted hover:text-fg">
          Instagram
        </a>
      </p>
    </PageShell>
  );
}
