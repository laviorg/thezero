import { PageShell } from "@/components/layout/page-shell";
import { NewsletterBox } from "@/components/newsletter/newsletter-box";
import { buildPageMetadata } from "@/lib/metadata";
import { NEWSLETTER_ENABLED, NEWSLETTER_NAME } from "@/lib/newsletter";
import type { Metadata } from "next";

const title = `Newsletter ${NEWSLETTER_NAME}`;
const description = "Assine a Zero Hora Tech, do The Zero. Ruído zero, dado bruto: o que importa em tecnologia no Brasil, direto no seu e-mail.";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title,
    description,
    path: "/newsletter",
    brand: "never",
    imagePath: "/opengraph-image",
    imageAlt: title,
  }),
  // Enquanto o formulário do Kit não está ligado, a página não entra no índice.
  ...(NEWSLETTER_ENABLED ? {} : { robots: { index: false, follow: true } }),
};

export default function NewsletterPage() {
  return (
    <PageShell width="narrow">
      <h1 className="font-display mt-4 text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[1] tracking-tight">
        {NEWSLETTER_NAME}
      </h1>
      {NEWSLETTER_ENABLED ? null : (
        <p className="mt-6 text-base leading-7 text-muted">
          A newsletter está chegando. Enquanto isso, acompanhe as matérias na página inicial.
        </p>
      )}
      <NewsletterBox placement="pagina" />
    </PageShell>
  );
}
