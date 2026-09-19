"use client";

import {
  CONSENT_STORAGE_KEY,
  parseStoredConsent,
  serializeConsent,
  type StoredConsent,
} from "@/lib/consent";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ConsentContextValue = {
  consent: StoredConsent | null;
  showBanner: boolean;
  advertisingAllowed: boolean;
  acceptAdvertising: () => void;
  rejectAdvertising: () => void;
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: StoredConsent | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function getConsentSnapshot(): StoredConsent | null {
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parseStoredConsent(raw);
  return cachedValue;
}

function getServerConsentSnapshot(): StoredConsent | null {
  return null;
}

function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function persistConsent(advertising: boolean) {
  const raw = serializeConsent(advertising);
  localStorage.setItem(CONSENT_STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedValue = parseStoredConsent(raw);
  emit();
  return cachedValue;
}

function subscribeClient() {
  return () => {};
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(subscribeClient, () => true, () => false);
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [forceBanner, setForceBanner] = useState(false);

  const acceptAdvertising = useCallback(() => {
    persistConsent(true);
    setForceBanner(false);
  }, []);

  const rejectAdvertising = useCallback(() => {
    persistConsent(false);
    setForceBanner(false);
  }, []);

  const openPreferences = useCallback(() => {
    setForceBanner(true);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      showBanner: isClient && (forceBanner || consent === null),
      advertisingAllowed: consent?.advertising === true,
      acceptAdvertising,
      rejectAdvertising,
      openPreferences,
    }),
    [
      consent,
      isClient,
      forceBanner,
      acceptAdvertising,
      rejectAdvertising,
      openPreferences,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
