import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Helper untuk format Rupiah
const formatCurrency = (value) => `Rp.${new Intl.NumberFormat('id-ID').format(value)}`;

// Komponen untuk setiap item penyewa
const PenyewaItem = ({ item, onPress }) => {
    const isAktif = item.status === 'aktif';
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: isAktif ? '#E0F2E9' : '#FFEBEE' }]}>
                <FontAwesome5 name="user-alt" size={20} color={isAktif ? '#30C95B' : '#F44336'} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>Kamar {item.room} - Sisa {item.daysLeft} Hari</Text>
                {isAktif ? (
                    <View style={styles.priceBadge}>
                       <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
                    </View>
                ) : (
                    <View style={styles.keluarBadge}>
                        <Text style={styles.keluarText}>Keluar</Text>
                    </View>
                )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#BDBDBD" />
        </TouchableOpacity>
    );
};

// Komponen Utama Layar Penyewa
const PenyewaScreen = ({ navigation }) => {
    const [penyewaList, setPenyewaList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "penyewa"), orderBy("name", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const penyewa = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPenyewaList(penyewa);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Penyewa</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={22} color="#888" style={styles.searchIcon} />
                    <TextInput placeholder="Cari Penyewa..." placeholderTextColor="#888" style={styles.searchInput}/>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Daftar Penyewa</Text>
                    <TouchableOpacity><MaterialCommunityIcons name="filter-variant" size={24} color="#555" /></TouchableOpacity>
                </View>

                <FlatList
                    data={penyewaList}
                    renderItem={({ item }) => <PenyewaItem item={item} onPress={() => navigation.navigate('DetailPenyewa', { penyewaId: item.id })} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data penyewa.</Text>}
                />
            </View>
             <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TambahPenyewa')}>
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// StyleSheet dikembalikan untuk menggunakan Poppins
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginTop: 16, marginHorizontal:16, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 48, fontFamily: 'Poppins-Regular', fontSize: 16 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, marginHorizontal: 16, },
    listTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, marginHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    textContainer: { flex: 1 },
    title: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#333' },
    subtitle: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', marginVertical: 2 },
    priceBadge: { alignSelf: 'flex-start', backgroundColor: '#E0F2E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
    priceText: { color: '#30C95B', fontFamily: 'Poppins-Medium', fontSize: 12 },
    keluarBadge: { alignSelf: 'flex-start', backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
    keluarText: { color: '#F44336', fontFamily: 'Poppins-Medium', fontSize: 12 },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#30C95B', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular', color: '#888' }
});

export default PenyewaScreen;
