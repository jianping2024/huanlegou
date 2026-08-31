import type { ConfigContext, ExpoConfig } from 'expo/config';

const { APP_VERSION, DEFAULT_WEB_APP_URL } = require('./config/defaults.js');

const splash = {
  image: './assets/splash.png',
  resizeMode: 'cover' as const,
  backgroundColor: '#FF5000',
};

export default ({ config }: ConfigContext): ExpoConfig =>
  ({
    ...config,
    name: '欢乐购',
    slug: 'huanlegou',
    version: APP_VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.huanlegou.app',
      splash,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.huanlegou.app',
      permissions: ['INTERNET'],
      splash,
      adaptiveIcon: {
        backgroundColor: '#FF5000',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          backgroundColor: '#FF5000',
          image: './assets/splash.png',
          resizeMode: 'cover',
        },
      ],
      'expo-asset',
    ],
    extra: {
      eas: {
        projectId: '366e6c31-8c61-4b50-bffb-8340b5019b88',
      },
      webAppUrl: process.env.EXPO_PUBLIC_WEB_APP_URL ?? DEFAULT_WEB_APP_URL,
    },
    owner: 'yuanlingqi',
  }) as ExpoConfig;
