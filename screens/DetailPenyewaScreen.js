import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const DetailPenyewaScreen = ({ route, navigation }) => {
    // Mengambil ID penyewa dari parameter navigasi
    const { penyewaId } = route.params;
    const [loading, setLoading] = useState(true);

    // State untuk menyimpan data asli dari Firestore
    const [penyewa, setPenyewa] = useState(null);
    
    // State untuk nilai-nilai di dalam form input
    const [nama, setNama] = useState('');
    const [kamar, setKamar] = useState('');
    const [sisaHari, setSisaHari] = useState('');
    const [harga, setHarga] = useState('');

    // Fungsi untuk mengambil data penyewa dari Firestore saat layar pertama kali dimuat
    useEffect(() => {
        const fetchPenyewa = async () => {
            const docRef = doc(db, "penyewa", penyewaId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPenyewa(data);
                // Mengisi form dengan data yang ada
                setNama(data.name);
                setKamar(data.room);
                setSisaHari(data.daysLeft.toString());
                setHarga(data.price.toString());
            } else {
                Alert.alert("Error", "Data penyewa tidak ditemukan.");
                navigation.goBack();
            }
            setLoading(false);
        };
        fetchPenyewa();
    }, [penyewaId]);

    // Fungsi untuk memperbarui data di Firestore
    const handleUpdate = async () => {
        if (!nama || !kamar || !sisaHari || !harga) {
            Alert.alert('Error', 'Semua kolom harus diisi.');
            return;
        }
        const docRef = doc(db, "penyewa", penyewaId);
        try {
            await updateDoc(docRef, {
                name: nama,
                room: kamar,
                daysLeft: parseInt(sisaHari),
                price: parseInt(harga)
            });
            Alert.alert('Sukses', 'Data penyewa berhasil diperbarui');
            navigation.goBack();
        } catch (e) {
            console.error("Error updating document: ", e);
            Alert.alert('Error', 'Gagal memperbarui data.');
        }
    };
    
    // Fungsi untuk menghapus data dari Firestore
    const handleDelete = () => {
        Alert.alert(
            "Hapus Penyewa",
            `Apakah Anda yakin ingin menghapus ${penyewa.name}?`,
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: async () => {
                    await deleteDoc(doc(db, "penyewa", penyewaId));
                    navigation.goBack();
                }}
            ]
        );
    };

    // Tampilkan loading indicator jika data belum siap
    if (loading || !penyewa) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Penyewa</Text>
                <TouchableOpacity onPress={handleDelete}><MaterialCommunityIcons name="delete-outline" size={28} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <TextInput style={styles.input} value={nama} onChangeText={setNama} />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nomor Kamar</Text>
                    <TextInput style={styles.input} value={kamar} onChangeText={setKamar} keyboardType="numeric" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Sisa Hari Sewa</Text>
                    <TextInput style={styles.input} value={sisaHari} onChangeText={setSisaHari} keyboardType="numeric" />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Harga Sewa (Rp)</Text>
                    <TextInput style={styles.input} value={harga} onChangeText={setHarga} keyboardType="numeric" />
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

export default DetailPenyewaScreen;
