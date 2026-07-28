# GDD_C002_CHAPTER_01.md

**Chapter:** 1 — Rutinitas yang Terganggu (menggabungkan PU01 "Routine Interrupted" + PU02 "The First Inconsistency" dari draft GDD asli)
**Version:** 2.0 — disederhanakan ke pola SQL standar Case001, siap implementasi
**Status:** SIAP IMPLEMENTASI
**Classification:** Chapter GDD — CASE #002
**Sumber:** `GDD_CASE002_CH01_PU1.md` + `GDD_C002_CH01_PU2.md` (draft asli, disesuaikan)

---

# Catatan Sinkronisasi v2.0

v1.0 sempat mengusulkan mekanisme baru (`Objective.type: 'browse'`, `Level.report` opsional) supaya persis ngikutin draft GDD asli yang "player cuma klik tanpa nulis SQL, tanpa report di akhir". **Dibatalkan** — diganti pola standar Case001: 4 objective tetap SQL (`SELECT * FROM <tabel>;`, paling sederhana, gak ada WHERE/JOIN), chapter ditutup lewat Report/pilihan ganda biasa. Konsekuensinya:

- **Tidak ada perubahan ke `types.ts` sama sekali.** `Objective` dan `Level` tetap struktur asli Case001, 100% kompatibel.
- Tema "datanya benar, hubungannya yang salah" tetap tersampaikan — bukan lewat larangan nulis SQL, tapi lewat ISI data & pilihan jawaban di Report (lihat bagian Penutup Chapter).
- Ini juga nyederhanain wiring: chapter1.ts Case002 bisa langsung disambung ke pola `LEVELS` array yang sama persis kayak Case001 chapter manapun, gak butuh jalur App.tsx baru.

**Perubahan ID:** Chapter ini `id: 13` (bukan `id: 1`) — lanjut dari Case001 yang berhenti di 12, bukan reset. Detail alasan & wiring `levels.ts` ada di bagian akhir dokumen ini.

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 1 — Observe (`SELECT * FROM <tabel>;` polos, 4x, tanpa WHERE/JOIN) |
| Teknik SQL dipakai | `SELECT *` doang — paling sederhana yang ada di seluruh curriculum, cocok buat chapter observasi pertama |
| Tabel database | `vehicle`, `owner` (chapter-lokal, seed baru Case002) + `address`, `sync_log` (dari `masterRegistry.ts`, entry pertama Case002) |
| App/menu terlibat | INBOX, CONTACTS (dialog Raka baru), CASE_FILES, NOTEBOOK, DB_LIST, TERM, RESULT, REPORT — semua udah ada dari Case001, tidak ada app baru dibuka |
| Report/Closing | Ada, pola standar (lihat Penutup Chapter) |
| Rule of Three Answers | Terjawab: apa isi laporan kecil yang dimaksud Raka (data kendaraan berubah pasca-sinkronisasi). Fakta baru: semua indikator sistem bilang NORMAL, tapi ada 1 kendaraan dengan alamat yang gak sinkron ke Owner Registry. Pertanyaan baru: kalau sinkronisasi sukses total, kenapa hasilnya bisa beda? |

---

# Latar Belakang Naratif

Tiga minggu setelah Case #001 ditutup. Unit Investigasi Digital balik ke rutinitas — sebagian besar laporan yang masuk cuma kesalahan administrasi biasa. Raka nerima 1 laporan dari Divisi Administrasi Database: "beberapa hubungan data kendaraan berubah setelah sinkronisasi malam." Tim IT udah nganggep ini bug sinkronisasi biasa, siap ditutup.

Raka gak langsung setuju nutup tiketnya — bukan karena laporannya keliatan besar, justru karena **kelewat kecil**. Ini titik penting buat dinamika baru Raka-Player: dia gak lagi ngasih instruksi step-by-step kayak Case001 awal ("jangan mengecewakan saya"), dia sekarang ngajak Player buat liat sendiri dan mikir bareng — mentor & partner, bukan atasan & anak buah baru.

Di ruang investigasi kecil, dashboard sinkronisasi nunjukkin SEMUA hijau: checksum cocok, integrity check lolos, replication sukses. Gak ada 1 pun indikator gagal. Tapi laporan Administrasi tetep nyebut 3 hal aneh: kendaraan pindah alamat, nomor telepon saksi berubah, riwayat parkir gak sesuai. Raka: "Aneh... Kalau sistem bilang semuanya normal, kenapa mereka sampai kirim laporan?"

Player disuruh liat sendiri. Buka Vehicle Registry — normal. Owner Registry — normal. Baru di Address Registry ketauan: 1 kendaraan masih pake alamat lama, padahal Owner Registry udah nunjukkin alamat baru. Gak ada conflict system, gak ada error — cuma beda. Sync History pun nunjukkin semua SUCCESS, gak ada rollback, gak ada corrupt data.

