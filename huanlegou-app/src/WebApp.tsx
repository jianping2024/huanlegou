import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { APP_WEB_URL } from './config/appWebUrl';

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
    setError(
      detail
        ? `页面加载失败：${detail}\n\n请检查网络，或确认页面服务器已部署：${APP_WEB_URL}`
        : `页面加载失败，请检查网络连接`,
    );
    setLoading(false);
  }, []);

  const onWebViewCrash = useCallback(() => {
    setError('页面进程异常退出，请重试。');
    setLoading(false);
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>加载失败</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.browserBtn} onPress={() => Linking.openURL(APP_WEB_URL)}>
          <Text style={styles.browserBtnText}>在浏览器中打开</Text>
        </Pressable>
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
        source={{ uri: APP_WEB_URL }}
        style={styles.webview}
        originWhitelist={['https://*', 'http://*']}
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
  browserBtn: {
    marginTop: 20,
    backgroundColor: '#FF5000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browserBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
