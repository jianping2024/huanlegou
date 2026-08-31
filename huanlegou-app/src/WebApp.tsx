import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { APP_WEB_HOME } from './config/appWebUrl';
import BrandedSplash from './ui/BrandedSplash';
import ErrorScreen from './ui/ErrorScreen';
import { buildInAppWebBootstrapScript, resolveBottomInset } from './webview/safeArea';

const LOAD_TIMEOUT_MS = 25_000;
const IN_APP_WEB_BOOTSTRAP = buildInAppWebBootstrapScript();
const BRAND_ORANGE = '#FF5000';

export default function WebApp() {
  const insets = useSafeAreaInsets();
  const bottomInset = resolveBottomInset(insets.bottom);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  const failLoad = useCallback(
    (message: string) => {
      clearLoadTimer();
      setError(message);
      setLoading(false);
    },
    [clearLoadTimer],
  );

  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    hideNativeSplash();
  }, [hideNativeSplash]);

  useEffect(() => {
    clearLoadTimer();
    loadTimerRef.current = setTimeout(() => {
      failLoad(`页面加载超时（${LOAD_TIMEOUT_MS / 1000}s）\n\n${APP_WEB_HOME}`);
    }, LOAD_TIMEOUT_MS);
    return clearLoadTimer;
  }, [webViewKey, clearLoadTimer, failLoad]);

  useEffect(() => {
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
    clearLoadTimer();
    setLoading(false);
    webView?.injectJavaScript(IN_APP_WEB_BOOTSTRAP);
  }, [clearLoadTimer, webView]);

  const onWebViewError = useCallback(
    (event: { nativeEvent: { description?: string } }) => {
      const detail = event.nativeEvent.description?.trim();
      failLoad(
        detail
          ? `页面加载失败：${detail}\n\n${APP_WEB_HOME}`
          : `页面加载失败，请检查网络连接\n\n${APP_WEB_HOME}`,
      );
    },
    [failLoad],
  );

  const onWebViewCrash = useCallback(() => {
    failLoad('页面进程异常退出，请重试。');
  }, [failLoad]);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setWebViewKey((k) => k + 1);
  }, []);

  if (error) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: bottomInset }]}>
        <ErrorScreen
          title="加载失败"
          message={error}
          actionLabel="重试"
          onAction={retry}
          secondaryLabel="在浏览器中打开"
          onSecondaryAction={() => Linking.openURL(APP_WEB_HOME)}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {insets.top > 0 ? (
        <View style={[styles.topInset, { height: insets.top }]} />
      ) : null}
      <View style={styles.webArea}>
        <WebView
          key={webViewKey}
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
          injectedJavaScriptBeforeContentLoaded={IN_APP_WEB_BOOTSTRAP}
          onNavigationStateChange={onNavChange}
          onLoadEnd={finishLoading}
          onError={onWebViewError}
          onHttpError={onWebViewError}
          onRenderProcessGone={onWebViewCrash}
          onContentProcessDidTerminate={onWebViewCrash}
        />
        {loading ? <BrandedSplash /> : null}
      </View>
      {bottomInset > 0 ? (
        <View style={[styles.bottomInset, { height: bottomInset }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRAND_ORANGE,
  },
  topInset: {
    backgroundColor: BRAND_ORANGE,
  },
  bottomInset: {
    backgroundColor: '#ffffff',
  },
  webArea: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
