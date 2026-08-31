import type { ConfigContext, ExpoConfig } from 'expo/config';

const { APP_VERSION, DEFAULT_WEB_APP_URL } = require('./config/defaults.js');

/** Android 12+ only supports a centered icon + background color (not full-screen art). */
const androidSplash = {
  backgroundColor: '#FF5000',
  image: './assets/splash-logo.png',
  imageWidth: 240,
};

const iosSplash = {
  backgroundColor: '#FF5000',
  image: './assets/splash.png',
  resizeMode: 'cover' as const,
  enableFullScreenImage_legacy: true,
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
    androidStatusBar: {
      backgroundColor: '#FF5000',
      barStyle: 'light-content',
      translucent: true,
    },
    splash: androidSplash,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.huanlegou.app',
      splash: iosSplash,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.huanlegou.app',
      permissions: ['INTERNET'],
      splash: androidSplash,
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
          ...androidSplash,
          resizeMode: 'contain',
          ios: iosSplash,
          android: androidSplash,
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
