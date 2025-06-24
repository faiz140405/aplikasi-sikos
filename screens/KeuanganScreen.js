import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// --- Helper Functions ---
const formatCurrency = (value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
const groupDataByDate = (data) => {
    return data.reduce((acc, item) => {
        // Ubah Firestore Timestamp menjadi objek Date, lalu format ke string
        const date = item.date.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        (acc[date] = acc[date] || []).push(item);
        return acc;
    }, {});
};

// --- Komponen Utama ---
const KeuanganScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('pemasukan');
    const [pemasukanList, setPemasukanList] = useState([]);
    const [pengeluaranList, setPengeluaranList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const qPemasukan = query(collection(db, "pemasukan"), orderBy("date", "desc"));
        const qPengeluaran = query(collection(db, "pengeluaran"), orderBy("date", "desc"));
        
        const unsubPemasukan = onSnapshot(qPemasukan, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPemasukanList(list);
            if(loading) setLoading(false);
        }, (error) => {
            console.error("Error fetching pemasukan: ", error);
            setLoading(false);
        });

        const unsubPengeluaran = onSnapshot(qPengeluaran, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPengeluaranList(list);
            if(loading) setLoading(false);
        }, (error) => {
            console.error("Error fetching pengeluaran: ", error);
            setLoading(false);
        });

        return () => { // Cleanup listeners
            unsubPemasukan();
            unsubPengeluaran();
        };
    }, []);

    const totalPemasukan = pemasukanList.reduce((sum, item) => sum + item.amount, 0);
    const totalPengeluaran = pengeluaranList.reduce((sum, item) => sum + item.amount, 0);

    const currentData = activeTab === 'pemasukan' ? pemasukanList : pengeluaranList;
    const groupedData = groupDataByDate(currentData);
    const dataKeys = Object.keys(groupedData);

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#30C95B" /></View>
    }

    const renderTransactionItem = (item) => (
        // Dibungkus dengan TouchableOpacity agar bisa diklik
        <TouchableOpacity key={item.id} style={styles.transactionCard} onPress={() => navigation.navigate('DetailTransaksi', { transaksiId: item.id, tipe: activeTab })}>
            <View>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionSubtitle}>{item.room}</Text>
            </View>
            <Text style={activeTab === 'pemasukan' ? styles.incomeText : styles.expenseText}>{formatCurrency(item.amount)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity><Text style={styles.headerTitle}>Keuangan</Text><View style={{ width: 28 }} /></View>
            <View style={styles.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.saldoCard}><View style={styles.saldoRow}><View style={styles.saldoBox}><Text style={styles.saldoLabel}>Pemasukan</Text><Text style={styles.incomeText}>{formatCurrency(totalPemasukan)}</Text></View><View style={styles.saldoBox}><Text style={styles.saldoLabel}>Pengeluaran</Text><Text style={styles.expenseText}>{formatCurrency(totalPengeluaran)}</Text></View></View><View style={styles.separator} /><View style={styles.sisaSaldoRow}><Text style={styles.saldoLabel}>Sisa Saldo</Text><Text style={styles.sisaSaldoText}>{formatCurrency(totalPemasukan - totalPengeluaran)}</Text></View></View>
                    <View style={styles.toggleContainer}><TouchableOpacity style={[styles.toggleButton, activeTab === 'pemasukan' && styles.toggleButtonActive]} onPress={() => setActiveTab('pemasukan')}><Text style={[styles.toggleText, activeTab === 'pemasukan' && styles.toggleTextActive]}>Pemasukan</Text></TouchableOpacity><TouchableOpacity style={[styles.toggleButton, activeTab === 'pengeluaran' && styles.toggleButtonActive]} onPress={() => setActiveTab('pengeluaran')}><Text style={[styles.toggleText, activeTab === 'pengeluaran' && styles.toggleTextActive]}>Pengeluaran</Text></TouchableOpacity></View>
                    <View style={styles.historySection}><Text style={styles.historyTitle}>Riwayat</Text><TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Bulan ini</Text><MaterialCommunityIcons name="chevron-down" size={20} color="#888" /></TouchableOpacity></View>
                    {dataKeys.length > 0 ? dataKeys.map(date => (<View key={date} style={styles.dateGroup}><View style={styles.dateHeader}><Text style={styles.dateHeaderText}>{date}</Text><Text style={[styles.dateTotal, activeTab === 'pemasukan' ? styles.incomeText : styles.expenseText]}>{formatCurrency(groupedData[date].reduce((sum, item) => sum + item.amount, 0))}</Text></View>{groupedData[date].map(renderTransactionItem)}</View>)) : <Text style={styles.emptyText}>Belum ada riwayat {activeTab}.</Text>}
                    <View style={{ height: 100 }} />
                </ScrollView>
                <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TambahTransaksi', { type: activeTab })}><MaterialCommunityIcons name="plus" size={32} color="#fff" /></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    mainContainer: { flex: 1, backgroundColor: '#f8f9fa' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff' },
    saldoCard: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    saldoRow: { flexDirection: 'row', justifyContent: 'space-around' },
    sisaSaldoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 8, marginTop: 12 },
    saldoBox: { alignItems: 'center', flex: 1 },
    saldoLabel: { fontSize: 14, color: '#888' },
    incomeText: { fontWeight: '600', fontSize: 16, color: '#28A745' },
    expenseText: { fontWeight: '600', fontSize: 16, color: '#FF6B6B' },
    sisaSaldoText: { fontWeight: 'bold', fontSize: 18, color: '#30C95B' },
    separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#E0F2E9', marginHorizontal: 16, borderRadius: 25, padding: 4 },
    toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    toggleButtonActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    toggleText: { fontWeight: '600', color: '#888' },
    toggleTextActive: { color: '#30C95B' },
    historySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 8 },
    historyTitle: { fontWeight: 'bold', fontSize: 18, color: '#333' },
    filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
    filterText: { marginRight: 4, color: '#888' },
    dateGroup: { marginBottom: 8 },
    dateHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    dateHeaderText: { fontWeight: '600', color: '#333' },
    dateTotal: { fontWeight: '600' },
    transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    transactionTitle: { fontWeight: '600', fontSize: 14, color: '#333' },
    transactionSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#30C95B', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#888' }
});


export default KeuanganScreen;
