# GDD_CHAPTER_09.md

**Chapter:** 9 — Nama yang Dihapus
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter9.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | Seluruh 5 `goal` field di `chapter9.ts` berisi **query SQL literal**, sama seperti masalah yang ditemukan di Chapter 6 — membocorkan jawaban persis ke pemain | **Perlu di-patch total** — lihat instruksi Track B. |
| 2 | Objective 3, 4, 5 `story` menyebut "subquery" secara eksplisit | **Perlu di-patch.** |
| 3 | `App.tsx` (blok `currentLevelId === 9`, `nextIdx === 2` dan `nextIdx === 3`) — dua popup Supervisor menyebut **"Gunakan SUBQUERY"** eksplisit | **Perlu di-patch.** (`nextIdx === 4` sudah bersih, tidak menyebut sintaks — tidak perlu diubah.) |
| 4 | `report.conclusion` — `+700 XP`, `Rank: Lead Investigator`, `Unlocked: Criminal Records, Subquery, Archived Evidence` | **Perlu di-patch** — pola sama seperti chapter sebelumnya. |
| 5 | `report.conclusion` tidak diawali "Supervisor Raka:" seperti chapter lain | **Dikonfirmasi disengaja, bukan bug** — selaras tema chapter ini (Supervisor nyaris hilang dari narasi, kesunyian yang meningkat). Tidak diubah. |
| 6 | Ditemukan pola serupa (WITH/CTE disebut eksplisit) di blok `currentLevelId === 10` saat menelusuri App.tsx untuk chapter ini | **Dicatat untuk sesi Chapter 10**, tidak dikerjakan sekarang. |

---

# Latar Belakang Naratif

Chapter 9 adalah plot reversal terbesar sejauh ini — bukan cuma soal fakta baru, tapi soal **siapa yang sebenarnya sedang dicari**. Delapan chapter sebelumnya, pemain selalu mengejar orang: Budi, Rizky, Andi, Rudi. Chapter ini mengungkap bahwa 8 tahun lalu, seorang **investigator resmi kepolisian** pernah menangani kasus kecelakaan Arunika yang sama — dan identitasnya telah dihapus total dari sistem.

Secara teknis, chapter ini memperkenalkan konsep yang sangat pas secara metafora dengan momen naratifnya: menggunakan hasil satu pencarian sebagai bahan pencarian berikutnya, dalam satu query yang sama (subquery). Persis seperti investigasi itu sendiri — jawaban pertama (ID investigator) bukan tujuan akhir, tapi kunci untuk pertanyaan berikutnya.

---

# Hook Psikologis

Tidak ada boot sequence baru, tidak ada telepon — HP langsung berubah sendiri sebelum Inbox terbuka: wallpaper sempat menghitam sesaat lalu kembali normal, tanpa penjelasan apapun. Ini detail visual murni yang menyampaikan pesan tanpa kata: HP dinas pemain sedang disusupi, sebelum cerita chapter ini bahkan dimulai.

INBOX baru muncul setelahnya:

> "Saya menemukan surat izin lama dari delapan tahun lalu. Ada seorang penyidik yang menangani kecelakaan Arunika, tapi seluruh identitasnya telah dihapus dari arsip. Saya membuka akses ke Criminal Records. Cari tahu siapa yang menangani kasus ini."

**Efek psikologis yang dituju:** nada Raka di sini kembali ke mode formal/laporan setelah kepanikan personal di akhir Chapter 8 ("STOP OR HE DIES") — pergeseran ini penting: dia tidak menyinggung ancaman kemarin sama sekali, seolah memilih untuk terus bekerja meski dalam bahaya. Ketegangan yang tidak diucapkan ini lebih kuat daripada kalau Raka membahasnya secara eksplisit.

CRIMINAL RECORDS terbuka — domain baru terakhir sebelum Email (Ch10) dan Traffic Camera (Ch11). `files.content` menampilkan struktur 4 tabel yang saling terhubung erat: persons, cases, suspects, evidence — kerangka investigasi formal yang jadi cermin dari investigasi pemain sendiri.

---

# Objective Walkthrough (selaras `chapter9.ts` + logic `App.tsx`)

## Objective 1

