import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const DetailKamarScreen = ({ route, navigation }) => {
    // Mengambil ID kamar dari parameter navigasi
    const { kamarId } = route.params;
    const [loading, setLoading] = useState(true);

    // State untuk menyimpan data asli dari Firestore
    const [kamar, setKamar] = useState(null);

    // State untuk nilai-nilai di dalam form input
    const [nomorKamar, setNomorKamar] = useState('');
    const [kategori, setKategori] = useState('');
    const [jangkaWaktu, setJangkaWaktu] = useState('');
    const [status, setStatus] = useState('');

    // Fungsi untuk mengambil data kamar dari Firestore saat layar pertama kali dimuat
    useEffect(() => {
        const fetchKamar = async () => {
            const docRef = doc(db, "kamar", kamarId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setKamar(data);
                // Mengisi form dengan data yang ada
                setNomorKamar(data.number);
                setKategori(data.category);
                setJangkaWaktu(data.term);
                setStatus(data.status);
            } else {
                Alert.alert("Error", "Data kamar tidak ditemukan.");
                navigation.goBack();
            }
            setLoading(false);
        };
        fetchKamar();
    }, [kamarId]);

    // Fungsi untuk memperbarui data di Firestore
    const handleUpdate = async () => {
        if (!nomorKamar || !kategori || !jangkaWaktu) {
            Alert.alert('Error', 'Semua kolom harus diisi.');
            return;
        }
        const docRef = doc(db, "kamar", kamarId);
        try {
            await updateDoc(docRef, {
                number: nomorKamar,
                category: kategori,
                term: jangkaWaktu,
                status: status,
            });
            Alert.alert('Sukses', 'Data kamar berhasil diperbarui');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Gagal memperbarui data.');
        }
    };
    
    // Fungsi untuk menghapus data dari Firestore
    const handleDelete = () => {
        Alert.alert(
            "Hapus Kamar",
            `Apakah Anda yakin ingin menghapus Kamar ${kamar.number}?`,
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: async () => {
                    await deleteDoc(doc(db, "kamar", kamarId));
                    navigation.goBack();
                }}
            ]
        );
    };

    // Tampilkan loading indicator jika data belum siap
    if (loading || !kamar) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Kamar {kamar.number}</Text>
                <TouchableOpacity onPress={handleDelete}><MaterialCommunityIcons name="delete-outline" size={28} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Kamar</Text>
                    <TextInput style={styles.input} value={nomorKamar} onChangeText={setNomorKamar} />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kategori Kamar</Text>
                    <RNPickerSelect
                        value={kategori}
                        onValueChange={(value) => setKategori(value)}
                        items={[ { label: 'Kamar Kuning', value: 'Kamar Kuning' }, { label: 'Kamar Biru', value: 'Kamar Biru' }, { label: 'Kamar Tingkat', value: 'Kamar Tingkat' } ]}
                        style={pickerSelectStyles}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jangka Waktu Sewa</Text>
                    <RNPickerSelect
                        value={jangkaWaktu}
                        onValueChange={(value) => setJangkaWaktu(value)}
                        items={[ { label: 'Bulanan', value: 'Bulanan' }, { label: 'Tahunan', value: 'Tahunan' } ]}
                        style={pickerSelectStyles}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Status Kamar</Text>
                    <RNPickerSelect
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                        items={[ { label: 'Kosong', value: 'Kosong' }, { label: 'Terisi', value: 'Terisi' } ]}
                        style={pickerSelectStyles}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// StyleSheet dikembalikan untuk menggunakan Poppins
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    formGroup: { marginBottom: 16 },
    label: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', height: 50, borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50 },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50 },
  iconContainer: { top: 12, right: 15, },
});

export default DetailKamarScreen;
