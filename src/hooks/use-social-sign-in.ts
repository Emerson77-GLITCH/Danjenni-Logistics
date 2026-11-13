import { useSSO } from "@clerk/expo";
import { router, type Href } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export type SocialProvider = "google" | "apple";

const STRATEGY = { google: "oauth_google", apple: "oauth_apple" } as const;

// Preloads the browser on Android to cut auth load time.
// See https://docs.expo.dev/guides/authentication/#improving-user-experience
function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

/**
 * Google / Apple sign-in via Clerk's browser SSO flow (`useSSO`).
 * One flow for both sign-in and sign-up: new users are created automatically.
 * Redirect URL defaults to `danjenni://sso-callback` (must be allowed in the Clerk
 * Dashboard → Native applications). `ClerkProvider` completes the auth session itself.
 */
export function useSocialSignIn() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const [pending, setPending] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWith = async (provider: SocialProvider) => {
    if (pending) return;
    setPending(provider);
    setError(null);
    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: STRATEGY[provider],
      });

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
          navigate: async ({ session, decorateUrl }) => {
            // Session tasks (e.g. choose an organization) — none are enabled yet.
            if (session?.currentTask) {
              console.warn("Clerk session task pending:", session.currentTask.key);
              return;
            }
            const url = decorateUrl("/home");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.replace(url as Href);
            }
          },
        });
      } else if (signUp?.status === "missing_requirements") {
        // Instance requires fields the provider didn't supply.
        setError("We couldn't finish creating your account. Please try again or contact support.");
      }
      // No session and no missing requirements → the user cancelled. Not an error.
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError("Sign-in failed. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return { signInWith, pending, error };
}
