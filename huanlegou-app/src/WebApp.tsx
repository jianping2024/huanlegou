import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { APP_WEB_HOME } from './config/appWebUrl';
import ErrorScreen from './ui/ErrorScreen';

export default function WebApp() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

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
    hideSplash();
  }, [hideSplash]);

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

  useEffect(() => {
    if (error) hideSplash();
  }, [error, hideSplash]);

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
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>正在加载欢乐购…</Text>
        </View>
      ) : null}
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
        onNavigationStateChange={onNavChange}
        onLoadEnd={finishLoading}
        onError={onWebViewError}
        onHttpError={onWebViewError}
        onRenderProcessGone={onWebViewCrash}
        onContentProcessDidTerminate={onWebViewCrash}
      />
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
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5000',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    fontWeight: '500',
  },
});
