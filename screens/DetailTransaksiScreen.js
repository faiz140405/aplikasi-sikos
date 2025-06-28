import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Helper untuk format Rupiah
const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = value.toString().replace(/\D/g, '');
    if (!numberValue) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(numberValue)}`;
};
const unformatCurrency = (value) => value.toString().replace(/\D/g, '');


const DetailTransaksiScreen = ({ route, navigation }) => {
    // Mengambil ID transaksi dan tipe (pemasukan/pengeluaran) dari parameter
    const { transaksiId, tipe } = route.params;
    const [loading, setLoading] = useState(true);

    // State untuk menyimpan data asli dari Firestore
    const [transaksi, setTransaksi] = useState(null);

    // State untuk nilai-nilai di dalam form input
    const [kategori, setKategori] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [deskripsi, setDeskripsi] = useState('');

    // Fungsi untuk mengambil data transaksi dari Firestore saat layar dimuat
    useEffect(() => {
        const fetchTransaksi = async () => {
            const docRef = doc(db, tipe, transaksiId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setTransaksi(data);
                // Mengisi form dengan data yang ada
                setKategori(data.category);
                setJumlah(formatCurrency(data.amount));
                setDeskripsi(data.description || '');
            } else {
                Alert.alert("Error", "Data transaksi tidak ditemukan.");
                navigation.goBack();
            }
            setLoading(false);
        };
        fetchTransaksi();
    }, [transaksiId, tipe]);

    // Fungsi untuk memperbarui data di Firestore
    const handleUpdate = async () => {
        const numericJumlah = parseInt(unformatCurrency(jumlah), 10);
        if (!kategori || !numericJumlah) {
            Alert.alert('Error', 'Kategori dan Jumlah tidak boleh kosong.');
            return;
        }
        const docRef = doc(db, tipe, transaksiId);
        try {
            await updateDoc(docRef, {
                category: kategori,
                amount: numericJumlah,
                description: deskripsi,
            });
            Alert.alert('Sukses', 'Data transaksi berhasil diperbarui.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Gagal memperbarui data.');
        }
    };
    
    // Fungsi untuk menghapus data dari Firestore
    const handleDelete = () => {
        Alert.alert(
            "Hapus Transaksi",
            `Apakah Anda yakin ingin menghapus transaksi ini?`,
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: async () => {
                    await deleteDoc(doc(db, tipe, transaksiId));
                    navigation.goBack();
                }}
            ]
        );
    };

    // Tampilkan loading indicator jika data belum siap
    if (loading || !transaksi) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Transaksi</Text>
                <TouchableOpacity onPress={handleDelete}><MaterialCommunityIcons name="delete-outline" size={28} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kategori</Text>
                    <TextInput style={styles.input} value={kategori} onChangeText={setKategori} />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jumlah</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={jumlah} onChangeText={(text) => setJumlah(formatCurrency(text))} />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Deskripsi (Opsional)</Text>
                    <TextInput style={styles.textArea} multiline value={deskripsi} onChangeText={setDeskripsi} />
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
    textArea: { backgroundColor: '#fff', height: 100, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'Poppins-Regular', fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', textAlignVertical: 'top' },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

export default DetailTransaksiScreen;
