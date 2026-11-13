import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/** Public auth screens — signed-in users are sent into the app. */
export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
