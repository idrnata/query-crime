# GDD_CHAPTER_06.md

**Chapter:** 6 — Jejak Digital
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter6.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | `App.tsx` (baris ~837-847) punya popup bertitel **"NEW LESSON UNLOCKED"** isi **"LIKE\n\nUnlocked\n\nContoh:\nSELECT * FROM articles WHERE title LIKE '%Rizky%';"** — bukan cuma menyebut nama sintaks, tapi **membocorkan jawaban persis** untuk Objective 2 yang belum dikerjakan pemain | **Pelanggaran ganda** (Article 4 + merusak puzzle). Perlu di-patch — lihat instruksi Track B. |
| 2 | Field `goal` di seluruh 5 objective `chapter6.ts` berisi **query SQL literal** ("SELECT * FROM articles WHERE title='Rizky Hidayat';") alih-alih deskripsi bahasa natural seperti Chapter 1-5 | **Masalah desain, bukan cuma redaksional.** Karena `goal` tampil langsung ke pemain, ini secara efektif membocorkan jawaban di semua 5 objective, bukan cuma Objective 2. Perlu di-patch total. |
| 3 | Objective 2 `story`: "...dengan operator LIKE..." — menyebut nama sintaks eksplisit | **Perlu di-patch.** |
| 4 | Popup unlock awal chapter (`App.tsx`, chapterId 6): "New query capabilities unlocked: LIKE with % wildcards" | **Perlu di-patch.** |
| 5 | `report.conclusion` — `+320 XP`, `Rank: Senior Investigator`, `Unlocked: Browser, LIKE, Wildcard Search, Companies Database` | **Perlu di-patch** — pola sama seperti Ch1-5. |
| 6 | Ditemukan "Gunakan SUBQUERY" eksplisit di blok `currentLevelId === 9` saat menelusuri sekitar kode Chapter 6 | **Dicatat untuk sesi Chapter 9**, tidak dikerjakan sekarang. |

---

# Latar Belakang Naratif

Chapter 6 adalah titik balik skala cerita — sampai sini pemain percaya mereka sedang menangani kasus "hari ini" (Budi hilang, Rizky terlibat, Andi terlibat). Chapter ini mengungkap akar masalahnya sudah ada **delapan tahun lalu**: kecelakaan yang menewaskan tiga orang, melibatkan PT Arunika Logistics, dengan Rizky sebagai satu-satunya penyintas dan sopir truk yang menghilang tanpa jejak.

Secara pembelajaran, chapter ini juga titik balik teknis pertama yang benar-benar tentang **strategi pencarian**, bukan struktur data. Chapter 1-5 selalu punya jawaban pasti untuk dicari lewat kolom yang tepat. Chapter 6 pertama kali menghadapkan pemain pada kenyataan data dunia nyata: nama orang di berita jarang ditulis lengkap dan konsisten, jadi pencarian yang terlalu spesifik justru bisa membuat bukti penting tidak ditemukan.

---

# Hook Psikologis

INBOX dari Supervisor Raka membuka dengan kalimat yang secara langsung menyambung ke akhir Chapter 5:

> "Kamera memang mati selama enam menit. Tapi orang tidak bisa menghapus semua jejaknya. Setiap orang meninggalkan jejak digital. Saya membuka akses ke Arsip Digital Nasional untukmu."

**Efek psikologis yang dituju:** kalimat ini secara eksplisit menyambung callback ke pesan Unknown Number di akhir Chapter 5 ("yang hilang bukan hanya rekamannya") — Supervisor menjawabnya tanpa sadar dia sedang menjawab ancaman anonim, bukan cuma melanjutkan investigasi biasa. Nada optimis Raka ("tidak bisa menghapus semua jejaknya") justru terasa ironis begitu pemain sampai ke akhir chapter dan sadar betapa banyak yang **sudah** berhasil dihapus (data perusahaan rusak, sopir truk hilang, kasus lama ditutup).

