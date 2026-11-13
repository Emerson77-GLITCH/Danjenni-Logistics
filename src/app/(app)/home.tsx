import { useClerk, useUser } from "@clerk/expo";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/** Placeholder home — confirms sign-in works. Replaced by the dashboard in Phase 4. */
export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);

  const name = user?.firstName ?? user?.fullName ?? "there";
  const email = user?.primaryEmailAddress?.emailAddress;

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(); // the (app) layout guard then redirects to /log-in
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-navy-950">
      <StatusBar style="auto" />
      <View className="mt-[26px] flex-row items-center justify-between pl-[23px] pr-[23px]">
        <BrandLogo />
        <ThemeToggle />
      </View>

      <View className="flex-1 justify-center px-[30px]">
        <Text className="font-inter-bold text-[27px] text-navy-900 dark:text-white">
          Hello, {name}
        </Text>
        {email && (
          <Text className="mt-[8px] font-inter text-[14px] text-ink-muted dark:text-slate-300">
            Signed in as {email}
          </Text>
        )}
        <Text className="mt-[16px] font-inter text-[14px] text-ink-muted dark:text-slate-300">
          Your shipments and invoices will appear here.
        </Text>

        <Pressable
          onPress={onSignOut}
          disabled={signingOut}
          accessibilityRole="button"
          className="mt-[32px] h-[45px] items-center justify-center rounded-[4px] border border-line active:opacity-70 dark:border-navy-700"
        >
          {signingOut ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-inter-semibold text-[14.5px] text-navy-900 dark:text-white">
              Sign out
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
