import { PageShell } from "@/components/layout/page-shell";
import { Breadcrumbs } from "@/components/news/breadcrumbs";
import { GuidePageJsonLd } from "@/components/deals/json-ld";
import {
  AFFILIATE_REL,
  AMAZON_DISCLOSURE,
  KABUM_DISCLOSURE,
  amazonAffiliateUrl,
  catalogItem,
  kabumAffiliateUrl,
} from "@/lib/affiliate";
import type { DealEvent } from "@/lib/deals";
import { dealEvents } from "@/lib/deals";
import Image from "next/image";
import Link from "next/link";

export function EventGuide({ event }: { event: DealEvent }) {
  const productItems = event.categories.flatMap((block) =>
    block.picks.map((pick) => {
      const item = catalogItem(pick.id);
      return { name: item.name, url: item.url };
    }),
  );
  const amazonItems = (event.amazonPicks ?? []).map((pick) => ({
    name: pick.name,
    url: `https://www.amazon.com.br/dp/${pick.asin}`,
  }));
  const others = dealEvents.filter((entry) => entry.slug !== event.slug);

  return (
    <PageShell width="narrow">
      <GuidePageJsonLd
        path={event.path}
        name={event.documentTitle}
        description={event.description}
        image={event.cover}
        dateModified={event.updatedIso}
        items={[...amazonItems, ...productItems]}
        faq={event.faq}
      />
      <Breadcrumbs items={[{ href: "/", label: "Newsroom" }, { label: event.kicker }]} />
      <p className="eyebrow page-kicker">{event.kicker}</p>
      <h1 className="page-title mt-3 font-extrabold text-balance">{event.title}</h1>
      <p className="lede mt-4">{event.lede}</p>
      <p className="mt-3 text-sm text-muted">
        Atualizado em <time dateTime={event.updatedIso}>{event.updatedLabel}</time>. Sem preço nesta página:
        preço muda todo dia. Os valores checados, com data e hora, ficam no{" "}
        <Link className="underline" href="/menor-preco">rastreador de menor preço do dia</Link>.
      </p>
      <Image
        src={event.cover}
        alt={event.coverAlt}
        width={1200}
        height={630}
        priority
        className="mt-8 h-auto w-full rounded-lg border border-border"
      />

      <div className="legal-prose mt-10">
        <h2>{event.dateHeading}</h2>
        {event.dateText.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <h2>Como se preparar</h2>
        <ul>
          {event.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>

        {event.amazonPicks && event.amazonPicks.length > 0 ? (
          <>
            <h2>Na Amazon: itens que conferimos</h2>
            <p className="affiliate-note">{AMAZON_DISCLOSURE}</p>
            <ul>
              {event.amazonPicks.map((pick) => (
                <li key={pick.asin}>
                  <strong>{pick.name}</strong> ({pick.seller}). {pick.why}{" "}
                  <a href={amazonAffiliateUrl(pick.asin)} rel={AFFILIATE_REL} target="_blank">
                    ver preço na Amazon
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {event.categories.map((block, index) => (
          <section key={block.category} id={block.category}>
            <h2>{block.heading}</h2>
            <p>{block.intro}</p>
            <h3>O que olhar</h3>
            <ul>
              {block.criteria.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <h3>Como vigiar o preço</h3>
            <ul>
              {block.watch.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <h3>Modelos pra acompanhar na KaBuM</h3>
            {index === 0 ? <p className="affiliate-note">{KABUM_DISCLOSURE}</p> : null}
            <ul>
              {block.picks.map((pick) => {
                const item = catalogItem(pick.id);
                return (
                  <li key={pick.id}>
                    <strong>{item.name}</strong>. {pick.why}{" "}
                    <a href={kabumAffiliateUrl(item.url)} rel={AFFILIATE_REL} target="_blank">
                      ver preço na KaBuM
                    </a>
                  </li>
                );
              })}
            </ul>
            <p>
              Leia também:{" "}
              {block.guides.map((guide, guideIndex) => (
                <span key={guide.href}>
                  {guideIndex > 0 ? " · " : null}
                  <Link href={guide.href}>{guide.label}</Link>
                </span>
              ))}
            </p>
          </section>
        ))}

        <h2>Perguntas frequentes</h2>
        {event.faq.map((entry) => (
          <div key={entry.q}>
            <h3>{entry.q}</h3>
            <p>{entry.a}</p>
          </div>
        ))}

        <h2>Outras datas de compra</h2>
        <ul>
          {others.map((entry) => (
            <li key={entry.slug}>
              <Link href={entry.path}>{entry.documentTitle}</Link>
            </li>
          ))}
        </ul>
        <p className="affiliate-note">
          A seleção é editorial: entra o modelo que a gente indicaria pelo critério acima, com link conferido na
          loja em {event.updatedLabel}. Comissão de afiliado não muda a ordem nem o critério. Veja{" "}
          <Link href="/como-testamos">como avaliamos</Link>.
        </p>
      </div>
    </PageShell>
  );
}
