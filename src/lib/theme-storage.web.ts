// Web preview: use localStorage instead of expo-sqlite (which needs wasm + COOP/COEP headers on web).
export type ThemePreference = "light" | "dark";

const KEY = "theme-preference";

export function loadThemePreference(): ThemePreference | null {
  try {
    const value = globalThis.localStorage?.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function saveThemePreference(value: ThemePreference) {
  try {
    globalThis.localStorage?.setItem(KEY, value);
  } catch {
    // Not critical — the choice just won't survive a reload.
  }
}
