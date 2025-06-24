import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';

const DataVerificationScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulasi proses verifikasi data
    setTimeout(() => {
      // Ganti navigasi ke 'MainApp' (Tab Navigator) dan hapus semua riwayat navigasi sebelumnya
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }, 2000); // Tampilkan selama 2 detik
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ActivityIndicator size="large" color="#28A745" />
      <Text style={styles.text}>Memverifikasi data diri anda...</Text>
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
    fontFamily: 'Poppins-Regular',
    color: '#888888',
  },
});

export default DataVerificationScreen;
