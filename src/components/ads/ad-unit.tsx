"use client";

import { useConsent } from "@/components/consent/consent-provider";
import {
  adsenseClientId,
  getAdsensePubId,
  getAdsenseSlotHome,
  getAdsenseSlotInArticle,
} from "@/lib/adsense";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdPlacement = "home" | "in-article";

const slotByPlacement: Record<AdPlacement, () => string | null> = {
  home: getAdsenseSlotHome,
  "in-article": getAdsenseSlotInArticle,
};

/**
 * Uma unidade de anúncio do AdSense. Só renderiza quando existe publisher ID,
 * o slot foi criado na UI do AdSense (env) e o leitor aceitou publicidade.
 * Sem slot configurado, some por completo — nada de caixa vazia no ar.
 */
export function AdUnit({ placement }: { placement: AdPlacement }) {
  const pubId = getAdsensePubId();
  const slot = slotByPlacement[placement]();
  const { advertisingAllowed } = useConsent();
  const pushedRef = useRef(false);

  const enabled = Boolean(pubId && slot && advertisingAllowed);

  useEffect(() => {
    if (!enabled || pushedRef.current) return;
    // O push fica na fila até o adsbygoogle.js carregar (padrão do AdSense).
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      pushedRef.current = false;
    }
  }, [enabled]);

  if (!enabled || !pubId || !slot) return null;

  const client = adsenseClientId(pubId);
  const isInArticle = placement === "in-article";

  return (
    <aside
      data-ad-placement={placement}
      aria-label="Publicidade"
      className="not-prose my-8"
    >
      <p className="mb-1 text-center text-[0.6rem] tracking-[0.2em] text-muted uppercase">
        Publicidade
      </p>
      <ins
        className="adsbygoogle"
        style={
          isInArticle
            ? { display: "block", textAlign: "center" }
            : { display: "block" }
        }
        data-ad-layout={isInArticle ? "in-article" : undefined}
        data-ad-format={isInArticle ? "fluid" : "auto"}
        data-ad-client={client}
        data-ad-slot={slot}
        data-full-width-responsive={isInArticle ? undefined : "true"}
      />
    </aside>
  );
}
