<div align="center">
  <img src="assets/logo-sikos.png" alt="Sikos Logo" width="150">
  <h1>Aplikasi Sikos - Manajemen Kos-Kosan</h1>
  <p>
    Aplikasi mobile untuk membantu pemilik kos mengelola properti secara efisien.
  </p>
  <p>
    <img src="https://img.shields.io/badge/Framework-React_Native-61DAFB?logo=react" alt="React Native">
    <img src="https://img.shields.io/badge/Platform-Expo-white?logo=expo" alt="Expo">
    <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?logo=firebase" alt="Firebase">
  </p>
</div>

Aplikasi mobile berbasis React Native yang dirancang untuk membantu pemilik atau pengelola properti kos-kosan dalam mencatat dan mengelola data bisnis mereka secara efisien dan terorganisir. Proyek ini dibangun sebagai bagian dari tugas perkuliahan dan memanfaatkan database cloud real-time dari Google Firebase.

---

## Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur untuk memudahkan manajemen kos-kosan:

* **Dashboard Dinamis:**
    * Menampilkan ringkasan jumlah kamar terisi dan total penyewa aktif secara *real-time*.
    * Carousel promo yang bergeser otomatis untuk menampilkan informasi penting.
    * Grafik tren keuangan 6 bulan terakhir untuk memvisualisasikan pemasukan dan pengeluaran.
    * Daftar 5 penyewa dengan masa sewa yang akan segera berakhir (jatuh tempo terdekat).

* **Manajemen Data (CRUD Penuh):**
    * **Kamar:** Menambah, melihat, mengubah, dan menghapus data kamar.
    * **Penyewa:** Menambah, melihat, mengubah, dan menghapus data penyewa.
    * **Keuangan:** Mencatat transaksi Pemasukan dan Pengeluaran, serta mengedit atau menghapusnya.
    * **Tagihan:** Mengelola data tagihan untuk Listrik dan Air untuk setiap kamar.
    * **Kategori:** Mengelola kategori kamar (misal: Kamar AC, Kamar Non-AC).

* **Pencarian & Penyaringan:**
    * Fungsi pencarian yang responsif pada halaman daftar Kamar, Penyewa, dan Tagihan.
    * Fitur filter untuk menampilkan data berdasarkan status (misal: Kamar "Kosong" saja, atau Tagihan "Belum Lunas").

* **Interaksi Cerdas:**
    * Status kamar secara otomatis berubah menjadi "Terisi" saat penyewa baru ditambahkan.
    * Dropdown dinamis yang menampilkan daftar kamar kosong saat menambahkan penyewa baru.

* **Pengaturan & Personalisasi Akun:**
    * Kemampuan untuk mengunggah dan mengubah foto profil dari galeri ponsel.
    * Mengelola informasi penting seperti daftar kosan dan info rekening bank.
    * Pengaturan pengingat dan pilihan bahasa.

---

## Teknologi yang Digunakan

-   **Framework:** React Native (Expo)
-   **Database:** Google Firebase - Firestore (Real-time NoSQL Database)
-   **Styling:** StyleSheet (Flexbox)
-   **Navigasi:** React Navigation (Stack & Bottom Tab Navigator)
-   **Komponen Tambahan:** React Native Picker Select, React Native SVG, Expo Image Picker

---

## Cara Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di komputer Anda, ikuti langkah-langkah berikut:

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/faiz140405/aplikasi-sikos.git](https://github.com/faiz140405/aplikasi-sikos.git)
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd aplikasi-sikos
    ```

3.  **Install semua dependensi:**
    *Pastikan Anda memiliki Node.js dan npm terinstal.*
    ```bash
    npm install
    ```

4.  **Siapkan Konfigurasi Firebase:**
    * Buat file `firebaseConfig.js` di folder root.
    * Salin konfigurasi proyek Firebase Anda ke dalam file tersebut.

5.  **Jalankan aplikasi:**
    ```bash
    npm start
    ```
    Pindai QR code yang muncul menggunakan aplikasi Expo Go di ponsel Anda.

---

## Penulis

Dibuat oleh **[Faiz Nizar Nu'aim]** sebagai Proyek Kuliah.
