import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebApp from './src/WebApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FF5000' }} edges={['top']}>
        <StatusBar style="light" />
        <WebApp />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
