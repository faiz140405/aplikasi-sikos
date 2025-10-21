import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

// --- Aset Gambar ---
const avatar = require('../assets/avatar-placeholder.png');
const promoIllustration = require('../assets/illustration-promo.png'); 
const promoIllustration2 = require('../assets/illustration-promo2.png');
const promoIllustration3 = require('../assets/illustration-promo3.png');

// --- Data untuk Carousel ---
const carouselData = [
    { id: '1', title: 'Kelola kosan anda menjadi lebih mudah?', subtitle: 'Fitur canggih Sikos akan membantu mengelola kost anda.', image: promoIllustration },
    { id: '2', title: 'Biar sikos aja lah yang atur aku mah santai!', subtitle: 'Serba mudah pakai teknologi dari aplikasi SIKOS ya kawan.', image: promoIllustration2 },
    { id: '3', title: 'Cape di tagih sama Ibu Kos terus?', subtitle: 'Makannya pakai aplikasi SIKOS sekarang juga pasti mudah dan efektif.', image: promoIllustration3 },
];

// --- Komponen untuk satu slide di carousel ---
const CarouselCard = ({ item }) => (
    <View style={styles.promoCard}>
        <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>{item.title}</Text>
            <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
        </View>
        <Image source={item.image} style={styles.promoIllustration} />
    </View>
);

// --- PERUBAHAN: Komponen Tombol Aksi yang mendukung subtitle ---
const ActionButton = ({ icon, label, color, onPress, subtitle }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={[styles.actionButtonContainer, { backgroundColor: color }]}>
            <MaterialCommunityIcons name={icon} size={32} color="#fff" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
        {/* Menampilkan subtitle jika ada */}
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
);


// --- Komponen Utama Layar Beranda ---
const BerandaScreen = ({ navigation }) => {
  const [penyewaList, setPenyewaList] = useState([]);
  const [loadingPenyewa, setLoadingPenyewa] = useState(true);
  
  // --- PERUBAHAN: State untuk informasi kamar ---
  const [kamarInfo, setKamarInfo] = useState({ total: 0, terisi: 0 });

  const [carouselIndex, setCarouselIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // useEffect untuk auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
        setCarouselIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % carouselData.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true, });
            return nextIndex;
        });
    }, 4000); 

    return () => clearInterval(interval);
  }, [carouselIndex]);

  // useEffect untuk mengambil data penyewa dari Firestore
  useEffect(() => {
    const q = query(collection(db, "penyewa"), orderBy("daysLeft"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPenyewaList(list);
        setLoadingPenyewa(false);
    });
    return () => unsubscribe();
  }, []);

  // --- PERUBAHAN: useEffect baru untuk mengambil data kamar ---
  useEffect(() => {
    const q = collection(db, "kamar");
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const total = snapshot.size;
        const terisi = snapshot.docs.filter(doc => doc.data().status === 'Terisi').length;
        setKamarInfo({ total, terisi });
    });
    return () => unsubscribe();
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#30C95B" />
        <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('MainApp', { screen: 'Akun' })}>
            <View>
                <Text style={styles.headerTitle}>Kost Amanah <MaterialCommunityIcons name="check-decagram" size={16} color="#fff" /></Text>
                <Text style={styles.headerSubtitle}>Faiz Nizar Nu'aim</Text>
            </View>
            <Image source={avatar} style={styles.avatar} />
        </TouchableOpacity>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* --- Carousel --- */}
            <View>
                <FlatList
                    ref={flatListRef}
                    data={carouselData}
                    renderItem={({ item }) => <CarouselCard item={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 48));
                        setCarouselIndex(index);
                    }}
                    style={styles.sliderContainer}
                />
                <View style={styles.paginationContainer}>
                    {carouselData.map((_, index) => (
                        <View key={index} style={[styles.paginationDot, carouselIndex === index && styles.paginationDotActive]} />
                    ))}
                </View>
            </View>


            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                {/* PERUBAHAN: Tombol Kamar sekarang menampilkan subtitle dinamis */}
                <ActionButton 
                    icon="home-variant-outline" 
                    label="Kamar" 
                    color="#3D4A5C" 
                    onPress={() => navigation.navigate('Kamar')}
                    subtitle={`${kamarInfo.terisi}/${kamarInfo.total} Terisi`}
                />
                <ActionButton icon="flash" label="Listrik" color="#FFC93C" onPress={() => navigation.navigate('TagihanListrik')}/>
                <ActionButton icon="water" label="Air" color="#4596F7" onPress={() => navigation.navigate('TagihanAir')}/>
                <ActionButton icon="account-group-outline" label="Penyewa" color="#30C95B" onPress={() => navigation.navigate('Penyewa')}/>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentArea}>
                <View style={styles.handleBar} />
                <Text style={styles.contentTitle}>Jatuh Tempo Terdekat</Text>
                <Text style={styles.contentSubtitle}>Top 5 penyewa dengan tanggal jatuh tempo terdekat</Text>

                {loadingPenyewa ? ( <ActivityIndicator size="large" color="#30C95B" style={{marginTop: 20}}/> ) : (
                    penyewaList.map((penyewa) => {
                        const isAktif = penyewa.status === 'aktif';
                        return (
                            <TouchableOpacity key={penyewa.id} style={styles.tenantCard} onPress={() => navigation.navigate('DetailPenyewa', { penyewaId: penyewa.id })}>
                                <View style={[styles.tenantAvatar, {backgroundColor: isAktif ? '#E0F2E9' : '#FFEBEE'}]}>
                                    <FontAwesome5 name="user-alt" size={18} color={isAktif ? "#30C95B" : "#F44336"} />
                                </View>
                                <View style={styles.tenantInfo}>
                                    <Text style={styles.tenantName}>{penyewa.name}</Text>
                                    <View style={styles.tenantRoomContainer}>
                                        <Text style={styles.tenantRoom}>Kamar {penyewa.room}</Text>
                                        <View style={[styles.tenantStatus, { backgroundColor: isAktif ? '#E0F2E9' : '#FFEBEE' }]}><Text style={[styles.tenantStatusText, { color: isAktif ? '#30C95B' : '#F44336' }]}>{penyewa.status}</Text></View>
                                    </View>
                                </View>
                                <Text style={styles.tenantDue}>Sisa {penyewa.daysLeft} hari</Text>
                            </TouchableOpacity>
                        )
                    })
                )}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

