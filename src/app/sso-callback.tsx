import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

/**
 * Target of the SSO redirect (`danjenni://sso-callback`). Normally the auth browser
 * session intercepts it; if the deep link reaches the router instead, wait for
 * Clerk and send the user to the right place rather than "Unmatched route".
 */
export default function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded) return <Redirect href={isSignedIn ? "/home" : "/log-in"} />;

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-navy-950">
      <ActivityIndicator />
    </View>
  );
}
