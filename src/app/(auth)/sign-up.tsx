import lightWeight from "expo-symbols/androidWeights/light";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthTextField } from "@/components/auth/auth-text-field";
import { SocialButton } from "@/components/auth/social-button";
import { BrandMark } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SymbolView } from "@/components/ui/interop";
import { useSocialSignIn } from "@/hooks/use-social-sign-in";
import { colors, useThemeColor } from "@/hooks/use-theme-color";

/**
 * Sign up — recreates design/dj-logistics-03-sign-up.jpg.
 * Google/Apple via Clerk SSO (same flow signs up new users); the email form + verification
 * code is still to do (PLAN.md Phase 2).
 */
export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const arrowColor = useThemeColor(colors.navy[900], colors.white);
  const { signInWith, pending, error: ssoError } = useSocialSignIn();

  const goToLogIn = () => (router.canGoBack() ? router.back() : router.replace("/log-in"));

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-navy-950" edges={["top", "bottom"]}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerClassName="grow pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header: mark, then back arrow on its own row */}
          <View className="flex-row items-center justify-between pl-[16px] pr-[23px] pt-[17px]">
            <BrandMark className="h-[27px] w-[27px]" />
            <ThemeToggle />
          </View>
          <Pressable
            onPress={goToLogIn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            className="ml-[20px] mt-[21px] self-start"
          >
            <SymbolView
              name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
              weight={{ ios: "regular", android: lightWeight }}
              size={20}
              tintColor={arrowColor}
            />
          </Pressable>

          <View className="px-[23px]">
            <Text className="mt-[19px] font-inter-bold text-[26px] leading-[32px] text-navy-900 dark:text-white">
              Create your account
            </Text>
            <Text className="mt-[7px] font-inter text-[13px] leading-[18px] text-navy-900 dark:text-slate-300">
              Join D&amp;J Logistics and manage your logistics.
            </Text>

            <View className="mt-[28px] flex-row gap-[10.5px]">
              <SocialButton
                className="flex-1"
                variant="signup"
                provider="google"
                label="Continue with Google"
                onPress={() => signInWith("google")}
                loading={pending === "google"}
                disabled={!!pending}
              />
              <SocialButton
                className="flex-1"
                variant="signup"
                provider="apple"
                label="Continue with Apple"
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

            {/* Divider */}
            <View className="mt-[24.5px] h-[16px] flex-row items-center">
              <View className="h-px flex-1 bg-line-strong dark:bg-navy-700" />
              <Text className="mx-[9px] font-inter text-[10.5px] leading-[16px] text-ink-muted dark:text-slate-300">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-line-strong dark:bg-navy-700" />
            </View>

            <AuthTextField
              variant="signup"
              className="mt-[19px]"
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
            <AuthTextField
              variant="signup"
              className="mt-[15px]"
              label="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <AuthTextField
              variant="signup"
              className="mt-[15.5px]"
              label="Password"
              password="withToggle"
              value={password}
              onChangeText={setPassword}
              autoComplete="new-password"
              textContentType="newPassword"
            />

            {/* Mount point for Clerk bot protection (required on custom sign-up screens). */}
            <View nativeID="clerk-captcha" />

            <Pressable
              accessibilityRole="button"
              className="mt-[17.5px] h-[41.5px] items-center justify-center rounded-[4px] bg-cobalt-600 active:opacity-85 dark:bg-cobalt-500"
            >
              <Text className="font-inter-semibold text-[14px] text-white">Create account</Text>
            </Pressable>

            <View className="mt-[24px] flex-row items-center justify-center">
              <Text className="font-inter text-[12.5px] leading-[18px] text-navy-900 dark:text-white">
                Already have an account?{" "}
              </Text>
              <Pressable onPress={goToLogIn} accessibilityRole="link" hitSlop={8}>
                <Text className="font-inter-semibold text-[12.5px] leading-[18px] text-cobalt-600 dark:text-cobalt-500">
                  Log in.
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
