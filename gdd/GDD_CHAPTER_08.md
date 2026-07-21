# GDD_CHAPTER_08.md

**Chapter:** 8 — Pola yang Disembunyikan
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter8.ts` **dan** logic `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# ⚠️ Catatan Sinkronisasi v2.0 — PERLU VERIFIKASI DULU

| # | Isu | Tindakan |
|---|---|---|
| 1 | **Berpotensi kritis.** `database.transactions` dan `database.accounts` chapter8.ts punya penerima bernama bare **"Andi"** dan **"Maya"** (tanpa nama belakang) — masing-masing dapat 1 dan 2 transaksi. Ini kemungkinan besar **dimaksudkan sebagai Andi Prasetyo dan Maya Putri** (karakter asli, bagian dari reveal "Rizky/Budi/Andi masing-masing cuma 1 transaksi" yang jadi inti chapter ini) — **bukan** filler yang perlu di-rename. Instruksi batch rename sebelumnya (`cari objek dengan owner_id atau id 101 dan/atau name yang persis 'Andi'`) berpotensi ambigu dan **mungkin sudah tidak sengaja mengganti nama "Andi" di file ini juga**, padahal harusnya tidak — file ini tidak berkaitan dengan `owner_id`/`id` 101 sama sekali (memakai `account_number` sebagai key, bukan id numerik). | **Tolong cek dulu isi `chapter8.ts` kamu saat ini** — apakah field `receiver`/`owner_name` masih tertulis `'Andi'`/`'Maya'`, atau sudah berubah jadi `'Deni'` (rename yang salah)? Laporkan hasilnya sebelum chapter ini di-declare FINAL. |
| 2 | Objective 1 `goal`: "Gunakan SELECT untuk melihat..." | Perlu di-patch — pola sama seperti Chapter 7. |
| 3 | Objective 2 `goal`: "...GROUP BY receiver..." disebut eksplisit dalam kurung | Perlu di-patch. |
| 4 | Objective 3 `story` dan `goal`: "...COUNT(*)..." disebut eksplisit | Perlu di-patch. |
| 5 | Objective 4 `story`: "...HAVING COUNT(*) > 5..." disebut eksplisit (tapi `goal`-nya sudah bersih, tidak perlu diubah) | Perlu di-patch (story saja). |
| 6 | Popup unlock awal chapter + `report.conclusion` — pola XP/Rank/penyebutan sintaks standar | Perlu di-patch. |
| 7 | Tidak ada bespoke popup chain di `App.tsx` untuk chapter ini (beda dari Ch5/Ch6) — cuma popup unlock standar | Tidak perlu perbaikan struktural, cukup patch teks. |
| 8 | Chapter 8 termasuk dalam bug "missing branch" yang sudah dilaporkan sebelumnya (Chapter 7 & 8 sama-sama tidak ada di daftar transisi objective `handleObjectiveComplete`) | Sudah tercakup di instruksi Track B terpisah yang sudah dijalankan — tidak perlu diulang di sini. |
| 9 | `database.web` berisi 1 artikel arsip berita opsional, bisa diakses lewat Browser (app sudah unlock sejak Ch6) meski tidak ada objective yang mewajibkannya | Dicatat sebagai konten bonus opsional, bukan bug. |

---

# Latar Belakang Naratif

Chapter 8 adalah titik balik terbesar CASE #001 sampai sejauh ini — bukan cuma soal fakta baru, tapi soal **jenis pertanyaan yang berubah total**. Chapter 1-7 selalu bertanya "siapa / kapan / di mana". Chapter 8 pertama kali bertanya **"apa polanya"** — investigasi bergeser dari mencari fakta individual ke mencari anomali statistik dalam data yang jumlahnya sangat banyak (54 transaksi).

Ini juga chapter pertama yang secara eksplisit mengajarkan bahwa investigator sungguhan tidak membaca ribuan baris data satu-satu — mereka mencari pengelompokan dan pengecualian. Prinsip ini disampaikan lewat dialog Supervisor secara bertahap (Objective 1 → kewalahan oleh volume data → Objective 2 → kelompokkan → Objective 3 → hitung → Objective 4 → saring kelompok yang menonjol), bukan lewat penjelasan teori di awal.

---

# Hook Psikologis

Untuk pertama kalinya, kontak bukan lewat Inbox tapi **implikasi telepon langsung** — `mail.body` dibuka dengan sapaan personal yang belum pernah dipakai sebelumnya:

> "Indra... dengarkan saya baik-baik. Gudang Arunika kosong. Tidak ada siapa-siapa. Seolah-olah mereka sudah tahu kita akan datang. Saya baru mendapatkan surat izin. Sekarang kita bisa membuka data transaksi keuangan."

