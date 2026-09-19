export const CONSENT_STORAGE_KEY = "thezero-consent";
export const CONSENT_VERSION = 1;

export type StoredConsent = {
  version: number;
  advertising: boolean;
  updatedAt: string;
};

export function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === CONSENT_VERSION &&
    typeof record.advertising === "boolean" &&
    typeof record.updatedAt === "string"
  );
}

export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function serializeConsent(advertising: boolean, now = new Date()): string {
  const value: StoredConsent = {
    version: CONSENT_VERSION,
    advertising,
    updatedAt: now.toISOString(),
  };
  return JSON.stringify(value);
}
