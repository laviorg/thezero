import { AUTHORS } from "@/lib/authors";
import { PageShell } from "@/components/layout/page-shell";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { AUTHORS_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

/**
 * Foto e bio do Nicholas: aguardando o material dele.
 * Quando chegar, preencha NICHOLAS_PHOTO (ex.: "/brand/authors/nicholas.jpg")
 * e NICHOLAS_BIO. Até lá o avatar de iniciais segue no lugar.
 */
const NICHOLAS_PHOTO: string | null = null;
const NICHOLAS_BIO: string | null = null;

/**
 * TODO: trocar pelos perfis pessoais do Nicholas (LinkedIn, Instagram etc.)
 * quando ele informar. Por ora, só as contas do The Zero linkadas no rodapé.
 */
const NICHOLAS_SAME_AS = [
  site.social.instagram,
  site.social.threads,
  site.social.x,
  site.social.youtube,
  site.social.pinterest,
];

function NicholasPersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/autores#nicholas"),
    name: AUTHORS.nicholas.name,
    jobTitle: "Editor",
    url: absoluteUrl(AUTHORS.nicholas.href),
    ...(NICHOLAS_PHOTO ? { image: absoluteUrl(NICHOLAS_PHOTO) } : {}),
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
    worksFor: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    sameAs: NICHOLAS_SAME_AS,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const description =
  "Quem assina as matérias do The Zero: Nicholas Haruo Nishimura, fundador e editor. Produção assistida por Mavi, assistente de IA.";

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
      <NicholasPersonJsonLd />
      <p className="eyebrow page-kicker">Redação</p>
      <h1 className="font-display mt-4 text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-balance">
        Autores
      </h1>
      <p className="mt-6 text-lg leading-8 text-fg/90">
        Quem assina as matérias do The Zero.
      </p>
      <p className="mt-4 text-base leading-7 text-fg/90">
        Todas as matérias são assinadas por Nicholas Haruo Nishimura, editor. A Mavi, assistente de IA, ajuda na pesquisa e no rascunho; nenhum texto sai sem revisão editorial humana.
      </p>

      <section id="nicholas" className="mt-14 scroll-mt-24 border-t border-border pt-10">
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={NICHOLAS_PHOTO ?? AUTHORS.nicholas.avatar}
            alt={AUTHORS.nicholas.avatarAlt}
            width={88}
            height={88}
            className="size-[5.5rem] shrink-0 rounded-full border border-border bg-surface"
          />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              <Link href={AUTHORS.nicholas.href}>{AUTHORS.nicholas.name}</Link>
            </h2>
            <p className="mt-2 text-base leading-7 text-fg/90">
              Fundador e editor do The Zero. Assina e revisa todas as matérias. São Paulo–SP. Contato:{" "}
              <a className="text-accent" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
            {NICHOLAS_BIO ? (
              <p className="author-bio-text mt-3 text-base leading-7 text-fg/90">
                {NICHOLAS_BIO}
              </p>
            ) : null}
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
              <Link href={AUTHORS.mavi.href}>{AUTHORS.mavi.name}</Link>
            </h2>
            <p className="mt-2 text-base leading-7 text-fg/90">
              Assistente de IA do The Zero. Ajuda na pesquisa e no rascunho, não
              assina matérias. Todo texto passa por revisão editorial humana. Contato:{" "}
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
