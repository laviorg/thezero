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
  ready: boolean;
  showBanner: boolean;
  advertisingAllowed: boolean;
  acceptAdvertising: () => void;
  rejectAdvertising: () => void;
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readConsent(): StoredConsent | null {
  return parseStoredConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onExternalChange = () => listener();
  window.addEventListener("storage", onExternalChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onExternalChange);
  };
}

function writeConsent(advertising: boolean) {
  localStorage.setItem(CONSENT_STORAGE_KEY, serializeConsent(advertising));
  emit();
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(
    subscribe,
    readConsent,
    () => null,
  );
  const [forceBanner, setForceBanner] = useState(false);

  const acceptAdvertising = useCallback(() => {
    writeConsent(true);
    setForceBanner(false);
  }, []);

  const rejectAdvertising = useCallback(() => {
    writeConsent(false);
    setForceBanner(false);
  }, []);

  const openPreferences = useCallback(() => {
    setForceBanner(true);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      ready: true,
      showBanner: forceBanner || consent === null,
      advertisingAllowed: consent?.advertising === true,
      acceptAdvertising,
      rejectAdvertising,
      openPreferences,
    }),
    [consent, forceBanner, acceptAdvertising, rejectAdvertising, openPreferences],
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
