import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Data Dummy untuk daftar tagihan listrik
const tagihanData = [
    { id: '1', number: '12', amount: 70000, status: 'Belum Lunas', due: '-12 h' },
    { id: '2', number: '10', amount: 70000, status: 'Lunas', due: '-12 h' },
    { id: '3', number: '08', amount: 120000, status: 'Lunas', due: '-12 h' },
    { id: '4', number: '24', amount: 30000, status: 'Belum Lunas', due: '-12 h' },
    { id: '5', number: '09', amount: 50000, status: 'Belum Lunas', due: '-12 h' },
    { id: '6', number: '11', amount: 120000, status: 'Lunas', due: '-12 h' },
    { id: '7', number: '06', amount: 50000, status: 'Belum Lunas', due: '-12 h' },
    { id: '8', number: '03', amount: 100000, status: 'Belum Lunas', due: '-12 h' },
];

// Helper untuk format Rupiah
const formatCurrency = (value) => `Rp.${new Intl.NumberFormat('id-ID').format(value)}`;

// Komponen untuk setiap item tagihan
const TagihanItem = ({ item }) => {
    const isLunas = item.status === 'Lunas';
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="flash" size={28} color="#fff" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Kamar {item.number}</Text>
                <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isLunas ? '#E8F5E9' : '#FFFDE7' }]}>
                   <Text style={[styles.statusText, { color: isLunas ? '#28A745' : '#FBC02D' }]}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.time}>{item.due}</Text>
        </TouchableOpacity>
    );
};

// Komponen Utama Layar Tagihan Listrik
const TagihanListrikScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tagihan Listrik</Text>
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
                    data={tagihanData}
                    renderItem={({ item }) => <TagihanItem item={item} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginTop: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: 48, fontSize: 16 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
    listTitle: { fontWeight: 'bold', fontSize: 18, color: '#333' },
    headerIcons: { flexDirection: 'row' },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: '#F96C4E' },
    textContainer: { flex: 1 },
    title: { fontWeight: '600', fontSize: 16, color: '#333' },
    amount: { fontSize: 14, color: '#888', marginVertical: 2 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
    statusText: { fontWeight: '500', fontSize: 12, textTransform: 'uppercase' },
    time: { fontWeight: '600', fontSize: 14, color: '#888' },
});

export default TagihanListrikScreen;
