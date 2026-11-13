import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable } from "react-native";

import { Image } from "@/components/ui/interop";

const SPLASH_DURATION_MS = 2500;

/**
 * Branded splash (design/dj-logistics-01-splash.jpg). Once Clerk has restored the
 * session, goes to home (signed in) or log in (signed out). Tap to skip.
 */
export default function Splash() {
  const { isLoaded, isSignedIn } = useAuth();
  const next = isSignedIn ? "/home" : "/log-in";

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => router.replace(next), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [isLoaded, next]);

  return (
    <Pressable
      className="flex-1 bg-splash"
      onPress={() => isLoaded && router.replace(next)}
      accessibilityLabel="D&J Logistics. Your Cargo. Our Priority."
    >
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash-demo.jpg")}
        className="absolute inset-0"
        contentFit="cover"
        contentPosition="center"
      />
    </Pressable>
  );
}
