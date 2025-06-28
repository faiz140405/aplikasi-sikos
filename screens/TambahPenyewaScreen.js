import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const TambahPenyewaScreen = ({ navigation }) => {
    const [nama, setNama] = useState('');
    const [kamar, setKamar] = useState(null); // Diubah menjadi null untuk picker
    const [sisaHari, setSisaHari] = useState('');
    const [harga, setHarga] = useState('');

    // State baru untuk menyimpan daftar kamar dari Firestore
    const [daftarKamar, setDaftarKamar] = useState([]);
    const [loadingKamar, setLoadingKamar] = useState(true);

    // useEffect untuk mengambil daftar kamar yang statusnya "Kosong"
    useEffect(() => {
        const q = query(collection(db, "kamar"), where("status", "==", "Kosong"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const listKamar = snapshot.docs.map(doc => ({
                label: `Kamar ${doc.data().number}`,
                value: doc.data().number,
                id: doc.id // Menyimpan ID dokumen untuk update status nanti
            }));
            setDaftarKamar(listKamar);
            setLoadingKamar(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSimpan = async () => {
        if (!nama || !kamar || !sisaHari || !harga) {
            Alert.alert('Error', 'Harap isi semua kolom.');
            return;
        }

        try {
            await addDoc(collection(db, "penyewa"), {
                name: nama,
                room: kamar, // 'kamar' sekarang adalah nomor kamar dari picker
                daysLeft: parseInt(sisaHari),
                price: parseInt(harga),
                status: 'aktif'
            });
            Alert.alert('Sukses', 'Data penyewa berhasil ditambahkan.');
            navigation.goBack();
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert('Error', 'Gagal menambahkan data penyewa.');
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
                    <Text style={styles.label}>Pilih Kamar</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setKamar(value)}
                        items={daftarKamar}
                        style={pickerSelectStyles}
                        placeholder={{ label: loadingKamar ? 'Memuat kamar...' : '-- Pilih Kamar Kosong --', value: null }}
                        disabled={loadingKamar}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Sisa Hari Sewa</Text>
                    <TextInput style={styles.input} value={sisaHari} onChangeText={setSisaHari} keyboardType="numeric" placeholder="Contoh: 365" />
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

// --- StyleSheet dikembalikan untuk menggunakan Poppins ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    formGroup: { marginBottom: 16 },
    label: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', height: 50, borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  iconContainer: { top: 12, right: 15, },
  placeholder: { color: '#CDCDCD' },
});


export default TambahPenyewaScreen;
