// Sentry's Expo config wraps Expo's default Metro config (adds Debug IDs for source maps).
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
