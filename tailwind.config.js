const { colors } = require("./src/theme/tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // All files that use Nativewind `className`s (Expo Router screens, components, hooks, etc.)
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // "class" lets Nativewind control the color scheme (required on web, where the
  // default "media" mode throws "Cannot manually set color scheme").
  darkMode: "class",
  theme: {
    extend: {
      // Brand tokens live in src/theme/tokens.js (shared with components).
      colors,
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
