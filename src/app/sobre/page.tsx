import { Wordmark } from "@/components/brand/logo";
import { PageShell } from "@/components/layout/page-shell";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "The Zero é o canal de tech que mostra o que funciona de verdade — demo na tela, opinião sem filtro, zero hype de lançamento.",
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <PageShell width="narrow">
      <Wordmark className="mb-10 h-16 w-auto text-fg sm:h-20" />
      <p className="eyebrow page-kicker">Sobre</p>
      <h1 className="font-display mt-4 text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-balance">
        Se não dá pra testar, medir ou discordar em 40 segundos, não entra.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-8 text-fg/90">
        <p>
          The Zero é o newsroom de tech do Brasil pra quem já passou do unboxing
          emocional. Tecnologia, IA, computadores, dispositivos, aplicativos e
          jogos. Opinião em uma frase. Nome de ferramenta, atalho, preço ou
          número. Ironia no hype — não hate bait.
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

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Cinco regras de voz</h2>
        <ol className="mt-6 list-decimal space-y-4 pl-5 text-base leading-7 text-fg/90">
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

      <p className="mt-12 text-muted">
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
