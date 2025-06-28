import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- Data Dummy untuk Notifikasi ---
// Di aplikasi nyata, data ini akan datang dari state management atau API
const notificationsData = [
    { id: '1', type: 'Jatuh Tempo', room: 'Kamar 02', status: 'Kamar Kuning', time: '-12 h' },
    { id: '2', type: 'Jatuh Tempo', room: 'Kamar 10', status: 'Kamar Tingkat', time: '-14 h' },
    { id: '3', type: 'Jatuh Tempo', room: 'Kamar 02', status: 'Kamar Kuning', time: '-12 h' },
    { id: '4', type: 'Jatuh Tempo', room: 'Kamar 10', status: 'Kamar Tingkat', time: '-14 h' },
    { id: '5', type: 'Pembayaran Diterima', room: 'Kamar 05', status: 'Lunas', time: '1 hari yang lalu', isPayment: true },
    { id: '6', type: 'Jatuh Tempo', room: 'Kamar 07', status: 'Kamar Biru', time: '-45 h' },
    { id: '7', type: 'jatuh Tempo', room: 'kamar 03', status: 'Kamar Biru', time: '-20 h' },
    { id: '8', type: 'jatuh Tempo', room: 'kamar 11', status: 'Kamar Kuning', time: '-22 h' },
    { id: '9', type: 'jatuh Tempo', room: 'kamar 07', status: 'Kamar Kuning', time: '-11 h' },
    { id: '10', type: 'Jatuh Tempo', room: 'Kamar 02', status: 'Kamar Kuning', time: '-12 h' },
    { id: '11', type: 'Jatuh Tempo', room: 'Kamar 10', status: 'Kamar Tingkat', time: '-14 h' },
    { id: '12', type: 'Jatuh Tempo', room: 'Kamar 02', status: 'Kamar Kuning', time: '-12 h' },
    { id: '13', type: 'Jatuh Tempo', room: 'Kamar 10', status: 'Kamar Tingkat', time: '-14 h' },
    { id: '14', type: 'Pembayaran Diterima', room: 'Kamar 05', status: 'Lunas', time: '1 hari yang lalu', isPayment: true },
    { id: '15', type: 'Jatuh Tempo', room: 'Kamar 07', status: 'Kamar Biru', time: '-45 h' },
    { id: '16', type: 'jatuh Tempo', room: 'kamar 03', status: 'Kamar Biru', time: '-20 h' },
    { id: '17', type: 'jatuh Tempo', room: 'kamar 11', status: 'Kamar Kuning', time: '-22 h' },
    { id: '18', type: 'jatuh Tempo', room: 'kamar 07', status: 'Kamar Kuning', time: '-11 h' },
];

// --- Komponen untuk setiap item notifikasi ---
const NotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: item.isPayment ? '#E0F2E9' : '#FFF9C4'}]}>
            <MaterialCommunityIcons 
                name={item.isPayment ? "check-circle" : "alert"} 
                size={28} 
                color={item.isPayment ? '#28A745' : '#FBC02D'} 
            />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{item.type}</Text>
            <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>{item.room}</Text>
                <View style={[styles.statusBadge, {backgroundColor: item.isPayment ? '#E8F5E9' : '#FFFDE7'}]}>
                   <Text style={[styles.statusText, {color: item.isPayment ? '#28A745' : '#FBC02D'}]}>{item.status}</Text>
                </View>
            </View>
        </View>
        <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
);

// --- Komponen Utama Layar Notifikasi ---
const NotifikasiScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header Kustom */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifikasi</Text>
                <View style={{ width: 28 }} /> 
            </View>

            {/* Daftar Notifikasi */}
            <FlatList
                data={notificationsData}
                renderItem={({ item }) => <NotificationItem item={item} />}
                // PERBAIKAN: Membuat key lebih unik dengan menggabungkan id dan index
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#30C95B',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#30C95B',
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#fff',
    },
    listContainer: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#333',
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#888',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    statusText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
    },
    time: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#888',
    },
});

export default NotifikasiScreen;
