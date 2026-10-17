export const CONSENT_STORAGE_KEY = "thezero-consent";
export const CONSENT_VERSION = 2;

export type StoredConsent = {
  version: number;
  advertising: boolean;
  analytics: boolean;
  updatedAt: string;
};

export function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === CONSENT_VERSION &&
    typeof record.advertising === "boolean" &&
    typeof record.analytics === "boolean" &&
    typeof record.updatedAt === "string"
  );
}

/**
 * Lê o consentimento gravado. A versão 1 tinha uma escolha só
 * ("publicidade", que também ligava o Analytics): quem tinha aceitado
 * migra com os dois ligados; quem tinha recusado, com os dois desligados.
 * Qualquer outra forma inválida volta a mostrar o aviso.
 */
export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isStoredConsent(parsed)) return parsed;
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as Record<string, unknown>).version === 1 &&
      typeof (parsed as Record<string, unknown>).advertising === "boolean" &&
      typeof (parsed as Record<string, unknown>).updatedAt === "string"
    ) {
      const legacy = parsed as { advertising: boolean; updatedAt: string };
      return {
        version: CONSENT_VERSION,
        advertising: legacy.advertising,
        analytics: legacy.advertising,
        updatedAt: legacy.updatedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function serializeConsent(
  advertising: boolean,
  analytics: boolean,
  now = new Date(),
): string {
  const value: StoredConsent = {
    version: CONSENT_VERSION,
    advertising,
    analytics,
    updatedAt: now.toISOString(),
  };
  return JSON.stringify(value);
}
