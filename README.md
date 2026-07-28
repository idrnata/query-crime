# 🕵️‍♂️ Query Crime

[![Status](https://img.shields.io/badge/Status-Active-success.svg?style=flat-for-the-badge)]()
[![Framework](https://img.shields.io/badge/React-18-blue.svg?style=flat-for-the-badge)]()
[![Bundler](https://img.shields.io/badge/Vite-5-646CFF.svg?style=flat-for-the-badge)]()
[![Styling](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg?style=flat-for-the-badge)]()

**Query Crime** adalah platform game edukasi bertema investigasi digital dan *forensic data analysis* dengan antarmuka retro ala ponsel klasik. Pemain berperan sebagai seorang *Digital Investigator* di Unit Investigasi Digital yang memecahkan berbagai kasus kriminal melalui analisis data interaktif, kueri database, dan pemrosesan informasi forensik.

---

## 📱 Live Preview Game

Mainkan game langsung melalui tautan berikut:
* **[Query Crime Live Game](https://query-crime.vercel.app/)**

---

## 📖 Sinopsis & Evolusi Investigasi

Dalam dunia **Query Crime**, kejahatan modern tidak lagi hanya meninggalkan jejak fisik, melainkan jejak digital tersembunyi di balik riwayat transaksi, log kamera lalu lintas, arsip email terenkripsi, hingga manipulasi relasi basis data. Pemain diajak untuk menyelami dunia investigasi cyber bersama **Supervisor Raka** dan tim investigasi.

### Skalabilitas Kasus Tanpa Batas
Game ini dirancang untuk terus berkembang secara terstruktur dan modular melintasi ratusan kasus (**Case #001** hingga **Case #XXX**) dan ribuan *chapters* yang saling berhubungan:
* **Case #001: Kasus Orang Hilang & Konspirasi Arunika**: Mengupas hilangnya warga sipil Budi Santoso, penelusuran armada PT Arunika Logistics, hingga konspirasi internal di tubuh kepolisian.
* **Case #002: Rutinitas yang Terganggu**: Membongkar manipulasi relasi data tingkat lanjut di mana setiap data individual nampak valid dan berstatus `SUCCESS`, namun hubungan antar-tabel telah dimanipulasi secara sistematis.
* **Case #XXX & Mendatang**: Beragam skenario kejahatan korporasi, cybercrime, dan penyelidikan forensik baru yang dirilis secara berkala.

### Peralatan & Bahasa Investigasi
Meskipun saat ini fokus utama investigasi bertumpu pada **SQL (Structured Query Language)**, sistem game ini dibangun untuk mendukung alat dan bahasa pemrograman investigatif lainnya di masa depan:
* **Database Forensics**: Kueri SQL (`SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `HAVING`, Subqueries, `WITH`/CTE, Window Functions).
* **Scripting & Automation (Mendatang)**: Analisis log, otomatisasi pemrosesan teks, dan pembongkaran skrip menggunakan **Python** dan perkakas pemrograman forensik lainnya.

---

## 🛠️ Fitur Utama Aplikasi

### 1. Retro Phone Interface UI
Simulasi ponsel genggam klasik lengkap dengan tombol fisik fungsional, getaran, efek suara pengetikan taktil, serta ekosistem aplikasi khusus penyelidik.

### 2. Hub Aplikasi Detektif
* **💬 Inbox**: Menerima petunjuk cerita dari para saksi, pengarahan supervisor, atau ancaman dari nomor tidak dikenal.
* **📂 Case Files**: Rangkuman intelijen, berkas investigasi, dan laporan resmi per kasus.
* **📊 Police Database**: Penjelajah skema dan tabel data asli untuk dianalisis langsung dari chapter aktif.
* **📓 Notebook**: Tempat mencatat pengamatan pribadi pemain untuk menyimpan informasi penting.
* **🗺️ GPS Tracker**: Memetakan rute kendaraan, koordinat lokasi, dan timeline perjalanan tersangka.
* **✉️ Email Server**: Mengakses arsip email kepolisian, pesan terhapus, dan file lampiran.
* **🏆 Rank & Statistics**: Melacak XP, total kueri yang berhasil dieksekusi, serta pangkat penyelidik saat ini.

### 3. Engine Evaluasi Data Real-Time
Pemain dapat menyusun kueri/perintah secara taktil menggunakan tombol token (*token-builder*) atau mengetikkan perintah secara manual pada terminal terintegrasi. Engine mengevaluasi jawaban Anda terhadap basis data virtual di memori secara instan.

---

## 🚀 Panduan Memulai & Pengembangan Lokal

### Prasyarat
Pastikan Anda telah menginstal Node.js versi 18+ di komputer Anda.

### 1. Kloning Repositori
```bash
git clone <url-repositori-anda>
cd query-crime
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Aplikasi akan berjalan pada port default: `http://localhost:3000`

### 4. Lakukan Linting Kode
Untuk memastikan tidak ada kesalahan sintaks dan tipe TypeScript:
```bash
npm run lint
```

### 5. Bangun Aplikasi untuk Produksi (Build)
```bash
npm run build
```

---

## 🎨 Desain dan Estetika

* **Warna Tema**: Hijau monokromatik (`#8cb07d`) dan latar belakang gelap (`#1b2118`) memberikan nuansa layar LCD lawas yang autentik dan nyaman di mata (*eye-safe*).
* **Tipografi**: Menggunakan font sans-serif monospaced yang memberikan kesan retro-terminal cyberpunk yang kental.
* **Animasi**: Transisi antar layar dikemas dengan animasi mikro yang mulus menggunakan pustaka `motion` untuk melengkapi pengalaman visual premium.

---

## 📁 Struktur Proyek

```text
├── gdd/                   # Dokumen Game Design Document (GDD) per babak & kasus
├── src/
│   ├── components/        # Komponen UI Reusable & Layar Ponsel (Screens)
│   ├── constants/         # Konfigurasi ikon, meta aplikasi, dan data pendukung
│   ├── game/              # Level cerita (Case #001, Case #002, dst.), master registry, & sistem simpan
│   ├── utils/             # Fungsi utilitas (format tanggal, dsb.)
│   ├── App.tsx            # Komponen root & pengatur state game utama
│   ├── index.css          # Kustomisasi gaya global dan Tailwind CSS
│   ├── main.tsx           # Entry point utama aplikasi React
│   └── types.ts           # Definisi tipe data TypeScript global
├── package.json           # Dependensi proyek dan skrip npm
└── vite.config.ts         # Konfigurasi bundler Vite
```

Selamat bertugas, Detektif! Gunakan keahlian analisis data Anda untuk mengungkap kebenaran. 🕵️‍♂️💻
