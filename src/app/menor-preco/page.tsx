import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { StaleBadge } from "@/components/deals/stale-badge";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { AFFILIATE_REL, KABUM_DISCLOSURE, STOCK_NOTICE, kabumAffiliateUrl } from "@/lib/affiliate";
import { buildPageMetadata } from "@/lib/metadata";
import { AVAILABILITY_LABEL, formatBRL, formatBRT, priceData, priceList } from "@/lib/prices";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "Menor preço do dia: placas de vídeo, SSDs e consoles na KaBuM";
const description =
  "Preço à vista de placas de vídeo, SSDs e consoles conferido todo dia na página da KaBuM, com data e hora de cada checagem e o menor valor já registrado.";
const cover = "/images/pages/menor-preco.png";
const coverAlt = "Arte com o texto Menor preço do dia e a marca The Zero sobre fundo escuro";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/menor-preco",
  imagePath: cover,
  imageAlt: coverAlt,
});

const sections = [
  { category: "gpu" as const, heading: "Placas de vídeo", guide: { href: "/black-friday-2026#gpu", label: "como escolher placa de vídeo" } },
  { category: "ssd" as const, heading: "SSDs", guide: { href: "/black-friday-2026#ssd", label: "como escolher SSD" } },
  { category: "console" as const, heading: "Consoles", guide: { href: "/black-friday-2026#console", label: "como escolher console" } },
];

export default function LowestPricePage() {
  const all = sections.flatMap((section) => priceList(section.category));
  return (
    <PageShell width="narrow">
      <GuidePageJsonLd
        path="/menor-preco"
        name={title}
        description={description}
        image={cover}
        dateModified={priceData.generatedAt}
        items={all.map((item) => ({ name: item.name, url: item.url }))}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Menor preço do dia" }]} />
      <p className="eyebrow page-kicker">Rastreador</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{title}</h1>
      <p className="lede mt-4">
        Um robô do The Zero abre a página de cada produto na KaBuM todo dia de manhã e lê o preço que a própria
        página informa. Sem estimativa, sem preço inventado: se a leitura falha, o item fica marcado.
      </p>
      <p className="mt-3 text-sm text-muted">
        Última atualização desta página: <time dateTime={priceData.generatedAt}>{formatBRT(priceData.generatedAt)}</time>.
      </p>
      <Image src={cover} alt={coverAlt} width={1200} height={630} priority className="mt-8 h-auto w-full rounded-lg border border-border" />

      <div className="legal-prose mt-10">
        <p className="affiliate-note">
          {KABUM_DISCLOSURE} Preço e condições valem na data e hora da checagem. {STOCK_NOTICE}
        </p>
        {sections.map((section) => (
          <section key={section.category} id={section.category}>
            <h2>{section.heading}</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço na checagem</th>
                    <th>Checado em</th>
                    <th>Menor registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {priceList(section.category).map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.name}
                        <br />
                        <a href={kabumAffiliateUrl(item.url)} rel={AFFILIATE_REL} target="_blank">
                          ver na KaBuM
                        </a>
                      </td>
                      <td>
                        {item.price != null ? formatBRL(item.price) : "—"}
                        <br />
                        <span className="text-sm text-muted">
                          {item.availability ? AVAILABILITY_LABEL[item.availability] ?? item.availability : "—"}
                        </span>
                      </td>
                      <td className="text-sm">
                        {item.checkedAt ? formatBRT(item.checkedAt) : "—"}
                        <StaleBadge checkedAt={item.checkedAt} />
                        {item.error ? <span className="block text-accent">última leitura falhou</span> : null}
                      </td>
                      <td className="text-sm">
                        {item.lowest ? (
                          <>
                            {formatBRL(item.lowest.price)}
                            <br />
                            <span className="text-muted">{formatBRT(item.lowest.at)}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Antes de comprar, leia <Link href={section.guide.href}>{section.guide.label}</Link>.
            </p>
          </section>
        ))}

        <h2>Como o rastreador funciona</h2>
        <ul>
          <li>
            Fonte: a página do produto na KaBuM. O robô lê o preço e o estoque dos dados estruturados (JSON-LD) que a
            própria loja publica na página.
          </li>
          <li>
            Antes de aceitar o preço, o robô confere se o nome do produto na página ainda é o do nosso catálogo. Se não
            for, ou se a página não abrir, o preço anterior fica com a data antiga e o item é marcado.
          </li>
          <li>
            A checagem roda todo dia por volta das 06:15 (horário de Brasília). A página só é republicada quando algum
            preço ou estoque muda, ou a cada 3 dias. Preço com mais de 48 horas aparece como desatualizado.
          </li>
          <li>
            &quot;Menor registrado&quot; é o menor preço que o nosso robô viu com o produto em estoque, desde que o item
            entrou no rastreador. Não é o histórico da loja.
          </li>
          <li>
            O preço pode ser diferente no carrinho (frete, CEP, forma de pagamento e vendedor). Confira sempre na loja.
          </li>
        </ul>
        <p>
          Datas de compra: <Link href="/black-friday-2026">Black Friday 2026</Link> ·{" "}
          <Link href="/11-11">11.11</Link> · <Link href="/prime-day">Prime Day</Link>
        </p>
      </div>
    </PageShell>
  );
}