| | |
|---|---|
| **Story (kode)** | Cari kasus kecelakaan Arunika di tabel cases. |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM cases WHERE title LIKE '%Arunika%';` |
| **Goal (revisi)** | "Cari kasus dengan judul yang mengandung kata 'Arunika' di tabel cases." |
| **Expected SQL** | `SELECT * FROM cases WHERE title LIKE '%Arunika%';` |

**Detail hook:** Hasil: "Traffic Accident Arunika", status Closed, `lead_investigator: 52` — cuma angka, bukan nama. Foreign key yang sudah sangat familiar sejak Chapter 3, tapi kali ini polanya akan berujung ke jalan buntu di objective berikutnya, bukan jawaban langsung seperti biasanya.

---

## Scripted Event — Transisi ke Objective 2 (`App.tsx`, tidak perlu diubah)

Popup Supervisor: "Sama seperti foreign key. Cari siapa nomor 52 di tabel persons." — analogi ini sengaja merujuk balik ke pola yang sudah pemain kuasai sejak lama, membangun rasa percaya diri sebelum jalan buntu berikutnya menghantam.

## Objective 2

| | |
|---|---|
| **Story (kode)** | Cari siapa investigator dengan ID 52 di tabel persons. |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM persons WHERE id=52;` |
| **Goal (revisi)** | "Cari data investigator dengan ID 52 di tabel persons." |
| **Expected SQL** | `SELECT * FROM persons WHERE id = 52;` |

**Detail hook:** Hasil: **0 baris** — jawaban benar (validasi eksplisit `res.length === 0`). Pola query yang seharusnya bekerja (seperti berulang kali di chapter sebelumnya) tiba-tiba tidak menghasilkan apa-apa. Pastikan UI tetap netral di sini (bukan error) — ini justru reveal, bukan kegagalan.

---

## Scripted Event — Transisi ke Objective 3 (`App.tsx`, PERLU DIPATCH)

Popup Supervisor saat ini: "Tidak mungkin. Kalau seseorang menghapus identitas, apakah datanya benar-benar hilang? Gunakan SUBQUERY untuk mencari data person yang menjadi investigator kasus Arunika."

Revisi: "Tidak mungkin. Kalau seseorang menghapus identitas, apakah datanya benar-benar hilang? Coba cari ID investigatornya dulu, lalu langsung pakai hasil itu di query yang sama — tanpa mengetik ulang angkanya secara manual."

## Objective 3 — Kapabilitas Baru (Query Bersarang)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Coba gunakan subquery untuk mencari data person yang menjadi investigator kasus Arunika." |
| **Story (revisi)** | "Coba cari data person yang menjadi investigator kasus Arunika, tanpa mengetik ID-nya secara manual — gunakan hasil pencarian sebelumnya langsung di dalam query ini." |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM persons WHERE id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');` |
| **Goal (revisi)** | "Cari data person yang ID-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika langsung di dalam query ini." |
| **Expected SQL** | `SELECT * FROM persons WHERE id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');` |

**Detail hook:** Kapabilitas ini muncul dari kebutuhan yang sangat konkret — pemain sudah tahu ID 52 dari Objective 1, tapi query langsung ke situ (Objective 2) gagal. Daripada mengulang manual, `availableTokens` menyediakan tanda kurung yang mengisyaratkan satu query bisa "bersarang" di dalam query lain. Hasil: **tetap 0 baris** — bukan ID-nya yang salah, tapi recordnya memang benar-benar sudah dihapus. Reveal ini penting: bukan kegagalan teknik, tapi konfirmasi bahwa penghapusan itu nyata dan menyeluruh.

---

## Scripted Event — Transisi ke Objective 4 (`App.tsx`, PERLU DIPATCH)

Popup Supervisor saat ini: "Menarik... Berarti bukan datanya yang hilang, tapi record-nya sudah dihapus. Tapi apakah evidence miliknya juga hilang? Gunakan SUBQUERY di tabel evidence."

Revisi: "Menarik... Berarti bukan datanya yang hilang, tapi record-nya sudah dihapus. Tapi apakah evidence miliknya juga hilang? Coba cara yang sama di tabel evidence."

## Objective 4

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Meskipun record person hilang, mungkin evidence miliknya masih ada. Cari evidence yang dimiliki oleh lead investigator kasus Arunika menggunakan subquery." |
| **Story (revisi)** | "Meskipun record person hilang, mungkin evidence miliknya masih ada. Cari evidence yang dimiliki oleh lead investigator kasus Arunika, dengan cara yang sama seperti sebelumnya." |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM evidence WHERE owner_id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');` |
| **Goal (revisi)** | "Cari evidence yang owner_id-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama." |
| **Expected SQL** | `SELECT * FROM evidence WHERE owner_id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');` |

