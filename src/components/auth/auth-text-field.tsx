import type { AndroidSymbol, SFSymbol } from "expo-symbols";
import lightWeight from "expo-symbols/androidWeights/light";
import { useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";

import { SymbolView } from "@/components/ui/interop";
import { colors, useThemeColor } from "@/hooks/use-theme-color";

type Variant = "login" | "signup";

type Props = Omit<TextInputProps, "secureTextEntry"> & {
  label: string;
  /** Leading icon (log-in design). */
  icon?: { ios: SFSymbol; material: AndroidSymbol };
  /** Password field; `withToggle` adds the show/hide eye (sign-up design). */
  password?: "plain" | "withToggle";
  variant?: Variant;
};

const STYLES: Record<Variant, { label: string; field: string; border: string }> = {
  // design/dj-logistics-04-log-in.jpg
  login: {
    label: "mb-[8px] text-[12px] leading-[16px]",
    field: "h-[45px] px-[15px]",
    border: "border-line",
  },
  // design/dj-logistics-03-sign-up.jpg
  signup: {
    label: "mb-[3px] text-[11px] leading-[16px]",
    field: "h-[39px] pl-[14px] pr-[10px]",
    border: "border-line-strong",
  },
};

/** Labelled text field matching the auth mockups. */
export function AuthTextField({
  label,
  icon,
  password,
  variant = "login",
  className,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const s = STYLES[variant];
  const iconColor = useThemeColor(colors.ink.icon, colors.ink["icon-dark"]);
  const textColor = useThemeColor(colors.navy[900], colors.white);

  return (
    <View className={className}>
      <Text className={`font-inter-medium text-navy-900 dark:text-white ${s.label}`}>{label}</Text>
      <View
        className={`flex-row items-center rounded-[4px] border bg-white dark:bg-navy-800 ${s.field} ${
          focused ? "border-cobalt-600 dark:border-cobalt-500" : `${s.border} dark:border-navy-700`
        }`}
      >
        {icon && (
          <SymbolView
            name={{ ios: icon.ios, android: icon.material, web: icon.material }}
            weight={{ ios: "light", android: lightWeight }}
            size={20}
            tintColor={iconColor}
          />
        )}
        <TextInput
          {...inputProps}
          secureTextEntry={!!password && hidden}
          accessibilityLabel={label}
          selectionColor={colors.cobalt[600]}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={{ color: textColor }}
          className={`h-full flex-1 font-inter text-[14px] outline-none ${icon ? "ml-[12px]" : ""}`}
        />
        {password === "withToggle" && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={10}
          >
            <SymbolView
              name={{
                ios: hidden ? "eye" : "eye.slash",
                android: hidden ? "visibility" : "visibility_off",
                web: hidden ? "visibility" : "visibility_off",
              }}
              weight={{ ios: "light", android: lightWeight }}
              size={16}
              tintColor={iconColor}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
