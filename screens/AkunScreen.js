import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, TextInput, Switch, FlatList, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

// Aset untuk gambar profil
const avatar = require('../assets/avatar-placeholder.png');

// Komponen Reusable untuk setiap baris menu
const MenuItem = ({ icon, name, value, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemContent}>
            <MaterialCommunityIcons name={icon} size={24} color="#555" style={styles.menuIcon} />
            <Text style={styles.menuText}>{name}</Text>
        </View>
        <View style={styles.menuItemContent}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
        </View>
    </TouchableOpacity>
);

// Komponen Utama Layar Akun
const AkunScreen = ({ navigation }) => {
    // State untuk kontrol modal
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [kostanModalVisible, setKostanModalVisible] = useState(false);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    
    // State untuk data (kembali menggunakan data statis/dummy)
    const [userName, setUserName] = useState("Faiz Nizar Nu'aim");
    const [tempName, setTempName] = useState(userName);
    const [reminder3Days, setReminder3Days] = useState(true);
    const [reminder15Days, setReminder15Days] = useState(false);
    const [kostanList, setKostanList] = useState([ { id: '1', name: 'Kost Amanah' }, { id: '2', name: 'Kost Santi' }, ]);
    const [selectedLanguage, setSelectedLanguage] = useState('id');
    const [tempLanguage, setTempLanguage] = useState('id');

    // Fungsi logout dummy, hanya navigasi
    const handleLogout = () => {
        Alert.alert(
            "Keluar",
            "Apakah Anda yakin ingin keluar?",
            [
                { text: "Batal", style: "cancel" },
                { text: "Keluar", style: "destructive", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
            ]
        );
    };

    const handleBeriRating = () => {
        // Ganti dengan URL Play Store/App Store Anda nanti
        const url = 'market://details?id=com.instagram.android'; 
        Linking.openURL(url).catch(() => Alert.alert("Error", "Tidak dapat membuka App Store."));
    };

    const ketentuanContent = `Selamat datang di Sikos!

Terima kasih telah menggunakan aplikasi kami untuk membantu mengelola usaha kos-kosan Anda. Dengan mengunduh, mendaftar, atau menggunakan aplikasi Sikos ("Layanan"), Anda setuju untuk terikat oleh Ketentuan Layanan dan Kebijakan Privasi di bawah ini. Harap baca dokumen ini dengan saksama.

I. Ketentuan Penggunaan (Terms of Use)
1. Penerimaan Ketentuan
Dengan mengakses atau menggunakan Layanan kami, Anda mengonfirmasi bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh ketentuan ini. Jika Anda tidak setuju, Anda tidak diizinkan untuk menggunakan Layanan.

2. Deskripsi Layanan
Sikos adalah aplikasi manajemen properti yang dirancang untuk membantu pemilik atau pengelola kos-kosan dalam mencatat data kamar, data penyewa, mengelola tagihan (listrik, air), serta melacak pemasukan dan pengeluaran keuangan.

3. Tanggung Jawab Pengguna

Akurasi Data: Anda bertanggung jawab penuh atas keakuratan dan legalitas semua data yang Anda masukkan ke dalam aplikasi, termasuk data penyewa, detail kamar, dan catatan transaksi keuangan.

Keamanan Akun: Anda bertanggung jawab untuk menjaga kerahasiaan informasi login Anda (seperti verifikasi nomor telepon) dan semua aktivitas yang terjadi di bawah akun Anda.

Penggunaan yang Sah: Anda setuju untuk tidak menggunakan Layanan untuk tujuan ilegal, penipuan, atau aktivitas lain yang melanggar hukum yang berlaku di Indonesia.

4. Pembatasan
Anda tidak diizinkan untuk merekayasa balik (reverse-engineer), mendekompilasi, atau mencoba mengekstrak kode sumber dari aplikasi Sikos.

II. Kebijakan Privasi (Privacy Policy)
Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.

1. Informasi yang Kami Kumpulkan
Kami mengumpulkan data yang Anda berikan secara langsung saat menggunakan aplikasi, yang meliputi:

Data Properti: Nama kosan, kategori kamar, informasi bank.

Data Penyewa: Nama penyewa, nomor kamar yang ditempati, dan detail terkait sewa.

Data Keuangan: Catatan pemasukan dan pengeluaran yang Anda masukkan.

Data Kontak: Nomor telepon Anda yang digunakan untuk pendaftaran (jika fitur autentikasi diaktifkan).

2. Bagaimana Kami Menggunakan Informasi Anda
Informasi yang Anda berikan digunakan semata-mata untuk menyediakan dan meningkatkan fungsionalitas Layanan, termasuk:

Menampilkan data Anda secara terorganisir di dalam aplikasi.

Menyimpan catatan Anda di database cloud (Firebase) agar dapat diakses kapan saja.

Menghitung total pemasukan, pengeluaran, dan sisa saldo.

(Fitur di masa depan) Mengirimkan pengingat tagihan atau notifikasi penting lainnya.

3. Penyimpanan dan Keamanan Data

Data Anda disimpan dengan aman di layanan cloud Google Firebase, yang menggunakan standar keamanan industri untuk melindungi informasi.

Meskipun kami berusaha keras untuk melindungi data Anda, tidak ada sistem keamanan yang 100% sempurna. Kami tidak dapat menjamin keamanan absolut dari data yang Anda simpan.

4. Berbagi Informasi
Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga mana pun untuk tujuan pemasaran. Data Anda hanya milik Anda. Kami hanya dapat mengungkapkan informasi Anda jika diwajibkan oleh hukum atau proses peradilan yang sah.

III. Perubahan pada Ketentuan & Privasi
Kami dapat memperbarui Ketentuan Layanan dan Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan melalui notifikasi di dalam aplikasi atau cara lain yang wajar. Dengan terus menggunakan Layanan setelah perubahan tersebut, Anda dianggap menyetujui ketentuan yang baru.

IV. Informasi Kontak
Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan atau Kebijakan Privasi ini, silakan hubungi kami di:

Email: sikos@gmail.com

WhatsApp: +62-818-0988-4140

Disclaimer: Dokumen ini adalah templat umum dan mungkin tidak sepenuhnya mencakup semua kewajiban hukum untuk yurisdiksi Anda. Sangat disarankan untuk berkonsultasi dengan profesional hukum untuk meninjau dan menyesuaikan dokumen ini sesuai dengan kebutuhan bisnis dan hukum yang berlaku.`;
    const bantuanContent = `Untuk bantuan, silakan hubungi kami melalui email di support@sikos.com atau WhatsApp di +62-818-0988-4140`;


    const handleOpenProfileModal = () => { setTempName(userName); setProfileModalVisible(true); };
    const handleSaveChanges = () => { setUserName(tempName); setProfileModalVisible(false); };
    const handleSaveReminders = () => { setReminderModalVisible(false); };
    const handleSaveKostan = () => { setKostanModalVisible(false); };
    const handleSaveLanguage = () => { setSelectedLanguage(tempLanguage); setLanguageModalVisible(false); };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* --- Modal untuk Edit Profil --- */}
            <Modal animationType="fade" transparent={true} visible={profileModalVisible}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setProfileModalVisible(false)}><MaterialCommunityIcons name="close-circle" size={28} color="#BDBDBD" /></TouchableOpacity>
                        <View style={styles.modalProfilePicContainer}><Image source={avatar} style={styles.modalProfilePic} /><TouchableOpacity style={styles.cameraIcon}><MaterialCommunityIcons name="camera" size={18} color="#fff" /></TouchableOpacity></View>
                        <Text style={styles.modalLabel}>Nama Lengkap</Text>
                        <TextInput style={styles.modalInput} value={tempName} onChangeText={setTempName} />
                        <View style={styles.modalButtonContainer}><TouchableOpacity onPress={() => setProfileModalVisible(false)}><Text style={styles.modalButtonBatal}>Batal</Text></TouchableOpacity><TouchableOpacity onPress={handleSaveChanges}><Text style={styles.modalButtonSimpan}>Simpan</Text></TouchableOpacity></View>
                    </View>
                </View>
            </Modal>

            {/* --- Modal untuk Pengingat --- */}
            <Modal animationType="fade" transparent={true} visible={reminderModalVisible}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setReminderModalVisible(false)}><MaterialCommunityIcons name="close-circle" size={28} color="#BDBDBD" /></TouchableOpacity>
                        <Text style={styles.modalTitle}>Pengingat</Text>
                        <View style={styles.reminderOption}><View style={styles.reminderIconContainer}><MaterialCommunityIcons name="calendar-alert" size={24} color="#30C95B" /></View><Text style={styles.reminderText}>3 Hari Sebelum Jatuh Tempo</Text><Switch trackColor={{ false: "#E0E0E0", true: "#A5D6A7" }} thumbColor={reminder3Days ? "#30C95B" : "#f4f3f4"} onValueChange={() => setReminder3Days(p => !p)} value={reminder3Days} /></View>
                        <View style={styles.reminderOption}><View style={styles.reminderIconContainer}><MaterialCommunityIcons name="calendar-alert" size={24} color="#30C95B" /></View><Text style={styles.reminderText}>15 Hari Sebelum Jatuh Tempo</Text><Switch trackColor={{ false: "#E0E0E0", true: "#A5D6A7" }} thumbColor={reminder15Days ? "#30C95B" : "#f4f3f4"} onValueChange={() => setReminder15Days(p => !p)} value={reminder15Days} /></View>
                        <View style={styles.modalButtonContainer}><TouchableOpacity onPress={() => setReminderModalVisible(false)}><Text style={styles.modalButtonBatal}>Batal</Text></TouchableOpacity><TouchableOpacity onPress={handleSaveReminders}><Text style={styles.modalButtonSimpan}>Simpan</Text></TouchableOpacity></View>
                    </View>
                </View>
            </Modal>

            {/* --- Modal untuk Daftar Kost-an --- */}
            <Modal animationType="fade" transparent={true} visible={kostanModalVisible}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setKostanModalVisible(false)}><MaterialCommunityIcons name="close-circle" size={28} color="#BDBDBD" /></TouchableOpacity>
                        <View style={styles.kostanHeader}><Text style={styles.modalTitle}>Daftar Kost-an</Text><TouchableOpacity><MaterialCommunityIcons name="plus-circle" size={28} color="#30C95B" /></TouchableOpacity></View>
                        <FlatList data={kostanList} style={{width: '100%'}} keyExtractor={item => item.id} renderItem={({item}) => (<View style={styles.kostanItem}><View style={styles.reminderIconContainer}><MaterialCommunityIcons name="home-city-outline" size={24} color="#30C95B" /></View><Text style={styles.reminderText}>{item.name}</Text><TouchableOpacity><MaterialCommunityIcons name="pencil-outline" size={24} color="#888" /></TouchableOpacity></View>)} />
                        <View style={styles.modalButtonContainer}><TouchableOpacity onPress={() => setKostanModalVisible(false)}><Text style={styles.modalButtonBatal}>Batal</Text></TouchableOpacity><TouchableOpacity onPress={handleSaveKostan}><Text style={styles.modalButtonSimpan}>Simpan</Text></TouchableOpacity></View>
                    </View>
                </View>
            </Modal>

            {/* --- Modal untuk Pilih Bahasa --- */}
            <Modal animationType="fade" transparent={true} visible={languageModalVisible}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setLanguageModalVisible(false)}><MaterialCommunityIcons name="close-circle" size={28} color="#BDBDBD" /></TouchableOpacity>
                        <Text style={styles.modalTitle}>Pilih Bahasa</Text>
                        <TouchableOpacity style={styles.languageOption} onPress={() => setTempLanguage('id')}><Text style={styles.reminderText}>Bahasa Indonesia</Text>{tempLanguage === 'id' && <MaterialCommunityIcons name="check-circle" size={24} color="#30C95B" />}</TouchableOpacity>
                        <TouchableOpacity style={styles.languageOption} onPress={() => setTempLanguage('en')}><Text style={styles.reminderText}>Bahasa Inggris</Text>{tempLanguage === 'en' && <MaterialCommunityIcons name="check-circle" size={24} color="#30C95B" />}</TouchableOpacity>
                        <View style={styles.modalButtonContainer}><TouchableOpacity onPress={() => setLanguageModalVisible(false)}><Text style={styles.modalButtonBatal}>Batal</Text></TouchableOpacity><TouchableOpacity onPress={handleSaveLanguage}><Text style={styles.modalButtonSimpan}>Simpan</Text></TouchableOpacity></View>
                    </View>
                </View>
            </Modal>

            {/* Header Kustom */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Akun</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container}>
                {/* Info Profil */}
                <View style={styles.profileSection}>
                    <Image source={avatar} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userName}</Text>
                        <Text style={styles.profilePhone}>+62 818 0988 4140</Text>
                    </View>
                    <TouchableOpacity onPress={handleOpenProfileModal}><MaterialCommunityIcons name="pencil-outline" size={24} color="#30C95B" /></TouchableOpacity>
                </View>
                
                {/* Grup Menu Akun */}
                <View style={styles.menuGroup}>
                    <Text style={styles.groupTitle}>Akun</Text>
                    <MenuItem icon="clock-time-three-outline" name="Pengingat" onPress={() => setReminderModalVisible(true)} />
                    <MenuItem icon="home-city-outline" name="Daftar Kost-an" onPress={() => setKostanModalVisible(true)} />
                    <MenuItem icon="layers-outline" name="Kategori Kamar" onPress={() => navigation.navigate('KategoriKamar')} />
                    <MenuItem icon="wallet-outline" name="Info Bank" onPress={() => navigation.navigate('InfoBank')} />
                    <MenuItem icon="map-marker-outline" name="Pilih Bahasa" value={selectedLanguage === 'id' ? "Bahasa Indonesia" : "English"} onPress={() => { setTempLanguage(selectedLanguage); setLanguageModalVisible(true); }} />
                    <MenuItem icon="comment-question-outline" name="Pusat Bantuan" onPress={() => navigation.navigate('InfoScreen', { title: 'Pusat Bantuan', content: bantuanContent })} />
                </View>

                {/* Grup Menu Info Lainnya */}
                <View style={styles.menuGroup}>
                    <Text style={styles.groupTitle}>Info Lainnya</Text>
                    <MenuItem icon="information-outline" name="Ketentuan & Privasi" onPress={() => navigation.navigate('InfoScreen', { title: 'Ketentuan & Privasi', content: ketentuanContent })} />
                    <MenuItem icon="heart-outline" name="Beri Rating" onPress={handleBeriRating} />
                </View>

                {/* Tombol Keluar */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>KELUAR</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- StyleSheet (Menggunakan Poppins) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#30C95B' },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    profileSection: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
    profileInfo: { flex: 1 },
    profileName: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333' },
    profilePhone: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#888', marginTop: 2 },
    menuGroup: { marginTop: 12 },
    groupTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#888', paddingHorizontal: 20, marginBottom: 8 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    menuItemContent: { flexDirection: 'row', alignItems: 'center' },
    menuIcon: { marginRight: 16 },
    menuText: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#333' },
    menuValue: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#888', marginRight: 8 },
    logoutButton: { margin: 20, borderWidth: 1.5, borderColor: '#30C95B', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    logoutButtonText: { color: '#30C95B', fontFamily: 'Poppins-Bold', fontSize: 16 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
    modalView: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', },
    closeButton: { position: 'absolute', top: 10, right: 10, zIndex: 1},
    modalTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#333', marginBottom: 24, alignSelf: 'flex-start' },
    modalProfilePicContainer: { marginBottom: 16, },
    modalProfilePic: { width: 80, height: 80, borderRadius: 40, },
    cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#30C95B', borderRadius: 12, padding: 4, },
    modalLabel: { alignSelf: 'flex-start', fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 8, },
    modalInput: { width: '100%', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 16, },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    modalButtonBatal: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#888', marginRight: 24, },
    modalButtonSimpan: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#30C95B', },
    reminderOption: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20, },
    reminderIconContainer: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#E0F2E9', justifyContent: 'center', alignItems: 'center', marginRight: 16, },
    reminderText: { flex: 1, fontFamily: 'Poppins-Regular', fontSize: 16, color: '#333', },
    kostanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 },
    kostanItem: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20, },
    languageOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
});

export default AkunScreen;
