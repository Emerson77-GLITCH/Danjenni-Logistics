import { Text, View } from "react-native";

import { Image } from "@/components/ui/interop";

const MARK = require("@/assets/images/logo-mark.png");

/** D&J Logistics swoosh mark only. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      source={MARK}
      className={className ?? "h-[27px] w-[31px]"}
      contentFit="contain"
      accessibilityLabel="D&J Logistics"
    />
  );
}

/** D&J Logistics logo: swoosh mark + two-line wordmark. */
export function BrandLogo() {
  return (
    <View className="flex-row items-center" accessibilityRole="image" accessibilityLabel="D&J Logistics">
      <BrandMark />
      <View className="ml-[7px]">
        <Text className="font-inter-bold text-[13px] leading-[13px] text-navy-900 dark:text-white">
          D&amp;J
        </Text>
        <Text className="font-inter-bold text-[13px] leading-[13px] text-navy-900 dark:text-white">
          Logistics
        </Text>
      </View>
    </View>
  );
}
