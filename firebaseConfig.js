import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PERHATIAN: Ganti objek di bawah ini dengan konfigurasi dari proyek Firebase Anda!
const firebaseConfig = {
  apiKey: "AIzaSyBKmd5zfq6YWFZ6Bbpg5zEiFFHEZdgYziE",
  authDomain: "sikos-app.firebaseapp.com",
  databaseURL: "https://sikos-app-default-rtdb.firebaseio.com",
  projectId: "sikos-app",
  storageBucket: "sikos-app.firebasestorage.app",
  messagingSenderId: "197066537054",
  appId: "1:197066537054:web:a3fd17a3c53a093ee01ccf",
  measurementId: "G-KCBS3DF6VM"
};

// --- Inisialisasi Firebase (Hanya Database) ---

// Memastikan Firebase hanya diinisialisasi sekali untuk menghindari error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Mengambil referensi ke layanan Firestore
const db = getFirestore(app);

// Mengekspor hanya 'db' untuk digunakan di seluruh aplikasi
export { db };