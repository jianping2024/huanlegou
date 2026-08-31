import { Image, StyleSheet, View } from 'react-native';

/** Full-screen branded splash shown while WebView loads (matches splash.png). */
export default function BrandedSplash() {
  return (
    <View style={styles.root}>
      <Image source={require('../../assets/splash.png')} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FF5000',
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
