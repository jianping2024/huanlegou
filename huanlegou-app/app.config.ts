import type { ConfigContext, ExpoConfig } from 'expo/config';

/** 部署 huanlegou-prototype 后的 HTTPS 地址，末尾不要 / */
const DEFAULT_WEB_APP_URL = 'https://huanlegou.vercel.app';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '欢乐购',
  slug: 'huanlegou',
  version: '1.0.4',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FF5000',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.huanlegou.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.huanlegou.app',
    permissions: ['INTERNET'],
    adaptiveIcon: {
      backgroundColor: '#FF5000',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-asset'],
  extra: {
    eas: {
      projectId: '366e6c31-8c61-4b50-bffb-8340b5019b88',
    },
    webAppUrl: process.env.EXPO_PUBLIC_WEB_APP_URL ?? DEFAULT_WEB_APP_URL,
  },
  owner: 'yuanlingqi',
});