**BROWSER dan COMPANIES DATABASE terbuka bersamaan** — dua app/domain baru sekaligus, pertama kalinya sejak Chapter 1 (Contacts) ada lebih dari satu unlock di titik yang sama. `files.content` menegaskan Browser **tetap murni SQL** ("POLICE BROWSER SECURE ACCESS... Indeks database terbuka") — bukan browser internet sungguhan, cuma terminal pencarian dengan kulit visual berbeda. Penting untuk UI: jangan render apapun yang menyerupai halaman web (tidak ada gambar, tidak ada layout artikel bergaya blog) — tetap tabel data seperti app lain.

CASE_FILES menampilkan 3 target sekaligus: cari Rizky di berita, cari Andi di berita, temukan hubungan yang tidak terlihat. Pola "3 target sekaligus di awal" sama seperti Chapter 4 — chapter-chapter dengan investigasi bercabang cenderung dibuka dengan banyak target sekaligus, bukan satu tujuan linear.

---

# Objective Walkthrough (selaras `chapter6.ts` + logic `App.tsx`)

## Objective 1 — Pencarian Gagal (Disengaja)

| | |
|---|---|
| **Story (kode)** | Cari apakah Rizky pernah muncul di berita menggunakan nama lengkap (Rizky Hidayat). |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM articles WHERE title='Rizky Hidayat';`~~ |
| **Goal (revisi)** | "Cari artikel dengan judul persis 'Rizky Hidayat' di tabel articles." |
| **Expected SQL** | `SELECT * FROM articles WHERE title = 'Rizky Hidayat';` |
| **Hasil valid** | 0 baris (`res.length === 0`) |

**Detail hook:** Ini objective pertama di seluruh CASE #001 di mana **hasil kosong justru validasi keberhasilan yang diharapkan** sejak awal (bukan seperti Chapter 4 Objective 4 yang kosongnya jadi temuan investigasi — di sini kosongnya murni demonstrasi bahwa pencarian persis itu terlalu kaku). Pastikan UI tetap netral (UI_MICROINTERACTIONS_SPEC §5) — jangan ada penanda "gagal" apapun, karena secara mekanik ini memang jawaban yang benar.

---

## Scripted Event — Transisi ke Objective 2 (`App.tsx`, di luar `chapter6.ts`)

Setelah Objective 1 selesai (`nextIdx === 1`), rangkaian berikut terjadi sebelum SQL Editor Objective 2 terbuka:

1. Notebook terisi: "Tidak ditemukan.\nApakah dia memang tidak pernah diberitakan?" → Notebook terbuka otomatis.
2. Popup "Supervisor Raka": "Atau... Kamu mencari dengan cara yang salah."
3. Popup "Supervisor Raka" (lanjutan): "Tidak semua orang ditulis dengan nama lengkap. Kadang hanya nama depan. Kadang hanya nama belakang. Gunakan pencarian yang lebih fleksibel." — **popup ini sudah bagus, tidak menyebut nama sintaks, tidak perlu diubah.**
4. ~~Popup "NEW LESSON UNLOCKED": "LIKE\n\nUnlocked\n\nContoh:\nSELECT * FROM articles WHERE title LIKE '%Rizky%';"~~ — **PERLU DIHAPUS TOTAL.** Ini bukan cuma pelanggaran Article 4, tapi membocorkan jawaban persis Objective 2 sebelum pemain sempat mencoba.

Setelah patch, urutan jadi: popup 1 → popup 2/3 (digabung atau berurutan, isi tidak berubah) → langsung `setAppState('TERM')`.

---

## Objective 2 — Kapabilitas Baru (Pencarian Fleksibel)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Coba gunakan pencarian yang lebih fleksibel dengan operator LIKE untuk menemukan berita tentang Rizky."~~ |
| **Story (revisi)** | "Coba gunakan pencarian yang lebih fleksibel untuk menemukan berita tentang Rizky." |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM articles WHERE title LIKE '%Rizky%';`~~ |
| **Goal (revisi)** | "Cari artikel yang judulnya mengandung kata 'Rizky', menggunakan pencarian yang lebih fleksibel." |
| **Expected SQL** | `SELECT * FROM articles WHERE title LIKE '%Rizky%';` |

