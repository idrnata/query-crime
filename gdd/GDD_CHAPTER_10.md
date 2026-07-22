# GDD_CHAPTER_10.md

**Chapter:** 10 — Percakapan yang Terputus
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter10.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | **Pelanggaran paling banyak sejauh ini** — "CTE" / "WITH" / "Common Table Expression" disebut eksplisit di **6 lokasi**: `files.content`, Objective 2 `story`, Objective 3 `story`, Objective 4 `story` (plus "subquery"), dan 3 popup transisi `App.tsx` (nextIdx 1, 2, 3) | **Perlu di-patch total** — lihat instruksi Track B. |
| 2 | Seluruh 4 `goal` field berisi query SQL literal — pola sama seperti Chapter 6, 9 | **Perlu di-patch total.** |
| 3 | `report.conclusion` — `+850 XP`, `Rank: Senior Digital Investigator`, `Unlocked: Email Database, CTE (WITH), Recovered Deleted Mail` | **Perlu di-patch** — pola sama seperti chapter sebelumnya. |
| 4 | Ditemukan "Gunakan LEAD()" eksplisit di blok `currentLevelId === 11` saat menelusuri App.tsx untuk chapter ini | **Dicatat untuk sesi Chapter 11**, tidak dikerjakan sekarang. |
| 5 | `EmailScreen.tsx` sudah diperbaiki di sesi audit sebelumnya (hardcoded fake content dihapus, disambungkan ke `handleBrowseTable`) | **Sudah selesai**, tidak perlu diulang. |

---

# Latar Belakang Naratif

Chapter 10 adalah titik di mana pemain untuk pertama kalinya benar-benar sendirian secara struktural, bukan cuma secara emosional. Sembilan chapter sebelumnya selalu ada Supervisor Raka yang memberi arahan lewat Inbox atau telepon. Chapter ini dibuka dengan sistem otomatis yang memberi akses tanpa Raka terlibat sama sekali — `mail.sender` bahkan bukan "Supervisor Raka" lagi, melainkan "SYSTEM MESSAGE", dengan catatan eksplisit: "Supervisor Raka status is CURRENTLY UNAVAILABLE."

Secara teknis, chapter ini soal merekonstruksi percakapan yang berantakan — thread email yang saling bersilangan, sebagian dihapus, satu email isinya kosong. Kapabilitas menyusun hasil sementara sebelum query utama (CTE) dipilih secara sengaja karena metaforanya pas: sama seperti pemain menyusun ulang potongan-potongan chapter 1-9 jadi satu pemahaman utuh, teknik ini menyusun potongan data mentah jadi satu hasil yang bisa dibaca berurutan.

---

# Hook Psikologis

Tidak ada Inbox dari Raka. Notifikasi sistem murni:

> "ACCESS GRANTED: Police Mail Archive Server. Note: Supervisor Raka status is CURRENTLY UNAVAILABLE. System auto-login initiated."

**Efek psikologis yang dituju:** pemain tidak pernah meminta akses ini, dan tidak dijelaskan siapa yang menyetujuinya. Kombinasi "akses diberikan tanpa diminta" + "Raka tidak tersedia" menciptakan rasa tidak stabil yang sangat berbeda dari kehangatan formal Raka di chapter-chapter sebelumnya — dunia game terasa bergerak sendiri, bukan lagi dipandu.

