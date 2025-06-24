import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig'; // Import firestore
import { collection, addDoc } from 'firebase/firestore';

const TambahPenyewaScreen = ({ navigation }) => {
    const [nama, setNama] = useState('');
    const [kamar, setKamar] = useState('');
    const [sisaHari, setSisaHari] = useState('');
    const [harga, setHarga] = useState('');

    const handleSimpan = async () => {
        if (!nama || !kamar || !sisaHari || !harga) {
            Alert.alert('Error', 'Harap isi semua kolom.');
            return;
        }

        try {
            await addDoc(collection(db, "penyewa"), {
                name: nama,
                room: kamar,
                daysLeft: parseInt(sisaHari),
                price: parseInt(harga),
                status: 'aktif' // Default status saat menambah
            });
            Alert.alert('Sukses', 'Data penyewa berhasil ditambahkan.');
            navigation.goBack();
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert('Error', 'Gagal menambahkan data.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tambah Penyewa Baru</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <TextInput style={styles.input} value={nama} onChangeText={setNama} placeholder="Masukkan nama penyewa" />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Kamar</Text>
                    <TextInput style={styles.input} value={kamar} onChangeText={setKamar} keyboardType="numeric" placeholder="Contoh: 07" />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Sisa Hari Sewa</Text>
                    <TextInput style={styles.input} value={sisaHari} onChangeText={setSisaHari} keyboardType="numeric" placeholder="Contoh: 300" />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Harga Sewa (Rp)</Text>
                    <TextInput style={styles.input} value={harga} onChangeText={setHarga} keyboardType="numeric" placeholder="Contoh: 5000000" />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}>
                    <Text style={styles.saveButtonText}>Simpan Penyewa</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff' },
    formGroup: { marginBottom: 16 },
    label: { fontWeight: '600', fontSize: 14, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', height: 50, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default TambahPenyewaScreen;
