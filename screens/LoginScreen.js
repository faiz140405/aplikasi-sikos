import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Ilustrasi untuk halaman login
const illustration = require('../assets/illustration-login.png');

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fungsi navigasi dummy
  const handleNavigate = () => {
    navigation.navigate('OTP', { phoneNumber: phoneNumber });
  };

  // Konten untuk halaman Syarat & Ketentuan
  const ketentuanContent = `Selamat datang di Sikos!

Terima kasih telah menggunakan aplikasi kami untuk membantu mengelola usaha kos-kosan Anda. Dengan mengunduh, mendaftar, atau menggunakan aplikasi Sikos ("Layanan"), Anda setuju untuk terikat oleh Ketentuan Layanan dan Kebijakan Privasi di bawah ini. Harap baca dokumen ini dengan saksama.

I. Ketentuan Penggunaan (Terms of Use)
1. Penerimaan Ketentuan
Dengan mengakses atau menggunakan Layanan kami, Anda mengonfirmasi bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh ketentuan ini. Jika Anda tidak setuju, Anda tidak diizinkan untuk menggunakan Layanan.

IV. Informasi Kontak
Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan atau Kebijakan Privasi ini, silakan hubungi kami di:
Email: sikos@gmail.com
WhatsApp: +62-818-0988-4140`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#5DDE7C" />
      <View style={styles.topContainer}>
        <Image source={illustration} style={styles.illustration} />
        <Text style={styles.heroText}>Kelola kosan jadi mudah dengan fitur pengelolaan dari Sikos</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>MASUK ATAU DAFTAR</Text>
        <Text style={styles.subtitle}>
          Masukkan nomor ponsel atau memulai layanan dan verifikasi OTP akan dikirim ke ponselmu
        </Text>

        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCodeContainer}>
            <Text style={styles.countryCodeText}>+62</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="818 0988 4140"
            placeholderTextColor="#CDCDCD"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>Verifikasi nomor telepon</Text>
        </TouchableOpacity>
        
        {/* PERUBAHAN: Teks sekarang dibungkus dengan TouchableOpacity */}
        <TouchableOpacity onPress={() => navigation.navigate('InfoScreen', { title: 'Ketentuan & Privasi', content: ketentuanContent })}>
            <Text style={styles.termsText}>Syarat dan ketentuan berlaku</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// StyleSheet dikembalikan untuk menggunakan Poppins dan disesuaikan dengan desain baru
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    height: '45%',
    backgroundColor: '#5DDE7C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  illustration: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: -20,
  },
  heroText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#28A745',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    marginBottom: 32, // Menambah jarak
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32, // Menambah jarak
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  countryCodeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  input: {
    flex: 1,
    height: 50,
    borderBottomWidth: 1, // Menggunakan garis bawah
    borderColor: '#E0E0E0',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
  },
  button: {
    backgroundColor: '#28A745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  termsText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#28A745',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textDecorationLine: 'underline', // Menambahkan garis bawah agar terlihat seperti link
  },
});

export default LoginScreen;
