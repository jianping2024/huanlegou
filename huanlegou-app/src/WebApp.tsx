import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation, WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import { WEB_ASSETS } from './webAssets';

const BUNDLE_VERSION = '2';
const WEB_DIR = `${FileSystem.documentDirectory ?? ''}huanlegou-web/`;
const READY_FLAG = `${WEB_DIR}.ready-v${BUNDLE_VERSION}`;
const BLANK_HTML = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>';

type PageContent = {
  html: string;
  baseUrl: string;
};

async function ensureDir(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

async function installWebBundle(): Promise<PageContent> {
  if (!FileSystem.documentDirectory) {
    throw new Error('无法访问本地存储');
  }

  const ready = await FileSystem.getInfoAsync(READY_FLAG);
  if (!ready.exists) {
    await ensureDir(WEB_DIR);

    for (const [relPath, moduleId] of Object.entries(WEB_ASSETS)) {
      const asset = Asset.fromModule(moduleId);
      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error(`Failed to load asset: ${relPath}`);
      }

      const dest = WEB_DIR + relPath;
      const lastSlash = dest.lastIndexOf('/');
      if (lastSlash > 0) {
        await ensureDir(dest.slice(0, lastSlash));
      }
      await FileSystem.copyAsync({ from: asset.localUri, to: dest });
    }

    await FileSystem.writeAsStringAsync(READY_FLAG, 'ok');
  }

  const indexPath = `${WEB_DIR}index.html`;
  const indexInfo = await FileSystem.getInfoAsync(indexPath);
  if (!indexInfo.exists) {
    throw new Error('页面文件缺失，请重新安装 App');
  }

  const html = await FileSystem.readAsStringAsync(indexPath);
  return { html, baseUrl: WEB_DIR };
}

export default function WebApp() {
  const [page, setPage] = useState<PageContent | null>(null);
  const [source, setSource] = useState<WebViewSource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    installWebBundle()
      .then(setPage)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    if (!page || source) return undefined;

    if (Platform.OS === 'android') {
      // Android（含魅族）：先挂载空页，等 WebView 就绪后再注入内容，避免 file:// 权限竞态导致闪退
      setSource({ html: BLANK_HTML, baseUrl: page.baseUrl });
      return undefined;
    }

    setSource({ html: page.html, baseUrl: page.baseUrl });
    return undefined;
  }, [page, source]);

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

  const onWebViewLoadEnd = useCallback(() => {
    if (!page || Platform.OS !== 'android') return;
    setSource((current) => {
      if (current && 'html' in current && current.html === page.html) {
        return current;
      }
      return { html: page.html, baseUrl: page.baseUrl };
    });
  }, [page]);

  const onWebViewError = useCallback((event: { nativeEvent: { description?: string } }) => {
    const detail = event.nativeEvent.description?.trim();
    setError(detail ? `WebView 加载失败：${detail}` : 'WebView 加载失败');
  }, []);

  const onRenderProcessGone = useCallback(() => {
    setError('页面进程异常退出。请完全关闭 App 后重试，或更新系统 WebView。');
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>加载失败</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!page || !source) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5000" />
        <Text style={styles.loadingText}>正在加载欢乐购…</Text>
      </View>
    );
  }

  return (
    <WebView
      ref={setWebView}
      source={source}
      style={styles.webview}
      originWhitelist={['*']}
      allowingReadAccessToURL={page.baseUrl}
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
      onLoadEnd={onWebViewLoadEnd}
      onError={onWebViewError}
      onHttpError={onWebViewError}
      onRenderProcessGone={onRenderProcessGone}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