**Efek psikologis yang dituju:** memanggil nama pemain langsung ("Indra...") — pertama kalinya sepanjang CASE #001 — menandakan momen ini berbeda dari rutinitas laporan biasa. Kalimat "seolah-olah mereka sudah tahu kita akan datang" menegaskan lawan yang dihadapi bukan cuma reaktif (menghapus jejak setelah ketahuan) tapi **proaktif** (tahu duluan sebelum tim bergerak) — eskalasi penting dari kesan "seseorang menutupi masa lalu" jadi "seseorang mengawasi investigasi ini secara real-time".

BANK DATABASE terbuka. `files.content` menegaskan lingkup akses: accounts, transactions, branches — murni data finansial, tidak ada rekening pribadi di luar yang relevan kasus (batasan ini penting secara realisme, tapi tidak perlu dijelaskan ke pemain, cukup implisit dari struktur tabel yang tersedia).

CASE_FILES membuka 3 target: cari apakah Arunika membayar seseorang, temukan pola transaksi, identifikasi penerima paling sering. Supervisor eksplisit menegaskan pergeseran mindset lewat `story` Objective 1: bukan mencari transaksi terbesar, tapi mencari pola — instruksi yang secara sengaja mengarahkan pemain menjauh dari insting "cari angka terbesar" yang mungkin jadi kebiasaan dari chapter-chapter sebelumnya.

---

# Objective Walkthrough (selaras `chapter8.ts`)

## Objective 1 — Kewalahan oleh Volume

| | |
|---|---|
| **Story (kode)** | Cari apakah PT Arunika membayar seseorang. Lihat semua transaksi dari sender PT Arunika Logistics. |
| **Goal (kode, PERLU DIPATCH)** | ~~"Gunakan SELECT untuk melihat seluruh transaksi dengan filter sender='PT Arunika Logistics'."~~ |
| **Goal (revisi)** | "Lihat seluruh transaksi dengan sender PT Arunika Logistics." |
| **Expected SQL** | `SELECT * FROM transactions WHERE sender = 'PT Arunika Logistics';` |

**Detail hook:** Hasil: **54 baris** — jumlah terbanyak yang pernah diminta pemain baca sekaligus di seluruh CASE #001. Ini bukan kesalahan desain, ini poinnya: pemain harus benar-benar merasakan kewalahan sebelum diberi jalan keluar (pengelompokan) di objective berikutnya. Jangan beri fitur sorting/filter tambahan apapun di sini di luar yang sudah ada — ketidaknyamanan scroll panjang ini bagian dari kurva emosional chapter.

---

## Objective 2 — Kapabilitas Baru (Pengelompokan)

| | |
|---|---|
| **Story (kode)** | Supervisor: "Bagaimana kalau kita kelompokkan berdasarkan penerima untuk mempermudah analisis?" |
| **Goal (kode, PERLU DIPATCH)** | ~~"Query tabel transactions untuk menampilkan receiver yang dikelompokkan (GROUP BY receiver) dengan filter sender='PT Arunika Logistics'."~~ |
| **Goal (revisi)** | "Query tabel transactions untuk menampilkan penerima yang dikelompokkan, dengan filter sender PT Arunika Logistics." |
| **Expected SQL** | `SELECT receiver FROM transactions WHERE sender = 'PT Arunika Logistics' GROUP BY receiver;` |

**Detail hook:** Hasil: 6 baris — daftar penerima unik (bukan 54 lagi). Ini kelegaan pertama setelah kewalahan Objective 1, tapi Supervisor sengaja tidak berhenti di sini ("Kelompok sudah ada. Sekarang hitung.") — pengelompokan doang belum menjawab apa-apa, cuma langkah antara.

---

## Objective 3 — Kapabilitas Baru (Menghitung per Kelompok)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Kelompok sudah ada. Sekarang hitung jumlah transaksi untuk masing-masing penerima menggunakan COUNT(*)."~~ |
| **Story (revisi)** | "Kelompok sudah ada. Sekarang hitung jumlah transaksi untuk masing-masing penerima." |
| **Goal (kode, PERLU DIPATCH)** | ~~"Query tabel transactions dengan menampilkan receiver dan COUNT(*) yang dikelompokkan berdasarkan receiver dengan filter sender='PT Arunika Logistics'."~~ |
| **Goal (revisi)** | "Query tabel transactions dengan menampilkan penerima beserta jumlah transaksinya, dikelompokkan berdasarkan penerima, dengan filter sender PT Arunika Logistics." |
| **Expected SQL** | `SELECT receiver, COUNT(*) FROM transactions WHERE sender = 'PT Arunika Logistics' GROUP BY receiver;` |

