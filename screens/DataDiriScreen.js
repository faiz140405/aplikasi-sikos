import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';

const illustration = require('../assets/illustration-data-diri.png');

const DataDiriScreen = ({ navigation }) => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaKost, setNamaKost] = useState('');

  const handleSimpan = () => {
    if (!namaLengkap || !namaKost) {
      alert('Harap isi semua data.');
      return;
    }
    console.log('Nama:', namaLengkap);
    console.log('Kost:', namaKost);
    // Navigasi ke layar verifikasi data setelah menyimpan
    navigation.navigate('DataVerification');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#5DDE7C" />
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identitas diri</Text>
        <Image source={illustration} style={styles.illustration} />
        <Text style={styles.heroText}>Lengkapi data anda agar dapat menikmati semua fitur Sikos</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>MASUKKAN DATA DIRI</Text>
        <Text style={styles.subtitle}>Tampaknya anda pengguna baru? Sebelum lanjut, silahkan isi data diri anda.</Text>
        
        <Text style={styles.label}>Nama lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama Anda..."
          value={namaLengkap}
          onChangeText={setNamaLengkap}
        />

        <Text style={styles.label}>Nama Kost</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama Kost..."
          value={namaKost}
          onChangeText={setNamaKost}
        />

        <TouchableOpacity style={styles.button} onPress={handleSimpan}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// StyleSheet dikembalikan untuk menggunakan Poppins
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  topContainer: { height: '45%', backgroundColor: '#5DDE7C', alignItems: 'center', paddingHorizontal: 30, paddingTop: 40, },
  illustration: { width: 250, height: 180, resizeMode: 'contain', },
  heroText: { fontSize: 14, color: '#FFFFFF', textAlign: 'center', fontFamily: 'Poppins-SemiBold', marginTop: 10, },
  bottomContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 24, },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#28A745', marginBottom: 8, },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#888888', marginBottom: 24, lineHeight: 22, },
  label: { fontFamily: 'Poppins-SemiBold', color: '#333333', marginBottom: 8, },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 16, },
  button: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold', },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1, },
  backButtonText: { fontSize: 30, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: { position: 'absolute', top: 55, color: 'white', fontFamily: 'Poppins-Bold', fontSize: 18 }
});

export default DataDiriScreen;
