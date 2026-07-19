# GDD_CHAPTER_05.md

**Chapter:** 5 — Bukti yang Bertentangan
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter5.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | `App.tsx` (baris ~792-820) punya rangkaian **5 popup berantai** khusus Chapter 5, sepenuhnya di luar `chapter5.ts` — termasuk popup bertitel **"NEW LESSON"** isi **"LEFT JOIN\n\nUnlocked"** (persis contoh yang dilarang eksplisit Constitution Article 4) dan popup **"TUTORIAL"** yang menjelaskan INNER JOIN vs LEFT JOIN secara teoretis | **Pelanggaran paling serius yang ditemukan sejauh ini.** Perlu di-patch — lihat instruksi Track B. Rangkaian 5 popup dipangkas jadi 3, tanpa penyebutan sintaks apapun. |
| 2 | Objective 4 `story` dan `goal` di `chapter5.ts` juga menyebut "LEFT JOIN" secara eksplisit | **Perlu di-patch.** |
| 3 | Popup unlock awal chapter (`App.tsx`, chapterId 5): "New query capabilities unlocked: SQL LEFT JOIN" | **Perlu di-patch.** |
| 4 | `report.conclusion` — `+250 XP`, `Rank: Investigator II`, `Unlocked: CCTV Database, LEFT JOIN` | **Perlu di-patch** — pola sama seperti Ch1-4. |
| 5 | Filler "Andi" (owners id 101) dan "Rudi" (owners id 310) masih ada di `database` chapter ini pada snapshot kode yang saya periksa | **Kemungkinan sudah tercakup** oleh instruksi batch rename yang sudah kamu jalankan sebelumnya (chapter5.ts eksplisit disebut di situ). Snapshot yang saya periksa adalah salinan sebelum instruksi itu dijalankan — tidak perlu instruksi baru, cukup diverifikasi. |
| 6 | Ambiguitas "Rudi" di tabel `visitors`/`footage` (nama depan doang, tanpa penanda apakah itu Rudi Hartono atau filler) | **Terselesaikan otomatis** oleh fix #5 — begitu filler owner id 310 berganti nama, "Rudi" di footage/visitors otomatis merujuk tunggal ke Rudi Hartono, tidak perlu instruksi tambahan. |
| 7 | Ditemukan bespoke logic serupa untuk Chapter 6 (LIKE/pencarian fleksibel) saat menelusuri sekitar kode Chapter 5 | **Dicatat untuk sesi Chapter 6**, tidak dikerjakan sekarang. |

---

# Latar Belakang Naratif

Chapter 5 adalah titik pertama CASE #001 mengubah sifat "musuh" pemain. Chapter 1-4 melawan **kekurangan informasi** — setiap objective adalah soal mencari data yang belum ditemukan. Mulai chapter ini, pemain melawan **ketidaksesuaian antar sumber data** — dua sumber (laporan rumah sakit vs CCTV) yang seharusnya saling menguatkan, ternyata tidak. Ini pergeseran dari "mencari" ke "memverifikasi", fondasi yang akan terus dipakai sampai Chapter 12 (Cross Examination).

Klaim "CCTV rusak" dari Chapter 3 kembali di sini — bukan untuk dijelaskan sebagai bohong (itu jatah Chapter 10), tapi untuk pertama kali diperiksa faktanya: sistem lama cuma menyimpan metadata (bukan video), dan kamera Main Gate memang tercatat OFFLINE. Faktanya benar secara teknis, tapi nanti terbukti maknanya jauh lebih gelap dari yang terlihat sekarang.

---

# Hook Psikologis

INBOX dari Supervisor Raka, dengan nada paling reflektif sejauh ini — bukan instruksi, tapi hasil semalaman berpikir:

> "Saya semalaman memikirkan laporanmu. Ada sesuatu yang tidak masuk akal. Data rumah sakit mengatakan Rizky keluar pukul 11.30. Tapi kita belum punya bukti bahwa Budi pernah keluar. Saya baru mendapatkan akses ke sistem CCTV."

**Efek psikologis yang dituju:** kalimat "kita belum punya bukti bahwa Budi pernah keluar" itu detail yang gampang terlewat tapi krusial — sejak Chapter 1, semua orang (termasuk pemain) berasumsi Budi memang keluar rumah sakit lalu menghilang setelahnya. Chapter ini diam-diam menantang asumsi itu tanpa bilang eksplisit "asumsimu salah". Ini pertama kalinya CASE #001 mempertanyakan sesuatu yang dari awal dianggap given.

**CCTV DATABASE terbuka** — app database baru pertama sejak Chapter 3 (JOIN, tanpa domain baru) dan Chapter 4 (Timeline, tapi bukan database). Penting: sistem lama **cuma metadata**, bukan rekaman video — pastikan UI tidak pernah menampilkan placeholder video/thumbnail apapun untuk tabel `cameras`/`footage`. Ini tetap murni permainan SQL, dan justru itu poinnya — "investigasi CCTV" di sini terasa seperti membongkar sistem lama yang usang, bukan menonton rekaman seperti film detektif kebanyakan.