**Detail hook:** Setelah patch popup di atas, kapabilitas pencarian fleksibel murni ditemukan pemain sendiri lewat `availableTokens` yang menyediakan kata kunci `LIKE` and pola `'%Rizky%'` — bukan diberi tahu lewat contoh persis. Hasil: artikel "Kecelakaan di Jalan Merdeka, Rizky Selamat dari Insiden" (2018) — reveal besar pertama chapter ini: Rizky penyintas kecelakaan yang melibatkan PT Arunika Logistics.

---

## Scripted Event — Transisi ke Objective 3

Setelah Objective 2 selesai (`nextIdx === 2`): Notebook terisi "?\nRizky pernah mengalami kecelakaan." → Notebook terbuka. Popup Supervisor: "Menarik. Rizky ternyata penyintas kecelakaan. Sekarang coba cari nama Andi." — **sudah bagus, tidak perlu diubah.**

---

## Objective 3 — Jalan Buntu yang Disengaja

| | |
|---|---|
| **Story (kode)** | Cari apakah nama Andi atau Prasetyo pernah disebut publik di isi artikel. |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM articles WHERE content LIKE '%Andi%';`~~ |
| **Goal (revisi)** | "Cari artikel yang isinya menyebut nama 'Andi', menggunakan pencarian yang lebih fleksibel." |
| **Expected SQL** | `SELECT * FROM articles WHERE content LIKE '%Andi%';` |
| **Hasil valid** | 0 baris |

**Detail hook:** Sekali lagi hasil kosong adalah jawaban benar — Andi memang tidak pernah disebut media. Ini penting secara naratif: bukan berarti Andi tidak terlibat, tapi dia "bersih" di media publik — kontras dengan Rizky yang justru banyak diberitakan. Perbedaan visibilitas media antar dua orang yang sama-sama terlibat inilah yang jadi petunjuk halus (belum dijelaskan eksplisit di chapter ini, baru terasa penting di chapter-chapter selanjutnya).

---

## Scripted Event — Transisi ke Objective 4

Setelah Objective 3 selesai (`nextIdx === 3`): Notebook terisi "Andi\ntidak pernah muncul." Popup Supervisor: "Andi bersih di media. Tapi coba perhatikan nama perusahaan di artikel kecelakaan Rizky: PT Arunika Logistics. Coba telusuri kata itu." — **sudah bagus, tidak perlu diubah.** Perhatikan popup ini secara eksplisit menyebut nama perusahaan sebagai petunjuk berikutnya — bukan pelarian ke sintaks, murni arahan naratif yang sah.

---

## Objective 4 — Ledakan Informasi

| | |
|---|---|
| **Story (kode)** | Cari semua artikel yang mengandung kata "Arunika". |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM articles WHERE content LIKE '%Arunika%';`~~ |
| **Goal (revisi)** | "Cari semua artikel yang isinya menyebut kata 'Arunika'." |
| **Expected SQL** | `SELECT * FROM articles WHERE content LIKE '%Arunika%';` |
| **Hasil valid** | Minimal 4 baris |

**Detail hook:** Ini objective dengan hasil terbanyak sejauh ini (4-5 artikel sekaligus) — sengaja dibuat sebagai "ledakan" informasi setelah dua objective sebelumnya sepi hasil. Pemain membaca 4 artikel berbeda dalam satu momen: kecelakaan awal, sopir truk hilang, data kendaraan hilang/dihapus, kasus resmi dihentikan. Efek yang dituju: dari sedikit demi sedikit (Obj 1-3) ke sekaligus banyak (Obj 4) — pemain merasakan skala masalah membesar drastis dalam satu klik.

---

## Scripted Event — Transisi ke Objective 5

