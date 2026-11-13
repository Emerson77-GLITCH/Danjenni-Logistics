import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/**
 * Protected app area — signed-out users go to log in.
 * Will become the NativeTabs layout (Shipments, Invoices, …) in later phases.
 */
export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/log-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
