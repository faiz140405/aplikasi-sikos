import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';


// Komponen untuk setiap item kamar
const KamarItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="home-outline" size={28} color="#30C95B" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Kamar {item.number}</Text>
            <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>{item.category} - {item.term}</Text>
                <View style={[styles.statusBadge, {
                    backgroundColor: item.status === 'Terisi' ? '#E8F5E9' : '#FFF9C4',
                }]}>
                   <Text style={[styles.statusText, {
                       color: item.status === 'Terisi' ? '#28A745' : '#FBC02D'
                   }]}>{item.status}</Text>
                </View>
            </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={28} color="#BDBDBD" />
    </TouchableOpacity>
);


// Komponen Utama Layar Kamar
const KamarScreen = ({ navigation }) => {
    const [kamarList, setKamarList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "kamar"), (snapshot) => {
            const kamar = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setKamarList(kamar);
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
                <Text style={styles.headerTitle}>Kamar</Text>
                <View style={{ width: 28 }} /> 
            </View>
            
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={22} color="#888" style={styles.searchIcon} />
                    <TextInput placeholder="Cari Kamar..." placeholderTextColor="#888" style={styles.searchInput}/>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Daftar Kamar</Text>
                    <TouchableOpacity><MaterialCommunityIcons name="filter-variant" size={24} color="#555" /></TouchableOpacity>
                </View>

                <FlatList
                    data={kamarList}
                    renderItem={({ item }) => (
                        <KamarItem 
                            item={item} 
                            onPress={() => navigation.navigate('DetailKamar', { kamarId: item.id })}
                        />
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data kamar.</Text>}
                />
            </View>
             <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TambahKamar')}>
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginTop: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 48, fontSize: 16 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, marginHorizontal: 16, },
    listTitle: { fontWeight: 'bold', fontSize: 18, color: '#333' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, marginHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
    iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: '#E0F2E9' },
    textContainer: { flex: 1 },
    title: { fontWeight: '600', fontSize: 16, color: '#333' },
    subtitleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    subtitle: { fontSize: 12, color: '#888' },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 8 },
    statusText: { fontWeight: '500', fontSize: 10, textTransform: 'uppercase' },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#30C95B', justifyContent: 'center', alignItems: 'center', elevation: 8 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#888' }
});


export default KamarScreen;
