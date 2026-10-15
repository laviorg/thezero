import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import builds from "@/data/pc-builds.json";
import { AFFILIATE_REL, KABUM_DISCLOSURE, STOCK_NOTICE, kabumAffiliateUrl } from "@/lib/affiliate";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const meta: ToolMeta = {
  path: "/ferramentas/montar-pc",
  title: "Montar PC por orçamento: 3 configurações de entrada a avançada",
  description: "Três configurações de PC gamer com peças compatíveis conferidas na KaBuM, do 1080p ao 1440p alto, com o porquê de cada escolha.",
  lede: "Três montagens com peças que conversam entre si (soquete, memória e fonte conferidos). Sem preço na página: o valor muda todo dia, então cada peça leva pra página da loja.",
  cover: "/images/pages/montar-pc.png",
  coverAlt: "Arte com o texto Montar PC por orçamento e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-14T20:00:00-03:00",
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

export default function Page() {
  return (
    <ToolPage meta={meta}>
      <p className="affiliate-note">
        {KABUM_DISCLOSURE} {STOCK_NOTICE}
      </p>
      {builds.builds.map((build) => (
        <section key={build.id} id={build.id}>
          <h2>{build.label}: {build.target}</h2>
          <p>Plataforma: {build.platform}.</p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Peça</th>
                  <th>Modelo</th>
                  <th>Preço na loja</th>
                </tr>
              </thead>
              <tbody>
                {build.parts.map((part) => (
                  <tr key={`${build.id}-${part.role}`}>
                    <td>{part.role}</td>
                    <td>
                      {part.qty > 1 ? `${part.qty}× ` : null}
                      {part.name}
                    </td>
                    <td>
                      <a href={kabumAffiliateUrl(part.url)} rel={AFFILIATE_REL} target="_blank">
                        ver preço na KaBuM
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{build.note} Falta gabinete e, no caso do Ryzen 5 5500 e do 7800X3D, conferir se o cooler vem na caixa do modelo que você comprar.</p>
        </section>
      ))}
      <h2>Como escolhemos</h2>
      <ul>
        <li>Compatibilidade primeiro: processador e placa-mãe do mesmo soquete (AM4 ou AM5), memória do tipo que a placa aceita (DDR4 ou DDR5), sempre em dois pentes pra usar dual channel.</li>
        <li>Fonte com folga pela <Link href="/ferramentas/calculadora-de-fonte">calculadora de fonte</Link> e pela recomendação oficial da placa de vídeo.</li>
        <li>Links conferidos na KaBuM em {builds.checkedAt.split("-").reverse().join("/")}: a página abriu e o nome do produto bate com a tabela.</li>
        <li>Preço não aparece aqui. Pra placas de vídeo e SSDs, o <Link href="/menor-preco">menor preço do dia</Link> mostra o valor checado com data e hora.</li>
      </ul>
      <p>
        Leia também: <Link href="/noticia/pc-gamer-ate-4-mil-2026">PC gamer até R$ 4 mil</Link> ·{" "}
        <Link href="/noticia/ddr4-vs-ddr5-ainda-vale-montar">DDR4 vs DDR5</Link> ·{" "}
        <Link href="/noticia/placa-mae-b650-barata-upgrade-ryzen">placa-mãe B650 barata</Link>
      </p>
    </ToolPage>
  );
}
