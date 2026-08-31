import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Linking, Platform, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { APP_WEB_HOME } from './config/appWebUrl';
import BrandedSplash from './ui/BrandedSplash';
import ErrorScreen from './ui/ErrorScreen';

function getAndroidStatusBarHeight() {
  return RNStatusBar.currentHeight ?? 32;
}

export default function WebApp() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const topInsetPx = useMemo(
    () => (Platform.OS === 'android' ? getAndroidStatusBarHeight() : 0),
    [],
  );

  const injectedBeforeContentLoaded = useMemo(
    () =>
      `(function(){var d=document.documentElement;d.classList.add('in-app-webview');d.style.setProperty('--safe-top','${topInsetPx}px');})();true;`,
    [topInsetPx],
  );

  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    hideNativeSplash();
  }, [hideNativeSplash]);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webView) {
        webView.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack, webView]);

  const onNavChange = useCallback((nav: WebViewNavigation) => {
    setCanGoBack(nav.canGoBack);
  }, []);

  const finishLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const onWebViewError = useCallback(
    (event: { nativeEvent: { description?: string } }) => {
      const detail = event.nativeEvent.description?.trim();
      setError(
        detail
          ? `页面加载失败：${detail}\n\n请检查网络，或确认页面服务器已部署。`
          : '页面加载失败，请检查网络连接',
      );
      finishLoading();
    },
    [finishLoading],
  );

  const onWebViewCrash = useCallback(() => {
    setError('页面进程异常退出，请重试。');
    finishLoading();
  }, [finishLoading]);

  if (error) {
    return (
      <ErrorScreen
        title="加载失败"
        message={error}
        actionLabel="在浏览器中打开"
        onAction={() => Linking.openURL(APP_WEB_HOME)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={setWebView}
        source={{ uri: APP_WEB_HOME }}
        style={styles.webview}
        originWhitelist={['https://*', 'http://*']}
        domStorageEnabled
        javaScriptEnabled
        cacheEnabled
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        textZoom={100}
        injectedJavaScriptBeforeContentLoaded={injectedBeforeContentLoaded}
        onNavigationStateChange={onNavChange}
        onLoadEnd={finishLoading}
        onError={onWebViewError}
        onHttpError={onWebViewError}
        onRenderProcessGone={onWebViewCrash}
        onContentProcessDidTerminate={onWebViewCrash}
      />
      {loading ? <BrandedSplash /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
