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

        {/* PERUBAHAN: Container input nomor telepon */}
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
        
        <Text style={styles.termsText}>Syarat dan ketentuan berlaku</Text>
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
  },
});

export default LoginScreen;
