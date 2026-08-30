import { Platform } from 'react-native';

/**
 * 内置 HTML 路径（构建时由 expo-custom-assets 写入原生包）
 *
 * - Android: android/app/src/main/assets/web/  →  file:///android_asset/web/
 * - iOS:     ios/Assets/web/                   →  bundle 内 Assets/web/
 */
export const LOCAL_WEB_URI = Platform.select({
  android: 'file:///android_asset/web/index.html',
  ios: 'web/index.html',
  default: 'file:///android_asset/web/index.html',
})!;

export const LOCAL_WEB_READ_ACCESS = Platform.select({
  android: 'file:///android_asset/web/',
  ios: 'web/',
  default: undefined,
});