EMAIL terbuka (app baru, ikon sudah harus ada di Home Screen — lihat perbaikan sebelumnya di `apps.ts`). `files.content` menampilkan struktur arsip: emails, deleted, attachments — dan sebuah catatan yang perlu dipatch karena menyebut CTE eksplisit (lihat Catatan Sinkronisasi #1).

Tidak ada Case Files objective checklist yang jelas di awal chapter ini (beda dari kebanyakan chapter lain) — pemain langsung dilempar ke `emails` tanpa arahan bertahap, konsisten dengan tema "sendirian" yang jadi inti chapter.

---

# Objective Walkthrough (selaras `chapter10.ts` + logic `App.tsx`)

## Objective 1

| | |
|---|---|
| **Story (kode)** | Temukan email yang berkaitan dengan kecelakaan Arunika di tabel emails. |
| **Goal (kode, PERLU DIPATCH)** | `SELECT * FROM emails WHERE subject LIKE '%Arunika%';` |
| **Goal (revisi)** | "Cari email yang berkaitan dengan kecelakaan Arunika (subject mengandung kata 'Arunika') di tabel emails." |
| **Expected SQL** | `SELECT * FROM emails WHERE subject LIKE '%Arunika%';` |

**Detail hook:** Hasil: 4 email dari thread yang sama (thread_id 18) — tapi urutannya berantakan, dan salah satu (ID 204) isinya `body: null`. Pemain harus merasakan kesulitan membaca thread yang tidak berurutan ini sebelum kapabilitas berikutnya diperkenalkan sebagai solusi, bukan fitur tambahan sembarangan.

---

## Scripted Event — Transisi ke Objective 2 (`App.tsx`, PERLU DIPATCH)

Popup Supervisor saat ini: "Archive email sangat berantakan. Gunakan WITH untuk menyusun result bertahap agar lebih mudah dibaca."

Revisi: "Archive email sangat berantakan. Coba susun dulu email yang relevan sebagai hasil sementara, supaya lebih mudah dibaca urutannya."

## Objective 2 — Kapabilitas Baru (Hasil Sementara Bertahap)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Gunakan Common Table Expression (WITH) untuk menyusun email Arunika berdasarkan waktu kirim agar lebih mudah dibaca." |
| **Story (revisi)** | "Archive email ini sangat berantakan. Coba susun dulu email yang berkaitan dengan Arunika sebagai satu kelompok sementara, baru urutkan berdasarkan waktu kirim." |
| **Goal (kode, PERLU DIPATCH)** | `WITH arunika_emails AS (SELECT * FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM arunika_emails ORDER BY sent_at;` |
| **Goal (revisi)** | "Kelompokkan dulu email yang berkaitan dengan Arunika sebagai hasil sementara, lalu tampilkan hasilnya terurut berdasarkan waktu kirim." |
| **Expected SQL** | `WITH arunika_emails AS (SELECT * FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM arunika_emails ORDER BY sent_at;` |

**Detail hook:** Ini pelanggaran paling parah di seluruh audit ("Gunakan Common Table Expression (WITH)" — menyebut nama lengkap teknis DAN singkatannya sekaligus). Setelah dipatch, kapabilitas ini muncul murni dari kebutuhan menyusun ulang thread yang berantakan — persis prinsip yang sudah dipakai konsisten sejak Chapter 3 (JOIN), Chapter 8 (GROUP BY), Chapter 9 (subquery). Hasil setelah diurutkan: 4 email membentuk percakapan yang bisa diikuti — Investigator 52 minta CCTV → IT Dept bilang sebagian hilang → Investigator 52 yakin dihapus sengaja → email ke-4 kosong (`body: null`).

---

## Scripted Event — Transisi ke Objective 3 (`App.tsx`, PERLU DIPATCH)

Popup Supervisor saat ini: "Jika email utama hilang, cek di tabel deleted. Gunakan CTE untuk memproses thread yang sama."

Revisi: "Jika email utama hilang, cek di tabel deleted. Coba kelompokkan dulu hasilnya sebagai langkah sementara."

## Objective 3

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Satu email (ID 204) isinya kosong. Cek apakah ada pesan terakhir yang dihapus di tabel deleted yang memiliki thread_id yang sama (18). Gunakan CTE." |
| **Story (revisi)** | "Satu email (ID 204) isinya kosong. Cek apakah ada pesan terakhir yang dihapus di tabel deleted yang memiliki thread_id yang sama (18) — kelompokkan dulu hasil pencarian di tabel deleted sebagai langkah sementara." |
| **Goal (kode, PERLU DIPATCH)** | `WITH deleted_mail AS (SELECT * FROM deleted WHERE thread_id=18) SELECT * FROM deleted_mail;` |
| **Goal (revisi)** | "Kelompokkan dulu pesan di tabel deleted dengan thread_id 18 sebagai hasil sementara, lalu tampilkan isinya." |
| **Expected SQL** | `WITH deleted_mail AS (SELECT * FROM deleted WHERE thread_id=18) SELECT * FROM deleted_mail;` |

**Detail hook:** Hasil: 1 email yang berhasil dipulihkan, status "Recovered Message". Isinya terpotong/rusak sebagian: "Jika sesuatu terjadi pada saya... Jangan percaya pada sistem ini. Seseorang di dalam membantu Arunika. [corrupted]" — kalimat ini menggemakan catatan Digital Notebook dari Chapter 9 ("Jangan percaya database. Percayalah pada ketidakkonsistenannya.") — investigator yang sama, ketakutan yang sama, dua chapter berbeda. Pemain yang ingat Chapter 9 akan merasakan koneksi ini sendiri, tanpa perlu dialog yang menghubungkannya secara eksplisit.

---

## Scripted Event — Transisi ke Objective 4 (`App.tsx`, PERLU DIPATCH)

Popup Supervisor saat ini: "Pesan itu terpotong. Cek lampiran (attachments) yang berkaitan dengan email Arunika menggunakan CTE dan subquery."

Revisi: "Pesan itu terpotong. Cek lampiran (attachments) yang berkaitan dengan email Arunika — kelompokkan dulu ID email yang relevan sebagai langkah awal."

## Objective 4

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | "Sekarang cari lampiran (attachments) yang berkaitan dengan email Arunika menggunakan CTE dan subquery." |
| **Story (revisi)** | "Sekarang cari lampiran (attachments) yang berkaitan dengan email Arunika — kelompokkan dulu ID email yang relevan sebagai langkah sementara, baru cocokkan dengan tabel attachments." |
| **Goal (kode, PERLU DIPATCH)** | `WITH suspicious_email AS (SELECT id FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM attachments WHERE email_id IN (SELECT id FROM suspicious_email);` |
| **Goal (revisi)** | "Kelompokkan dulu ID email yang berkaitan dengan Arunika sebagai hasil sementara, lalu cari attachments yang email_id-nya cocok dengan hasil tersebut." |
| **Expected SQL** | `WITH suspicious_email AS (SELECT id FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM attachments WHERE email_id IN (SELECT id FROM suspicious_email);` |

**Detail hook:** Ini titik puncak chapter — hasil: 3 lampiran (`warehouse_plan.pdf`, `employee_list.csv`, `camera_maintenance.xlsx`). Nama file ketiga ini adalah pembayaran langsung dari thread yang ditanam sejak Chapter 5: jadwal maintenance kamera. Pemain yang mengingat "kamera mati 6 menit" dari Chapter 5 akan langsung mengenali signifikansinya begitu melihat nama file ini — momen "anjir" yang murni lahir dari memori pemain sendiri, bukan dari penjelasan game.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** REPORT (dipicu otomatis lewat scripted event setelah Objective 4, bukan lewat Case Files manual)

Pertanyaan langsung (beda formatnya dari kebanyakan chapter lain — bukan "kesimpulan mana yang tepat", tapi "apa temuan terpenting"):
- Kamera benar-benar rusak karena petir.
- Kamera sedang dalam perbaikan rutin selama sebulan.
- **Kamera sengaja dijadwalkan mati (maintenance) tepat saat Budi hilang (11:24-11:31). Ini bukan kerusakan teknis, melainkan sabotase yang direncanakan.** ← jawaban benar
- Tidak ada data maintenance.

**Scripted event sebelum Report (`App.tsx`, nextIdx===4 — sudah bersih, tidak perlu diubah):** Popup Supervisor menampilkan jadwal maintenance persis (11:24 Start, 11:31 End) — angka ini adalah pembayaran langsung dari "enam menit yang hilang" di Chapter 5. Popup ini tidak menyebut nama sintaks apapun, tidak perlu dipatch.

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> "Semua clue mulai terhubung. Kamera tidak rusak. Kamera dijadwalkan mati. Seseorang di kepolisian atau IT Dept bekerja sama dengan Arunika. Dan sekarang... Supervisor Raka hilang."

**Detail hook:** Kalimat terakhir ("Supervisor Raka hilang") adalah eskalasi personal tertinggi sejak Chapter 8 ("STOP OR HE DIES") — bedanya, di sini tidak ada ancaman eksplisit, cuma pernyataan fakta dingin yang dibiarkan menggantung tanpa penjelasan lebih lanjut. Sama seperti Chapter 9, `conclusion` ini tidak diawali "Supervisor Raka:" — konsisten dengan pola kesunyian yang meningkat di dua chapter terakhir.

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter10.ts` (4 objective) **dan** logic bespoke `App.tsx` (3 dari 4 popup transisi perlu di-patch, nextIdx===4 sudah bersih).
* [x] Seluruh `goal` field diubah dari query SQL literal jadi deskripsi bahasa natural.
* [x] "CTE"/"WITH"/"Common Table Expression"/"subquery" dihapus dari 6 lokasi (files.content, 3 story field, 3 popup App.tsx).
* [x] Koneksi naratif ke Chapter 9 (catatan investigator) dan Chapter 5 (kamera 6 menit) didokumentasikan eksplisit sebagai momen yang harus lahir dari memori pemain, bukan dijelaskan ulang.
* [x] Temuan "Gunakan LEAD()" di blok Chapter 11 dicatat, tidak dikerjakan sekarang.
* [x] `EmailScreen.tsx` dikonfirmasi sudah diperbaiki di sesi sebelumnya.

---

# Shadows / Patch Instruksi Track B

```
1. Di file src/game/levels/case001/chapter10.ts:

a) Field files.content — ganti baris:
"NOTICE: Access to deleted items is restricted. Use temporary views or CTEs for complex reconstruction."
menjadi:
"NOTICE: Access to deleted items is restricted. Complex reconstruction may require combining multiple queries in stages."

