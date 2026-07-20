# GDD_CHAPTER_02.md

**Chapter:** 2 — Pemilik yang Menghilang
**Version:** 2.0 — disinkronkan ke struktur kode aktual (`chapter2.ts` + `App.tsx`)
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | v1.0 mengasumsikan Evidence Locker sudah aktif di Chapter 2 (bukti masuk ke "Evidence Locker") | **Diperbaiki.** Kode nyata: `EVIDENCE` app baru unlock saat `chapterId >= 5` (`App.tsx` baris 328). Chapter 2 belum punya Evidence Locker sama sekali. Temuan penting masuk ke Notebook, bukan Evidence Locker. |
| 2 | v1.0 mengasumsikan ada UI panggilan telepon interaktif penuh (Contacts → Call → dialog) untuk menghubungi Dina | **Koreksi dari audit lanjutan — v1.0 dan v2.0 draft awal SALAH.** `CallingScreen.tsx` + `DINA_DIALOGUE` (4 tahap dialog dengan pilihan) **memang ada dan berfungsi**. Yang salah adalah asumsi soal kapan bisa diakses — lihat detail di Objective 3 & catatan Track B di bawah. |
| 3 | Timing unlock WITNESSES tidak jelas (v1.0 menaruhnya "setelah Objective 4") | **Dikonfirmasi tepat dari kode** (`App.tsx` baris ~208): WITNESSES unlock persis begitu pemain menyelesaikan Objective 4 (index ≥ 4, sebelum masuk Objective 5). |
| 4 | `report.conclusion` di kode punya "Reward: +120 XP\nRank: Junior Detective" dan "Unlocked: Witnesses, Hospital Database" (Hospital Database sebenarnya sudah ke-unlock di *awal* chapter, bukan di akhir — redundan/tidak akurat) | **Perlu di-patch** — lihat instruksi Track B di bawah. |
| 5 | Nama "Andi Supriatna" (citizens id 1) dan "Rudi Hermawan" (citizens id 3) berpotensi bentrok dengan "Andi Prasetyo" (Ch3) dan "Rudi Hartono" (Ch4) | Sudah tercakup di instruksi batch rename yang sudah lo jalankan sebelumnya. |

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 1–2 transisi — Looking for Facts → Filtering Information |
| Teknik SQL dipakai | `SELECT *`, `WHERE ... =`, kolom spesifik (`SELECT name, phone`) — **tidak ada JOIN** (JOIN baru muncul Chapter 3) |
| Tabel database | `citizens`, `visitors`, `patients`, `parking` (lihat `chapter2.ts` field `database`) |
| App/menu aktif dari awal chapter | INBOX, CASE_FILES, DB_LIST, NOTEBOOK, CONTACTS *(dari Ch1)*, SETTINGS, RANK |
| App/menu baru dibuka **di awal** chapter (via popup, bukan di akhir) | Tabel `citizens`/`visitors`/`patients` (dibundel sebagai "Citizens Database" di popup) |
| App/menu baru dibuka **di tengah** chapter (setelah Objective 4) | **WITNESSES** |
| App/menu baru dibuka **di akhir** chapter | Tidak ada — "Hospital Database" di teks lama itu keliru, sudah aktif sejak awal chapter (lihat Catatan Sinkronisasi #4) |
| Rule of Three Answers | Terjawab: apakah Budi tinggal sendiri (tidak — ada Dina). Fakta baru: Budi terakhir terlihat mengunjungi pasien bernama Rizky Hidayat, dan Rizky keluar 2 jam kemudian tanpa data siapa yang menjemput. Pertanyaan baru: siapa yang menjemput Rizky? |

---

# Hook

Tidak ada boot sequence baru — HP cuma dalam mode sleep (ikuti pola **Boot Standar**, bukan versi terganggu, UI_MICROINTERACTIONS_SPEC §7). Detail kecil ini penting: dunia game harus terasa berjalan terus meski pemain tidak sedang membuka HP-nya. Ini pertama kalinya kontinuitas waktu ditegaskan — bukan restart dari nol tiap chapter.

**Dua hal masuk hampir bersamaan saat chapter dimulai**, dan urutannya penting:

1. **Popup sistem** (bukan Inbox) — "MISSION ACCEPTED / NEW DATABASE UNLOCKED: CITIZENS DATABASE (citizens, visitors, patients) / CONTACTS APP UNLOCKED / Verify if Budi Santoso's address matches citizens registration data." Ini murni notifikasi teknis, nadanya seperti sistem, bukan orang.
2. **INBOX** — br pesan dari Supervisor Raka, jauh lebih manusiawi dan lebih berat dari popup di atas:

> "Selamat pagi. Kemarin kita berhasil menemukan identitas pemilik kendaraan. Tim patroli sudah mendatangi alamat Budi Santoso. Rumahnya kosong. Tetangga mengatakan ia tidak terlihat selama tiga hari. Kami menemukan pintu rumah tidak terkunci. Tidak ada tanda kekerasan. Tapi ponsel miliknya hilang. Saya sudah membuka akses baru. Gunakan dengan bijak."

**Detail hook:** kontras dua pesan ini sengaja dipertahaman — popup teknis dulu (dingin, transaksional), baru Inbox (manusiawi, ada rasa khawatir tersirat dari Raka tanpa dia bilang "khawatir"). Kalimat "pintu tidak terkunci, tidak ada tanda kekerasan, tapi ponsel hilang" itu detail forensik yang sengaja tidak dijelaskan maknanya — pemain yang harus menyimpulkan sendiri bahwa ini bukan penculikan biasa (tidak ada tanda paksaan) tapi juga bukan sekadar pergi (ponsel hilang, tidak wajar untuk orang yang pergi sukarela).

Membuka **CASE_FILES** menampilkan status berubah jadi `REOPENED` — kata ini penting, bukan `ACTIVE` lagi seperti Chapter 1. "Reopened" menyiratkan kasus yang tadinya dianggap selesai, sekarang terbukti belum. Detail bahasa kecil, efek besar.

---

# Objective Walkthrough (selaras `chapter2.ts`)

## Objective 1

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`citizens`) |
| **Story (kode)** | Supervisor: "Pastikan apakah data owner kendaraan sama dengan data kependudukan." |
| **Goal (kode)** | Cari data Budi Santoso di tabel `citizens`. |
| **Expected SQL** | `SELECT * FROM citizens WHERE name = 'Budi Santoso';` |

