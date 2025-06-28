import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const kosIcon = require('../assets/icon-kos.png'); // Pastikan Anda sudah punya aset ini

const KuitansiScreen = ({ navigation, route }) => {
    // Mengambil data transaksi yang dikirim dari layar TambahTransaksi
    const { transaction } = route.params;

    const handleShare = async () => {
        try {
            const message = `
--- KUITANSI SIKOS ---
No. Ref: ${transaction.noRef}
Jenis: ${transaction.jenisTransaksi}
Total: Rp${new Intl.NumberFormat('id-ID').format(transaction.totalTransaksi)}
Tanggal: ${transaction.tanggal}
Penyewa: ${transaction.penyewa} (${transaction.kamar})
--------------------
Terima kasih!
Dihasilkan oleh aplikasi SIKOS.`;
            await Share.share({
                message,
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleHalamanUtama = () => {
        // Kembali ke halaman utama dengan mereset tumpukan navigasi
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>Kuitansi</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Header Kartu */}
                    <View style={styles.cardHeader}>
                        <Image source={kosIcon} style={styles.kosIcon} />
                        <View>
                            <Text style={styles.kosName}>KOS AMANAH</Text>
                            <Text style={styles.kosAddress}>JL. ZA Pagar Alam No.11, Labuhan Ratu, Kedaton Bandar Lampung</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    
                    {/* Total Transaksi */}
                    <Text style={styles.totalLabel}>TOTAL TRANSAKSI</Text>
                    <Text style={styles.totalAmount}>Rp{new Intl.NumberFormat('id-ID').format(transaction.totalTransaksi)}</Text>
                    
                    <View style={styles.separator} />

                    {/* Detail Transaksi */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>No. Ref</Text>
                        <Text style={styles.detailValue}>{transaction.noRef}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Jenis Transaksi</Text>
                        <Text style={styles.detailValue}>{transaction.jenisTransaksi}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Kamar</Text>
                        <Text style={styles.detailValue}>{transaction.kamar}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Penyewa</Text>
                        <Text style={styles.detailValue}>{transaction.penyewa}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tanggal</Text>
                        <Text style={styles.detailValue}>{transaction.tanggal}</Text>
                    </View>
                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tagihan Selanjutnya</Text>
                        <Text style={styles.detailValue}>{transaction.tagihanSelanjutnya}</Text>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.footerText}>-- Terima Kasih --</Text>
                    <Text style={styles.footerSubText}>Kuitansi ini di generate oleh aplikasi SIKOS</Text>

                </View>
                
                {/* Tombol Aksi */}
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareButtonText}>Bagikan Kuitansi</Text>
                    <MaterialCommunityIcons name="send-outline" size={22} color="#30C95B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={handleHalamanUtama}>
                    <Text style={styles.homeButtonText}>Halaman Utama</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// StyleSheet dikembalikan untuk menggunakan Poppins
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
    container: { flex: 1, padding: 16, justifyContent: 'space-between' },
    header: { padding: 16, backgroundColor: '#f8f9fa', alignItems: 'center' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333' },
    card: { backgroundColor: '#30C95B', borderRadius: 16, padding: 20 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    kosIcon: { width: 50, height: 50, marginRight: 16 },
    kosName: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#fff' },
    kosAddress: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#fff', flexShrink: 1 },
    separator: { height: 1.5, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 16 },
    totalLabel: { fontFamily: 'Poppins-Regular', color: '#fff', textAlign: 'center', fontSize: 14 },
    totalAmount: { fontFamily: 'Poppins-Bold', color: '#fff', textAlign: 'center', fontSize: 28, marginTop: 4 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    detailLabel: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#E0F2E9' },
    detailValue: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#fff' },
    footerText: { fontFamily: 'Poppins-SemiBold', color: '#fff', textAlign: 'center' },
    footerSubText: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#E0F2E9', textAlign: 'center', marginTop: 4 },
    shareButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#30C95B', borderRadius: 8, paddingVertical: 14, marginTop: 300 },
    shareButtonText: { color: '#30C95B', fontFamily: 'Poppins-Bold', fontSize: 16, marginRight: 8 },
    homeButton: { backgroundColor: '#30C95B', borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 12 },
    homeButtonText: { color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 16 }
});


export default KuitansiScreen;
