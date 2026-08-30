import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { WEB_ASSETS } from './webAssets';

const WEB_DIR = `${FileSystem.documentDirectory ?? ''}huanlegou-web/`;
const READY_FLAG = `${WEB_DIR}.ready`;

async function ensureDir(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

async function installWebBundle(): Promise<string> {
  if (!FileSystem.documentDirectory) {
    throw new Error('无法访问本地存储');
  }

  const ready = await FileSystem.getInfoAsync(READY_FLAG);
  if (ready.exists) {
    return `${WEB_DIR}index.html`;
  }

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
  return `${WEB_DIR}index.html`;
}

export default function WebApp() {
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [webView, setWebView] = useState<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    installWebBundle()
      .then(setUri)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>加载失败</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!uri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5000" />
        <Text style={styles.loadingText}>正在加载欢乐购…</Text>
      </View>
    );
  }

  const webDir = WEB_DIR;

  return (
    <WebView
      ref={setWebView}
      source={{ uri }}
      style={styles.webview}
      originWhitelist={['*']}
      allowingReadAccessToURL={webDir}
      allowFileAccess
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      domStorageEnabled
      javaScriptEnabled
      cacheEnabled
      setSupportMultipleWindows={false}
      onNavigationStateChange={onNavChange}
      onError={() => setError('WebView 渲染出错')}
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
