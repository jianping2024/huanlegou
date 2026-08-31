import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ErrorBoundary from './src/ErrorBoundary';
import WebApp from './src/WebApp';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <ErrorBoundary>
      <View style={styles.root}>
        <StatusBar style="light" />
        <WebApp />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FF5000',
  },
});
