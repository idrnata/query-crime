# GDD_CHAPTER_03.md

**Chapter:** 3 — Jejak yang Tidak Terlihat
**Version:** 2.0 — disinkronkan ke struktur kode aktual (`chapter3.ts` + `App.tsx`)
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | `chapter3.ts` Objective 6 & 7 punya story text **"Sekarang gunakan JOIN..."** — pelanggaran langsung Constitution Article 4 | **Perlu di-patch** — lihat instruksi Track B. Ditulis ulang tanpa menyebut nama sintaks. |
| 2 | `mail.body` chapter3 klaim "NEW TABLE: Parking" — faktanya tabel `parking` sudah ada sejak Chapter 1 (4 baris identik), cuma nambah 1 baris baru | **Perlu di-patch.** Diganti jadi "data parkir diperbarui", bukan "tabel baru". |
| 3 | Popup unlock `App.tsx` (chapterId 3) klaim "HOSPITAL DATABASE" baru terbuka — faktanya `visitors`/`patients` sudah aktif sejak popup Chapter 2 | **Perlu di-patch** — lihat instruksi Track B, baris ~1354 `App.tsx`. |
| 4 | v1.0 mengasumsikan domain "Hospital Parking" terpisah dari "Parking Log" kota (lihat 07_DATABASE_SCHEMA) | **Temuan untuk ditindaklanjuti terpisah** — kode nyata cuma punya SATU tabel `parking`, tidak ada pemisahan domain kota vs rumah sakit. 07_DATABASE_SCHEMA perlu direvisi di sesi lain, tidak menghalangi finalisasi chapter ini. |
| 5 | v1.0 tidak menyebutkan chapter ini tidak membuka app/menu baru | **Ditambahkan eksplisit** di Chapter Snapshot — ini murni chapter kapabilitas (JOIN), bukan chapter unlock UI. |

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 3 — Connecting Information (06_SQL_CURRICULUM) |
| Teknik SQL dipakai | `SELECT ... WHERE ...` (Objective 1-5), **JOIN** diperkenalkan pertama kali (Objective 6-7) |
| Tabel database | `citizens`, `visitors`, `patients`, `vehicles` *(tabel baru muncul chapter ini)*, `parking` *(tabel lama, +1 baris data baru)* |
| App/menu terlibat | INBOX, CASE_FILES, DB_LIST — **tidak ada app/menu baru dibuka chapter ini**, murni kapabilitas SQL baru |
| Rule of Three Answers | Terjawab: siapa yang menjemput Rizky (Andi Prasetyo, lewat mobilnya). Fakta baru: kendaraan Andi ada di lokasi & waktu yang persis cocok (11:26–11:34 vs Rizky keluar 11:30). Pertanyaan baru: apakah Andi pernah berhubungan dengan Budi sebelumnya — dan sekarang Andi juga tidak bisa dihubungi. |

---

# Hook

Boot standar (bukan versi terganggu — masih terlalu dini di cerita untuk itu). INBOX masuk dari Supervisor Raka:

> "Selamat pagi. Rumah sakit sudah mengirim data tambahan. Pasien bernama Rizky Hidayat memang keluar pukul 11.30. Tetapi CCTV rumah sakit sedang rusak. Satu-satunya petunjuk hanyalah data parkir kendaraan."

**Detail hook:** "CCTV rusak" adalah kalimat yang akan terbukti bohong 2 chapter lagi (Chapter 5 mengungkap kamera itu **dijadwalkan** mati, bukan rusak — dan Chapter 10 mengonfirmasi ini operasi terencana). Di titik ini, pemain (dan Supervisor) menerimanya sebagai fakta biasa. Jangan beri isyarat kecurigaan apapun di chapter ini — kepolosan Chapter 3 terhadap klaim "CCTV rusak" itu penting buat efek kejut Chapter 5 nanti.

Membuka **CASE_FILES** menampilkan laporan RS tambahan — cuma 4 baris data teknis (subjek, waktu keluar, status CCTV, petunjuk). Tidak ada arahan tambahan.

