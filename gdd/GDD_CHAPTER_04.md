# GDD_CHAPTER_04.md

**Chapter:** 4 — Delapan Menit
**Version:** 2.0 — disinkronkan ke struktur kode aktual (`chapter4.ts` + `App.tsx`)
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | Objective 1 `goal`: **"Gunakan BETWEEN untuk mencari..."** — field `goal` terkonfirmasi tampil langsung ke pemain (`TerminalScreen.tsx` baris 39), jadi ini pelanggaran Article 4 yang benar-benar terlihat di layar | **Perlu di-patch** — lihat instruksi Track B. |
| 2 | Objective 2 `story`: **"Masih ingat JOIN?"** | **Perlu di-patch.** |
| 3 | Objective 6 `goal`: **"Lakukan triple JOIN antara..."** | **Perlu di-patch.** |
| 4 | Popup unlock `App.tsx` (chapterId 4): "New query capabilities unlocked: BETWEEN, Multi-Table JOINs" | **Perlu di-patch.** |
| 5 | `report.conclusion` — `+220 XP`, `Rank: Investigator`, `Unlocked: Timeline, Multi JOIN, BETWEEN` | **Perlu di-patch** — pola sama seperti Ch1-3. |
| 6 | Data parkir `B2841PT` di Chapter 3 (`entry_time: '11:26'`) beda dengan Chapter 4 (`entry_time: '09:15'`) — sempat dicurigai bug | **Bukan bug.** `mail.body` Chapter 4 eksplisit bilang "log parkir rumah sakit yang **lebih lengkap**" — perubahan data ini dijustifikasi oleh cerita sendiri (data direvisi jadi lebih detail, bukan kontradiksi). Tidak perlu diubah. |

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 3-4 transisi — Connecting Information → Building Hypothesis |
| Teknik SQL dipakai | `BETWEEN` (baru), JOIN (pengulangan dari Ch3), **triple JOIN** (JOIN 3 tabel sekaligus, baru) |
| Tabel database | `visitors`, `patients`, `citizens`, `vehicles`, `parking` (semua tabel lama, terisi data lebih lengkap dari sebelumnya) |
| App/menu terlibat | INBOX, CASE_FILES, DB_LIST — **TIMELINE dibuka chapter ini** (`chapterId >= 4` di `App.tsx` baris 327, dikonfirmasi 3 trigger redundan yang saling menjaga konsistensi) |
| Rule of Three Answers | Terjawab: siapa lagi yang menemui Rizky di waktu yang sama (Rudi Hartono). Fakta baru: Rudi tidak punya kendaraan terdaftar sendiri, dan tiga kendaraan berbeda keluar di rentang waktu yang mencurigakan — kendaraan Andi paling menonjol. Pertanyaan baru: kalau Budi masuk 09:20, kenapa mobil Andi baru keluar dua jam kemudian? Di mana Budi selama itu? |

---

# Hook

INBOX masuk dari Supervisor Raka — nadanya berbeda dari 3 chapter sebelumnya, lebih reflektif daripada instruktif:

> "Semalam kami mencoba melacak kendaraan Andi Prasetyo. Mobilnya belum ditemukan. Tapi kami mendapatkan log parkir rumah sakit yang lebih lengkap. Saya merasa ada sesuatu yang terlewat. Coba susun kembali seluruh kejadian hari itu."

**Detail hook:** Kalimat "saya merasa ada sesuatu yang terlewat" itu penting — ini pertama kalinya Supervisor secara eksplisit mengakui dia sendiri tidak yakin, bukan cuma memberi instruksi. Nada berubah dari "aku tahu apa yang harus kamu lakukan" jadi "aku juga sedang meraba-raba" — mempersiapkan pemain untuk pola yang akan makin sering muncul: Supervisor bukan orang yang selalu tahu jawabannya.

**TIMELINE terbuka di titik ini** — app baru pertama sejak Chapter 2 (Witnesses). Beda dari WITNESSES yang unlock diam-diam di tengah chapter, TIMELINE diumumkan eksplisit lewat `mail.body` ("NEW FEATURE: Timeline") sebagai bagian dari pesan Supervisor sendiri — treat ini sebagai pengenalan yang lebih formal, cocok karena Timeline memang alat yang akan dipakai terus-menerus mulai sekarang, bukan sekadar penyimpan data pasif seperti Witnesses.

CASE_FILES menampilkan 3 target sekaligus (beda dari chapter-chapter sebelumnya yang biasanya 1 tujuan linear): susun kronologi, cari siapa saja di lokasi yang sama, tentukan siapa yang mungkin bertemu Budi. Tiga target ini sengaja dibuka bersamaan di awal — chapter ini tentang investigasi yang bercabang, bukan garis lurus.

---

