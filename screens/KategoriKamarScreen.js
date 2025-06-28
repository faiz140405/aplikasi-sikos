import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const KategoriKamarScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [namaKategori, setNamaKategori] = useState('');
    const [editingKategori, setEditingKategori] = useState(null); // Untuk menyimpan ID kategori yang diedit

    useEffect(() => {
        const q = collection(db, "kategori_kamar");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setKategoriList(list);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleOpenModal = (kategori = null) => {
        setEditingKategori(kategori);
        setNamaKategori(kategori ? kategori.name : '');
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!namaKategori.trim()) {
            Alert.alert("Error", "Nama kategori tidak boleh kosong.");
            return;
        }
        try {
            if (editingKategori) {
                // Update
                const docRef = doc(db, "kategori_kamar", editingKategori.id);
                await updateDoc(docRef, { name: namaKategori });
            } else {
                // Create
                await addDoc(collection(db, "kategori_kamar"), { name: namaKategori });
            }
            setModalVisible(false);
        } catch (error) {
            console.error("Error saving kategori: ", error);
            Alert.alert("Error", "Gagal menyimpan kategori.");
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Hapus Kategori", "Apakah Anda yakin ingin menghapus kategori ini?", [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: async () => {
                await deleteDoc(doc(db, "kategori_kamar", id));
            }}
        ]);
    };

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{editingKategori ? 'Edit' : 'Tambah'} Kategori</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Contoh: Kamar AC"
                            value={namaKategori}
                            onChangeText={setNamaKategori}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.modalButtonBatal}>Batal</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleSave}><Text style={styles.modalButtonSimpan}>Simpan</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Kategori Kamar</Text>
                <TouchableOpacity onPress={() => handleOpenModal()}><MaterialCommunityIcons name="plus" size={28} color="#fff" /></TouchableOpacity>
            </View>
            <FlatList
                data={kategoriList}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Belum ada kategori. Tekan + untuk menambah.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{item.name}</Text>
                        <View style={styles.cardActions}>
                            <TouchableOpacity onPress={() => handleOpenModal(item)}><MaterialCommunityIcons name="pencil" size={24} color="#FFA000" /></TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => handleDelete(item.id)}><MaterialCommunityIcons name="delete" size={24} color="#D32F2F" /></TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    cardText: { fontFamily: 'Poppins-Regular', fontSize: 16 },
    cardActions: { flexDirection: 'row' },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular', color: '#888' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalView: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '100%' },
    modalTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, marginBottom: 16 },
    modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, fontFamily: 'Poppins-Regular', marginBottom: 20 },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalButtonBatal: { fontFamily: 'Poppins-SemiBold', color: '#888', marginRight: 24, fontSize: 16 },
    modalButtonSimpan: { fontFamily: 'Poppins-SemiBold', color: '#30C95B', fontSize: 16 },
});

export default KategoriKamarScreen;