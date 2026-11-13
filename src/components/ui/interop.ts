import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { cssInterop } from "nativewind";

// Allow sizing/positioning these native components with `className`.
// Colors for `tintColor` must be passed as props (see useThemeColor) — on web
// NativeWind emits real CSS, so className colors can't be mapped to props there.
cssInterop(SymbolView, { className: "style" });
cssInterop(Image, { className: "style" });

export { Image, SymbolView };
