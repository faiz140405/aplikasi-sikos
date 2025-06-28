import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';

const DataVerificationScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulasi proses verifikasi data selama 2 detik
    setTimeout(() => {
      // Pindah ke 'MainApp' (halaman utama dengan tab) dan hapus semua riwayat navigasi sebelumnya
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }, 2000); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ActivityIndicator size="large" color="#28A745" />
      <Text style={styles.text}>Memverifikasi data diri anda...</Text>
    </View>
  );
};

// StyleSheet dikembalikan untuk menggunakan Poppins
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', // Menggunakan font Poppins
    color: '#888888',
  },
});

export default DataVerificationScreen;
