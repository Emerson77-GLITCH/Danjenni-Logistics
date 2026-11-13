// Single source of truth for brand colors.
// Used by tailwind.config.js (className tokens) and by components that need a raw
// color value for a native prop (e.g. SymbolView `tintColor`, which can't come
// from className on web).
// Sampled from design/dj-logistics-design-system.jpg and the screen mockups.
const colors = {
  navy: {
    900: "#0B1736", // headings, primary text
    950: "#060E24", // dark-mode background
    800: "#14234A", // dark-mode surfaces
    700: "#22325C", // dark-mode borders
  },
  cobalt: {
    600: "#0058F0", // primary buttons, links
    500: "#2E77F5", // primary (dark mode)
  },
  sky: { 100: "#C9DDFF" },
  orange: { 500: "#EC9428" }, // secondary accent / links
  teal: { 500: "#14A89A" },
  success: { 500: "#10B981" },
  warning: { 500: "#F59E0B" },
  danger: { 500: "#EF4444" },
  ink: {
    muted: "#3F4457", // secondary text
    icon: "#363A47", // input icons
    "icon-dark": "#CBD5E1", // input icons (dark mode)
  },
  line: {
    DEFAULT: "#D9DCE0", // input / button borders, dividers
    strong: "#C8CCD4", // sign-up form borders
  },
  splash: "#002058", // splash background (matches splash artwork)
  white: "#FFFFFF",
  black: "#000000",
};

module.exports = { colors };
