import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

// Helper untuk format Rupiah
const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = value.toString().replace(/\D/g, '');
    if (!numberValue) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(numberValue)}`;
};
const unformatCurrency = (value) => value.toString().replace(/\D/g, '');

const TambahTagihanScreen = ({ navigation, route }) => {
    // Menerima tipe tagihan ('listrik' atau 'air') dari layar sebelumnya
    const { type } = route.params;
    const headerTitle = type === 'listrik' ? 'Tagihan Listrik Baru' : 'Tagihan Air Baru';
    const collectionName = type === 'listrik' ? 'tagihan_listrik' : 'tagihan_air';

    const [kamar, setKamar] = useState(null);
    const [jumlah, setJumlah] = useState('');
    const [status, setStatus] = useState('Belum Lunas');

    const handleSimpan = async () => {
        const numericJumlah = parseInt(unformatCurrency(jumlah), 10);
        if (!kamar || !numericJumlah) {
            Alert.alert('Error', 'Harap pilih kamar dan isi jumlah tagihan.');
            return;
        }

        try {
            await addDoc(collection(db, collectionName), {
                number: kamar,
                amount: numericJumlah,
                status: status,
                createdAt: serverTimestamp() // Menambah stempel waktu untuk pengurutan
            });
            Alert.alert('Sukses', `Tagihan ${type} berhasil ditambahkan.`);
            navigation.goBack();
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert('Error', `Gagal menambahkan tagihan ${type}.`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Untuk Kamar</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setKamar(value)}
                        // Idealnya, daftar kamar ini diambil dari Firestore
                        items={[
                            { label: 'Kamar 01', value: '01' },
                            { label: 'Kamar 02', value: '02' },
                            { label: 'Kamar 08', value: '08' },
                            { label: 'Kamar 10', value: '10' },
                            { label: 'Kamar 11', value: '11' },
                            { label: 'Kamar 12', value: '12' },
                        ]}
                        style={pickerSelectStyles}
                        placeholder={{ label: '-- Pilih Kamar --', value: null }}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Jumlah Tagihan</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={jumlah} onChangeText={(text) => setJumlah(formatCurrency(text))} placeholder="Rp 0" />
                </View>
                 <View style={styles.formGroup}>
                    <Text style={styles.label}>Status Pembayaran</Text>
                     <RNPickerSelect
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                        items={[ { label: 'Belum Lunas', value: 'Belum Lunas' }, { label: 'Lunas', value: 'Lunas' }]}
                        style={pickerSelectStyles}
                        Icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSimpan}>
                    <Text style={styles.saveButtonText}>Simpan Tagihan</Text>
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

export default TambahTagihanScreen;
