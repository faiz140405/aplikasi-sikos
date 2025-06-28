import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const TambahKamarScreen = ({ navigation }) => {
    const [nomorKamar, setNomorKamar] = useState('');
    const [kategori, setKategori] = useState(null);
    const [jangkaWaktu, setJangkaWaktu] = useState(null);
    const [status, setStatus] = useState('Kosong'); // Status default adalah 'Kosong'

    const handleSimpan = async () => {
        if (!nomorKamar || !kategori || !jangkaWaktu) {
            Alert.alert('Error', 'Harap lengkapi semua kolom.');
            return;
        }

        try {
            await addDoc(collection(db, "kamar"), {
                number: nomorKamar,
                category: kategori,
                term: jangkaWaktu,
                status: status
            });
            Alert.alert('Sukses', 'Data kamar berhasil ditambahkan.');
            navigation.goBack();
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert('Error', 'Gagal menambahkan data kamar.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tambah Kamar Baru</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Kamar</Text>
                    <TextInput style={styles.input} value={nomorKamar} onChangeText={setNomorKamar} placeholder="Contoh: 1A atau 09" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kategori Kamar</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setKategori(value)}
                        items={[
                            { label: 'Kamar Kuning', value: 'Kamar Kuning' },
                            { label: 'Kamar Biru', value: 'Kamar Biru' },
                            { label: 'Kamar Tingkat', value: 'Kamar Tingkat' },
                        ]}
                        style={pickerSelectStyles}
                        placeholder={{ label: '-- Pilih Kategori --', value: null }}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jangka Waktu Sewa</Text>
                     <RNPickerSelect
                        onValueChange={(value) => setJangkaWaktu(value)}
                        items={[
                            { label: 'Bulanan', value: 'Bulanan' },
                            { label: 'Tahunan', value: 'Tahunan' },
                        ]}
                        style={pickerSelectStyles}
                        placeholder={{ label: '-- Pilih Jangka Waktu --', value: null }}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}>
                    <Text style={styles.saveButtonText}>Simpan Kamar</Text>
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


export default TambahKamarScreen;