**Detail hook:** Ini titik puncak emosional chapter — hasil: **1 baris**, "Digital Notebook - Archived". Kontras dengan Objective 3 (0 baris) sangat penting: identitas orangnya dihapus total, tapi jejak fisik pekerjaannya tidak. Pemain membuka isi notebook itu dan menemukan satu kalimat yang ditulis 8 tahun lalu: "Jika saya menghilang, jangan percaya database. Percayalah pada ketidakkonsistenannya." — kalimat ini jadi motif tersembunyi seluruh sisa CASE #001.

---

## Scripted Event — Transisi ke Objective 5 (`App.tsx`, tidak perlu diubah)

Popup Supervisor: "Pesan di Notebook: 'Jangan percaya database. Percayalah pada ketidakkonsistenannya.' Ini catatan seorang polisi, bukan korban. Cek apakah ada tersangka (suspects) untuk kasus ini." — popup ini sudah bersih, tidak menyebut nama sintaks, tidak perlu diubah.

## Objective 5

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Cek apakah ada tersangka (suspects) untuk kasus Arunika menggunakan subquery." |
| **Story (revisi)** | "Cek apakah ada tersangka (suspects) untuk kasus Arunika, dengan cara yang sama seperti sebelumnya." |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM suspects WHERE case_id = (SELECT case_id FROM cases WHERE title LIKE '%Arunika%');` |
| **Goal (revisi)** | "Cari suspects yang case_id-nya sama dengan case_id dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama." |
| **Expected SQL** | `SELECT * FROM suspects WHERE case_id = (SELECT case_id FROM cases WHERE title LIKE '%Arunika%');` |

**Detail hook:** Hasil terakhir: **0 baris** lagi. Kasus pembunuhan (tersirat), ditutup resmi, tanpa investigator, tanpa tersangka. Tiga kali hasil kosong di satu chapter (Objective 2, 3, 5) adalah pola yang disengaja — pemain harus merasakan betapa menyeluruhnya penghapusan ini, bukan cuma dikasih tahu lewat dialog.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

4 opsi:
- Tidak ada bukti yang tersisa.
- Kasus Arunika adalah kecelakaan biasa.
- **Identitas investigator (ID 52) sengaja dihapus dari database persons, namun jejaknya masih tertinggal di tabel evidence sebagai "Archived Notebook". Tidak ada tersangka yang pernah ditangkap.** ← jawaban benar
- Semua data telah dihapus total.

**Detail hook — opsi jebakan:** Opsi pertama dan keempat ("tidak ada bukti tersisa" / "semua data dihapus total") sengaja dibuat mirip jawaban benar tapi terlalu absolut — padahal justru poin chapter ini adalah penghapusan itu **tidak pernah benar-benar sempurna** (evidence masih ada). Pemain yang menyimpulkan "semuanya hilang" tanpa memperhatikan detail justru melewatkan inti dari apa yang baru saja mereka temukan.

**Twist penutup (perlu di-patch — hanya baris Reward/Rank/Unlocked, sisanya tidak berubah):**

> "Itu bukan catatan korban. Itu catatan seorang polisi. Seseorang telah menghapus identitas investigator resmi kasus ini. Artinya musuh kita memiliki akses yang sangat dalam ke sistem kepolisian."

**Detail hook:** Perhatikan tidak ada "Supervisor Raka:" di depan kalimat ini (beda dari semua chapter lain) — sudah dikonfirmasi disengaja (lihat Catatan Sinkronisasi #5). Efeknya: kalimat ini terasa seperti kesimpulan yang muncul dari kesunyian, bukan dialog aktif — cocok dengan tema chapter yang memang tentang penghapusan dan ketiadaan.

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter9.ts` (5 objective) **dan** logic bespoke `App.tsx` (2 dari 3 popup transisi perlu di-patch, 1 sudah bersih).
* [x] Seluruh `goal` field diubah dari query SQL literal jadi deskripsi bahasa natural, konsisten dengan Chapter 1-5, 7-8.
* [x] Penyebutan "subquery"/"SUBQUERY" dihapus dari seluruh story/popup, diganti deskripsi konseptual.
* [x] Tiga kasus hasil kosong (Objective 2, 3, 5) didokumentasikan eksplisit as part of reveal, bukan kegagalan.
* [x] Ketiadaan "Supervisor Raka:" di conclusion dikonfirmasi disengaja, tidak diubah.
* [x] Temuan pola serupa di blok Chapter 10 (WITH/CTE) dicatat, tidak dikerjakan sekarang.

