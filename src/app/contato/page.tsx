import { LegalDocument } from "@/components/layout/legal-document";
import { ContactPageJsonLd } from "@/components/news/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { CONTACT_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Pauta, correção ou parceria: fale com a redação do The Zero por e-mail ou pelas redes da casa.";

export const metadata: Metadata = buildPageMetadata({
  title: CONTACT_TITLE,
  description,
  path: "/contato",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: CONTACT_TITLE,
});

export default function ContactPage() {
  return (
    <LegalDocument
      kicker="Contato"
      title="A redação responde aqui."
      lede="Sem formulário-caixa-preta. E-mail da casa, direto."
      jsonLd={<ContactPageJsonLd description={description} />}
    >
      <p>
        The Zero é um newsroom independente de tecnologia, publicado no
        Brasil em {site.domain}. Se a matéria errou, se a pauta cabe, se a
        parceria não é hype disfarçado — escreve.
      </p>

      <h2>E-mail</h2>
      <p>
        <a href={`mailto:${site.email}`} className="contact-email">
          {site.email}
        </a>
      </p>
      <ul>
        <li>
          <strong>Pauta</strong> — o que testar, medir ou discordar. Manda o
          ângulo, não o press kit de 40 páginas.
        </li>
        <li>
          <strong>Correção</strong> — fato, número, crédito de foto. A gente
          corrige no texto, não no silêncio.
        </li>
        <li>
          <strong>Parceria</strong> — só o que dá para mostrar na tela sem
          vender a pauta.
        </li>
        <li>
          <strong>Privacidade / LGPD</strong> — use o mesmo e-mail, assunto
          “LGPD”. Detalhes na{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </li>
      </ul>

      <h2>Redes</h2>
      <p>
        Instagram{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.social.instagramHandle}
        </a>
        . YouTube{" "}
        <a
          href={site.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.social.youtubeHandle}
        </a>
        . Direct e comentário chegam, mas o e-mail é o canal que a gente
        consegue arquivar.
      </p>

      <h2>O que não é este endereço</h2>
      <p>
        Não é SAC de fabricante, não é suporte de loja, não é denúncia de
        anúncio do Google. Anúncio impróprio se reporta nas ferramentas do
        próprio anúncio. Quem publica o newsroom é a casa — vê{" "}
        <Link href="/sobre">Sobre</Link>.
      </p>
    </LegalDocument>
  );
}
