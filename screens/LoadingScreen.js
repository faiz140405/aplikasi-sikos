import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulasi proses loading (misal: cek token, ambil data awal)
    setTimeout(() => {
      navigation.replace('Login'); // Pindah ke layar Login
    }, 1500); // 1.5 detik
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
    color: '#888888',
  },
});

export default LoadingScreen;