import { Wordmark } from "@/components/brand/logo";
import { PageShell } from "@/components/layout/page-shell";
import { AboutPageJsonLd } from "@/components/news/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { ABOUT_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const aboutDescription =
  "The Zero é o canal de tech que mostra o que funciona de verdade — demo na tela, opinião sem filtro, zero hype de lançamento.";

export const metadata: Metadata = buildPageMetadata({
  title: ABOUT_TITLE,
  description: aboutDescription,
  path: "/sobre",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: ABOUT_TITLE,
});

export default function AboutPage() {
  return (
    <PageShell width="narrow">
      <AboutPageJsonLd description={aboutDescription} />
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
          . Threads{" "}
          <a
            className="text-accent underline decoration-accent/40 underline-offset-4"
            href={site.social.threads}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.threadsHandle}
          </a>
          . X{" "}
          <a
            className="text-accent underline decoration-accent/40 underline-offset-4"
            href={site.social.x}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.social.xHandle}
          </a>
          . Idioma: pt-BR. Casa: {site.domain}.
        </p>
      </div>

      {/*
        TODO(publisher): razão social — não consta em src/lib/site.ts nem no restante do repositório.
        TODO(publisher): CNPJ — não consta no repositório. Não inventar.
        TODO(publisher): endereço físico — não consta no repositório. Não inventar.
        TODO(publisher): editor responsável (pessoa física) — o byline é a redação (`site.defaultAuthor`). Não há perfil de pessoa.
        TODO(publisher): telefone — não consta no repositório.
      */}
      <section id="quem-publica" className="mt-14 border-t border-border pt-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Quem publica
        </h2>
        <div className="mt-6 space-y-4 text-base leading-7 text-fg/90">
          <p>
            The Zero é um newsroom independente de tecnologia, publicado no
            Brasil. Não somos assessoria, loja de hype nem agregador. A
            pauta, o critério e o texto são da casa. Se um fabricante mandou
            o produto, a gente diz. Se não testamos, não fingimos.
          </p>
          <dl className="grid gap-4 border border-border bg-surface px-5 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Publicação
              </dt>
              <dd className="mt-1 text-fg">{site.name}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Site
              </dt>
              <dd className="mt-1 text-fg">{site.domain}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Redação
              </dt>
              <dd className="mt-1">
                <a className="text-accent" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Idioma e país
              </dt>
              <dd className="mt-1 text-fg">pt-BR · Brasil</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Autor das matérias
              </dt>
              <dd className="mt-1 text-fg">
                {site.defaultAuthor}. Não há página de pessoa: o byline é a
                redação.
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                Redes
              </dt>
              <dd className="mt-1 text-fg">
                Instagram {site.social.instagramHandle}
                {" · "}
                YouTube {site.social.youtubeHandle}
                {" · "}
                Threads {site.social.threadsHandle}
                {" · "}
                X {site.social.xHandle}
              </dd>
            </div>
          </dl>
          <p>
            Existimos para mostrar o que funciona de verdade — IA,
            computadores, dispositivos, apps e jogos — em português do
            Brasil, com opinião e número. Sem unboxing emocional. Sem
            página feita só para anúncio.
          </p>
          <p>
            Quando houver publicidade no site, ela financia o newsroom.{" "}
            <strong className="text-fg">Não compra a pauta.</strong> O
            critério de avaliação está em{" "}
            <Link href="/como-testamos" className="text-accent">
              Como testamos
            </Link>
            . Independência, correção, fonte e o uso de IA estão na{" "}
            <Link href="/politica-editorial" className="text-accent">
              política editorial
            </Link>
            .
          </p>
        </div>
      </section>

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
        {" "}
        ou a página de{" "}
        <Link href="/contato" className="text-accent">
          contato
        </Link>
        . Método em{" "}
        <Link href="/como-testamos" className="text-accent">
          Como testamos
        </Link>
        . Regras da casa na{" "}
        <Link href="/politica-editorial" className="text-accent">
          política editorial
        </Link>
        . Privacidade e termos no rodapé.{" "}
        <Link href="/" className="text-accent">
          Voltar ao newsroom
        </Link>
        .
      </p>
    </PageShell>
  );
}
