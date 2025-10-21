import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

// Membuat Context
const ThemeContext = createContext();

// Membuat Provider yang akan membungkus aplikasi
export const ThemeProvider = ({ children }) => {
  // Mendeteksi tema default dari sistem pengguna
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#121212' : '#f8f9fa',
      card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#333333',
      subtleText: isDarkMode ? '#A9A9A9' : '#888888',
      primary: '#30C95B',
      border: isDarkMode ? '#272727' : '#E0E0E0',
      header: isDarkMode ? '#1E1E1E' : '#30C95B',
      headerText: isDarkMode ? '#FFFFFF' : '#FFFFFF',
      tabBackground: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    },
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook untuk menggunakan tema dengan mudah di komponen lain
export const useTheme = () => useContext(ThemeContext);
