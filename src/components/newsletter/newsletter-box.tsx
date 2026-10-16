import { Wordmark } from "@/components/brand/logo";
import { KIT_FORM_ACTION, NEWSLETTER_ENABLED, NEWSLETTER_NAME } from "@/lib/newsletter";

/**
 * Caixa da newsletter, sem pop-up. Enquanto o Kit não está ligado, fica no
 * HTML com `hidden` (placeholder pronto para plugar).
 */
export function NewsletterBox({ placement = "fim" }: { placement?: string }) {
  return (
    <aside
      id={placement === "fim" ? "newsletter" : undefined}
      hidden={!NEWSLETTER_ENABLED}
      data-newsletter={placement}
      className="newsletter-box not-prose my-10 border border-border border-t-2 border-t-accent bg-surface p-5"
      aria-label={`Newsletter ${NEWSLETTER_NAME}`}
    >
      <Wordmark aria-hidden className="mb-3 h-7 w-auto text-fg" />
      <p className="eyebrow page-kicker">Newsletter</p>
      <p className="font-display mt-1.5 text-xl font-bold tracking-tight">{NEWSLETTER_NAME}</p>
      <p className="mt-1.5 text-sm leading-6 text-muted">
        O que importa em tecnologia no Brasil, direto no seu e-mail. Sem spam; você sai quando quiser.
      </p>
      {NEWSLETTER_ENABLED ? (
        <form action={KIT_FORM_ACTION} method="post" target="_blank" className="mt-4 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`nl-email-${placement}`}>E-mail</label>
          <input
            id={`nl-email-${placement}`}
            type="email"
            name="email_address"
            required
            placeholder="seu@email.com"
            className="min-w-0 flex-1 rounded-sm border border-border bg-bg px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white">
            Assinar
          </button>
        </form>
      ) : null}
    </aside>
  );
}
