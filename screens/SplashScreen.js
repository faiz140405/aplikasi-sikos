import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Animated } from 'react-native'; // 1. Import Animated

// Ganti path logo sesuai dengan nama file Anda
const logo = require('../assets/logo-sikos.png');

const SplashScreen = ({ navigation }) => {
  // 2. Inisialisasi nilai untuk animasi
  // Mulai dari opacity 0 (tak terlihat) dan skala 0.8 (80% ukuran)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 3. Konfigurasi dan mulai animasi saat komponen dimuat
    Animated.parallel([
      // Animasi untuk opacity (fade-in)
      Animated.timing(fadeAnim, {
        toValue: 1, // Menuju opacity 1 (terlihat penuh)
        duration: 1500, // Durasi 1.5 detik
        useNativeDriver: true, // Menggunakan driver native untuk performa lebih baik
      }),
      // Animasi untuk skala (zoom-in)
      Animated.timing(scaleAnim, {
        toValue: 1, // Menuju skala 100%
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(); // Mulai kedua animasi secara bersamaan

    // Navigasi ke layar berikutnya setelah animasi selesai
    const timer = setTimeout(() => {
      navigation.replace('Loading'); // 'replace' agar tidak bisa kembali ke splash screen
    }, 2500); // Total durasi layar splash 2.5 detik

    return () => clearTimeout(timer); // Membersihkan timer jika komponen dilepas
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* 4. Terapkan style animasi ke komponen View yang membungkus gambar */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Image source={logo} style={styles.logo} />
      </Animated.View>
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
    resizeMode: 'contain',
  },
});

export default SplashScreen;
