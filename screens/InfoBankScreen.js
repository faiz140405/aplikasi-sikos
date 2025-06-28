import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const InfoBankScreen = ({ navigation }) => {
    const [namaBank, setNamaBank] = useState('');
    const [nomorRekening, setNomorRekening] = useState('');
    const [atasNama, setAtasNama] = useState('');
    const [loading, setLoading] = useState(true);

    const docRef = doc(db, "info_kost", "bank");

    useEffect(() => {
        const fetchBankInfo = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setNamaBank(data.namaBank);
                setNomorRekening(data.nomorRekening);
                setAtasNama(data.atasNama);
            }
            setLoading(false);
        };
        fetchBankInfo();
    }, []);

    const handleSimpan = async () => {
        if (!namaBank || !nomorRekening || !atasNama) {
            Alert.alert("Error", "Semua kolom harus diisi.");
            return;
        }
        try {
            await setDoc(docRef, { namaBank, nomorRekening, atasNama });
            Alert.alert("Sukses", "Informasi bank berhasil disimpan.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Gagal menyimpan informasi bank.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Info Bank</Text>
                <View style={{width: 28}}/>
            </View>
            <ScrollView style={styles.container}>
                <Text style={styles.infoText}>Informasi ini akan ditampilkan pada kuitansi pembayaran.</Text>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Bank</Text>
                    <TextInput style={styles.input} value={namaBank} onChangeText={setNamaBank} placeholder="Contoh: Bank BCA" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Rekening</Text>
                    <TextInput style={styles.input} value={nomorRekening} onChangeText={setNomorRekening} keyboardType="number-pad" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Atas Nama</Text>
                    <TextInput style={styles.input} value={atasNama} onChangeText={setAtasNama} placeholder="Sesuai nama di buku tabungan" />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}>
                    <Text style={styles.saveButtonText}>Simpan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    infoText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#888', marginBottom: 24, textAlign: 'center' },
    formGroup: { marginBottom: 16 },
    label: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', height: 50, borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

export default InfoBankScreen;