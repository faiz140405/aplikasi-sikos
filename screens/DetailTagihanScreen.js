import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const DetailTagihanScreen = ({ route, navigation }) => {
    // Menerima ID dan tipe tagihan dari parameter navigasi
    const { tagihanId, type } = route.params;
    const collectionName = type === 'listrik' ? 'tagihan_listrik' : 'tagihan_air';

    const [loading, setLoading] = useState(true);
    const [tagihan, setTagihan] = useState(null);
    const [status, setStatus] = useState('');
    
    // Fungsi untuk mengambil data dari Firestore saat layar dimuat
    useEffect(() => {
        const fetchTagihan = async () => {
            const docRef = doc(db, collectionName, tagihanId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTagihan(data);
                setStatus(data.status); // Mengisi picker dengan status yang ada
            } else {
                Alert.alert("Error", "Data tagihan tidak ditemukan.");
                navigation.goBack();
            }
            setLoading(false);
        };
        fetchTagihan();
    }, [tagihanId, collectionName]);

    // Fungsi untuk memperbarui status di Firestore
    const handleUpdate = async () => {
        const docRef = doc(db, collectionName, tagihanId);
        try {
            await updateDoc(docRef, { status: status });
            Alert.alert('Sukses', 'Status tagihan berhasil diperbarui.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Gagal memperbarui status.');
        }
    };

    // Fungsi untuk menghapus tagihan dari Firestore
    const handleDelete = () => {
        Alert.alert( "Hapus Tagihan", `Apakah Anda yakin ingin menghapus tagihan ini?`, [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: async () => {
                await deleteDoc(doc(db, collectionName, tagihanId));
                navigation.goBack();
            }}
        ]);
    };

    // Tampilkan loading indicator jika data belum siap
    if (loading || !tagihan) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Tagihan {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                <TouchableOpacity onPress={handleDelete}><MaterialCommunityIcons name="delete-outline" size={28} color="#fff" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Kamar {tagihan.number}</Text>
                    <Text style={styles.infoAmount}>Rp{new Intl.NumberFormat('id-ID').format(tagihan.amount)}</Text>
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Ubah Status Pembayaran</Text>
                    <RNPickerSelect
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                        items={[ { label: 'Belum Lunas', value: 'Belum Lunas' }, { label: 'Lunas', value: 'Lunas' } ]}
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

// --- StyleSheet dikembalikan untuk menggunakan Poppins ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    infoContainer: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E0E0E0' },
    infoTitle: { fontFamily: 'Poppins-Bold', fontSize: 24, color: '#333' },
    infoAmount: { fontFamily: 'Poppins-Regular', fontSize: 20, color: '#888', marginTop: 4 },
    formGroup: { marginBottom: 16 },
    label: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 8 },
    saveButton: { backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  iconContainer: { top: 12, right: 15, },
});

export default DetailTagihanScreen;
