import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { buildPageMetadata } from "@/lib/metadata";
import { BRAZIL_PRICE_GROUPS, brazilPrices, brazilPricesByGroup } from "@/lib/precos-brasil";
import { formatBRL, formatBRT } from "@/lib/prices";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "Preços no Brasil: consoles, celulares e placas de vídeo";
const description =
  "Quanto custam no Brasil os aparelhos que mais aparecem no The Zero: preço lido na loja brasileira, com link, vendedor e data da checagem.";
const cover = "/images/pages/precos-no-brasil.png";
const coverAlt = "Arte com o texto Preços no Brasil e a marca The Zero sobre fundo escuro";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/precos-no-brasil",
  imagePath: cover,
  imageAlt: coverAlt,
});

export default function BrazilPricesPage() {
  const checkedAt = brazilPrices.checkedAt;
  return (
    <PageShell width="narrow">
      <GuidePageJsonLd
        path="/precos-no-brasil"
        name={title}
        description={description}
        image={cover}
        dateModified={checkedAt}
        items={brazilPrices.items.map((item) => ({ name: item.name, url: item.url }))}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Preços no Brasil" }]} />
      <p className="eyebrow page-kicker">Tabela semanal</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{title}</h1>
      <p className="lede mt-4">
        Muita notícia de tecnologia chega com preço em dólar. Esta página mostra quanto os aparelhos mais citados nas
        nossas matérias custam de fato no Brasil, lidos na página de lojas brasileiras.
      </p>
      <p className="mt-3 text-sm text-muted">
        Última checagem: <time dateTime={checkedAt}>{formatBRT(checkedAt)}</time>. A tabela é refeita toda semana.
      </p>
      <Image
        src={cover}
        alt={coverAlt}
        width={1200}
        height={630}
        priority
        className="mt-8 h-auto w-full rounded-lg border border-border"
      />

      <div className="legal-prose mt-10">
        <h2>Como a tabela é feita</h2>
        <p>
          Cada linha traz o preço que a página da loja exibia no momento da checagem, o vendedor e o link para conferir.
          Usamos o site oficial da fabricante no Brasil ou grandes varejistas brasileiras. Quando a oferta é de um
          vendedor parceiro dentro da loja (marketplace), isso aparece na coluna do vendedor.
        </p>
        <p>
          Não estimamos preço nem convertemos dólar. Se um aparelho não tem venda oficial no Brasil ou se não
          conseguimos ler o preço com segurança, ele fica fora da tabela até a próxima checagem. Preço, estoque e
          condições mudam a qualquer momento: vale o que a loja mostrar na hora da compra.
        </p>
        <p>
          A coluna de observação diz que tipo de preço é: à vista no Pix, preço de tabela parcelável ou o valor
          inicial (&quot;a partir de&quot;) da versão mais barata. Esses números não são comparáveis entre si sem
          olhar a observação.
        </p>

        {BRAZIL_PRICE_GROUPS.map((group) => {
          const rows = brazilPricesByGroup(group.id);
          if (rows.length === 0) return null;
          return (
            <section key={group.id} id={group.id}>
              <h2>{group.heading}</h2>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Aparelho</th>
                      <th>Preço</th>
                      <th>Observação</th>
                      <th>Loja e vendedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => (
                      <tr key={item.url + item.name}>
                        <td>{item.name}</td>
                        <td className="tabular-nums">{formatBRL(item.price)}</td>
                        <td>{item.priceNote}</td>
                        <td>
                          <a href={item.url} rel="nofollow noopener" target="_blank">
                            {item.store}
                          </a>
                          {item.seller !== item.store ? <> · {item.seller}</> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <h2>O que chama atenção nesta semana</h2>
        <p>
          Na loja da Samsung, as versões de 512 GB do Galaxy S26 e do S26 Ultra estavam mais baratas que as de 256 GB
          na checagem, por causa de promoção. Antes de escolher a memória menor para economizar, compare as duas
          páginas.
        </p>
        <p>
          Nos consoles, o PlayStation 5 Pro estava com desconto sobre o preço anterior informado pela própria KaBuM. Já
          entre os PCs portáteis, a oferta mais barata do ROG Xbox Ally X vinha da Loja Asus dentro da KaBuM, e não da
          própria KaBuM.
        </p>

        <h2>Para ir além</h2>
        <ul>
          <li>
            <Link href="/guias/consoles-portateis">Consoles portáteis: a tabela com bateria, tela e chip</Link>
          </li>
          <li>
            <Link href="/ferramentas/imposto-portateis">Calculadora de imposto para importar um portátil</Link>
          </li>
          <li>
            <Link href="/politica-editorial">Política editorial do The Zero</Link>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
