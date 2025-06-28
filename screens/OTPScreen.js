import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';

const illustration = require('../assets/illustration-otp.png');

const OTPScreen = ({ navigation, route }) => {
  // Ambil nomor telepon yang dikirim dari layar Login (jika ada)
  const { phoneNumber } = route.params || {}; 

  // State untuk 5 digit OTP
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputs = useRef([]);

  // Fokus ke input pertama saat layar dimuat
  useEffect(() => {
    if (inputs.current[0]) {
        inputs.current[0].focus();
    }
  }, []);


  const handleOTPChange = (text, index) => {
    // Hanya izinkan angka
    if (/^[0-9]$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Jika teks dimasukkan, pindah ke input berikutnya
      if (text !== '' && index < 4) { // Batasnya adalah 4 (untuk 5 input)
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    // Jika backspace ditekan pada input yang kosong, pindah ke input sebelumnya
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Fungsi verifikasi dummy, hanya untuk navigasi
  const handleVerifikasi = () => {
    const otpCode = otp.join('');
    console.log('Kode OTP dimasukkan (dummy):', otpCode);
    // Langsung navigasi ke layar DataDiri
    navigation.navigate('DataDiri');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#5DDE7C" />
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        {/* Header Title sengaja dikosongkan agar sesuai desain */}
        <Image source={illustration} style={styles.illustration} />
        <Text style={styles.heroText}>Satu langkah kecil untuk perlindungan besar dari ancaman keamanan</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>VERIFIKASI OTP</Text>
        <Text style={styles.subtitle}>
          Kami telah mengirimkan kode OTP ke nomor yang anda masukkan <Text style={styles.phoneNumberText}>+62180****40</Text>, cek kontak pesan anda
        </Text>
        <View style={styles.otpContainer}>
          {/* Membuat 5 kotak input OTP */}
          {[...Array(5)].map((_, index) => (
            <TextInput
              key={index}
              ref={ref => inputs.current[index] = ref}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              value={otp[index] || ''}
            />
          ))}
        </View>
        <Text style={styles.resendText}>
          Belum menerima kode?, <Text style={styles.resendLink}>kirim ulang</Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleVerifikasi}>
          <Text style={styles.buttonText}>Kirim Kode OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// StyleSheet dikembalikan dan disesuaikan untuk 5 input
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  topContainer: { height: '45%', backgroundColor: '#5DDE7C', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  illustration: { width: 200, height: 200, resizeMode: 'contain', },
  heroText: { fontSize: 14, color: '#FFFFFF', textAlign: 'center', fontFamily: 'Poppins-SemiBold', marginTop: 10, },
  bottomContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 24, },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#28A745', marginBottom: 8, },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#888888', marginBottom: 24, lineHeight: 22, },
  phoneNumberText: { fontFamily: 'Poppins-SemiBold', color: '#333' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, },
  otpInput: { width: 50, height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, textAlign: 'center', fontSize: 24, fontFamily: 'Poppins-Bold', color: '#333333', },
  resendText: { fontFamily: 'Poppins-Regular', color: '#888888', textAlign: 'center', marginBottom: 24, },
  resendLink: { fontFamily: 'Poppins-Bold', color: '#28A745', textDecorationLine: 'underline' },
  button: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold', },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1, },
  backButtonText: { fontSize: 30, color: '#FFFFFF', fontWeight: 'bold' },
});

export default OTPScreen;
