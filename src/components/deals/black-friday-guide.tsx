import { GuidePageJsonLd } from "@/components/deals/json-ld";
import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import {
  AFFILIATE_REL,
  AMAZON_DISCLOSURE,
  KABUM_DISCLOSURE,
  amazonAffiliateUrl,
  kabumAffiliateUrl,
} from "@/lib/affiliate";
import { type BfItem, bfChange, bfCheckedCount, bfPrices, shortDate } from "@/lib/black-friday";
import type { DealEvent } from "@/lib/deals";
import { dealEvents } from "@/lib/deals";
import { getPostBySlug } from "@/lib/posts";
import { formatBRL, formatBRT } from "@/lib/prices";
import Image from "next/image";
import Link from "next/link";

const FEATURED_SLUG = "black-friday-2026-precos-tech-brasil";

const CHECKLIST = [
  {
    title: "Ignore o preço riscado",
    text: "O \"de\" é escolhido pela loja. Nesta sexta, uma RX 7600 exibia \"de R$ 3.411,75\", mas custava R$ 1.999,99 em outubro.",
  },
  {
    title: "Compare com o seu histórico",
    text: "Use o mesmo anúncio, na mesma loja, semanas antes. Sem anotação, use o arquivo de outubro e a tabela de Preços no Brasil.",
  },
  {
    title: "Abra duas lojas grandes",
    text: "O mesmo Switch 2 custava R$ 5.999 numa loja e R$ 4.001,11 em outra, na mesma tarde.",
  },
  {
    title: "Leia quem vende",
    text: "Vendedor parceiro dentro da loja muda garantia, prazo e troca. O nome aparece perto do botão de compra.",
  },
  {
    title: "Pix contra parcelado",
    text: "O preço anunciado costuma ser o do Pix. Some o total parcelado antes de comparar.",
  },
  {
    title: "Link só pelo site oficial",
    text: "Nada de pagar por link de WhatsApp ou SMS. Confira a lista Evite esses Sites do Procon-SP e pague só no checkout.",
  },
];

const TOOLS = [
  { href: "/precos-no-brasil", label: "Preços no Brasil", text: "Tabela semanal com loja, vendedor e data." },
  { href: "/menor-preco", label: "Arquivo de outubro", text: "Os preços de 14 a 16/10 usados na comparação." },
  { href: "/vale-a-pena", label: "Vale a pena?", text: "Veredito por produto, com preço em R$." },
  { href: "/ferramentas/imposto-portateis", label: "Imposto de importação", text: "Conta do Remessa Conforme por estado." },
  { href: "/ferramentas/meu-pc-roda", label: "Meu PC roda?", text: "Antes da placa nova, veja o que falta." },
  { href: "/ferramentas/calculadora-de-fonte", label: "Calculadora de fonte", text: "Potência certa pra placa que você vai comprar." },
  { href: "/ferramentas/montar-pc", label: "Montar PC", text: "Peças compatíveis e orçamento por faixa." },
];

function storeUrl(item: BfItem) {
  if (item.store === "Amazon" && item.asin) return amazonAffiliateUrl(item.asin);
  return kabumAffiliateUrl(item.url);
}