CASE_FILES (`files.content`) menampilkan potongan laporan teknis: "Main Gate → CAM-03 → 06 minutes → No Footage". Empat baris data mentah tanpa penjelasan — pemain belum tahu artinya "06 minutes" sampai jauh di akhir chapter.

---

# Objective Walkthrough (selaras `chapter5.ts` + logic `App.tsx`)

## Objective 1

| | |
|---|---|
| **Story (kode)** | "Jangan berharap ada video. Sistem lama hanya menyimpan metadata. Pertama, cari kamera yang merekam pintu utama (Main Gate)." |
| **Goal (kode)** | Cari kamera yang merekam pintu utama (Main Gate). |
| **Expected SQL** | `SELECT * FROM cameras;` |

**Detail hook:** Kalimat pembuka "jangan berharap ada video" itu instruksi ke pemain sekaligus disclaimer desain — menetapkan ekspektasi sejak awal supaya tidak ada yang kaget kenapa "investigasi CCTV" cuma berupa tabel data. Hasil: 4 kamera, salah satunya (CAM-03, Main Gate) berstatus **OFFLINE** — satu-satunya yang begitu. Jangan beri highlight visual pada baris OFFLINE ini; biarkan pemain scan sendiri dan menyadarinya.

---

## Objective 2

| | |
|---|---|
| **Story (kode)** | "Cari Budi. Apakah ada bukti visual dia masuk?" |
| **Goal (kode)** | Cari rekaman Budi Santoso di CCTV. |
| **Expected SQL** | `SELECT * FROM footage WHERE person_name = 'Budi Santoso';` |

**Popup lanjutan (`App.tsx`, terpisah dari `chapter5.ts`, tidak perlu diubah):** Begitu objective sebelumnya selesai dan pemain masuk ke objective ini, ada popup Supervisor tambahan: *"Cari rekaman Budi Santoso di CCTV (tabel footage)."* — ini duplikat/penguat dari `story` field, tidak melanggar apapun, tidak perlu diubah.

**Detail hook:** Hasil satu baris: Budi terekam **masuk** jam 09:18 (2 menit lebih awal dari waktu kunjungan tercatat di `visitors`, 09:20 — selisih kecil yang wajar, tidak perlu dipermasalahkan, murni variasi natural antar sistem pencatatan). Yang penting: **tidak ada rekaman Budi keluar**. Sistem tidak menyatakan ini eksplisit — pemain harus sadar sendiri dari ketiadaan baris kedua.

---

## Objective 3

| | |
|---|---|
| **Story (kode)** | "Sekarang cari Rizky. Kapan dia terekam kamera?" |
| **Goal (kode)** | Cari rekaman Rizky Hidayat di CCTV. |
| **Expected SQL** | `SELECT * FROM footage WHERE person_name = 'Rizky Hidayat';` |

**Popup lanjutan (`App.tsx`, tidak perlu diubah):** *"Cari rekaman Rizky Hidayat di CCTV."*

**Detail hook:** Hasil: Rizky terekam jam 11:31 — cocok dengan klaim rumah sakit (keluar 11:30, selisih wajar). Sekarang pemain punya dua fakta kontradiktif: Budi (masuk, tanpa rekaman keluar) vs Rizky (rekaman keluar, cocok dengan klaim resmi). Chapter berjudul "Bukti yang Bertentangan" — inilah pertentangannya, murni dari dua baris data yang tidak simetris.

---

## Objective 4 — Kapabilitas Baru (bandingkan dua sumber sekaligus)

Ini objective paling kompleks di seluruh chapter — bukan cuma soal SQL, tapi soal satu rangkaian panjang scripted event yang **sebagian besar hidup di `App.tsx`, bukan `chapter5.ts`**. Berikut urutan lengkapnya, versi final setelah patch:

### Urutan Scripted Event (setelah Objective 3 selesai, sebelum Objective 4 SQL Editor terbuka)

1. **Popup "SUPERVISOR RAKA":** "Bandingkan keduanya (Visitors dan Footage)." *(tidak berubah)*
2. Setelah popup ditutup → jeda 4 detik → **Notebook** otomatis terisi: "Data mulai banyak.\nSulit dibandingkan." → Notebook terbuka otomatis (ikuti pola auto-open Notebook, UI_MICROINTERACTIONS_SPEC §3 — ini entri refleksi, bukan fakta rutin, jadi **wajib menunggu pemain menekan Continue**, bukan auto-close).
3. **Popup "SUPERVISOR RAKA" (versi revisi, gabungan 3 popup lama jadi 1):** *(lihat instruksi Track B untuk teks persis)* — intinya menyampaikan "tidak semua data punya pasangan" sebagai hint konseptual, lalu langsung ke SQL Editor. **Popup "NEW LESSON" dan "TUTORIAL" dihapus total dari rangkaian ini.**
4. `setAppState('TERM')` — pemain masuk ke SQL Editor untuk menulis query objective 4.

