const GA_MEASUREMENT_ID_RE = /^G-[A-Z0-9]+$/i;

/**
 * Accept a GA4 measurement ID (`G-` + alphanumerics). Returns null for empty,
 * Universal Analytics (`UA-`), GTM, or malformed values — never invents an ID.
 */
export function normalizeGaMeasurementId(
  raw: string | undefined | null,
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return GA_MEASUREMENT_ID_RE.test(trimmed) ? trimmed.toUpperCase() : null;
}

export function getGaMeasurementId(
  raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
): string | null {
  return normalizeGaMeasurementId(raw);
}