**Kenapa chapter ini terasa berbeda sejak awal:** untuk pertama kalinya, pemain tidak dikasih tahu tabel mana yang harus dibuka pertama. Story Objective 1 langsung meminta "cari data kunjungan Budi" tanpa embel-embel "buka database dulu" seperti Chapter 1. Chapter 3 dirancang jadi titik di mana Supervisor mulai mengurangi tuntunan — pola ini akan makin ekstrem di chapter-chapter berikutnya sampai akhirnya hilang total di Chapter 9-11.

---

# Objective Walkthrough (selaras `chapter3.ts`)

## Objective 1

| | |
|---|---|
| **Story (kode)** | Cari data kunjungan Budi Santoso di rumah sakit. |
| **Goal (kode)** | Query tabel `visitors` untuk Budi Santoso. |
| **Expected SQL** | `SELECT * FROM visitors WHERE visitor_name = 'Budi Santoso';` |

**Detail hook:** Hasil satu baris: kunjungan 09:20, Ward C, `patient_id: 41`. Angka `41` ini harus diingat pemain sendiri untuk objective berikutnya — belum ada mekanisme "salin to Notebook otomatis" di titik ini. Beban mengingat angka manual inilah yang jadi motivasi organik buat JOIN nanti.

---

## Objective 2

| | |
|---|---|
| **Story (kode)** | Dapatkan data pasien dengan ID 41. |
| **Goal (kode)** | Query tabel `patients` untuk ID 41. |
| **Expected SQL** | `SELECT * FROM patients WHERE id = 41;` |

**Detail hook:** Hasil: **Rizky Hidayat**, status STABLE, plus satu kolom baru yang belum pernah pemain lihat — `emergency_contact: 7`. Ini foreign key kedua di chapter yang sama (setelah `patient_id`), tapi kali ini menunjuk ke tabel yang berbeda lagi (`citizens`). Pola "angka menunjuk ke tabel lain" mulai berulang cukup untuk terasa seperti sistem, bukan kebetulan.

---

## Objective 3

| | |
|---|---|
| **Story (kode)** | Rizky memiliki `emergency_contact` bernomor 7. Cari siapa itu. |
| **Goal (kode)** | Cari data di `citizens` dengan ID 7. |
| **Expected SQL** | `SELECT * FROM citizens WHERE id = 7;` |

**Detail hook:** Hasil: **Andi Prasetyo** — nama baru, karakter yang akan jadi pusat 3 chapter berikutnya. Ini kemunculan pertamanya, dan diperkenalkan lewat cara paling tidak dramatis mungkin: satu baris data di tabel `citizens`, bukan lewat dialog atau cutscene. Kontras ini penting — nama yang nanti jadi sangat penting muncul pertama kali seremeh nama pasien mana pun.

---

## Objective 4

| | |
|---|---|
| **Story (kode)** | Cari kendaraan milik Andi Prasetyo (Owner ID 7). |
| **Goal (kode)** | Cari data di `vehicles` untuk `owner_id` 7. |
| **Expected SQL** | `SELECT * FROM vehicles WHERE owner_id = 7;` |

**Detail hook:** Tabel `vehicles` baru muncul di database chapter ini (di Chapter 1 tabelnya bernama `owners`, bukan `vehicles` — ini tabel kendaraan yang berbeda struktur, fokus ke kepemilikan per-warga sipil, bukan laporan kendaraan mencurigakan seperti Ch1). Hasil: Toyota Avanza silver, plat **B 2841 PT**.

---

## Objective 5

| | |
|---|---|
| **Story (kode)** | Cek data parkir untuk plat nomor B 2841 PT. |
| **Goal (kode)** | Cari data di `parking` untuk plat B 2841 PT. |
| **Expected SQL** | `SELECT * FROM parking WHERE plate_number = 'B 2841 PT';` |

**Detail hook:** Ini titik paling tegang di chapter — hasil: entry `11:26`, exit `11:34`. Rizky keluar rumah sakit pukul `11:30` (sudah disebut di mail.body pembuka). Selisih delapan menit. **Jangan tambahkan highlight visual atau perhitungan otomatis apapun** ("selisih 8 menit!" dengan animasi) — biarkan pemain sendiri yang melakukan aritmetika sederhana ini di kepala mereka. Ini salah satu momen "anjir" paling murni di seluruh CASE #001 justru karena game tidak membantu sama sekali.

