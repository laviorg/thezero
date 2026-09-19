"use client";

import {
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveTheme,
  themeColor,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CYCLE: ThemePreference[] = ["light", "dark", "system"];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(stored) ? stored : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onExternalChange = () => {
    applyTheme(readPreference());
    listener();
  };
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onExternalChange);
  window.addEventListener("storage", onExternalChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onExternalChange);
    window.removeEventListener("storage", onExternalChange);
  };
}

function applyTheme(preference: ThemePreference) {
  const resolved = resolveTheme(preference, systemPrefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  root.setAttribute("data-theme", preference);
  const color = themeColor[resolved];
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", color);
  });
  return resolved;
}

function getPreferenceSnapshot(): ThemePreference {
  return readPreference();
}

function getResolvedSnapshot(): ResolvedTheme {
  return resolveTheme(readPreference(), systemPrefersDark());
}

function writePreference(next: ThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  emit();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribe,
    getPreferenceSnapshot,
    () => "light",
  );
  const resolved = useSyncExternalStore<ResolvedTheme>(
    subscribe,
    getResolvedSnapshot,
    () => "light",
  );

  const setPreference = useCallback((next: ThemePreference) => {
    writePreference(next);
  }, []);

  const cyclePreference = useCallback(() => {
    const current = readPreference();
    writePreference(CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, cyclePreference }),
    [preference, resolved, setPreference, cyclePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
