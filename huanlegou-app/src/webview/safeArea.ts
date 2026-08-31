import { Platform } from 'react-native';

/** Android 手势条：SafeAreaContext 常报 0 时的兜底（dp） */
export const ANDROID_BOTTOM_INSET_FALLBACK = 28;

export const WEB_IN_APP_CLASS = 'in-app-webview';

/** 底部安全区：原生 bottomInset 白条高度的唯一数据源 */
export function resolveBottomInset(rawBottom: number): number {
  if (rawBottom > 0) return rawBottom;
  if (Platform.OS === 'android') return ANDROID_BOTTOM_INSET_FALLBACK;
  return 0;
}

/** WebView 内仅标记 in-app；bottom inset 由原生 padding 负责，不再注入 --safe-bottom */
export function buildInAppWebBootstrapScript(): string {
  return `(function(){document.documentElement.classList.add('${WEB_IN_APP_CLASS}');})();true;`;
}