function Change({ item }: { item: BfItem }) {
  const change = bfChange(item);
  if (change === null) return <span className="text-muted">sem referência</span>;
  const tone =
    change < 0
      ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
      : change > 0
        ? "bg-red-500/12 text-red-700 dark:text-red-300"
        : "bg-surface-raised text-muted";
  const label = change < 0 ? `−${Math.abs(change)}%` : change > 0 ? `+${change}%` : "0%";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[0.78rem] font-semibold ${tone}`}>
      {label}
      <span className="sr-only"> desde {item.ref ? shortDate(item.ref.date) : ""}</span>
    </span>
  );
}

function PriceRow({ item }: { item: BfItem }) {
  return (
    <tr className="bf-row">
      <th scope="row" className="bf-cell-product">
        <span className="block font-semibold text-fg">{item.name}</span>
        <span className="mt-0.5 block text-[0.8rem] font-normal text-muted">
          {item.store} · vendido por {item.seller}
          {item.available ? ` · ${item.priceNote}` : null}
        </span>
      </th>
      <td className="bf-cell" data-label="Hoje">
        {item.price !== null ? (
          <span className="font-mono text-[1.02rem] font-bold text-fg">{formatBRL(item.price)}</span>
        ) : (
          <span className="font-mono text-[0.85rem] font-semibold text-muted">esgotado</span>
        )}
      </td>
      <td className="bf-cell" data-label="Antes">
        {item.ref && item.price !== null ? (
          <span className="font-mono text-[0.9rem] text-muted">
            {formatBRL(item.ref.price)} <span className="text-[0.75rem]">em {shortDate(item.ref.date)}</span>
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td className="bf-cell" data-label="Variação">
        {item.price !== null ? <Change item={item} /> : <span className="text-muted">—</span>}
      </td>
      <td className="bf-cell bf-cell-link">
        <a
          href={storeUrl(item)}
          rel={AFFILIATE_REL}
          target="_blank"
          className="font-mono text-[0.8rem] font-semibold text-accent hover:underline"
        >
          ver na {item.store} ↗
        </a>
      </td>
    </tr>
  );
}

export function BlackFridayGuide({ event }: { event: DealEvent }) {
  const featured = getPostBySlug(FEATURED_SLUG);
  const others = dealEvents.filter((entry) => entry.slug !== event.slug);
  const checkedAt = bfPrices.checkedAt;
  const products = bfPrices.groups.flatMap((group) =>
    group.items
      .filter((item) => item.price !== null)
      .map((item) => ({ name: item.detail, url: item.url })),
  );
  const blockById = Object.fromEntries(event.categories.map((block) => [block.category, block]));
  const nav = [
    { href: "#precos", label: "Preços de hoje" },
    { href: "#checklist", label: "Desconto falso" },
    { href: "#gpu", label: "Placa de vídeo" },
    { href: "#ssd", label: "SSD" },
    { href: "#console", label: "Console" },
    { href: "#notebook", label: "Notebook" },
    { href: "#importados", label: "Importados" },
    { href: "#faq", label: "Perguntas" },
  ];

  return (
    <PageShell width="wide" className="bf-page">
      <GuidePageJsonLd
        path={event.path}
        name={event.documentTitle}
        description={event.description}
        image={event.cover}
        dateModified={event.updatedIso}
        items={products}
        faq={event.faq}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: "Black Friday 2026" }]} />

      <header className="bf-hero mt-4">
        <div className="bf-hero-grid">
          <div className="min-w-0">
            <p className="bf-hero-kicker">
              <span className="bf-dot" aria-hidden /> Black Friday 2026 · preços lidos hoje
            </p>
            <h1 className="bf-hero-title">{event.title}</h1>
            <p className="bf-hero-lede">{event.lede}</p>
            <p className="bf-hero-meta">
              Checagem: <time dateTime={checkedAt}>{formatBRT(checkedAt)}</time> · por Nicholas Nishimura
            </p>
          </div>
          <ol className="bf-dates" aria-label="Datas">
            <li>
              <span className="bf-date-day">27/11</span>
              <span className="bf-date-label">sexta · Black Friday</span>
            </li>
            <li>
              <span className="bf-date-day">30/11</span>
              <span className="bf-date-label">segunda · Cyber Monday</span>
            </li>
            <li>
              <span className="bf-date-day">7 dias</span>
              <span className="bf-date-label">pra desistir de compra online (CDC, art. 49)</span>
            </li>
          </ol>
        </div>
        <dl className="bf-stats">
          <div>
            <dt>preços lidos hoje</dt>
            <dd>{bfCheckedCount()}</dd>
          </div>
          <div>
            <dt>SSD Kingston NV3 1 TB desde 16/10</dt>
            <dd className="bf-down">−13%</dd>
          </div>
          <div>
            <dt>Switch 2 na KaBuM desde 16/10</dt>
            <dd className="bf-up">+40%</dd>
          </div>
          <div>
            <dt>dólar PTAX desde 16/10</dt>
            <dd className="bf-up">+9,1%</dd>
          </div>
        </dl>
      </header>

      <nav aria-label="Nesta página" className="bf-nav">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      {featured?.cover ? (
        <Link href={`/noticia/${featured.slug}`} className="bf-feature group">
          <div className="bf-feature-media">
            <Image
              src={featured.cover}
              alt={featured.coverAlt ?? ""}
              width={1200}
              height={675}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bf-feature-body">
            <p className="eyebrow text-accent">Análise da redação</p>
            <h2 className="font-display mt-2 text-[1.45rem] leading-tight font-extrabold text-balance text-fg group-hover:text-accent md:text-[1.75rem]">
              {featured.title}
            </h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">{featured.excerpt}</p>
            <span className="mt-4 inline-block font-mono text-[0.8rem] font-semibold text-accent">Ler a análise →</span>
          </div>
        </Link>
      ) : null}

      <section id="precos" className="bf-section">
        <p className="eyebrow page-kicker">Tabela da redação</p>
        <h2 className="bf-h2">Preços checados hoje, lado a lado com o passado</h2>
        <p className="bf-p">
          Preço da página de cada produto em <time dateTime={checkedAt}>{formatBRT(checkedAt)}</time>, à vista no Pix
          quando a loja mostra. A coluna &quot;Antes&quot; é o mesmo anúncio no nosso{" "}
          <Link href="/menor-preco">arquivo de outubro</Link> ou na{" "}
          <Link href="/precos-no-brasil">tabela de 16/11</Link>. Produto esgotado fica sem preço. Preço e estoque mudam a
          qualquer hora: vale o que a loja mostrar no checkout.
        </p>
        <p className="affiliate-note mt-3 text-[0.82rem] text-muted">
          {KABUM_DISCLOSURE} {AMAZON_DISCLOSURE}
        </p>

        {bfPrices.groups.map((group) => (
          <div key={group.id} className="mt-8">
            <h3 className="font-display text-[1.15rem] font-bold text-fg">{group.heading}</h3>
            <div className="bf-table-wrap">
              <table className="bf-table">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Hoje</th>
                    <th scope="col">Antes</th>
                    <th scope="col">Variação</th>
                    <th scope="col">
                      <span className="sr-only">Loja</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <PriceRow key={item.url} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      <section id="checklist" className="bf-section">
        <p className="eyebrow page-kicker">Checklist</p>
        <h2 className="bf-h2">Como pegar desconto falso em 6 passos</h2>
        <ol className="bf-checklist">
          {CHECKLIST.map((step, index) => (
            <li key={step.title}>
              <span className="bf-step">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display font-bold text-fg">{step.title}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="bf-p mt-4">
          Lista oficial:{" "}
          <a href="https://sistemas.procon.sp.gov.br/evitesite/list/evitesites.php" target="_blank" rel="noopener">
            Evite esses Sites, do Procon-SP
          </a>
          . Direito de arrependimento:{" "}
          <a href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" target="_blank" rel="noopener">
            artigo 49 do Código de Defesa do Consumidor
          </a>
          .
        </p>
      </section>

      <section className="bf-section">
        <p className="eyebrow page-kicker">Critério por categoria</p>
        <h2 className="bf-h2">O que olhar antes do preço</h2>
        <div className="bf-cards">
          {(["gpu", "ssd", "console", "notebook"] as const).map((id) => {
            const block = blockById[id];
            if (!block) return null;
            return (
              <article key={id} id={id} className="bf-card">
                <h3 className="font-display text-[1.2rem] leading-snug font-extrabold text-fg">{block.heading}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{block.intro}</p>
                <ul className="bf-list">
                  {block.criteria.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-[0.7rem] font-semibold tracking-[0.1em] text-muted uppercase">
                  Como vigiar
                </p>
                <ul className="bf-list">
                  {block.watch.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.9rem] leading-relaxed">
                  {block.guides.map((guide, guideIndex) => (
                    <span key={guide.href}>
                      {guideIndex > 0 ? <span className="text-muted"> · </span> : null}
                      <Link href={guide.href} className="text-accent hover:underline">
                        {guide.label}
                      </Link>
                    </span>
                  ))}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="importados" className="bf-section">
        <div className="bf-import">
          <div className="min-w-0">
            <p className="eyebrow page-kicker">Importados</p>
            <h2 className="bf-h2">O degrau dos US$ 50 no Remessa Conforme</h2>
            <p className="bf-p">
              Desde 12/05/2026, compra de pessoa física em site certificado no Remessa Conforme paga imposto de importação
              zero até US$ 50, contando o frete. Acima disso, 60% com desconto de US$ 30. O ICMS de 17% a 20% vale nas duas
              faixas, segundo a{" "}
              <a
                href="https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/topicos/tributacao"
                target="_blank"
                rel="noopener"
              >
                Receita Federal
              </a>
              . Site fora do programa cobra 60% em qualquer valor.
            </p>
            <Link href="/ferramentas/imposto-portateis" className="bf-button mt-4">
              Fazer a conta na calculadora →
            </Link>
          </div>
          <table className="bf-mini-table">
            <caption className="sr-only">Imposto no Remessa Conforme, pessoa física</caption>
            <thead>
              <tr>
                <th scope="col">Valor com frete</th>
                <th scope="col">Imposto de importação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>até US$ 50</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>US$ 50,01 a 3.000</td>
                <td>60% − US$ 30</td>
              </tr>
              <tr>
                <td>ICMS (por dentro)</td>
                <td>17% a 20%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bf-section">
        <p className="eyebrow page-kicker">Ferramentas e guias</p>
        <h2 className="bf-h2">Pra decidir antes de pagar</h2>
        <ul className="bf-tools">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link href={tool.href}>
                <span className="font-display font-bold text-fg">{tool.label} →</span>
                <span className="mt-1 block text-[0.88rem] text-muted">{tool.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bf-section">
        <p className="eyebrow page-kicker">Antes de comprar</p>
        <h2 className="bf-h2">{event.dateHeading}</h2>
        {event.dateText.map((paragraph) => (
          <p key={paragraph} className="bf-p">
            {paragraph}
          </p>
        ))}
        <ul className="bf-list mt-3 max-w-[46rem]">
          {event.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>

      <section id="faq" className="bf-section">
        <p className="eyebrow page-kicker">Perguntas frequentes</p>
        <h2 className="bf-h2">Black Friday 2026: dúvidas comuns</h2>
        <div className="bf-faq">
          {event.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bf-section border-t border-border pt-6 text-[0.9rem] text-muted">
        <p>
          Outras datas de compra:{" "}
          {others.map((entry, index) => (
            <span key={entry.slug}>
              {index > 0 ? " · " : null}
              <Link href={entry.path} className="text-accent hover:underline">
                {entry.documentTitle}
              </Link>
            </span>
          ))}
        </p>
        <p className="mt-3">
          A seleção é editorial: entra o modelo que a gente indicaria pelo critério acima, com preço lido na loja em{" "}
          {event.updatedLabel}. Comissão de afiliado não muda a ordem nem o critério. Veja{" "}
          <Link href="/como-testamos" className="text-accent hover:underline">
            como avaliamos
          </Link>
          .
        </p>
      </footer>
    </PageShell>
  );
}