b) Objective id: 1, field goal — ganti dari:
"SELECT * FROM emails WHERE subject LIKE '%Arunika%';"
menjadi:
"Cari email yang berkaitan dengan kecelakaan Arunika (subject mengandung kata 'Arunika') di tabel emails."

c) Objective id: 2, field story — ganti dari:
"Gunakan Common Table Expression (WITH) untuk menyusun email Arunika berdasarkan waktu kirim agar lebih mudah dibaca."
menjadi:
"Archive email ini sangat berantakan. Coba susun dulu email yang berkaitan dengan Arunika sebagai satu kelompok sementara, baru urutkan berdasarkan waktu kirim."

d) Objective id: 2, field goal — ganti dari:
"WITH arunika_emails AS (SELECT * FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM arunika_emails ORDER BY sent_at;"
menjadi:
"Kelompokkan dulu email yang berkaitan dengan Arunika sebagai hasil sementara, lalu tampilkan hasilnya terurut berdasarkan waktu kirim."

e) Objective id: 3, field story — ganti dari:
"Satu email (ID 204) isinya kosong. Cek apakah ada pesan terakhir yang dihapus di tabel deleted yang memiliki thread_id yang sama (18). Gunakan CTE."
menjadi:
"Satu email (ID 204) isinya kosong. Cek apakah ada pesan terakhir yang dihapus di tabel deleted yang memiliki thread_id yang sama (18) — kelompokkan dulu hasil pencarian di tabel deleted sebagai langkah sementara."