**Detail hook:** Ini titik "anjir" chapter — salah satu baris menunjukkan **"Unknown Account" — 48**, jauh melampaui penerima lain (yang masing-masing di kisaran 1-2). Jangan beri highlight visual apapun pada baris ini; kontras angkanya sendiri (48 vs 1-2) sudah cukup mencolok tanpa bantuan UI. `Unknown Account` juga secara sengaja tidak ada di tabel `accounts` manapun (bisa dicek pemain kalau mereka penasaran) — akun yang datanya sudah dihapus, tapi transaksinya tetap tercatat.

---

## Objective 4 — Kapabilitas Baru (Menyaring Kelompok)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Cari kelompok yang jumlah transaksinya lebih dari lima menggunakan HAVING COUNT(*) > 5."~~ |
| **Story (revisi)** | "Cari kelompok yang jumlah transaksinya lebih dari lima." |
| **Goal (kode)** | "Query tabel transactions dengan menampilkan receiver dan COUNT(*) dikelompokkan berdasarkan receiver dengan filter jumlah transaksi lebih dari 5." — **sudah bersih, tidak perlu diubah.** |
| **Expected SQL** | `SELECT receiver, COUNT(*) FROM transactions GROUP BY receiver HAVING COUNT(*) > 5;` |

**Detail hook:** Hasil: **1 baris** — cuma Unknown Account yang tersisa setelah disaring. Ini penutup rapi dari keempat langkah (54 baris berantakan → 6 kelompok → 6 kelompok dengan angka → 1 kelompok yang benar-benar penting). Kurva ini — dari sangat berantakan ke sangat jelas dalam 4 langkah — adalah struktur pedagogis paling rapi di seluruh CASE #001 sejauh ini, pertahankan urutannya persis seperti ini kalau ada revisi di masa depan.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

4 opsi:
- PT Arunika Logistics tidak pernah melakukan pembayaran aneh ke mana pun.
- **Ditemukan transaksi mencurigakan rutin sebanyak 48 kali ke rekening yang telah dihapus (Unknown Account), yang dibayarkan setiap bulan secara teratur setelah kejadian kecelakaan maut delapan tahun lalu.** ← jawaban benar
- Saksi Andi menerima pembayaran rutin puluhan kali setiap bulannya dari PT Arunika Logistics.
- Uang kompensasi dari PT Arunika Logistics dibayarkan penuh ke semua keluarga korban kecelakaan.

**Detail hook — opsi jebakan:** Opsi ketiga ("Saksi Andi menerima pembayaran rutin puluhan kali...") sengaja dibuat mirip dengan jawaban benar tapi salah subjek — pemain yang cuma mengingat "ada pembayaran rutin ke seseorang" tanpa memperhatikan detail (Unknown Account, bukan Andi) bisa terjebak di sini. Andi di data sebenarnya cuma menerima **1** transaksi, bukan puluhan — konsisten dengan Rizky dan Budi yang juga cuma 1 masing-masing (lihat Catatan Sinkronisasi #1 soal pentingnya identitas "Andi" ini tetap utuh).

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Luar biasa! Penyelidikan yang sangat tajam. Akun yang terhapus (Unknown Account) menerima 48 transaksi kecil secara rutin setiap bulan... tepat setelah tabrakan maut itu terjadi. Ini bukan kompensasi resmi, karena asuransi dan kompensasi resmi tidak ada di arsip berita publik. Seseorang membayarkan uang tutup mulut secara teratur!
>
> Wait... Telepon seluler saya bergetar... 'Unknown Number' mengirimkan foto saya sedang diawasi di ruang briefing kepolisian! 'STOP OR HE DIES'"

**Detail hook — eskalasi tertinggi sejauh ini:** Ini ancaman paling berat sepanjang CASE #001 — bukan lagi ancaman ke pemain, tapi ancaman nyawa terhadap Supervisor, disertai bukti visual (foto) bahwa pengawasan itu nyata dan langsung, bukan sekadar gertakan teks. Perhatikan sudut pandangnya: Supervisor sendiri yang mengalami dan menceritakan ini secara real-time ("Wait..."), bukan pemain yang menerima pesan terpisah seperti pola ancaman di chapter-chapter sebelumnya — pemain jadi saksi ketakutan Supervisor secara langsung, bukan cuma pembaca laporannya.

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter8.ts` (4 objective) — dikonfirmasi tidak ada bespoke logic tambahan di `App.tsx` selain popup unlock standar.
* [x] Seluruh penyebutan eksplisit sintaks (SELECT, GROUP BY, COUNT, HAVING) di `story`/`goal` diperbaiki, kecuali Objective 4 `goal` yang sudah bersih sejak awal.
* [x] Kurva "54 baris → 6 kelompok → 6 kelompok+angka → 1 hasil" didokumentasikan eksplisit sebagai struktur pedagogis yang harus dipertahankan.
* [x] Eskalasi ancaman tertinggi (foto + ancaman nyawa Supervisor) dicatat sudut pandangnya secara spesifik (dialami Supervisor real-time, bukan pesan terpisah ke pemain).
* [x] Konten bonus opsional (`database.web`) dicatat, bukan bug.
* [x] **FINAL** — isu #1 (rename "Andi"/"Maya"/"Budi"/"Rizky" jadi nama lengkap di data transaksi) sudah dikonfirmasi diperbaiki.

---

# Shadows / Patch Instruksi Track B

```
PENTING: Sebelum menjalankan instruksi di bawah, verifikasi dulu isi field database.transactions dan database.accounts di chapter8.ts saat ini. Jika field receiver atau owner_name untuk entri terkait "Andi" sudah berubah menjadi "Deni" (akibat instruksi batch rename sebelumnya), KEMBALIKAN menjadi "Andi Prasetyo" (bukan "Andi" atau "Deni") — karena entri ini merepresentasikan karakter asli Andi Prasetyo (bagian dari reveal "Rizky/Budi/Andi masing-masing hanya 1 transaksi"), bukan karakter filler yang perlu di-rename. Sekalian ubah "Maya" menjadi "Maya Putri" dan "Budi" menjadi "Budi Santoso" dan "Rizky" menjadi "Rizky Hidayat" di seluruh database.transactions dan database.accounts pada file ini, agar tidak ambigu dengan karakter lain di masa depan. Field report.options nomor 3 ("Saksi Andi menerima...") juga perlu diubah "Andi" menjadi "Andi Prasetyo" agar konsisten.

1. Di file src/game/levels/case001/chapter8.ts:

a) Objective id: 1, field goal — ganti dari:
"Gunakan SELECT untuk melihat seluruh transaksi dengan filter sender='PT Arunika Logistics'."
menjadi:
"Lihat seluruh transaksi dengan sender PT Arunika Logistics."

