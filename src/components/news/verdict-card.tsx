import { AFFILIATE_REL } from "@/lib/affiliate";
import {
  AFFILIATE_CARD_NOTICE,
  VERDICT_LABEL,
  type VerdictCardData,
  verdictPrice,
} from "@/lib/verdict-card";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const day = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export function VerdictCard({ data }: { data: VerdictCardData }) {
  const price = verdictPrice(data.precoId);
  return (
    <section
      className="verdict-card not-prose my-8 border border-border border-t-4 border-t-accent bg-surface p-5"
      aria-label="Veredito"
      data-decisao={data.decisao}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow page-kicker">Veredito</p>
        <p className="font-display text-2xl font-extrabold tracking-tight">
          {VERDICT_LABEL[data.decisao]}
        </p>
      </div>
      {price ? (
        <p className="mt-2 text-sm text-muted">
          <strong className="price-badge text-fg">{brl.format(price.amount)}</strong> na {price.store} em{" "}
          <time dateTime={price.date}>{day.format(new Date(price.date))}</time>
        </p>
      ) : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {data.pros.length > 0 ? (
          <div>
            <p className="text-sm font-semibold">Prós</p>
            <ul className="mt-1.5 list-disc pl-5 text-sm leading-6">
              {data.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {data.contras.length > 0 ? (
          <div>
            <p className="text-sm font-semibold">Contras</p>
            <ul className="mt-1.5 list-disc pl-5 text-sm leading-6">
              {data.contras.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {data.praQuem ? (
        <p className="mt-4 text-sm leading-6">
          <strong>Pra quem é:</strong> {data.praQuem}
        </p>
      ) : null}
      {price?.href ? (
        <div className="mt-4 border-t border-border pt-4">
          <a
            href={price.href}
            rel={AFFILIATE_REL}
            target="_blank"
            className="inline-block rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Ver na {price.store}
          </a>
          <p className="mt-2 text-xs leading-5 text-muted">{AFFILIATE_CARD_NOTICE}</p>
        </div>
      ) : null}
    </section>
  );
}
