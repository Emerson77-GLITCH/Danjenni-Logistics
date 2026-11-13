import { useColorScheme } from "nativewind";

import { colors } from "@/theme/tokens";

/** Pick a token color for the current scheme, for native props that can't use className. */
export function useThemeColor(light: string, dark: string) {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? dark : light;
}

export { colors };
