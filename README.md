# 🕵️‍♂️ Query Crime

[![Status](https://img.shields.io/badge/Status-Active-success.svg?style=flat-for-the-badge)]()
[![Framework](https://img.shields.io/badge/React-18-blue.svg?style=flat-for-the-badge)]()
[![Bundler](https://img.shields.io/badge/Vite-5-646CFF.svg?style=flat-for-the-badge)]()
[![Styling](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg?style=flat-for-the-badge)]()

**Query Crime** adalah sebuah game edukasi bertema detektif database dengan antarmuka retro ala ponsel Nokia jadul. Pemain berperan sebagai seorang *Digital Investigator* yang memecahkan kasus-kasus kriminal menggunakan kueri SQL interaktif pada terminal ponsel mereka.

---

## 📱 Live Preview Game

Mainkan game langsung melalui tautan berikut:
* **[Link Preview Pengembang (Dev App)](https://ais-dev-5ednq7ehft4tkfbckc47e6-585440882595.asia-southeast1.run.app)**
* **[Link Preview Publik (Shared App)](https://ais-pre-5ednq7ehft4tkfbckc47e6-585440882595.asia-southeast1.run.app)**

---

## 📖 Alur Cerita (Case #001: Kasus Orang Hilang)

Seorang warga bernama **Budi Santoso** dilaporkan hilang setelah mengunjungi kerabat di Rumah Sakit Harapan Bangsa. Tugas Anda sebagai penyelidik digital adalah melacak perjalanannya, menganalisis CCTV, mengungkap aliran dana gelap **PT Arunika Logistics**, hingga menemukan konspirasi besar yang mengarah pada hilangnya atasan Anda sendiri, **Supervisor Raka**.

Game ini terdiri dari **11 Bab (Chapters)** yang membimbing Anda menguasai SQL dari tingkat dasar hingga tingkat lanjut:
* **Chapter 1-2**: Dasar-dasar kueri (`SELECT`, `FROM`, `WHERE`, `ORDER BY`).
* **Chapter 3-5**: Menghubungkan tabel dan relasi CCTV (`JOIN`, `LEFT JOIN`).
* **Chapter 6-7**: Pelacakan sejarah perusahaan dan rute kendaraan GPS (`LIMIT`, filter lanjutan).
* **Chapter 8-9**: Menganalisis aliran dana transaksi mencurigakan (`GROUP BY`, `COUNT`, `HAVING`).
* **Chapter 10-11**: Rekonstruksi thread pesan terfragmentasi dan menghadapi ancaman siber (`WITH`/CTE, subqueries).

---

## 🛠️ Fitur Utama Aplikasi

### 1. Retro Nokia Phone UI
Simulasi ponsel genggam klasik lengkap dengan tombol fisik fungsional, getaran, suara pengetikan taktil, serta aplikasi-aplikasi yang terpasang di dalamnya.

### 2. Hub Aplikasi Detektif
* **💬 Inbox**: Menerima petunjuk cerita dari para saksi atau ancaman dari nomor tidak dikenal.
* **📂 Case Files**: Rangkuman intelijen, berkas investigasi, dan kronologi kasus yang sedang berjalan.
* **📊 Police Database**: Modul penjelajah tabel data asli untuk menganalisis skema tabel langsung dari chapter aktif.
* **📓 Notebook**: Tempat mencatat pengamatan pribadi pemain untuk menyimpan informasi penting.
* **🗺️ GPS Tracker**: Memetakan rute kendaraan, koordinat lokasi, dan timeline perjalanan tersangka.
* **✉️ Email Server**: Mengakses arsip email kepolisian, pesan terhapus, dan file lampiran menggunakan CTE.
* **🏆 Rank & Statistics**: Melacak XP, total kueri yang berhasil dieksekusi, serta pangkat penyelidik saat ini.

### 3. Engine Simulasi SQL Real-Time
Pemain dapat menyusun kueri secara taktil menggunakan tombol token (*token-builder*) atau mengetikkan kueri secara manual pada terminal terintegrasi. Engine akan mengevaluasi kueri Anda terhadap basis data virtual di memori secara instan.

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
├── gdd/                   # Dokumen Game Design Document (GDD) untuk tiap babak
├── src/
│   ├── components/        # Komponen UI Reusable & Layar Ponsel (Screens)
│   ├── constants/         # Konfigurasi ikon dan meta aplikasi
│   ├── game/              # Konfigurasi level cerita (Chapter 1 - 11) dan sistem penyimpanan
│   ├── utils/             # Fungsi utilitas (format tanggal, dsb.)
│   ├── App.tsx            # Komponen root & pengatur state game utama
│   ├── index.css          # Kustomisasi gaya global dan Tailwind CSS
│   ├── main.tsx           # Entry point utama aplikasi React
│   └── types.ts           # Definisi tipe data TypeScript global
├── package.json           # Dependensi proyek dan skrip npm
└── vite.config.ts         # Konfigurasi bundler Vite
```

Selamat bertugas, Detektif! Gunakan keahlian SQL Anda untuk mengungkap kebenaran di balik rahasia gelap PT Arunika Logistics. 🕵️‍♂️💻
