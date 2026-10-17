"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { getGaMeasurementId } from "@/lib/analytics";
import Script from "next/script";

/**
 * Loads gtag / GA4 only when a real measurement ID is configured and the
 * reader accepted analytics cookies ("Aceitar tudo" ou "Só estatísticas").
 * A escolha de publicidade é separada e fica com o AdSense.
 */
export function GoogleAnalyticsScript() {
  const measurementId = getGaMeasurementId();
  const { analyticsAllowed } = useConsent();

  if (!measurementId || !analyticsAllowed) return null;

  return (
    <>
      <Script
        id="ga4-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
