import { PageShell } from "@/components/layout/page-shell";
import { Wordmark } from "@/components/brand/logo";
import {
  AboutPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/news/json-ld";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";
import { absoluteUrl, site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

const aboutDescription =
  "The Zero é o canal de tech que mostra o que funciona de verdade — demo na tela, opinião sem filtro, zero hype de lançamento.";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre",
  description: aboutDescription,
  path: "/sobre",
  imagePath: "/opengraph-image",
  imageAlt: `${site.name} — ${site.tagline}`,
});

export default function AboutPage() {
  return (
    <PageShell width="narrow">
      <AboutPageJsonLd description={aboutDescription} />
      <BreadcrumbJsonLd
        items={[
          { name: site.name, url: site.url },
          { name: "Sobre", url: absoluteUrl("/sobre") },
        ]}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Newsroom" },
          { label: "Sobre" },
        ]}
      />
      <Wordmark className="mb-6 h-11 w-auto text-fg sm:h-14" />
      <p className="eyebrow page-kicker">
        Sobre · {site.tagline}
      </p>
      <h1 className="page-title mt-3 font-semibold text-balance">
        Se não dá pra testar, medir ou discordar em 40 segundos, não entra.
      </h1>
      <div className="mt-8 space-y-5 text-[1.02rem] leading-7 text-fg/90">
        <p>
          The Zero é o newsroom de tech do Brasil pra quem já passou do unboxing
          emocional. IA, computadores, dispositivos, aplicativos e jogos.
          Opinião em uma frase. Nome de ferramenta, atalho, preço ou número.
          Ironia no hype — não hate bait.
        </p>
        <p>
          O critério é de bastidor técnico: setup, falha, workaround, o que você
          mudaria. Demo na tela. Se for só discurso, a gente não publica.
        </p>
        <p>
          Instagram{" "}
          <a
            className="text-accent underline decoration-accent/40 underline-offset-4"
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.instagramHandle}
          </a>
          . YouTube{" "}
          <a
            className="text-accent underline decoration-accent/40 underline-offset-4"
            href={site.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.youtubeHandle}
          </a>
          . Idioma: pt-BR. Casa: {site.domain}.
        </p>
      </div>

      <section className="mt-12 border-t border-white/10 pt-8">
        <h2 className="text-[1.35rem] font-semibold tracking-tight">Cinco regras de voz</h2>
        <ol className="mt-5 list-decimal space-y-4 pl-5 text-base leading-7 text-fg/90">
          <li>
            <strong className="text-fg">Opinião clara em 1 frase</strong> no
            gancho. Sem “vamos falar sobre…”.
          </li>
          <li>
            <strong className="text-fg">Nomear ferramenta, atalho, preço ou número.</strong>{" "}
            Nada de “revolucionário”.
          </li>
          <li>
            <strong className="text-fg">Ironia leve contra hype</strong> — inclusive o da
            própria Big Tech. Sem “X está morto” sem argumento.
          </li>
          <li>
            <strong className="text-fg">Demo &gt; discurso.</strong> Se dá pra gravar a
            tela, grava.
          </li>
          <li>
            <strong className="text-fg">Tom de bastidor técnico.</strong> Sem rotina de
            CEO.
          </li>
        </ol>
      </section>

      <p className="mt-10 text-muted">
        Pauta, correção, parceria:{" "}
        <a className="text-accent" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        . Ou o Direct do Instagram.{" "}
        <Link href="/" className="text-accent">
          Voltar ao newsroom
        </Link>
        .
      </p>
    </PageShell>
  );
}
