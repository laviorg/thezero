import { LegalDocument } from "@/components/layout/legal-document";
import { TrustPageJsonLd } from "@/components/news/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { EDITORIAL_POLICY_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Independência editorial, correções, fontes e o uso de IA no The Zero: assistência de máquina, revisão humana, sem citação ou benchmark inventados.";

const updated = "26 de setembro de 2026";

export const metadata: Metadata = buildPageMetadata({
  title: EDITORIAL_POLICY_TITLE,
  description,
  path: "/politica-editorial",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: EDITORIAL_POLICY_TITLE,
});

export default function EditorialPolicyPage() {
  return (
    <LegalDocument
      kicker="Redação"
      title="A pauta não está à venda. O erro, quando existe, é corrigido no texto."
      lede="Independência, fonte, correção e o que a casa faz com IA. Sem citação fabricada e sem benchmark que ninguém rodou."
      updated={updated}
      jsonLd={
        <TrustPageJsonLd
          path="/politica-editorial"
          name={EDITORIAL_POLICY_TITLE}
          description={description}
        />
      }
    >
      <p>
        The Zero é um newsroom independente de tecnologia, em português do
        Brasil, em {site.domain}. O byline das matérias é a redação. Não há
        página de autor pessoa enquanto não existir um perfil publicado. Quem
        responde pelo veículo está em{" "}
        <Link href="/sobre#quem-publica">Quem publica</Link>.
      </p>

      <h2>Independência</h2>
      <p>
        Publicidade, quando existir no site, financia a operação. Não compra
        pauta, manchete nem veredito. Não aceitamos pagamento para recomendar
        produto, loja ou serviço. Parceria que for hype disfarçado não entra.
      </p>
      <p>
        Se um fabricante mandar produto, a matéria diz. Se a redação não
        usou o aparelho, ela também diz — o método está em{" "}
        <Link href="/como-testamos">Como testamos</Link>. Assessoria pode
        mandar pauta. A pauta só vira texto se a tese se sustentar sem o
        release.
      </p>

      <h2 id="fontes">Fontes</h2>
      <p>
        O padrão é a fonte primária: página do fabricante, loja, documentação
        oficial, regulador, decisão judicial, comunicado. Link no texto.
        Veículo de notícia entra quando a fonte primária não carrega o fato
        — e o texto diz de quem é o relato. Não reescrevemos um número de
        outro site como se fosse medição nossa.
      </p>
      <p>
        Preço em real leva a loja e a data da consulta. Especificação que a
        ficha não confirma fica de fora, ou entra com a ressalva de que não
        foi verificada. Não há citação entre aspas sem a fala e a fonte.
      </p>

      <h2 id="correcoes">Correções</h2>
      <p>
        Erro de fato — preço, data, spec, nome, atribuição — é corrigido no
        corpo da matéria. A data de atualização passa a aparecer no topo.
        Correção material ganha uma frase no texto dizendo o que mudou, para
        o leitor que já tinha lido a versão anterior não ficar com o número
        velho na cabeça.
      </p>
      <p>
        Não apagamos a matéria para esconder o erro, salvo exigência legal.
        Não “atualizamos a data” sem mudar o texto.
      </p>
      <p>
        Achou um erro: escreva para{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> com o link da
        página e o trecho. O mesmo endereço está na página de{" "}
        <Link href="/contato">contato</Link>. Não há comentário no site.
      </p>

      <h2 id="ia">Uso de IA</h2>
      <p>
        Parte do texto pode ser produzida com assistência de inteligência
        artificial. Um editor humano da redação revisa e edita antes de
        publicar. A ferramenta não assina a matéria. O byline continua The
        Zero.
      </p>
      <p>
        A casa não publica citação, preço, benchmark, especificação ou data
        inventados por um modelo. Se a conferência não acha a fonte, o dado
        sai ou entra com ressalva explícita. IA não é desculpa para ficha
        técnica alucinada nem para aspas que ninguém disse.
      </p>
      <p>
        Imagem gerada, quando existir, não é apresentada como foto de
        produto. Capa de review com foto de imprensa leva crédito. Capa de
        cartaz da casa é identificada como cartaz.
      </p>
    </LegalDocument>
  );
}
