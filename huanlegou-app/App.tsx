import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from './src/ErrorBoundary';
import WebApp from './src/WebApp';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    RNStatusBar.setBackgroundColor('#FF5000');
    RNStatusBar.setBarStyle('light-content');
    RNStatusBar.setTranslucent(true);
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={styles.root}>
          <StatusBar style="light" />
          <WebApp />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FF5000',
  },
});
