import { LegalDocument } from "@/components/layout/legal-document";
import { TrustPageJsonLd } from "@/components/news/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { HOW_WE_TEST_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Como o The Zero avalia produto, preço em real e texto de review, comparativo, guia e Vale a pena — sem laboratório que a casa não tem.";

const updated = "26 de setembro de 2026";

export const metadata: Metadata = buildPageMetadata({
  title: HOW_WE_TEST_TITLE,
  description,
  path: "/como-testamos",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: HOW_WE_TEST_TITLE,
});

export default function HowWeTestPage() {
  return (
    <LegalDocument
      kicker="Método"
      title="Como a gente avalia — e o que a gente não finge ter medido."
      lede="Sem nota de 0 a 10. Sem bancada que não existe. Preço em real com data, ficha com fonte, e um veredito que cabe numa frase."
      updated={updated}
      jsonLd={
        <TrustPageJsonLd
          path="/como-testamos"
          name={HOW_WE_TEST_TITLE}
          description={description}
        />
      }
    >
      <p>
        The Zero publica review, comparativo, guia, a série{" "}
        <Link href="/vale-a-pena">Vale a pena?</Link> e{" "}
        <Link href="/tutoriais">tutoriais</Link> no mesmo newsroom das
        notícias. O formato muda o que a página promete. Não muda a regra:
        se o número não tem fonte, ele não entra.
      </p>

      <h2>O que a casa não tem</h2>
      <p>
        Não há laboratório, câmara acústica, esteira de bateria nem amostra
        estatística de aparelhos. Quando o texto não saiu de um aparelho na
        mão da redação, ele diz isso. A avaliação, nesse caso, é de
        pesquisa: ficha do fabricante, página da loja, documentação oficial
        e o que a casa já publicou sobre o mesmo assunto.
      </p>
      <p>
        Isso não vira “teste”. Não publicamos quadro de fps, autonomia em
        horas ou temperatura de superfície como se tivéssemos medido. Se um
        fabricante publica um número de bateria, o texto atribui o número a
        ele. Se a redação não repetiu a medição, ela não assina o resultado.
      </p>
      <p>
        Se um fabricante emprestar um produto, a matéria diz. Empréstimo não
        compra o veredito. A maior parte do arquivo evergreen de hoje é
        pesquisa de mesa, não unboxing.
      </p>

      <h2>Como a conclusão é escrita</h2>
      <ul>
        <li>
          <strong>Review</strong> descreve o que a ficha e o uso conhecido
          sustentam: para quem serve, o que o anúncio infla, o que fica de
          fora. Sem nota numérica.
        </li>
        <li>
          <strong>Comparativo</strong> coloca dois ou mais produtos no mesmo
          patamar. Armazenamento, edição e data do preço precisam ser os
          mesmos. Misturar 256 GB de um com 512 GB do outro e chamar de
          empate é erro de método.
        </li>
        <li>
          <strong>Guia</strong> responde uma decisão (o que olhar, o que
          recusar) com critério nomeado. Não é lista de “melhores” sem
          corte.
        </li>
        <li>
          <strong>Vale a pena?</strong> abre com um veredito curto: comprar,
          esperar ou ficar na geração anterior. Em seguida diz para quem
          vale, para quem não vale, o preço no Brasil com data, alternativas
          e as perguntas que a busca repete.
        </li>
        <li>
          <strong>Tutorial</strong> é passo a passo. Requisito, ordem, o que
          fazer quando a tela não bate com o texto, e o que o botão não
          apaga. Sem JSON-LD de HowTo: o Google aposentou esse rich result, e
          a casa não emite markup que a busca não usa.
        </li>
      </ul>

      <h2 id="precos">Preço em real</h2>
      <p>
        Preço em R$ sai da página da loja — fabricante ou varejo com nome —
        e leva a data da consulta no texto. Não usamos média sem fonte,
        print de grupo de WhatsApp nem anúncio sem vendedor. Cotação de
        dólar, quando aparece, também leva data. Converter US$ e chamar o
        resultado de “preço no Brasil” é outra conta: falta imposto, frete e
        quem responde pela garantia.
      </p>
      <p>
        A etiqueta muda no mesmo dia. A data no parágrafo é a da consulta,
        não uma trava. Se você vai pagar, abra a loja de novo. Quando o
        preço do texto envelhece e a redação confere outra vez, o parágrafo
        muda e a matéria ganha <code>updated</code>. Não redatamos uma
        página só para a busca achar que ela é nova.
      </p>

      <h2 id="atualizacao">Quando o texto muda</h2>
      <p>
        Notícia fica com a data do dia em que saiu. Evergreen volta a ser
        editado quando o preço, a lista de aparelhos ou o passo a passo
        mudam de verdade. Correção de erro segue a{" "}
        <Link href="/politica-editorial#correcoes">política editorial</Link>:
        o trecho é reescrito e a data de atualização aparece no topo da
        matéria.
      </p>
      <p>
        Pauta e correção:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Quem publica, e o
        que ainda não está no cadastro da casa, está em{" "}
        <Link href="/sobre#quem-publica">Quem publica</Link>.
      </p>
    </LegalDocument>
  );
}
