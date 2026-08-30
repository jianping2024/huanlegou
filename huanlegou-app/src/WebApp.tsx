import { useCallback, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { LOCAL_WEB_READ_ACCESS, LOCAL_WEB_URI } from './config/localWeb';

export default function WebApp() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

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

  const onWebViewError = useCallback((event: { nativeEvent: { description?: string } }) => {
    const detail = event.nativeEvent.description?.trim();
    setError(detail ? `WebView 加载失败：${detail}` : 'WebView 加载失败');
    setLoading(false);
  }, []);

  const onWebViewCrash = useCallback(() => {
    setError(
      Platform.OS === 'ios'
        ? '页面加载异常，请完全关闭 App 后重试。'
        : '页面进程异常退出。请完全关闭 App 后重试，或更新系统 WebView。',
    );
    setLoading(false);
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>加载失败</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF5000" />
          <Text style={styles.loadingText}>正在加载欢乐购…</Text>
        </View>
      )}
      <WebView
        ref={setWebView}
        source={{ uri: LOCAL_WEB_URI }}
        style={styles.webview}
        originWhitelist={['*']}
        allowingReadAccessToURL={LOCAL_WEB_READ_ACCESS}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        domStorageEnabled
        javaScriptEnabled
        cacheEnabled
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        textZoom={100}
        onNavigationStateChange={onNavChange}
        onLoadEnd={() => setLoading(false)}
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
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
