import { ActivityIndicator, Pressable, Text } from "react-native";

import { Image } from "@/components/ui/interop";
import { colors, useThemeColor } from "@/hooks/use-theme-color";

const ICONS = {
  google: require("@/assets/images/icons/google.svg"),
  apple: require("@/assets/images/icons/apple.svg"),
};

type Variant = "login" | "signup";

const STYLES: Record<Variant, { box: string; text: string; google: string; apple: string }> = {
  // design/dj-logistics-04-log-in.jpg
  login: {
    box: "h-[43px] border-line",
    text: "ml-[12px] text-[12px]",
    google: "h-[18px] w-[18px]",
    apple: "h-[19px] w-[16px]",
  },
  // design/dj-logistics-03-sign-up.jpg
  signup: {
    box: "h-[37px] border-line-strong",
    text: "ml-[12px] text-[10.5px]",
    google: "h-[18px] w-[18px]",
    apple: "h-[16px] w-[14px]",
  },
};

type Props = {
  provider: keyof typeof ICONS;
  label: string;
  variant?: Variant;
  onPress?: () => void;
  /** This button's flow is in progress. */
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Outlined OAuth button (Google / Apple) from the auth mockups. */
export function SocialButton({
  provider,
  label,
  variant = "login",
  onPress,
  loading,
  disabled,
  className,
}: Props) {
  const s = STYLES[variant];
  const appleTint = useThemeColor(colors.black, colors.white);
  const spinner = useThemeColor(colors.navy[900], colors.white);
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      className={`flex-row items-center justify-center rounded-[4px] border bg-white active:opacity-70 dark:border-navy-700 dark:bg-navy-800 ${s.box} ${disabled && !loading ? "opacity-50" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinner} />
      ) : (
        <Image
          source={ICONS[provider]}
          contentFit="contain"
          tintColor={provider === "apple" ? appleTint : undefined}
          className={provider === "apple" ? s.apple : s.google}
        />
      )}
      <Text className={`font-inter-medium text-navy-900 dark:text-white ${s.text}`}>{label}</Text>
    </Pressable>
  );
}
