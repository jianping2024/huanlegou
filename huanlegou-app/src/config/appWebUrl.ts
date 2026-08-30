import Constants from 'expo-constants';

const DEFAULT_WEB_APP_URL = 'https://huanlegou.vercel.app';

/** App WebView 加载的远程页面根地址（index.html） */
export function getAppWebUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const fromExtra = Constants.expoConfig?.extra?.webAppUrl as string | undefined;
  if (fromExtra?.trim()) return fromExtra.trim().replace(/\/$/, '');

  return DEFAULT_WEB_APP_URL;
}

export const APP_WEB_URL = `${getAppWebUrl()}/index.html`;