---

# Shadows / Patch Instruksi Track B

```
1. Di file src/game/levels/case001/chapter9.ts:

a) Objective id: 1, field goal — ganti dari:
"SELECT * FROM cases WHERE title LIKE '%Arunika%';"
menjadi:
"Cari kasus dengan judul yang mengandung kata 'Arunika' di tabel cases."

b) Objective id: 2, field goal — ganti dari:
"SELECT * FROM persons WHERE id=52;"
menjadi:
"Cari data investigator dengan ID 52 di tabel persons."

c) Objective id: 3, field story — ganti dari:
"Coba gunakan subquery untuk mencari data person yang menjadi investigator kasus Arunika."
menjadi:
"Coba cari data person yang menjadi investigator kasus Arunika, tanpa mengetik ID-nya secara manual — gunakan hasil pencarian sebelumnya langsung di dalam query ini."

d) Objective id: 3, field goal — ganti dari:
"SELECT * FROM persons WHERE id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');"
menjadi:
"Cari data person yang ID-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika langsung di dalam query ini."

e) Objective id: 4, field story — ganti dari:
"Meskipun record person hilang, mungkin evidence miliknya masih ada. Cari evidence yang dimiliki oleh lead investigator kasus Arunika menggunakan subquery."
menjadi:
"Meskipun record person hilang, mungkin evidence miliknya masih ada. Cari evidence yang dimiliki oleh lead investigator kasus Arunika, dengan cara yang sama seperti sebelumnya."

f) Objective id: 4, field goal — ganti dari:
"SELECT * FROM evidence WHERE owner_id = (SELECT lead_investigator FROM cases WHERE title LIKE '%Arunika%');"
menjadi:
"Cari evidence yang owner_id-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama."

g) Objective id: 5, field story — ganti dari:
"Cek apakah ada tersangka (suspects) untuk kasus Arunika menggunakan subquery."
menjadi:
"Cek apakah ada tersangka (suspects) untuk kasus Arunika, dengan cara yang sama seperti sebelumnya."

h) Objective id: 5, field goal — ganti dari:
"SELECT * FROM suspects WHERE case_id = (SELECT case_id FROM cases WHERE title LIKE '%Arunika%');"
menjadi:
"Cari suspects yang case_id-nya sama dengan case_id dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama."

i) Field report.conclusion — hapus baris "Reward: +700 XP" dan "Rank: Lead Investigator" sepenuhnya. Ubah baris "Unlocked: Criminal Records, Subquery, Archived Evidence" menjadi "Unlocked: Criminal Records" saja. JANGAN tambahkan "Supervisor Raka:" di awal conclusion — ketiadaannya sudah sesuai desain.

2. Di file src/App.tsx, cari blok kondisi "else if (currentLevelId === 9)" (sekitar baris 887-909):

a) Di dalam "if (nextIdx === 2)", ubah pesan showSupervisorPopup dari:
'Tidak mungkin. Kalau seseorang menghapus identitas, apakah datanya benar-benar hilang? Gunakan SUBQUERY untuk mencari data person yang menjadi investigator kasus Arunika.'
menjadi:
'Tidak mungkin. Kalau seseorang menghapus identitas, apakah datanya benar-benar hilang? Coba cari ID investigatornya dulu, lalu langsung pakai hasil itu di query yang sama — tanpa mengetik ulang angkanya secara manual.'

b) Di dalam "else if (nextIdx === 3)", ubah pesan showSupervisorPopup dari:
'Menarik... Berarti bukan datanya yang hilang, tapi record-nya sudah dihapus. Tapi apakah evidence miliknya juga hilang? Gunakan SUBQUERY di tabel evidence.'
menjadi:
'Menarik... Berarti bukan datanya yang hilang, tapi record-nya sudah dihapus. Tapi apakah evidence miliknya juga hilang? Coba cara yang sama di tabel evidence.'

Blok "else if (nextIdx === 4)" TIDAK perlu diubah — sudah bersih, tidak menyebut nama sintaks.

Setelah semua perubahan, konfirmasi tidak ada lagi kata "subquery" or "SUBQUERY" yang muncul di dialog/story/goal/popup manapun yang tampil ke pemain di seluruh chapter9.ts dan blok App.tsx untuk level 9 (kata itu boleh tetap ada di komentar kode/nama variabel internal, hanya dilarang di teks yang benar-benar tampil ke pemain).
```
