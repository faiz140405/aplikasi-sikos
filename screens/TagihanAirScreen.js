import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Helper untuk format Rupiah
const formatCurrency = (value) => `Rp.${new Intl.NumberFormat('id-ID').format(value)}`;

// Komponen untuk setiap item tagihan
const TagihanItem = ({ item, onPress }) => {
    const isLunas = item.status === 'Lunas';
    return (
        // Dibungkus TouchableOpacity agar bisa diklik
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="water" size={28} color="#fff" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Kamar {item.number}</Text>
                <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isLunas ? '#E8F5E9' : '#FFFDE7' }]}>
                   <Text style={[styles.statusText, { color: isLunas ? '#28A745' : '#FBC02D' }]}>{item.status}</Text>
                </View>
            </View>
            {/* Tampilan waktu bisa ditambahkan lagi nanti */}
            {/* <Text style={styles.time}>{item.due}</Text> */}
        </TouchableOpacity>
    );
};

// Komponen Utama Layar Tagihan Air
const TagihanAirScreen = ({ navigation }) => {
    const [tagihanList, setTagihanList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mengambil data dari koleksi 'tagihan_air' di Firestore
        const q = query(collection(db, "tagihan_air"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTagihanList(list);
            setLoading(false);
        });
        return () => unsubscribe(); // Cleanup listener
    }, []);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tagihan Air</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={22} color="#888" style={styles.searchIcon} />
                    <TextInput placeholder="Cari Kamar..." placeholderTextColor="#888" style={styles.searchInput}/>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Tagihan Bulan Ini</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity><MaterialCommunityIcons name="calendar-month-outline" size={24} color="#555" /></TouchableOpacity>
                        <TouchableOpacity style={{marginLeft: 16}}><MaterialCommunityIcons name="filter-variant" size={24} color="#555" /></TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={tagihanList}
                    renderItem={({ item }) => <TagihanItem item={item} onPress={() => navigation.navigate('DetailTagihan', { tagihanId: item.id, type: 'air' })} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Belum ada tagihan air.</Text>}
                />
            </View>
            {/* Tombol Tambah (FAB) */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TambahTagihan', { type: 'air' })}>
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// --- StyleSheet dikembalikan untuk menggunakan Poppins ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginVertical: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 48, fontFamily: 'Poppins-Regular', fontSize: 16 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 16 },
    listTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333' },
    headerIcons: { flexDirection: 'row' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, marginHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: '#4596F7' },
    textContainer: { flex: 1 },
    title: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#333' },
    amount: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#888', marginVertical: 2 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
    statusText: { fontFamily: 'Poppins-Medium', fontSize: 12, textTransform: 'uppercase' },
    time: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#888' },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#30C95B', justifyContent: 'center', alignItems: 'center', elevation: 8 },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'Poppins-Regular', color: '#888' }
});

export default TagihanAirScreen;
