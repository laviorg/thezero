"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { getGaMeasurementId } from "@/lib/analytics";
import Script from "next/script";

/**
 * Loads gtag / GA4 only when a real measurement ID is configured and the
 * reader accepted advertising/analytics cookies. Same gate as AdSense.
 * "Só o necessário" does not load Analytics.
 */
export function GoogleAnalyticsScript() {
  const measurementId = getGaMeasurementId();
  const { advertisingAllowed } = useConsent();

  if (!measurementId || !advertisingAllowed) return null;

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