# Objective Walkthrough (selaras `chapter4.ts`)

## Objective 1 — Kapabilitas Baru (BETWEEN)

| | |
|---|---|
| **Story (kode)** | Cari siapa saja yang berada di rumah sakit antara pukul 09:00 dan 09:30. |
| **Goal (kode, PERLU DIPATCH)** | ~~"Gunakan BETWEEN untuk mencari pengunjung di rentang waktu '09:00' dan '09:30' pada tabel visitors."~~ |
| **Goal (revisi)** | "Cari semua pengunjung yang datang di rentang waktu 09:00 sampai 09:30 pada tabel visitors." |
| **Expected SQL** | `SELECT * FROM visitors WHERE visit_time BETWEEN '09:00' AND '09:30';` |

**Detail hook:** Kapabilitas rentang waktu (`BETWEEN`) diperkenalkan lewat kebutuhan yang sangat konkret — pemain tahu Budi datang 09:20, tapi pertanyaan barunya "siapa lagi di sekitar waktu itu" tidak bisa dijawab dengan `WHERE visit_time = ...` (butuh kecocokan persis). Ini pertama kalinya pemain butuh pencarian rentang, bukan pencarian pasti — kebutuhan yang muncul wajar dari pertanyaan investigasi, bukan diperkenalkan sebagai materi. Hasil: 3 pengunjung — Budi (09:20), Maya Putri (09:11), **Rudi Hartono** (09:24, nama baru).

---

## Objective 2 — Terapkan Ulang Kapabilitas Lama (JOIN + BETWEEN)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Jangan fokus ke orangnya. Fokus ke pasien yang mereka kunjungi. Masih ingat JOIN?"~~ |
| **Story (revisi)** | "Jangan fokus ke orangnya. Fokus ke pasien yang mereka kunjungi." |
| **Goal (kode)** | Hubungkan tabel visitors dan patients berdasarkan patient_id untuk melihat siapa menemui siapa di rentang waktu tersebut. |
| **Expected SQL** | `SELECT v.visitor_name, p.name, v.visit_time FROM visitors v JOIN patients p ON v.patient_id = p.id WHERE visit_time BETWEEN '09:00' AND '09:30';` |

**Detail hook:** Ini bukan kapabilitas baru — pemain menggabungkan dua teknik yang sudah dikuasai terpisah (JOIN dari Ch3, BETWEEN dari Objective 1 chapter ini) jadi satu query. Reveal-nya jauh lebih penting dari teknik SQL-nya: **Rudi Hartono ternyata menemui pasien yang sama dengan Budi** — Rizky Hidayat. Sampai titik ini pemain cuma tahu "beberapa orang ada di lokasi yang sama"; sekarang jadi jelas mereka semua terhubung ke satu pasien yang sama.

---

## Objective 3

| | |
|---|---|
| **Story (kode)** | Rudi Hartono ternyata mengunjungi pasien yang sama dengan Budi. Cari identitas Rudi Hartono. |
| **Goal (kode)** | Cari data Rudi Hartono di tabel citizens. |
| **Expected SQL** | `SELECT * FROM citizens WHERE name = 'Rudi Hartono';` |

**Detail hook:** Data yang keluar sengaja minim — status ACTIVE, tapi telepon dan alamat tidak lengkap dibanding entri citizens lain. Jangan beri komentar eksplisit soal ini di layar manapun ("data mencurigakan!") — biarkan kejanggalan itu terlihat murni dari kekosongan kolom, konsisten dengan prinsip "ketiadaan data adalah petunjuk" yang nanti jadi tema besar Chapter 5.

---

## Objective 4

| | |
|---|---|
| **Story (kode)** | Data Rudi sangat minim. Bagaimana kalau Rudi memiliki kendaraan terdaftar? Coba periksa. |
| **Goal (kode)** | Hubungkan citizens dan vehicles untuk mencari plat nomor kendaraan Rudi Hartono. |
| **Expected SQL** | `SELECT c.name, v.plate_number FROM citizens c JOIN vehicles v ON c.id = v.owner_id WHERE c.name = 'Rudi Hartono';` |

**Detail hook:** Hasil: **0 baris**. Ini query pertama di seluruh CASE #001 yang secara sengaja dirancang untuk menghasilkan hasil kosong sebagai jawaban yang benar (`validateResult` chapter ini secara eksplisit mengecek `res.length === 0`) — bukan kegagalan pemain, tapi temuan itu sendiri. Rudi tidak punya kendaraan. Pastikan UI hasil kosong di sini tetap netral (lihat UI_MICROINTERACTIONS_SPEC §5 — tidak ada warna merah/ikon gagal), karena hasil kosong ini justru jawaban yang dicari.

---

## Objective 5

