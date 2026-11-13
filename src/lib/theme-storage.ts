import Storage from "expo-sqlite/kv-store";

export type ThemePreference = "light" | "dark";

const KEY = "theme-preference";

/** Saved light/dark choice, or null if the user never picked one (follow the system). */
export function loadThemePreference(): ThemePreference | null {
  try {
    const value = Storage.getItemSync(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function saveThemePreference(value: ThemePreference) {
  try {
    Storage.setItemSync(KEY, value);
  } catch {
    // Not critical — the choice just won't survive a restart.
  }
}