f) Objective id: 3, field goal — ganti dari:
"WITH deleted_mail AS (SELECT * FROM deleted WHERE thread_id=18) SELECT * FROM deleted_mail;"
menjadi:
"Kelompokkan dulu pesan di tabel deleted dengan thread_id 18 sebagai hasil sementara, lalu tampilkan isinya."

g) Objective id: 4, field story — ganti dari:
"Sekarang cari lampiran (attachments) yang berkaitan dengan email Arunika menggunakan CTE dan subquery."
menjadi:
"Sekarang cari lampiran (attachments) yang berkaitan dengan email Arunika — kelompokkan dulu ID email yang relevan sebagai langkah sementara, baru cocokkan dengan tabel attachments."

h) Objective id: 4, field goal — ganti dari:
"WITH suspicious_email AS (SELECT id FROM emails WHERE subject LIKE '%Arunika%') SELECT * FROM attachments WHERE email_id IN (SELECT id FROM suspicious_email);"
menjadi:
"Kelompokkan dulu ID email yang berkaitan dengan Arunika sebagai hasil sementara, lalu cari attachments yang email_id-nya cocok dengan hasil tersebut."

i) Field report.conclusion — hapus baris "Reward: +850 XP" dan "Rank: Senior Digital Investigator" sepenuhnya. Ubah baris "Unlocked: Email Database, CTE (WITH), Recovered Deleted Mail" menjadi "Unlocked: Email Database, Recovered Deleted Mail". JANGAN tambahkan "Supervisor Raka:" di awal conclusion — ketiadaannya sudah sesuai desain (sama seperti Chapter 9).

2. Di file src/App.tsx, cari blok kondisi "else if (currentLevelId === 10)" (sekitar baris 916-935):

a) Di dalam "if (nextIdx === 1)", ubah pesan showSupervisorPopup dari:
'Archive email sangat berantakan. Gunakan WITH untuk menyusun result bertahap agar lebih mudah dibaca.'
menjadi:
'Archive email sangat berantakan. Coba susun dulu email yang relevan sebagai hasil sementara, supaya lebih mudah dibaca urutannya.'

b) Di dalam "else if (nextIdx === 2)", ubah pesan showSupervisorPopup dari:
'Jika email utama hilang, cek di tabel deleted. Gunakan CTE untuk memproses thread yang sama.'
menjadi:
'Jika email utama hilang, cek di tabel deleted. Coba kelompokkan dulu hasilnya sebagai langkah sementara.'

c) Di dalam "else if (nextIdx === 3)", ubah pesan showSupervisorPopup dari:
'Pesan itu terpotong. Cek lampiran (attachments) yang berkaitan dengan email Arunika menggunakan CTE dan subquery.'
menjadi:
'Pesan itu terpotong. Cek lampiran (attachments) yang berkaitan dengan email Arunika — kelompokkan dulu ID email yang relevan sebagai langkah awal.'

Blok "else if (nextIdx === 4)" TIDAK perlu diubah — sudah bersih, tidak menyebut nama sintaks.

Setelah semua perubahan, konfirmasi tidak ada lagi kata "CTE", "WITH" (sebagai penyebutan teknik), "Common Table Expression", atau "subquery" yang muncul di dialog/story/goal/popup/files manapun yang tampil ke pemain di seluruh chapter10.ts dan blok App.tsx untuk level 10 (kata-kata itu boleh tetap ada di availableTokens dan validateResult).
```