---

## Objective 6 — Kapabilitas Baru (JOIN)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Sekarang gunakan JOIN untuk melihat nama pemilik and plat nomornya secara langsung."~~ |
| **Story (revisi)** | "Bagus. Sekarang aku ingin tahu nama pemilik dan plat kendaraannya sekaligus — tanpa harus bolak-balik dua tabel. Bisa?" |
| **Goal (kode)** | Gabungkan `citizens` dan `vehicles`. |
| **Expected SQL** | `SELECT c.name, v.plate_number FROM citizens c JOIN vehicles v ON c.id = v.owner_id;` |

**Detail hook:** Ini pertama kalinya pemain benar-benar butuh menggabungkan dua tabel dalam satu query — setelah 5 objective sebelumnya memaksa pemain mengingat angka secara manual dan bolak-balik tabel. Kapabilitas ini **tidak boleh diperkenalkan lewat popup bertuliskan nama sintaks** — biarkan `availableTokens` (yang sudah menyediakan kata kunci `JOIN`, `ON`, alias `c`/`v`) jadi satu-satunya petunjuk visual, bukan dialog yang menyebutnya eksplisit.

---

## Objective 7 — Menerapkan Kapabilitas Baru

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Sekarang gunakan JOIN untuk mencari kendaraan milik Andi Prasetyo."~~ |
| **Story (revisi)** | "Sekarang cari kendaraan milik Andi Prasetyo dengan cara yang sama." |
| **Goal (kode)** | Query gabungan dengan filter nama Andi Prasetyo. |
| **Expected SQL** | `SELECT c.name, v.plate_number FROM citizens c JOIN vehicles v ON c.id = v.owner_id WHERE c.name = 'Andi Prasetyo';` |

**Detail hook:** Objective ini sengaja tidak menambah tantangan baru — murni pengulangan Objective 6 dengan filter tambahan, supaya kapabilitas gabungan tabel terasa "dikuasai", bukan cuma "berhasil sekali secara kebetulan". Pola dua-langkah ini (perkenalkan lewat kebutuhan umum → terapkan lewat kebutuhan spesifik) akan berulang tiap kali kapabilitas baru muncul di chapter-chapter berikutnya.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

Tiga opsi:
- Andi Prasetyo adalah pelaku penculikan
- **Andi menjemput Rizky dengan mobil Toyota Avanza** ← jawaban benar
- Budi Santoso melarikan diri bersama Andi

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Bagus. Sekarang saya ingin tahu... Apakah Andi pernah berhubungan dengan Budi sebelumnya? Saya mendapat kabar buruk. Andi Prasetyo ternyata juga tidak bisa dihubungi. Dua orang hilang. Satu pasien. Satu pengunjung. Dan satu kendaraan yang membawa mereka pergi."

**Detail hook:** Perhatikan opsi pertama ("Andi adalah pelaku penculikan") sengaja jadi jebakan kesimpulan tergesa — data cuma menunjukkan Andi menjemput Rizky, bukan menculik siapa pun. Kalau pemain pilih opsi ini, itu murni salah baca bukti (bukan alur cerita bercabang — `correctIndex: 1` tetap satu-satunya jalur benar), tapi keberadaan opsi ini sendiri melatih pemain untuk tidak melompat ke kesimpulan dramatis dari bukti yang sebenarnya netral.

---

# Definition of Done Check

* [x] Selaras 1:1 dengan struktur `chapter3.ts` (7 objective, JOIN diperkenalkan di 6-7).
* [x] Story text "gunakan JOIN" diperbaiki — tidak lagi menyebut nama sintaks (Constitution Article 4).
* [x] Klaim "NEW TABLE: Parking" diperbaiki — sudah dikonfirmasi tabel lama, bukan baru.
* [x] Ditegaskan tidak ada app/menu baru dibuka chapter ini — murni kapabilitas SQL.
* [x] Tidak ada mekanik XP/Rank di GDD — instruksi patch kode disiapkan di bawah.
* [x] Temuan domain "Hospital Parking vs Parking kota" dicatat untuk revisi 07_DATABASE_SCHEMA terpisah, tidak menghalangi chapter ini.
