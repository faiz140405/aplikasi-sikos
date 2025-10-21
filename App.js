import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './ThemeContext';

// Mengembalikan import untuk font dan splash screen
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// --- Import Semua Layar & Navigator ---
import SplashScreenComponent from './screens/SplashScreen';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import DataDiriScreen from './screens/DataDiriScreen';
import DataVerificationScreen from './screens/DataVerificationScreen';
import MainTabNavigator from './MainTabNavigator';
import TambahTransaksiScreen from './screens/TambahTransaksiScreen';
import KuitansiScreen from './screens/KuitansiScreen';
import KamarScreen from './screens/KamarScreen';
import DetailKamarScreen from './screens/DetailKamarScreen';
import TagihanListrikScreen from './screens/TagihanListrikScreen';
import TagihanAirScreen from './screens/TagihanAirScreen';
import PenyewaScreen from './screens/PenyewaScreen';
import TambahPenyewaScreen from './screens/TambahPenyewaScreen';
import DetailPenyewaScreen from './screens/DetailPenyewaScreen';
import TambahKamarScreen from './screens/TambahKamarScreen';
import DetailTransaksiScreen from './screens/DetailTransaksiScreen';
import TambahTagihanScreen from './screens/TambahTagihanScreen';
import DetailTagihanScreen from './screens/DetailTagihanScreen';
import KategoriKamarScreen from './screens/KategoriKamarScreen';
import InfoBankScreen from './screens/InfoBankScreen';
import InfoScreen from './screens/InfoScreen';


// Mencegah splash screen hilang secara otomatis sebelum font dimuat
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  // Mengembalikan logika untuk memuat font kustom
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // Fungsi untuk menyembunyikan splash screen setelah font dimuat
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Jika font belum dimuat, jangan tampilkan apa-apa
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // Membungkus aplikasi dengan View untuk memastikan onLayout berjalan
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {/* Mengembalikan ke satu alur navigasi linear */}
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreenComponent} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="DataDiri" component={DataDiriScreen} />
          <Stack.Screen name="DataVerification" component={DataVerificationScreen} />
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
          <Stack.Screen name="TambahTransaksi" component={TambahTransaksiScreen} />
          <Stack.Screen name="Kuitansi" component={KuitansiScreen} />
          <Stack.Screen name="Kamar" component={KamarScreen} />
          <Stack.Screen name="DetailKamar" component={DetailKamarScreen} />
          <Stack.Screen name="TagihanListrik" component={TagihanListrikScreen} />
          <Stack.Screen name="TagihanAir" component={TagihanAirScreen} />
          <Stack.Screen name="Penyewa" component={PenyewaScreen} />
          <Stack.Screen name="TambahPenyewa" component={TambahPenyewaScreen} />
          <Stack.Screen name="DetailPenyewa" component={DetailPenyewaScreen} />
          <Stack.Screen name="TambahKamar" component={TambahKamarScreen} />
          <Stack.Screen name="DetailTransaksi" component={DetailTransaksiScreen} />
          <Stack.Screen name="TambahTagihan" component={TambahTagihanScreen} />
          <Stack.Screen name="DetailTagihan" component={DetailTagihanScreen} />
          <Stack.Screen name="KategoriKamar" component={KategoriKamarScreen} />
          <Stack.Screen name="InfoBank" component={InfoBankScreen} />
          <Stack.Screen name="InfoScreen" component={InfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { // Style ini dibutuhkan oleh View pembungkus
        flex: 1,
    }
});


export default App;
