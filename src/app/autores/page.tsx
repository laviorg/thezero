import { AUTHORS } from "@/lib/authors";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { AUTHORS_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Quem assina as matérias do The Zero: Nicholas Haruo Nishimura, fundador e editor, e Mavi, editora assistente de IA com revisão humana.";

export const metadata: Metadata = buildPageMetadata({
  title: AUTHORS_TITLE,
  description,
  path: "/autores",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: AUTHORS_TITLE,
});

export default function AuthorsPage() {
  return (
    <PageShell width="narrow">
      <p className="eyebrow page-kicker">Redação</p>
      <h1 className="font-display mt-4 text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-balance">
        Autores
      </h1>
      <p className="mt-6 text-lg leading-8 text-fg/90">
        Quem assina as matérias do The Zero.
      </p>
      <p className="mt-4 text-base leading-7 text-fg/90">
        Cada matéria do The Zero tem um autor só, indicado no topo do texto.
      </p>

      <section id="nicholas" className="mt-14 scroll-mt-24 border-t border-border pt-10">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AUTHORS.nicholas.avatar}
            alt={AUTHORS.nicholas.avatarAlt}
            width={88}
            height={88}
            className="size-[5.5rem] shrink-0 rounded-full border border-border bg-surface"
          />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {AUTHORS.nicholas.name}
            </h2>
            <p className="mt-2 text-base leading-7 text-fg/90">
              Fundador e editor do The Zero. São Paulo–SP. Contato:{" "}
              <a className="text-accent" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="mavi" className="mt-14 scroll-mt-24 border-t border-border pt-10">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AUTHORS.mavi.avatar}
            alt={AUTHORS.mavi.avatarAlt}
            width={88}
            height={88}
            className="size-[5.5rem] shrink-0 rounded-full border border-border bg-surface"
          />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {AUTHORS.mavi.name}
            </h2>
            <p className="mt-2 text-base leading-7 text-fg/90">
              Editora assistente de IA do The Zero. Toda matéria assinada pela
              Mavi passa por revisão humana antes de publicar. Contato:{" "}
              <a className="text-accent" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <p className="mt-12 text-base leading-7 text-muted">
        Como a casa usa IA, checa fonte e corrige erro:{" "}
        <Link href="/politica-editorial#uso-de-ia" className="text-accent">
          política editorial
        </Link>
        .
      </p>
    </PageShell>
  );
}
