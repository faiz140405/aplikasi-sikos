import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const DetailPenyewaScreen = ({ route, navigation }) => {
    const { penyewaId } = route.params;
    const [penyewa, setPenyewa] = useState(null);
    const [nama, setNama] = useState('');
    const [kamar, setKamar] = useState('');

    useEffect(() => {
        const fetchPenyewa = async () => {
            const docRef = doc(db, "penyewa", penyewaId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPenyewa(data);
                setNama(data.name);
                setKamar(data.room);
            } else {
                console.log("No such document!");
            }
        };
        fetchPenyewa();
    }, [penyewaId]);

    const handleUpdate = async () => {
        const docRef = doc(db, "penyewa", penyewaId);
        await updateDoc(docRef, {
            name: nama,
            room: kamar,
        });
        Alert.alert('Sukses', 'Data berhasil diperbarui');
        navigation.goBack();
    };
    
    const handleDelete = () => {
        Alert.alert(
            "Hapus Penyewa",
            "Apakah Anda yakin ingin menghapus penyewa ini?",
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: async () => {
                    await deleteDoc(doc(db, "penyewa", penyewaId));
                    navigation.goBack();
                }}
            ]
        );
    };

    if (!penyewa) {
        return <View style={styles.container}><Text>Loading...</Text></View>
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
                    <TextInput style={styles.input} value={kamar} onChangeText={setKamar} keyboardType="numeric"/>
                </View>
                {/* Tambahkan field lain jika perlu */}
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
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


export default DetailPenyewaScreen;