Raka nutup dengan kalimat penting: *"Bertahun-tahun aku nangani database. Kalau ada bug, biasanya sistem ninggalin bekas. Tapi ini kelewat bersih."* — fondasi tema Case002: **data yang benar bisa tetep menghasilkan kesimpulan yang salah, kalau hubungannya yang dimanipulasi, bukan datanya.**

---

# Hook Psikologis

Target emosi PU1 (dari GDD asli): Curiosity 90%, Comfort 70%, Suspicion 30%, Urgency 10% — chapter ini SENGAJA lambat, gak boleh kerasa genting. Player harus ngerasa "hari ini biasa aja" duluan sebelum "ini agak aneh" muncul pelan-pelan.

Target emosi PU2: Curiosity naik ke 95%, Suspicion naik ke 60%, Comfort turun ke 40%. Pergeseran mindset yang harus kerasa (bukan dinyatain lewat dialog eksplisit, tapi lewat pacing): "Ini pasti bug" → "...sebentar" → "Ini gak mungkin bug."

**Detail penting yang wajib dijaga pas implementasi:** JANGAN kasih indikator visual apapun (warna merah, ikon warning, badge error) di data yang "salah". Kekuatan chapter ini justru dari SISTEM yang bilang semua normal — Player sendiri yang harus notice kejanggalannya dari baca manual, gak dibantu UI. Ini prinsip yang sama kayak "jangan highlight baris yang cocok" di Case001 Ch1, tapi levelnya lebih tinggi di sini: bahkan gak ada 1 pun sinyal sistem yang salah — beneran cuma insting player.

---

# Objective Walkthrough (selaras `chapter1.ts` Case002)

## Pra-Objective — Inbox & Dialog Raka (non-SQL)

Alur standar `hasAcceptedMission` yang udah ada, plus 1 dialog baru via `CallingScreen`.

1. `mail.body` — pesan Raka masuk ke Inbox (lihat isi di kode).
2. Player accept mission (`handleAcceptMission`) — popup unlock standar, **tanpa** embel-embel "New query capabilities" (chapter ini gak ngenalin kapabilitas SQL baru, cuma `SELECT *` yang udah dikenal sejak Case001).
3. **Dialog baru:** Player buka CONTACTS → panggil Raka → dialog singkat (pola sama kayak `DINA_DIALOGUE`). Isi: *"Aku harap ini cuma bug. Kalau benar bug, selesai hari ini. Kalau bukan... kita jangan membuat orang yang melakukannya sadar."*

**Penting:** GDD nekenin "no waypoint, no highlight" — Player harus inisiatif sendiri buka Contacts, bukan dituntun popup "sekarang telepon Raka".

---

## Objective 1 — Vehicle Registry

| | |
|---|---|
| **Story** | "Raka minta kamu lihat sendiri laporannya. Mulai dari data kendaraan." |
| **Goal** | "Lihat seluruh data kendaraan di tabel vehicle." |
| **Expected SQL** | `SELECT * FROM vehicle;` |
| **Hasil valid** | 3 baris |

**Detail hook:** Semua kolom normal: `vehicle_plate`, `owner_id`, `brand`, `status`, `registered_address`. Termasuk 1 baris kunci: plat `D 4123 QX`, `owner_id: 501`, `registered_address: 'Jl. Melur Lama No. 9'` — belum ada apapun yang keliatan aneh di titik ini, cuma bekal buat Objective 3.

---

## Objective 2 — Owner Registry

| | |
|---|---|
| **Story** | "Bandingkan dengan data pemiliknya." |
| **Goal** | "Lihat seluruh data pemilik kendaraan di tabel owner." |
| **Expected SQL** | `SELECT * FROM owner;` |
| **Hasil valid** | 3 baris |

**Detail hook:** `owner_id: 501` punya `address: 'Jl. Melur Baru No. 21'` — beda dari `registered_address` di Objective 1. Belum ada yang eksplisit nyuruh Player bandingin; murni ngandelin Player notice sendiri.

---

## Objective 3 — Address Registry (titik reveal)

| | |
|---|---|
| **Story** | "Sistem mencatat riwayat alamat secara terpisah. Mungkin ada jawabannya di sana." |
| **Goal** | "Lihat riwayat alamat di tabel address." |
| **Expected SQL** | `SELECT * FROM address;` |
| **Hasil valid** | 2 baris |

**Detail hook:** 2 entri buat `linked_entity_id: 501` — satu `'Jl. Melur Lama No. 9'`, satu lagi `'Jl. Melur Baru No. 21'`. Player sekarang punya 3 sumber data yang semua "benar" secara individual, tapi gak sinkron satu sama lain.

**Setelah objective ini:** Notebook otomatis keisi: *"Tabelnya benar. Hubungannya yang salah."* — kalimat kunci dari GDD asli, jangan diubah, ini fondasi tema Case002.

---

## Objective 4 — Sync History

