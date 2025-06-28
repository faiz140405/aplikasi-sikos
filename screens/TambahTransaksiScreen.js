import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Helper untuk format Rupiah
const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = value.toString().replace(/\D/g, '');
    if (!numberValue) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(numberValue)}`;
};
const unformatCurrency = (value) => value.toString().replace(/\D/g, '');

const TambahTransaksiScreen = ({ navigation, route }) => {
    const { type } = route.params; 
    const isPemasukan = type === 'pemasukan';

    const [tanggal, setTanggal] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [kamar, setKamar] = useState(null);
    const [kategori, setKategori] = useState(null);
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setTanggal(selectedDate);
        }
    };

    const handleSimpan = async () => {
        const numericJumlah = parseInt(unformatCurrency(jumlah), 10);
        if (!kategori || !numericJumlah) {
            Alert.alert('Error', 'Kategori dan Jumlah wajib diisi.');
            return;
        }

        const collectionName = isPemasukan ? 'pemasukan' : 'pengeluaran';
        const transactionData = {
            category: kategori,
            amount: numericJumlah,
            date: tanggal,
            room: kamar || 'Umum', // Jika kamar tidak dipilih, anggap umum
            description: deskripsi,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, collectionName), transactionData);
            Alert.alert('Sukses', `Data ${collectionName} berhasil ditambahkan.`);
            
            const receiptData = {
                noRef: Math.floor(100000000 + Math.random() * 900000000),
                jenisTransaksi: kategori,
                kamar: kamar ? `Kamar ${kamar}` : 'Umum',
                penyewa: 'Faiz Nizar Nu\'aim',
                tanggal: tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                tagihanSelanjutnya: '-',
                totalTransaksi: numericJumlah,
            };

            navigation.replace('Kuitansi', { transaction: receiptData });

        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert('Error', `Gagal menambahkan data ${collectionName}.`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>{isPemasukan ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}</Text>
                <View style={{width: 28}} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tanggal</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}><Text style={styles.dateText}>{tanggal.toLocaleDateString('id-ID', { day:'2-digit', month: 'long', year: 'numeric' })}</Text><MaterialCommunityIcons name="calendar" size={24} color="#888" /></TouchableOpacity>
                </View>

                {showDatePicker && (<DateTimePicker value={tanggal} mode="date" display="default" onChange={onDateChange} />)}
                
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Kamar (Opsional)</Text>
                    <RNPickerSelect onValueChange={(value) => setKamar(value)} items={[{ label: 'Kamar 01', value: '01' }, { label: 'Kamar 02', value: '02' }]} style={pickerSelectStyles} placeholder={{ label: '-- Pilih Kamar --', value: null }} Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />} />
                </View>

                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Kategori</Text>
                    <RNPickerSelect onValueChange={(value) => setKategori(value)} items={isPemasukan ? [ { label: 'Uang Sewa', value: 'Uang Sewa' }, { label: 'Tagihan Listrik', value: 'Tagihan Listrik' }, { label: 'Tagihan Air', value: 'Tagihan Air' } ] : [ { label: 'Renovasi', value: 'Renovasi' }, { label: 'Operasional', value: 'Operasional' }]} style={pickerSelectStyles} placeholder={{ label: '-- Pilih Kategori --', value: null }} Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Deskripsi (Opsional)</Text>
                    <TextInput style={styles.textArea} multiline value={deskripsi} onChangeText={setDeskripsi} placeholder="Contoh: Pembayaran sewa bulan Juli" />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jumlah</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={jumlah} onChangeText={(text) => setJumlah(formatCurrency(text))} placeholder="Rp 0" />
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}><Text style={styles.saveButtonText}>Simpan</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton}><MaterialCommunityIcons name="send-outline" size={24} color="#30C95B" /></TouchableOpacity>
                </View>
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
    dateInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', height: 50, borderRadius: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    dateText: { fontFamily: 'Poppins-Regular', fontSize: 16 },
    textArea: { backgroundColor: '#fff', height: 100, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontFamily: 'Poppins-Regular', fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', textAlignVertical: 'top' },
    saveButton: { flex: 1, backgroundColor: '#28A745', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
    shareButton: { marginLeft: 16, borderWidth: 1, borderColor: '#30C95B', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#fff', height: 50, fontFamily: 'Poppins-Regular' },
  iconContainer: { top: 12, right: 15, },
  placeholder: { color: '#CDCDCD' },
});

export default TambahTransaksiScreen;
