import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert, Platform } from 'react-native';
// PERHATIAN: Tidak ada lagi import dari 'expo-firebase-recaptcha'
// Kita hanya menggunakan library 'firebase/auth'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const illustration = require('../assets/illustration-login.png');

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  
  // ID elemen 'div' dummy yang dibutuhkan oleh RecaptchaVerifier
  // Ini hanya untuk web, tidak akan terlihat di mobile
  const recaptchaWidgetId = 'recaptcha-container';

  // useEffect untuk membuat instance RecaptchaVerifier saat komponen dimuat
  useEffect(() => {
    try {
      // Pastikan hanya membuat satu instance verifier
      if (!recaptchaVerifier) {
        // Inisialisasi RecaptchaVerifier langsung dari 'firebase/auth'
        const verifier = new RecaptchaVerifier(auth, recaptchaWidgetId, {
          'size': 'invisible',
          'callback': (response) => {
            console.log("reCAPTCHA terverifikasi");
          },
          'expired-callback': () => {
            console.log("reCAPTCHA kadaluwarsa");
          }
        });
        setRecaptchaVerifier(verifier);
      }
    } catch (error) {
        console.error("Error saat membuat RecaptchaVerifier:", error);
    }
  }, [auth, recaptchaVerifier]);


  const handleSendVerificationCode = async () => {
      const fullPhoneNumber = `+62${phoneNumber}`;
      if (phoneNumber.length < 9) {
          Alert.alert("Error", "Nomor telepon tidak valid.");
          return;
      }
      if (!recaptchaVerifier) {
          Alert.alert("Error", "Recaptcha verifier belum siap. Silakan coba lagi sebentar.");
          return;
      }

      try {
          // Gunakan verifier dari state
          const verificationId = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
          // Kirim ID verifikasi ke layar OTP
          navigation.navigate('OTP', { verificationId: verificationId, phoneNumber: fullPhoneNumber });
      } catch (error) {
          console.error('Error saat mengirim kode verifikasi: ', error);
          Alert.alert("Error", "Gagal mengirim kode verifikasi. Coba lagi.");
      }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* 'div' dummy ini hanya aktif di platform web */}
        {Platform.OS === 'web' && <View id={recaptchaWidgetId}></View>}
        
        <StatusBar barStyle="light-content" backgroundColor="#5DDE7C" />
        <View style={styles.topContainer}><Image source={illustration} style={styles.illustration} /><Text style={styles.heroText}>Kelola kosan jadi mudah dengan fitur pengelolaan dari Sikos</Text></View>
        <View style={styles.bottomContainer}>
            <Text style={styles.title}>MASUK ATAU DAFTAR</Text>
            <Text style={styles.subtitle}>Masukkan nomor ponsel atau memulai layanan dan verifikasi OTP akan dikirim ke ponselmu</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+62</Text>
                <TextInput style={styles.input} placeholder="812-3456-7890" placeholderTextColor="#CDCDCD" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
                <Text style={styles.buttonText}>Verifikasi nomor telepon</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>Syarat dan ketentuan berlaku</Text>
        </View>
    </SafeAreaView>
  );
};

// Styles (sama seperti sebelumnya, tidak perlu diubah)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF', },
    topContainer: { height: '45%', backgroundColor: '#5DDE7C', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, },
    illustration: { width: 250, height: 250, resizeMode: 'contain', marginBottom: -20, },
    heroText: { fontSize: 14, color: '#FFFFFF', textAlign: 'center', fontWeight: '600', }, // Menggunakan fontWeight
    bottomContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 24, },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333333', marginBottom: 8, },
    subtitle: { fontSize: 14, color: '#888888', marginBottom: 24, lineHeight: 22, },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 24, },
    countryCode: { fontSize: 16, fontWeight: '600', paddingHorizontal: 16, color: '#333333', },
    input: { flex: 1, height: 50, fontSize: 16, color: '#333333', },
    button: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
    termsText: { marginTop: 16, textAlign: 'center', color: '#28A745', textDecorationLine: 'underline', fontSize: 12, },
});

export default LoginScreen;