| | |
|---|---|
| **Story** | "Cek juga log sinkronisasinya. Kalau ada bug, biasanya kelihatan di sini." |
| **Goal** | "Lihat log sinkronisasi di tabel sync_log." |
| **Expected SQL** | `SELECT * FROM sync_log;` |
| **Hasil valid** | 2 baris, semua `status: 'SUCCESS'` |

**Detail hook:** Semua baris `status: 'SUCCESS'`, `integrity_check: 'PASS'`, `replication: 'PASS'`. Gak ada satupun tanda kegagalan — inilah yang bikin Raka bilang "kelewat bersih".

---

# Penutup Chapter — Report Submission

**App/Menu terlibat:** CASE_FILES → Submit Report (pola standar Case001, `ReportScreen` + `handleReportSelect`)

4 opsi:
- Ini murni bug sinkronisasi seperti yang dilaporkan tim IT.
- **Data di setiap tabel valid, tapi hubungan antar data tidak konsisten — kemungkinan bukan bug biasa.** ← jawaban benar
- Sistem sinkronisasi mengalami kegagalan yang belum terdeteksi.
- Data pemilik kendaraan salah dimasukkan oleh admin.

**Detail hook — opsi jebakan:** Opsi ketiga ("kegagalan belum terdeteksi") sengaja mirip jawaban benar tapi nyimpulin ada BUG tersembunyi — padahal `sync_log` udah eksplisit nunjukkin semua PASS, gak ada dasar buat nyimpulin kegagalan sistem. Opsi keempat nyalahin human error administratif — juga gak didukung data manapun (gak ada indikasi siapa yang "salah input"). Kedua opsi ini melatih Player buat gak buru-buru nyimpulin dari asumsi ("pasti ada yang gagal di suatu tempat") tanpa bukti eksplisit.

**Twist penutup:**

> Supervisor Raka: "Bertahun-tahun aku menangani database. Kalau ada bug, biasanya sistem meninggalkan bekas. Tapi ini terlalu bersih. Ini bukan kesalahan, Ini keputusan. Ayo kita cari tahu apa lagi yang terlihat normal, padahal tidak."

---

# Definition of Done Check

* [ ] Selaras 1:1 dengan `chapter1.ts` Case002 (4 objective, semua `SELECT * FROM <tabel>;`).
* [ ] Tidak ada perubahan ke `types.ts` — struktur `Objective`/`Level` tetap identik Case001.
* [ ] Dialog Raka baru (`CallingScreen.tsx`) buat Case002 Chapter 1 ditambahin dengan pola sama kayak `DINA_DIALOGUE`.
* [ ] Tabel `address` dan `sync_log` diimpor dari `masterRegistry.ts` (baru), bukan didefinisikan lokal di `chapter1.ts`.
* [ ] Gak ada indikator visual (warna/ikon) yang nge-highlight data yang gak sinkron — murni teks apa adanya.
* [ ] Gak ada penyebutan sintaks SQL apapun di `story`/`goal`/dialog (Article 4) — `goal` tetap deskripsi natural language walau expected SQL-nya cuma `SELECT *`.
* [ ] `id: 13`, bukan `id: 1` — lihat bagian ID & wiring di bawah.

---

# ID & Wiring `levels.ts`

**Keputusan:** ID Case002 lanjut dari Case001, bukan reset. Case001 pakai 1-12, jadi Chapter 1 Case002 = **`id: 13`**, Chapter 2 = `id: 14`, dst sampai Chapter 16 = `id: 28`.

**Kenapa bukan ID string/case-prefixed:** `currentLevelId` dipakai sebagai `number` di puluhan perbandingan (`currentLevelId === 5`, dst) di seluruh `App.tsx`. Ganti ke string berarti nyentuh semua itu — resiko tinggi, manfaat kecil. Lanjut angka jauh lebih murah dan zero-refactor ke logic existing.

**Field baru (opsional, non-breaking):** `Level` dapet `caseId?: string` (misal `'CASE001'` / `'CASE002'`) — dipakai murni buat display (judul grup di Settings chapter list, badge "CASE #002" di UI), BUKAN buat logic progresi. Semua chapter Case001 yang udah ada gak perlu diisi field ini (opsional = default undefined, aman).

**Konsekuensi positif:** progression tetap jalan natural tanpa logic baru — selesai Case001 ch12 → `unlockedLevelIds` nambah 13 → itu udah Chapter 1 Case002. Gak ada "case selector" terpisah yang perlu dibangun.

**Catatan buat transisi antar-objective:** JANGAN nambah `else if (currentLevelId === 13)` ke rantai if/else raksasa di `handleObjectiveComplete` (pola lama Case001). Case002 pakai `OBJECTIVE_TRANSITIONS` registry (`objectiveTransitions.ts`, keyed by `(chapterId, nextIdx)`) — pola matang dari refactor Case001 yang udah diputuskan jadi mandatory buat Case002.
