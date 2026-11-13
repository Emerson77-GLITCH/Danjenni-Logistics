import lightWeight from "expo-symbols/androidWeights/light";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthTextField } from "@/components/auth/auth-text-field";
import { SocialButton } from "@/components/auth/social-button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SymbolView } from "@/components/ui/interop";
import { useSocialSignIn } from "@/hooks/use-social-sign-in";
import { colors, useThemeColor } from "@/hooks/use-theme-color";

/**
 * Log in — recreates design/dj-logistics-04-log-in.jpg.
 * Google/Apple sign in via Clerk SSO; email + password wiring is still to do (PLAN.md Phase 2).
 */
export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const arrowColor = useThemeColor(colors.navy[900], colors.white);
  const { signInWith, pending, error: ssoError } = useSocialSignIn();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-navy-950" edges={["top", "bottom"]}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerClassName="grow pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header: logo + back */}
          <View className="mt-[26px] flex-row items-center justify-between pl-[23px] pr-[21px]">
            <BrandLogo />
            <View className="flex-row items-center gap-[20px]">
              <ThemeToggle />
              <Pressable
                onPress={() => router.canGoBack() && router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={12}
              >
                <SymbolView
                  name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
                  weight={{ ios: "regular", android: lightWeight }}
                  size={22}
                  tintColor={arrowColor}
                />
              </Pressable>
            </View>
          </View>

          <View className="px-[30px]">
            <Text className="mt-[53px] font-inter-bold text-[27.5px] leading-[34px] text-navy-900 dark:text-white">
              Welcome back
            </Text>
            <Text className="mt-[9px] font-inter text-[13.3px] leading-[20px] text-ink-muted dark:text-slate-300">
              Sign in to continue to your account.
            </Text>

            <AuthTextField
              className="mt-[28px]"
              label="Email address"
              icon={{ ios: "envelope", material: "mail" }}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <AuthTextField
              className="mt-[24px]"
              label="Password"
              icon={{ ios: "lock", material: "lock" }}
              password="plain"
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              textContentType="password"
            />

            <Pressable className="mt-[7px] self-end" accessibilityRole="link" hitSlop={8}>
              <Text className="font-inter text-[10.2px] leading-[16px] text-navy-900 dark:text-slate-200">
                Forgot password?
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              className="mt-[21px] h-[45px] items-center justify-center rounded-[4px] bg-cobalt-600 active:opacity-85 dark:bg-cobalt-500"
            >
              <Text className="font-inter-semibold text-[14.5px] text-white">Log in</Text>
            </Pressable>

            {/* Divider */}
            <View className="mt-[18px] h-[16px] flex-row items-center">
              <View className="h-px flex-1 bg-line dark:bg-navy-700" />
              <Text className="mx-[13px] font-inter text-[10.2px] leading-[16px] text-navy-900 dark:text-slate-300">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-line dark:bg-navy-700" />
            </View>

            <View className="mt-[14px] flex-row gap-[12px]">
              <SocialButton
                className="flex-1"
                provider="google"
                label="Google"
                onPress={() => signInWith("google")}
                loading={pending === "google"}
                disabled={!!pending}
              />
              <SocialButton
                className="flex-1"
                provider="apple"
                label="Apple"
                onPress={() => signInWith("apple")}
                loading={pending === "apple"}
                disabled={!!pending}
              />
            </View>
            {ssoError && (
              <Text className="mt-[8px] text-center font-inter text-[12px] text-danger-500">
                {ssoError}
              </Text>
            )}

            <View className="mt-[32px] flex-row items-center justify-center">
              <Text className="font-inter-medium text-[12.2px] leading-[20px] text-navy-900 dark:text-white">
                New to D&amp;J?{" "}
              </Text>
              <Pressable onPress={() => router.push("/sign-up")} accessibilityRole="link" hitSlop={8}>
                <Text className="ml-[3px] font-inter-medium text-[12.2px] leading-[20px] text-orange-500">
                  Create account
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
