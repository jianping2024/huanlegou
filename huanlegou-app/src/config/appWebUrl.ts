import Constants from 'expo-constants';
import { DEFAULT_WEB_APP_URL } from './constants';

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

/** 远程页面根地址（无末尾 /） */
export function getAppWebUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_APP_URL?.trim();
  if (fromEnv) return stripTrailingSlash(fromEnv);

  const fromExtra = Constants.expoConfig?.extra?.webAppUrl as string | undefined;
  if (fromExtra?.trim()) return stripTrailingSlash(fromExtra.trim());

  return DEFAULT_WEB_APP_URL;
}

export const APP_WEB_HOME = `${getAppWebUrl()}/index.html`;