| | |
|---|---|
| **Story (kode)** | Rudi tidak memiliki kendaraan pribadi terdaftar. Atau dia memakai kendaraan orang lain. Cari semua kendaraan yang keluar sekitar pukul 11:30. |
| **Goal (kode)** | Query tabel parking untuk mencari semua kendaraan yang keluar antara pukul 11:25 dan 11:40. |
| **Expected SQL** | `SELECT * FROM parking WHERE exit_time BETWEEN '11:25' AND '11:40';` |

**Detail hook:** Hasil: 3 kendaraan. Pemain sekarang punya 3 plat nomor tapi belum tahu pemiliknya — persis situasi yang butuh triple JOIN di objective berikutnya. Biarkan pemain merasakan dulu keterbatasan ini (3 baris data mentah tanpa nama pemilik) sebelum kapabilitas baru diperkenalkan.

---

## Objective 6 — Kapabilitas Baru (Triple JOIN)

| | |
|---|---|
| **Story (kode)** | Ada tiga kendaraan. Sekarang hubungkan semuanya untuk mengetahui siapa pemilik dari kendaraan-kendaraan tersebut. |
| **Goal (kode, PERLU DIPATCH)** | ~~"Lakukan triple JOIN antara parking (alias p), vehicles (alias v), dan citizens (alias c) untuk menampilkan nama pemilik, plat nomor, dan waktu keluar untuk kendaraan yang keluar di rentang waktu tersebut."~~ |
| **Goal (revisi)** | "Hubungkan tabel parking (alias p), vehicles (alias v), dan citizens (alias c) sekaligus untuk menampilkan nama pemilik, plat nomor, dan waktu keluar dari ketiga kendaraan tersebut." |
| **Expected SQL** | `SELECT c.name, v.plate_number, p.exit_time FROM parking p JOIN vehicles v ON p.plate_number = v.plate_number JOIN citizens c ON v.owner_id = c.id WHERE p.exit_time BETWEEN '11:25' AND '11:40';` |

**Detail hook:** This is the most complex query requested so far — 3 tables at once. But conceptually it's not a huge leap from JOINing 2 tables: players just connect one more JOIN to the pattern they've already mastered. Results: Andi Prasetyo, Linda Wijaya, PT Medika Nusantara — and Andi becomes the only name players already recognize from previous chapters, automatically standing out without any visual highlight.

**Timeline update (automatic):** After this objective, the Timeline is filled: 09:20 Budi enters → 11:30 Rizky exits → 11:34 Andi's car exits. This is the first use of the Timeline as a visual representation, rather than just an empty app.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

Pertanyaan: "Siapa orang mencurigakan yang juga menemui Rizky?"
- Maya Putri
- **Rudi Hartono** ← jawaban benar
- Siska

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Kronologi berhasil disusun. Rudi juga menemui Rizky. Tiga kendaraan keluar sekitar waktu Rizky pulang. Kendaraan Andi adalah yang paling mencurigakan."
>
> Unknown Number: "Kamu terlalu lambat. Kalau ingin menemukan Budi... cari tempat yang tidak pernah tercatat di database."

**Detail hook:** Ini pesan ancaman anonim **pertama** di seluruh CASE #001 — eskalasi penting dari chapter-chapter sebelumnya yang cuma berisi laporan dan instruksi resmi. Pastikan pesan ini render dengan visual yang beda dari pesan Supervisor (ikuti pola badge/notifikasi berbeda, UI_MICROINTERACTIONS_SPEC §2 — badge warna beda untuk pesan ancaman/anonim). Kalimat "cari tempat yang tidak pernah tercatat di database" itu sendiri adalah petunjuk terselubung ke arah Chapter 6-7 (Browser/arsip publik, Maps) — pemain belum bisa bertindak atas ini sekarang, murni ditanam untuk nanti.

---

# Definition of Done Check

* [x] Selaras 1:1 dengan struktur `chapter4.ts` (6 objective).
* [x] Semua penyebutan eksplisit nama sintaks (BETWEEN, JOIN, "triple JOIN") di `goal`/`story` diperbaiki — dikonfirmasi field `goal` benar-benar tampil ke pemain di UI.
* [x] Objective 4 (hasil kosong) didokumentasikan eksplisit sebagai jawaban yang benar, bukan kegagalan — selaras Failure Philosophy.
* [x] TIMELINE unlock dicatat sebagai app baru chapter ini, dikonfirmasi dari 3 trigger redundan di kode.
* [x] Pesan ancaman anonim pertama diberi catatan UI khusus (beda dari pesan resmi Supervisor).
* [x] Tidak ada mekanik XP/Rank di GDD — instruksi patch kode disiapkan di bawah.
* [x] Temuan "TUTORIAL popup INNER/LEFT JOIN" dicatat untuk Chapter 5, tidak dikerjakan di sini.

---