// --- StyleSheet yang Disesuaikan dengan Desain ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#30C95B' },
    container: { flex: 1, backgroundColor: '#30C95B' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, },
    headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#fff' },
    headerSubtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#fff' },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    sliderContainer: {
        height: 150,
    },
    promoCard: { 
        width: Dimensions.get('window').width - 48,
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        marginHorizontal: 24, 
        borderRadius: 20,
        padding: 20,
        alignItems: 'center', 
        elevation: 10,
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 20, 
        shadowOffset: { width: 0, height: 10 },
    },
    promoTextContainer: { flex: 1, paddingRight: 10 },
    promoTitle: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#30C95B', lineHeight: 22 },
    promoSubtitle: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', marginTop: 8 },
    promoIllustration: { width: 100, height: 100, resizeMode: 'contain' },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
    },
    actionsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        marginTop: 24 
    },
    actionItem: { 
        alignItems: 'center', 
        flex: 1, 
        marginHorizontal: 4,
    },
    actionButtonContainer: {
        width: 70, 
        height: 70, 
        borderRadius: 22, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    actionLabel: { 
        fontFamily: 'Poppins-SemiBold', 
        fontSize: 12, 
        marginTop: 8,
        color: '#FFFFFF'
    },
    // PERUBAHAN: Style baru untuk subtitle tombol
    actionSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    contentArea: { 
        flex: 1, 
        backgroundColor: '#fff', 
        borderTopLeftRadius: 28, 
        borderTopRightRadius: 28, 
        marginTop: 24, 
        paddingHorizontal: 20,
        paddingTop: 12,
        minHeight: 565,
    },
    handleBar: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    contentTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, color: '#333', paddingHorizontal: 4 },
    contentSubtitle: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888', marginBottom: 20, paddingHorizontal: 4 },
    tenantCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    tenantAvatar: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: '#E0F2E9' },
    tenantInfo: { flex: 1 },
    tenantName: { fontFamily: 'Poppins-Bold', fontSize: 15, color: '#333' },
    tenantRoomContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    tenantRoom: { fontFamily: 'Poppins-Regular', fontSize: 12, color: '#888' },
    tenantStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
    tenantStatusText: { fontFamily: 'Poppins-SemiBold', fontSize: 10, textTransform: 'capitalize' },
    tenantDue: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#555' },
});

export default BerandaScreen;
