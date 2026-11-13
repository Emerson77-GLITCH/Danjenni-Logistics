import lightWeight from "expo-symbols/androidWeights/light";
import { Pressable } from "react-native";

import { SymbolView } from "@/components/ui/interop";
import { useAppTheme } from "@/hooks/use-app-theme";
import { colors, useThemeColor } from "@/hooks/use-theme-color";

/** Sun/moon button that switches between light and dark mode. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useAppTheme();
  const tint = useThemeColor(colors.navy[900], colors.white);
  const isDark = theme === "dark";

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      hitSlop={12}
      className={`active:opacity-60 ${className ?? ""}`}
    >
      <SymbolView
        name={{
          ios: isDark ? "sun.max" : "moon",
          android: isDark ? "light_mode" : "dark_mode",
          web: isDark ? "light_mode" : "dark_mode",
        }}
        weight={{ ios: "regular", android: lightWeight }}
        size={20}
        tintColor={tint}
      />
    </Pressable>
  );
}
