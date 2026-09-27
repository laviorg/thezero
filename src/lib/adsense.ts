import { site } from "./site.ts";

/** IAB certified seller ID for Google’s ad systems (AdSense / Ad Manager). */
export const GOOGLE_ADS_TXT_CERT = "f08c47fec0942fa0";

const PUB_ID_RE = /^(?:ca-)?(pub-\d{16})$/i;

/**
 * Accept `pub-` or `ca-pub-` and return the ads.txt form (`pub-` + 16 digits).
 * Returns null for empty, placeholder, or malformed values — never invents an ID.
 */
export function normalizeAdsensePubId(
  raw: string | undefined | null,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(PUB_ID_RE);
  return match ? match[1].toLowerCase() : null;
}

export function adsenseClientId(pubId: string): string {
  return pubId.startsWith("ca-") ? pubId : `ca-${pubId}`;
}

export function getAdsensePubId(
  raw = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID,
): string | null {
  return normalizeAdsensePubId(raw);
}

/** Publisher ID declared in ads.txt. The ad script still waits on the env var. */
export const GOOGLE_ADS_PUB_ID = "pub-3679376723096233";

export function buildAdsTxt(): string {
  return [
    `google.com, ${GOOGLE_ADS_PUB_ID}, DIRECT, ${GOOGLE_ADS_TXT_CERT}`,
    `CONTACT=mailto:${site.email}`,
    "",
  ].join("\n");
}
