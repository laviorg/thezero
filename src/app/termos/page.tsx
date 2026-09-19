import { LegalDocument } from "@/components/layout/legal-document";
import { LegalPageJsonLd } from "@/components/news/json-ld";
import { LEGAL_UPDATED_LABEL } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { TERMS_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Regras de uso do newsroom The Zero: conteúdo, responsabilidade, publicidade e lei aplicável no Brasil.";

export const metadata: Metadata = buildPageMetadata({
  title: TERMS_TITLE,
  description,
  path: "/termos",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: TERMS_TITLE,
});

export default function TermsPage() {
  return (
    <LegalDocument
      kicker="Termos"
      title="Como usar este newsroom."
      lede="Leitura, link, crítica. Sem conta. Sem vender a pauta no anúncio."
      updated={LEGAL_UPDATED_LABEL}
      jsonLd={<LegalPageJsonLd path="/termos" name={TERMS_TITLE} description={description} />}
    >
      <p>
        Estes termos regem o uso de {site.domain} e das páginas que
        publicamos aqui. Ao acessar o site, você concorda com eles e com a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>. Se não
        concordar, não use o serviço.
      </p>

      <h2>1. O que é o The Zero</h2>
      <p>
        The Zero é um newsroom independente de tecnologia, publicado no
        Brasil em português. Matérias, opinião, demos e hubs de editoria
        são conteúdo jornalístico e editorial — não consultoria, não
        recomendação de investimento, não garantia de que um produto vai
        funcionar na sua casa.
      </p>
      <p>
        O critério editorial está no <Link href="/sobre">Sobre</Link>. A
        loja em {site.storeUrl.replace("https://", "")}, quando existir,
        é um destino separado: link no rodapé não transforma este site em
        e-commerce.
      </p>

      <h2>2. Propriedade intelectual</h2>
      <p>
        Texto, marca, wordmark e o selo nas fotos são do The Zero, salvo
        crédito em contrário. Fotos de assessoria (Apple Newsroom e
        equivalentes) pertencem a quem as divulgou; o crédito vai na
        legenda. Você pode citar trechos com link para a matéria. Não pode
        republicar o texto inteiro, o layout ou a marca como se fossem
        seus.
      </p>

      <h2>3. Uso aceitável</h2>
      <p>Não use o site para:</p>
      <ul>
        <li>quebrar, sobrecarregar ou burlar o acesso;</li>
        <li>raspar o acervo para republicar como produto próprio;</li>
        <li>fazer passar o The Zero por outra casa, ou o contrário;</li>
        <li>enviar malware, spam ou coleta enganosa a partir das nossas URLs.</li>
      </ul>
      <p>
        Não há área logada nem caixa de comentário neste site. Se isso
        mudar, as regras daquela superfície entram aqui.
      </p>

      <h2>4. Publicidade</h2>
      <p>
        Quando houver anúncios (Google AdSense, depois da aprovação da
        conta), eles financiam o newsroom. <strong>Não compram a pauta.</strong>{" "}
        Anúncio é anúncio — não rotulamos peça paga como matéria. Você
        pode recusar cookies de publicidade; o conteúdo editorial continua
        no ar. Clique em anúncio por engano é do anunciante, não nosso
        endosso.
      </p>
      <p>
        É proibido pedir a alguém que clique nos anúncios, clicar nos
        próprios anúncios ou inflar impressão. Isso viola as políticas do
        Google e estes termos.
      </p>

      <h2>5. Precisão e correção</h2>
      <p>
        A gente erra. Se o fato, o número ou o crédito estiver errado,
        escreva para{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Corrigimos no
        texto. Matéria de opinião continua opinião, mesmo depois do patch.
      </p>

      <h2>6. Limitação</h2>
      <p>
        O site é oferecido como está. Links de terceiros, fotos de
        divulgação e produtos citados não são nossos. Na medida permitida
        pela legislação brasileira — inclusive o Código de Defesa do
        Consumidor, quando couber — não respondemos por dano indireto,
        lucro cessante ou decisão que você tomou só porque leu uma
        matéria.
      </p>

      <h2>7. Lei e foro</h2>
      <p>
        Aplica-se a legislação brasileira. Foro: o do domicílio do usuário,
        quando a lei do consumidor exigir; nos demais casos, o foro
        competente no Brasil para o editor do site. Nada aqui limita
        direito que a lei impeça de limitar.
      </p>

      <h2>8. Contato</h2>
      <p>
        The Zero — {site.domain}.{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.{" "}
        <Link href="/contato">Contato</Link>. Atualizado em{" "}
        {LEGAL_UPDATED_LABEL}.
      </p>
    </LegalDocument>
  );
}
