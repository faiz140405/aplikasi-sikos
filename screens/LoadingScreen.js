import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulasi proses loading (misal: cek token, ambil data awal)
    // Setelah 1.5 detik, pindah ke layar Login
    setTimeout(() => {
      navigation.replace('Login'); 
    }, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* ActivityIndicator adalah komponen loading bawaan React Native */}
      <ActivityIndicator size="large" color="#28A745" />
      <Text style={styles.text}>Tunggu Sebentar...</Text>
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

export default LoadingScreen;
