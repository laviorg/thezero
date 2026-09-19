export const THEME_STORAGE_KEY = "thezero-theme";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = "light" | "dark";

export const themeColor = {
  light: "#F6F7F9",
  dark: "#0C1018",
} as const;

/** Social cards stay on a navy field so type and the wordmark keep contrast. */
export const ogPalette = {
  bg: "#0C1220",
  fg: "#F4F6FB",
  muted: "#93A0B5",
  accent: "#6EA8FF",
} as const;

export function isThemePreference(value: string | null): value is ThemePreference {
  return (
    value === "light" || value === "dark" || value === "system"
  );
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/**
 * Runs before paint so the first frame matches the stored preference.
 * Unset storage defaults to light (the designed newsroom).
 */
export const themeInitScript = `(function(){
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = localStorage.getItem(key);
    var pref = stored === "dark" || stored === "system" || stored === "light" ? stored : "light";
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = pref === "system" ? (systemDark ? "dark" : "light") : pref;
    var root = document.documentElement;
    if (resolved === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = resolved;
    root.setAttribute("data-theme", pref);
    var color = resolved === "dark" ? ${JSON.stringify(themeColor.dark)} : ${JSON.stringify(themeColor.light)};
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", color);
  } catch (e) {}
})();`;