**Detail hook:** Ini langkah verifikasi silang pertama di seluruh CASE #001 — data pemilik kendaraan (dari `owners`, Chapter 1) dicocokkan konsepnya terhadap data kependudukan resmi (`citizens`, tabel baru). Secara mekanik query-nya sederhana (cuma `WHERE name =`), tapi secara naratif ini penting: pemain baru sadar ada 2 sumber kebenaran berbeda (data kendaraan vs data warga) yang harus saling menguatkan. Hasil: status `ACTIVE`, alamat cocok dengan data owner sebelumnya (Jl Melati 15) — identitas terverifikasi.

---

## Objective 2

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`citizens`) |
| **Story (kode)** | Supervisor: "Cari apakah dia tinggal sendirian." |
| **Goal (kode)** | Cari orang lain yang tinggal di Jl Melati 15. |
| **Expected SQL** | `SELECT * FROM citizens WHERE address = 'Jl Melati 15';` |

**Detail hook:** Tidak ada hint eksplisit soal kolom mana yang harus dipakai — pemain sendiri yang harus sadar `address` bisa dipakai untuk mencari siapa lagi yang tinggal di lokasi yang sama. Ini langkah pertama di seluruh game di mana pemain memakai satu kolom untuk tujuan yang **bukan** tujuan utamanya (`address` bukan buat mencari alamat, tapi buat mencari orang lain). Hasil: dua nama muncul — Budi Santoso dan Dina Santoso.

---

## Objective 3

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`citizens`) → **CONTACTS** (Dina otomatis ditambahkan setelah objective ini) |
| **Story (kode)** | "Kamu menemukan Dina Santoso di alamat yang sama. Hubungi dia." |
| **Goal (kode)** | Dapatkan nama dan nomor telepon dari Jl Melati 15. |
| **Expected SQL** | `SELECT name, phone FROM citizens WHERE address = 'Jl Melati 15';` |

**Detail hook — koreksi dari audit lanjutan:** Story text bilang "Hubungi dia" — dan ini **beneran bisa dilakukan**, bukan cuma tersirat lewat teks. `CallingScreen.tsx` punya dialog Dina 4-tahap lengkap dengan pilihan respons pemain (`DINA_DIALOGUE`), diakses dengan membuka **CONTACTS** lalu memilih **Call** pada kontak Dina. Ikuti pola Incoming/Outgoing Call standar (UI_MICROINTERACTIONS_SPEC §1).

**Peringatan window waktu (perlu di-patch, lihat instruksi Track B):** Di kode aslinya, panggilan ini cuma bisa diakses persis saat `currentObjectiveIndex === 3` (jendela satu-objective, antara selesai Objective 3 dan selesai Objective 4). Di luar window itu, mencoba menelepon Dina menampilkan pesan generik "Nomor tidak dapat dihubungi atau sibuk." — pemain yang telat membuka Contacts kehilangan dialog interaktif ini secara permanen, digantikan versi flat otomatis di Objective 4 (lihat di bawah). Instruksi Track B melebarkan window ini jadi `currentObjectiveIndex >= 3` supaya tidak gampang kelewat.

---

## Objective 4

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`visitors`) → **WITNESSES unlock di sini** |
| **Story (kode)** | "Dina Santoso mengatakan kakaknya (Budi) mengunjungi seseorang di RS Harapan Bangsa. Supervisor membuka akses Hospital Database." |
| **Goal (kode)** | Lihat daftar pengunjung (`visitors`) di rumah sakit. |
| **Expected SQL** | `SELECT * FROM visitors;` |

