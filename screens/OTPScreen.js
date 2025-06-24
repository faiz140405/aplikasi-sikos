import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const illustration = require('../assets/illustration-otp.png');

const OTPScreen = ({ navigation, route }) => {
    const { verificationId, phoneNumber } = route.params; 
    const [otpCode, setOtpCode] = useState('');
    const inputs = useRef([]);

    // Fokus ke input pertama saat layar dimuat
    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleOTPChange = (text, index) => {
        let newOtp = otpCode.split('');
        newOtp[index] = text;
        setOtpCode(newOtp.join(''));

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };
    
    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerifikasi = async () => {
        if (otpCode.length !== 6) {
            Alert.alert("Error", "Mohon masukkan 6 digit kode OTP.");
            return;
        }
        try {
            const credential = PhoneAuthProvider.credential(verificationId, otpCode);
            await signInWithCredential(auth, credential);
            // Navigasi tidak diperlukan di sini karena App.js akan menanganinya secara otomatis
        } catch (error) {
            console.error('Error verifying OTP: ', error);
            Alert.alert("Error", "Kode OTP salah atau tidak valid.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#5DDE7C" />
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backButtonText}>‹</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Kode OTP</Text>
                <Image source={illustration} style={styles.illustration} />
                <Text style={styles.heroText}>Satu langkah kecil untuk perlindungan besar dari ancaman keamanan</Text>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.title}>VERIFIKASI OTP</Text>
                <Text style={styles.subtitle}>Kami telah mengirimkan kode OTP ke nomor {phoneNumber}, cek kotak masuk pesan anda</Text>
                <View style={styles.otpContainer}>
                    {[...Array(6)].map((_, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputs.current[index] = ref}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(text) => handleOTPChange(text, index)}
                            onKeyPress={(e) => handleBackspace(e, index)}
                            value={otpCode[index] || ''}
                        />
                    ))}
                </View>
                <Text style={styles.resendText}>Belum menerima kode? <Text style={styles.resendLink}>Kirim ulang</Text></Text>
                <TouchableOpacity style={styles.button} onPress={handleVerifikasi}><Text style={styles.buttonText}>Verifikasi Kode</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Styles (OTP input disesuaikan untuk 6 digit)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    topContainer: { height: '45%', backgroundColor: '#5DDE7C', alignItems: 'center', paddingHorizontal: 30, paddingTop: 40, },
    illustration: { width: 180, height: 180, resizeMode: 'contain', },
    heroText: { fontSize: 14, color: '#FFFFFF', textAlign: 'center', fontWeight: '600', marginTop: 10, },
    bottomContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 24, },
    title: { fontSize: 16, fontWeight: 'bold', color: '#28A745', marginBottom: 8, },
    subtitle: { fontSize: 14, color: '#888888', marginBottom: 24, lineHeight: 22, },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, },
    otpInput: { width: 45, height: 55, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#333333', },
    resendText: { color: '#888888', textAlign: 'center', marginBottom: 24, },
    resendLink: { fontWeight: 'bold', color: '#28A745', },
    button: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1, },
    backButtonText: { fontSize: 30, color: '#FFFFFF', fontWeight: 'bold' },
    headerTitle: { position: 'absolute', top: 55, color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default OTPScreen;
