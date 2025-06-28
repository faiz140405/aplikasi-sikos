import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Svg, { G, Circle, Polyline, Line, Text as SvgText } from 'react-native-svg'; // Import komponen SVG tambahan

// --- Helper Functions ---
const formatCurrency = (value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
const groupDataByDate = (data) => {
    return data.reduce((acc, item) => {
        if (item.date && item.date.toDate) {
            const dateStr = item.date.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            (acc[dateStr] = acc[dateStr] || []).push(item);
        }
        return acc;
    }, {});
};

// --- Komponen Pie Chart ---
const PieChart = ({ pemasukan, pengeluaran }) => {
    const total = pemasukan + pengeluaran;
    if (total === 0) {
        return <View style={styles.chartContainer}><Text style={styles.chartLabel}>Belum ada data</Text></View>;
    }

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const pemasukanStrokeDashoffset = circumference - (pemasukan / total) * circumference;

    return (
        <View style={styles.chartContainer}>
            <Svg height="100" width="100" viewBox="0 0 100 100">
                <G rotation="-90" origin="50, 50">
                    <Circle cx="50" cy="50" r={radius} stroke="#FF6B6B" strokeWidth="10" fill="transparent" />
                    {pemasukan > 0 && (
                        <Circle cx="50" cy="50" r={radius} stroke="#28A745" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={pemasukanStrokeDashoffset} strokeLinecap="round"/>
                    )}
                </G>
            </Svg>
            <View style={styles.chartTextContainer}>
                <Text style={styles.chartTextPercentage}>{Math.round((pemasukan/total)*100)}%</Text>
                <Text style={styles.chartTextLabel}>Pemasukan</Text>
            </View>
        </View>
    );
};

// --- Komponen Line Chart (Baru) ---
const LineChart = () => {
    // Data dummy untuk tren, di aplikasi nyata ini akan dinamis
    const data = [80, 100, 90, 120, 110, 130];
    const width = 140;
    const height = 100;
    const padding = 10;

    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - (point / 150) * (height - padding * 2); // 150 adalah nilai max dummy
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={styles.chartContainer}>
            <Svg height={height} width={width}>
                {/* Garis Sumbu Y */}
                <Line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#E0E0E0" strokeWidth="1"/>
                {/* Garis Sumbu X */}
                <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E0E0E0" strokeWidth="1"/>
                {/* Garis Data */}
                <Polyline points={points} fill="none" stroke="#4596F7" strokeWidth="2"/>
            </Svg>
        </View>
    )
}


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
            setLoading(false);
        });

        const unsubPengeluaran = onSnapshot(qPengeluaran, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPengeluaranList(list);
            setLoading(false);
        });

        return () => {
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
        <TouchableOpacity key={item.id} style={styles.transactionCard} onPress={() => navigation.navigate('DetailTransaksi', { transaksiId: item.id, tipe: activeTab })}>
            <View>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionSubtitle}>{item.room}</Text>
            </View>
            <Text style={activeTab === 'pemasukan' ? styles.incomeTextValue : styles.expenseTextValue}>{formatCurrency(item.amount)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity><Text style={styles.headerTitle}>Keuangan</Text><View style={{ width: 28 }} /></View>
            <View style={styles.mainContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Kartu Saldo dengan Grafik */}
                    <View style={styles.saldoCard}>
                        {/* Baris untuk Grafik */}
                        <View style={styles.chartRow}>
                           <PieChart pemasukan={totalPemasukan} pengeluaran={totalPengeluaran} />
                           <LineChart />
                        </View>
                        {/* Baris untuk Legenda & Info */}
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#28A745'}]} />
                                <View>
                                    <Text style={styles.saldoLabel}>Pemasukan</Text>
                                    <Text style={styles.incomeTextValue}>{formatCurrency(totalPemasukan)}</Text>
                                </View>
                            </View>
                             <View style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: '#FF6B6B'}]} />
                                <View>
                                    <Text style={styles.saldoLabel}>Pengeluaran</Text>
                                    <Text style={styles.expenseTextValue}>{formatCurrency(totalPengeluaran)}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.sisaSaldoRow}><Text style={styles.sisaSaldoLabel}>Sisa Saldo</Text><Text style={styles.sisaSaldoText}>{formatCurrency(totalPemasukan - totalPengeluaran)}</Text></View>
                    </View>

                    <View style={styles.toggleContainer}><TouchableOpacity style={[styles.toggleButton, activeTab === 'pemasukan' && styles.toggleButtonActive]} onPress={() => setActiveTab('pemasukan')}><Text style={[styles.toggleText, activeTab === 'pemasukan' && styles.toggleTextActive]}>Pemasukan</Text></TouchableOpacity><TouchableOpacity style={[styles.toggleButton, activeTab === 'pengeluaran' && styles.toggleButtonActive]} onPress={() => setActiveTab('pengeluaran')}><Text style={[styles.toggleText, activeTab === 'pengeluaran' && styles.toggleTextActive]}>Pengeluaran</Text></TouchableOpacity></View>

                    <View style={styles.historySection}><Text style={styles.historyTitle}>Riwayat</Text><TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Bulan ini</Text><MaterialCommunityIcons name="chevron-down" size={20} color="#888" /></TouchableOpacity></View>
                    {dataKeys.length > 0 ? dataKeys.map(date => (<View key={date} style={styles.dateGroup}><View style={styles.dateHeader}><Text style={styles.dateHeaderText}>{date}</Text><Text style={[styles.dateTotal, activeTab === 'pemasukan' ? styles.incomeTextValue : styles.expenseTextValue]}>{formatCurrency(groupedData[date].reduce((sum, item) => sum + item.amount, 0))}</Text></View>{groupedData[date].map(renderTransactionItem)}</View>)) : <Text style={styles.emptyText}>Belum ada riwayat {activeTab}.</Text>}
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
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    saldoCard: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    legendRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    sisaSaldoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    saldoLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#888' },
    incomeTextValue: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#28A745' },
    expenseTextValue: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#FF6B6B' },
    sisaSaldoLabel: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#333' },
    sisaSaldoText: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#30C95B' },
    separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
    chartContainer: { justifyContent: 'center', alignItems: 'center' },
    chartTextContainer: { position: 'absolute' },
    chartTextPercentage: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#333', textAlign: 'center' },
    chartTextLabel: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', textAlign: 'center' },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#E0F2E9', marginHorizontal: 16, borderRadius: 25, padding: 4 },
    toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    toggleButtonActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    toggleText: { fontFamily: 'Poppins-SemiBold', color: '#888' },
    toggleTextActive: { color: '#30C95B' },
    historySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 8 },
    historyTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333' },
    filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
    filterText: { fontFamily: 'Poppins-Regular', marginRight: 4, color: '#888' },
    dateGroup: { marginBottom: 8 },
    dateHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    dateHeaderText: { fontFamily: 'Poppins-SemiBold', color: '#333' },
    dateTotal: { fontFamily: 'Poppins-SemiBold' },
    transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    transactionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333' },
    transactionSubtitle: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', marginTop: 2 },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#30C95B', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
    emptyText: { textAlign: 'center', marginTop: 40, fontFamily: 'Poppins-Regular', color: '#888' }
});

export default KeuanganScreen;