### Objective 4 (field kode)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Tampilkan semua pengunjung rumah sakit. Lalu cocokkan dengan CCTV menggunakan LEFT JOIN. Kita ingin melihat siapa yang tidak muncul di CCTV."~~ |
| **Story (revisi)** | "Tampilkan semua pengunjung rumah sakit, lalu bandingkan dengan seluruh rekaman kamera sekaligus — termasuk yang tidak cocok." |
| **Goal (kode, PERLU DIPATCH)** | ~~"Bandingkan data pengunjung (visitors) dengan rekaman CCTV (footage) menggunakan LEFT JOIN."~~ |
| **Goal (revisi)** | "Bandingkan data pengunjung (visitors) with rekaman CCTV (footage), termasuk pengunjung yang tidak muncul di rekaman manapun." |
| **Expected SQL** | `SELECT v.visitor_name, f.capture_time FROM visitors v LEFT JOIN footage f ON v.visitor_name = f.person_name;` |

**Detail hook — ini titik puncak chapter:** Hasil menampilkan 4 baris, salah satunya `Andi Prasetyo` dengan `capture_time: null`. Pemain sudah kenal `null` dari Chapter 1 (exit_time kosong) tapi di sana maknanya sederhana ("belum keluar"). Di sini `null` berarti sesuatu yang jauh lebih berat: **Andi tidak pernah terekam kamera sama sekali**, padahal menurut data lain dia jelas terlibat. Ini pembayaran penuh dari prinsip yang cuma disentuh sekilas di Chapter 1 — NULL sebagai petunjuk, bukan kekosongan.

**Prinsip investigasi yang harus tersampaikan tanpa dialog eksplisit:** pemain (dan Supervisor) selama ini menganggap Andi yang mengemudikan mobilnya sendiri. Data tidak pernah benar-benar menyatakan itu — itu cuma asumsi yang terbawa sejak Chapter 3. **Jangan tambahkan dialog baru yang menyatakan ini eksplisit** — biarkan `report.conclusion` yang sudah ada di kode ("Siapa yang sebenarnya mengemudikan mobilnya?") jadi satu-satunya penegasan, muncul di titik paling tepat: setelah pemain submit laporan, bukan sebelumnya.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

Pertanyaan: "Kirim laporan bukti CCTV."
- Budi tidak pernah masuk ke rumah sakit, Rizky terekam keluar, dan kamera gate normal.
- **Budi hanya masuk, Rizky keluar, kamera mati selama 6 menit, dan Andi tidak pernah terekam (kemungkinan orang lain mengemudi).** ← jawaban benar
- Semua orang terekam masuk dan keluar dengan tertib di waktu yang tepat.

**Twist penutup (perlu di-patch — lihat instruksi Track B):**

> Supervisor Raka: "Laporan diterima. Tepat sekali. Andi tidak pernah muncul di CCTV. Siapa yang sebenarnya mengemudikan mobilnya?"
>
> Unknown Number: "Kamu terlalu lambat. Kalau ingin menemukan Budi... cari tempat yang tidak pernah tercatat di database."

**Detail hook:** Pesan Unknown Number ini pertama kali menyinggung "enam menit" — angka yang sudah muncul di `files.content` sejak awal chapter ("06 minutes\nNo Footage") tapi baru sekarang maknanya jelas: kamera mati 6 menit, persis di jendela waktu kritis. Pesan ini **tidak menjelaskan** kenapa 6 menit itu penting secara eksplisit — pemain yang harus menyambungkan sendiri ke laporan CCTV yang sudah dibaca di awal chapter. Ini contoh Rule of One More Click yang bekerja lintas-chapter, bukan cuma antar-layar.

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter5.ts` (4 objective) **dan** logic bespoke `App.tsx` yang tidak tercatat di file data manapun.
* [x] Rangkaian popup "NEW LESSON: LEFT JOIN Unlocked" dan "TUTORIAL" (pelanggaran Article 4 paling eksplisit yang ditemukan) diperbaiki total.
* [x] Objective 4 `story`/`goal` tidak lagi menyebut nama sintaks.
* [x] NULL diberi bobot naratif penuh sesuai desain besar chapter ini, tanpa penjelasan eksplisit di layar manapun.
* [x] Prinsip "jangan berasumsi di luar data" (soal siapa mengemudikan mobil Andi) disampaikan lewat dialog yang sudah ada di kode, tidak perlu dialog tambahan.
* [x] Tidak ada mekanik XP/Rank di GDD — instruksi patch kode disiapkan di bawah.
* [x] Temuan bespoke logic Chapter 6 dicatat, tidak dikerjakan sekarang.

---
