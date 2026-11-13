import { colorScheme, useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { loadThemePreference, saveThemePreference, type ThemePreference } from "@/lib/theme-storage";

/**
 * Applies the app theme: the user's saved choice, or the phone's setting if they
 * never picked one (and keeps following the phone until they do). Call once, in
 * the root layout.
 */
export function useApplyAppTheme() {
  const systemScheme = useSystemColorScheme();

  useEffect(() => {
    // An explicit "light"/"dark" is required for `dark:` classes (darkMode: "class").
    // `colorScheme.set` is stable, unlike the hook's setter (new function each render).
    colorScheme.set(loadThemePreference() ?? (systemScheme === "dark" ? "dark" : "light"));
  }, [systemScheme]);
}

/** Current theme + a toggle that switches light ⇄ dark and remembers the choice. */
export function useAppTheme() {
  const { colorScheme: current } = useNativewindColorScheme();
  const theme: ThemePreference = current === "dark" ? "dark" : "light";

  const toggleTheme = () => {
    const next: ThemePreference = theme === "dark" ? "light" : "dark";
    saveThemePreference(next);
    colorScheme.set(next);
  };

  return { theme, toggleTheme };
}
