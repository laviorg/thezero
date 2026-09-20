"use client";

import { Button } from "@/components/ui/button";
import { useConsent } from "@/components/consent/consent-provider";
import { useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const { showBanner, acceptAdvertising, rejectAdvertising } = useConsent();

  useEffect(() => {
    document.body.classList.toggle("has-cookie-banner", showBanner);
    return () => document.body.classList.remove("has-cookie-banner");
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-copy"
    >
      <div className="shell-frame cookie-banner-inner">
        <div className="min-w-0">
          <p id="cookie-banner-title" className="eyebrow page-kicker">
            Cookies
          </p>
          <p id="cookie-banner-copy" className="mt-1.5 text-sm leading-relaxed text-fg/90">
            Cookies necessários (tema, esta escolha) ficam no seu navegador.
            Google Analytics e a publicidade do AdSense — quando a conta
            estiver no ar — só entram se você aceitar.{" "}
            <Link href="/privacidade" className="text-accent underline-offset-4 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={acceptAdvertising}>
            Aceitar publicidade
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={rejectAdvertising}
          >
            Só o necessário
          </Button>
        </div>
      </div>
    </div>
  );
}
