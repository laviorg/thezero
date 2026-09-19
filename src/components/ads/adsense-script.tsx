"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { adsenseClientId, getAdsensePubId } from "@/lib/adsense";
import Script from "next/script";

/**
 * Loads the official AdSense bootstrap only when a real publisher ID is
 * configured and the reader accepted advertising cookies. No invented client.
 */
export function AdSenseScript() {
  const pubId = getAdsensePubId();
  const { advertisingAllowed } = useConsent();

  if (!pubId || !advertisingAllowed) return null;

  const client = adsenseClientId(pubId);

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