**Detail hook:** Begitu objective ini selesai, **WITNESSES app terbuka otomatis** dan statement Dina langsung terisi: *"Budi (kakaknya) pergi menemui seseorang di RS Harapan Bangsa 3 hari lalu."* — ini terjadi otomatis di background, tanpa popup besar. Cukup badge baru muncul di ikon Witnesses (ikuti pola notifikasi standar, bukan popup sistem penuh — beda dari pola "MISSION ACCEPTED" di awal chapter). Perbedaan level "kehebohan" notifikasi ini penting: unlock app baru dari Supervisor terasa resmi/sistem, tapi unlock dari hasil investigasi sendiri terasa lebih personal, lebih pelan.

Hasil query menampilkan 3 baris pengunjung — termasuk Budi Santoso muncul **dua kali** (kunjungan berbeda tanggal). Pemain harus perhatikan `visit_time` untuk membedakan kunjungan mana yang relevan (yang cocok dengan window waktu 3 hari lalu).

---

## Objective 5

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`patients`) |
| **Story (kode)** | "Budi Santoso mengunjungi Ward C pada jam 09:20. Cari tahu siapa pasiennya." |
| **Goal (kode)** | Cari data pasien dengan ID yang dikunjungi Budi. |
| **Expected SQL** | `SELECT * FROM patients WHERE id = 10;` |

**Detail hook:** Pemain harus menyambungkan `patient_id: 10` dari hasil Objective 4 ke tabel `patients` secara manual — **ini bukan JOIN**, murni dua query berurutan dengan angka yang harus diingat/dicatat sendiri oleh pemain (belum ada Notebook otomatis mencatat angka ini). Justru keterbatasan ini yang membuat Chapter 3 nanti (saat rantai penyambungan manual ini jadi 3-4 tingkat) terasa sangat melelahkan — dan JOIN diperkenalkan sebagai jalan keluar yang benar-benar dibutuhkan, bukan sekadar fitur baru. Hasil: nama pasien — **Rizky Hidayat**, nama baru yang belum dikenal siapa pun.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

Tiga opsi:
- Budi Santoso Melarikan Diri
- **Budi Santoso Menghilang Setelah Mengunjungi Rizky Hidayat** ← jawaban benar
- Kasus Ditutup Sementara

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Kerja bagus. Saya baru menerima informasi baru. Pasien bernama Rizky Hidayat keluar dari rumah sakit dua jam setelah Budi datang. Anehnya... tidak ada data siapa yang menjemputnya."

**Detail hook:** Kalimat "tidak ada data siapa yang menjemputnya" adalah hook penutup chapter — bukan pertanyaan yang dilontarkan Supervisor sebagai instruksi (belum ada objective baru), murni informasi yang digantung. Pemain menutup HP dengan pertanyaan itu masih mengambang, bukan dengan tugas baru yang jelas. Ini beda dari Chapter 1 (yang ditutup dengan "besok kita kunjungi rumahnya" — arahan jelas); Chapter 2 ditutup lebih terbuka, mempersiapkan pemain untuk Chapter 3 yang memang dirancang jauh lebih menuntut inisiatif mandiri.

---

# Definition of Done Check

* [x] Selaras 1:1 dengan struktur `chapter2.ts` dan trigger unlock nyata di `App.tsx` (5 objective, WITNESSES unlock mid-chapter, EVIDENCE belum aktif).
* [x] Tidak ada JOIN — konsisten dengan Chapter 1 & rencana Chapter 3.
* [x] Simplifikasi "panggilan Dina" (tanpa Call UI) didokumentasikan eksplisit, bukan dibiarkan jadi asumsi salah di GDD.
* [x] Evidence Locker tidak dijanjikan — selaras kode (`chapterId >= 5`).
* [x] "Hospital Database" dihapus dari daftar unlock akhir chapter karena faktanya sudah aktif sejak awal (redundan/tidak akurat di teks lama).
* [x] Tidak ada mekanik XP/Rank di GDD ini — instruksi patch kode disiapkan di bawah.

---

# Shadows / Patch Instruksi Track B

```
Di file src/game/levels/case001/chapter2.ts, pada field report.conclusion, lakukan perubahan berikut:

1. Hapus baris "Reward: +120 XP" dan "Rank: Junior Detective" sepenuhnya.
2. Ubah baris "Unlocked: Witnesses, Hospital Database" menjadi "Unlocked: Witnesses" saja — hapus "Hospital Database" karena tabel tersebut sebenarnya sudah aktif sejak awal chapter (lewat popup MISSION ACCEPTED), bukan sesuatu yang baru terbuka di akhir.

Teks akhir report.conclusion setelah diubah:
'Supervisor Raka:\nKerja bagus. Saya baru menerima informasi baru. Pasien bernama Rizky Hidayat keluar dari rumah sakit dua jam setelah Budi datang. Anehnya... tidak ada data siapa yang menjemputnya.\n\n*** CHAPTER 2 COMPLETE ***\nUnlocked: Witnesses'

Jangan ubah struktur objectives, mail, files, atau database di file ini — semuanya sudah final sesuai desain.
```
