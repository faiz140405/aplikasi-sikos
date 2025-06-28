import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import layar untuk setiap tab
import BerandaScreen from './screens/BerandaScreen';
import KeuanganScreen from './screens/KeuanganScreen';
import NotifikasiScreen from './screens/NotifikasiScreen';
import AkunScreen from './screens/AkunScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Beranda"
      screenOptions={{
        headerShown: false, // Menyembunyikan header default dari tab navigator
        tabBarActiveTintColor: '#30C95B', // Warna ikon dan label yang aktif
        tabBarInactiveTintColor: '#888', // Warna ikon dan label yang tidak aktif
        tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 5,
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
        },
        tabBarLabelStyle: {
            // Mengembalikan penggunaan font Poppins
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
        }
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={BerandaScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Keuangan"
        component={KeuanganScreen}
        options={{
          tabBarLabel: 'Keuangan',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifikasi"
        component={NotifikasiScreen}
        options={{
          tabBarLabel: 'Notifikasi',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Akun"
        component={AkunScreen}
        options={{
          tabBarLabel: 'Akun',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