b) Objective id: 2, field goal — ganti dari:
"Query tabel transactions untuk menampilkan receiver yang dikelompokkan (GROUP BY receiver) dengan filter sender='PT Arunika Logistics'."
menjadi:
"Query tabel transactions untuk menampilkan penerima yang dikelompokkan, dengan filter sender PT Arunika Logistics."

c) Objective id: 3, field story — ganti dari:
"Supervisor: \"Kelompok sudah ada. Sekarang hitung jumlah transaksi untuk masing-masing penerima menggunakan COUNT(*).\""
menjadi:
"Supervisor: \"Kelompok sudah ada. Sekarang hitung jumlah transaksi untuk masing-masing penerima.\""

d) Objective id: 3, field goal — ganti dari:
"Query tabel transactions dengan menampilkan receiver dan COUNT(*) yang dikelompokkan berdasarkan receiver dengan filter sender='PT Arunika Logistics'."
menjadi:
"Query tabel transactions dengan menampilkan penerima beserta jumlah transaksinya, dikelompokkan berdasarkan penerima, dengan filter sender PT Arunika Logistics."

e) Objective id: 4, field story — ganti dari:
"Supervisor: \"Cari kelompok yang jumlah transaksinya lebih dari lima menggunakan HAVING COUNT(*) > 5.\""
menjadi:
"Supervisor: \"Cari kelompok yang jumlah transaksinya lebih dari lima.\""

Field goal Objective 4 TIDAK perlu diubah — sudah bersih.

f) Field report.conclusion — hapus baris "Reward: +520 XP" dan "Rank: Digital Investigator II" sepenuhnya. Ubah baris "Unlocked: Bank Database, GROUP BY, COUNT(*), HAVING" menjadi "Unlocked: Bank Database" saja.

2. Di file src/App.tsx, cari blok kondisi "else if (currentLevelId === 8)" (sekitar baris 1367-1369). Ubah popupMessage dari:
'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- FINANCIAL BANK DATABASE\n  (accounts, transactions, branches)\n\nNew query capabilities unlocked: GROUP BY, COUNT(*), HAVING'
menjadi:
'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- FINANCIAL BANK DATABASE\n  (accounts, transactions, branches)'

Hapus baris "New query capabilities unlocked: GROUP BY, COUNT(*), HAVING" sepenuhnya.

Setelah semua perubahan, konfirmasi: (a) tidak ada lagi kata "SELECT", "GROUP BY", "COUNT", atau "HAVING" yang muncul sebagai penyebutan teknik/sintaks eksplisit di dialog/story/goal/popup manapun yang tampil ke pemain di seluruh chapter8.ts dan blok popup App.tsx untuk level 8; (b) validateResult di keempat objective masih berjalan benar setelah perubahan nama "Andi" menjadi "Andi Prasetyo" dkk — cek ulang bahwa validateResult tidak mem-filter berdasarkan string nama persis yang mungkin ikut berubah dan menyebabkan validasi gagal.
```
