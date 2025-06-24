import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

// Ganti path logo sesuai dengan nama file Anda
const logo = require('../assets/logo-sikos.png');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Setelah 2500 milidetik (2.5 detik), pindah ke layar Loading
    setTimeout(() => {
      navigation.replace('Loading'); // 'replace' agar tidak bisa kembali ke splash screen
    }, 2500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain', // Agar gambar tidak terdistorsi
  },
});

export default SplashScreen;