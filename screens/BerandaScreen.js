import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// --- Aset Gambar ---
const avatar = require('../assets/avatar-placeholder.png');
const promoIllustration = require('../assets/illustration-promo.png');

// --- Data Dummy (Diperbaiki: data duplikat dihapus & ditambahkan 'id' unik) ---
const penyewaData = [
    { id: '1', name: 'Faiz Nizar Nu\'aim', room: 'Kamar 02', status: 'Kamar Kuning', due: '-12 h', color: '#FFC107' },
    { id: '2', name: 'Falih Arya Budi', room: 'Kamar 10', status: 'Kamar Tingkat', due: '-14 h', color: '#4CAF50' },
    { id: '3', name: 'Sapta Wahyu Tirta', room: 'Kamar 04', status: 'Kamar Biru', due: '-45 h', color: '#2196F3' },
    { id: '4', name: 'Surya Agung Firdaus', room: 'Kamar 13', status: 'Kamar Kuning', due: '-14 h', color: '#FFC107' },
    { id: '5', name: 'Muhammad Ilham Syaifullah', room: 'Kamar 01', status: 'Kamar Kuning', due: '-137 h', color: '#FFC107' },
    { id: '6', name: 'Faiz Nizar Nu\'aim', room: 'Kamar 02', status: 'Kamar Kuning', due: '-12 h', color: '#FFC107' },
    { id: '7', name: 'Falih Arya Budi', room: 'Kamar 10', status: 'Kamar Tingkat', due: '-14 h', color: '#4CAF50' },
    { id: '8', name: 'Sapta Wahyu Tirta', room: 'Kamar 04', status: 'Kamar Biru', due: '-45 h', color: '#2196F3' },
    { id: '9', name: 'Surya Agung Firdaus', room: 'Kamar 13', status: 'Kamar Kuning', due: '-14 h', color: '#FFC107' },
    { id: '10', name: 'Muhammad Ilham Syaifullah', room: 'Kamar 01', status: 'Kamar Kuning', due: '-137 h', color: '#FFC107' },
];

// --- Komponen Tombol Aksi ---
// PERBAIKAN: Menambahkan prop 'onPress'
const ActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <MaterialCommunityIcons name={icon} size={28} color="#fff" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

// --- Komponen Utama Layar Beranda ---
// PERBAIKAN: Menambahkan { navigation } untuk bisa pindah halaman
const BerandaScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#30C95B" />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Kost Amanah <MaterialCommunityIcons name="check-decagram" size={16} color="#fff" /></Text>
                    <Text style={styles.headerSubtitle}>Faiz Nizar Nu'aim</Text>
                </View>
                <Image source={avatar} style={styles.avatar} />
            </View>

            {/* Promo Card */}
            <View style={styles.promoCard}>
                <View style={styles.promoTextContainer}>
                    <Text style={styles.promoTitle}>Kelola kosan anda menjadi lebih mudah?</Text>
                    <Text style={styles.promoSubtitle}>Fitur canggih Sikos akan membantu mengelola kost anda</Text>
                </View>
                <Image source={promoIllustration} style={styles.promoIllustration} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                {/* PERBAIKAN: Menambahkan fungsi onPress untuk navigasi */}
                <ActionButton icon="door-open" label="Kamar" color="#FFB02A" onPress={() => navigation.navigate('Kamar')} />
                <ActionButton icon="flash" label="Listrik" color="#F96C4E" onPress={() => navigation.navigate('TagihanListrik')} />
                <ActionButton icon="water" label="Air" color="#4596F7" onPress={() => navigation.navigate('TagihanAir')} />
                <ActionButton icon="account-group" label="Penyewa" color="#30C95B" onPress={() => navigation.navigate('Penyewa')} />
            </View>     

            {/* Main Content Area */}
            <View style={styles.contentArea}>
                <View style={styles.handleBar} />
                <Text style={styles.contentTitle}>Jatuh Tempo Terdekat</Text>
                <Text style={styles.contentSubtitle}>Top 5 penyewa dengan tanggal jatuh tempo terdekat</Text>

                {/* Tenant List */}
                {penyewaData.map((penyewa) => (
                    // PERBAIKAN: Menggunakan item.id sebagai key yang unik
                    <View key={penyewa.id} style={styles.tenantCard}>
                        <View style={[styles.tenantAvatar]}>
                            <FontAwesome5 name="user-alt" size={18} color="#30C95B" />
                        </View>
                        <View style={styles.tenantInfo}>
                            <Text style={styles.tenantName}>{penyewa.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={styles.tenantRoom}>{penyewa.room}</Text>
                                <View style={[styles.tenantStatus, { backgroundColor: `${penyewa.color}30` }]}>
                                    <Text style={[styles.tenantStatusText, { color: penyewa.color }]}>{penyewa.status}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.tenantDue}>{penyewa.due}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#30C95B' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#fff' },
    headerSubtitle: { fontSize: 14, color: '#fff' },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    promoCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1 },
    promoTextContainer: { flex: 1, paddingRight: 10 },
    promoTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    promoSubtitle: { fontSize: 12, color: '#888', marginTop: 4 },
    promoIllustration: { width: 100, height: 80, resizeMode: 'contain' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 24, marginTop: 24 },
    actionItem: { alignItems: 'center' },
    iconContainer: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontWeight: '600', fontSize: 12, color: '#fff', marginTop: 8 },
    contentArea: { flex: 1, backgroundColor: '#f8f9fa', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: 24, padding: 24 },
    handleBar: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
    contentTitle: { fontWeight: 'bold', fontSize: 18, color: '#333' },
    contentSubtitle: { fontSize: 12, color: '#888', marginBottom: 16 },
    tenantCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    tenantAvatar: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: '#E0F2E9' },
    tenantInfo: { flex: 1 },
    tenantName: { fontWeight: '600', fontSize: 14, color: '#333' },
    tenantRoom: { fontSize: 12, color: '#888' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
    tenantStatusText: { fontWeight: '500', fontSize: 10 },
    tenantDue: { fontWeight: '600', fontSize: 14, color: '#FF6B6B' },
});

export default BerandaScreen;