Setelah Objective 4 selesai (`nextIdx === 4`): Notebook terisi "Arunika\n↓\nKecelakaan\n↓\nRizky\n\nSopir truk menghilang.\nRizky adalah penyintas kecelakaan." Popup Supervisor: "Delapan tahun lalu... Ada orang yang juga menghilang. Saya menemukan sesuatu. Nama perusahaan itu masih aktif." → Popup "NEW DATABASE UNLOCKED": "COMPANIES\n\nUnlocked" — **popup ini boleh tetap ada**, formatnya konsisten dengan pola "unlock database baru" yang sudah dipakai wajar di chapter-chapter lain (bukan "lesson", murni pengumuman akses baru).

---

## Objective 5

| | |
|---|---|
| **Story (kode)** | Cari data perusahaan PT Arunika Logistics di database perusahaan. |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM companies WHERE company_name LIKE '%Arunika%';`~~ |
| **Goal (revisi)** | "Cari data perusahaan PT Arunika Logistics di tabel companies." |
| **Expected SQL** | `SELECT * FROM companies WHERE company_name LIKE '%Arunika%';` |

**Detail hook:** Hasil: PT Arunika Logistics, status ACTIVE, tapi `owner: 'R.... [DATA CORRUPTED]'`. Ini pertama kalinya pemain melihat data yang **secara eksplisit ditandai rusak/disensor** dalam sistem resmi — beda dari data kosong (NULL) yang sudah dikenal sejak Chapter 1 dan 5. "Data corrupted" menyiratkan sesuatu yang jauh lebih disengaja daripada sekadar informasi yang belum lengkap.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

4 opsi (lebih banyak dari chapter-chapter sebelumnya yang biasanya 3 — pertimbangkan ini disengaja untuk menaikkan kesulitan membedakan kesimpulan yang tepat):
- Rizky adalah pelaku kecelakaan 8 tahun lalu.
- Kasus kecelakaan lama PT Arunika Logistics disengaja.
- **Rizky selamat dari kecelakaan 8 tahun lalu yang melibatkan PT Arunika Logistics, namun data perusahaan telah dimodifikasi dan sopirnya menghilang.** ← jawaban benar
- Sopir truk adalah Andi Prasetyo.

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Laporan diterima. Tepat sekali. Rizky selamat dari kecelakaan 8 tahun lalu yang melibatkan PT Arunika Logistics. Data pemilik perusahaan juga ditemukan dalam keadaan rusak: R.... Saya rasa kita tidak lagi menyelidiki orang hilang. Kita sedang menyelidiki seseorang yang bisa menghapus sejarah."

**Detail hook:** Kalimat penutup ("kita sedang menyelidiki seseorang yang bisa menghapus sejarah") adalah pergeseran skala kasus paling eksplisit sejauh ini — pertama kalinya Supervisor sendiri mengucapkan bahwa sifat kasus telah berubah total, bukan cuma pemain yang menyimpulkan sendiri. Ini kebalikan dari pola chapter-chapter sebelumnya (biasanya pemain yang menyimpulkan, Supervisor cuma mengonfirmasi) — di sini Supervisor yang lebih dulu menyuarakan ketakutan itu.

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter6.ts` (5 objective) **dan** logic bespoke `App.tsx`.
* [x] Popup "NEW LESSON UNLOCKED" (LIKE, dengan contoh jawaban persis) dihapus — pelanggaran ganda (Article 4 + kebocoran jawaban).
* [x] Seluruh field `goal` diubah dari query SQL literal jadi deskripsi bahasa natural, konsisten dengan Chapter 1-5.
* [x] Objective 2 `story` tidak lagi menyebut "operator LIKE" secara eksplisit.
* [x] Popup unlock awal chapter dan `report.conclusion` dibersihkan dari penyebutan sintaks + XP/Rank.
* [x] Dua kasus hasil kosong (Objective 1 dan 3) didokumentasikan eksplisit sebagai jawaban benar, bukan kegagalan.
* [x] Temuan "Gunakan SUBQUERY" di blok Chapter 9 dicatat, tidak dikerjakan sekarang.

---
