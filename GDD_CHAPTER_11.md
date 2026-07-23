# GDD_CHAPTER_11.md

**Chapter:** 11 — Jejak Terakhir
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter11.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

## Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | `files.content` chapter11.ts baris terakhir: **"Advanced Analysis Tools:\n- Window Functions (ROW_NUMBER, LAG, LEAD) enabled for sequencing."** — tampil langsung di CASE_FILES screen (`CaseFilesScreen.tsx` merender `files.content` verbatim), jadi ini pelanggaran Article 4 yang benar-benar terlihat pemain | **Perlu di-patch.** |
| 2 | Objective 1 `goal`: literal SQL `"SELECT * FROM camera_logs WHERE plate_number='B2841PT' ORDER BY capture_time;"` — bukan deskripsi bahasa natural, dan `goal` terkonfirmasi tampil di `TerminalScreen.tsx` (baris "Current Objective") | **Perlu di-patch.** |
| 3 | Objective 2 `story`: **"Gunakan Window Function ROW_NUMBER()..."** — menyebut nama sintaks eksplisit dua kali (istilah umum + nama fungsi persis) | **Perlu di-patch.** |
| 4 | Objective 2 `goal`: literal SQL lengkap dengan `ROW_NUMBER() OVER (...)` tertulis persis | **Perlu di-patch.** |
| 5 | Objective 3 `story`: **"...menggunakan LEAD()."** — nama fungsi persis disebut | **Perlu di-patch.** |
| 6 | Objective 3 `goal`: literal SQL dengan `LEAD(plate_number) OVER (...)` tertulis persis | **Perlu di-patch.** |
| 7 | Objective 4 `goal`: literal SQL `"SELECT * FROM system_logs WHERE action='Disable Camera';"` | **Perlu di-patch.** (Story sudah bersih, tidak perlu diubah.) |
| 8 | `App.tsx`, blok `currentLevelId === 11`, `nextIdx === 2`: popup Supervisor **"Gunakan LEAD() untuk membandingkan baris saat ini dengan baris berikutnya."** | **Perlu di-patch.** (`nextIdx === 1` dan `nextIdx === 3` sudah bersih, tidak perlu diubah.) |
| 9 | `handleAcceptMission` (`App.tsx`, blok `currentLevelId === 11`): popup mission accept — **"New query capabilities unlocked: WINDOW FUNCTIONS (ROW_NUMBER, LEAD, LAG)"** | **Perlu di-patch** — pola sama seperti Ch8-10, baris dihapus total, bukan diparafrase. |
| 10 | `report.conclusion` — `Reward: +1000 XP`, `Rank: Chief Digital Investigator`, `Unlocked: Traffic Camera, ROW_NUMBER(), LAG(), LEAD()` | **Perlu di-patch** — pola sama seperti chapter sebelumnya. |
| 11 | Chapter ini adalah chapter terakhir di `LEVELS` array (`levels.ts`, 11 chapter total) — `QuestCompleteScreen.handleNextLevel` mengecek `currentLevelId < LEVELS.length`; karena 11 = LEVELS.length, tombol "NEXT CHAPTER" akan kembali ke `HOME` tanpa konten lanjutan apapun | **Dicatat eksplisit** di Chapter Snapshot — chapter ini secara mekanik adalah *dead end* sampai Chapter 12 diimplementasikan. Bukan bug, tapi harus didokumentasikan supaya tidak dikira chapter 12 sudah ada. |

---

## Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 5 — Advanced Sequencing (window functions) |
| Teknik SQL dipakai | `ORDER BY` (pengulangan), **Window Functions** (`ROW_NUMBER() OVER`, `LEAD() OVER` — baru), `WHERE` (pengulangan) |
| Tabel database | `camera_logs`, `system_logs` — keduanya baru muncul chapter ini |
| App/menu terlibat | INBOX, CASE_FILES, DB_LIST, TERM, **TIMELINE** (dipakai ulang untuk objective 2, bukan app baru) |
| Status mekanik penting | Chapter terakhir di `LEVELS` array saat ini. `QUEST_COMPLETE` di sini adalah ujung jalur cerita sampai Chapter 12 dibangun (lihat Catatan Sinkronisasi #11). |

---

## Latar Belakang Naratif

Chapter 11 adalah puncak teknis CASE #001 — window functions adalah kapabilitas SQL paling kompleks yang diperkenalkan sepanjang case ini, dan sengaja dipasangkan dengan momen naratif paling personal: Supervisor Raka sendiri sudah sepenuhnya offline sejak akhir Chapter 9, dan Chapter 10 ditutup dengan video pesan panik darinya ("Jangan datang ke kantor. Lari."). Chapter 11 dijalankan sepenuhnya tanpa arahan langsung dari atasan — pemain bekerja sendirian, memakai alat paling canggih yang pernah mereka pegang, justru di titik paling rapuh dalam hierarki komando.

Secara teknis, window function adalah alat yang pas secara metafora: `ROW_NUMBER()` memberi urutan pada kekacauan data mentah, `LEAD()` membandingkan satu baris dengan baris tepat setelahnya — persis apa yang pemain lakukan secara naratif: menyusun kekacauan kejadian jadi urutan, lalu membandingkan posisi kendaraan Budi dengan kendaraan lain di titik waktu yang sama untuk membuktikan pola *tailing* (dibuntuti), bukan kebetulan.

---

## Hook Psikologis

`mail.body`, dari Supervisor Raka, nadanya berbeda drastis dari 10 chapter sebelumnya — bukan instruksi, tapi permintaan pribadi disertai peringatan:

> "Kalau HP ini masih aman, temui saya setelah kasus selesai. Sementara itu... Saya membuka database terakhir: Traffic Camera Database."

**Efek psikologis yang dituju:** kalimat "kalau HP ini masih aman" adalah pertama kalinya Raka secara eksplisit mempertanyakan keamanan komunikasinya sendiri — bukan lagi optimis taktis (Ch7) atau formal-menahan-diri (Ch9), tapi genuinely tidak yakin apakah pesan ini akan sampai. Kata "database **terakhir**" juga sengaja ambigu: bisa dibaca sebagai "database terakhir yang tersisa untuk dibuka", tapi setelah Ch9-10 (Raka nyaris hilang), kalimat itu bisa juga dibaca lebih gelap.

CASE_FILES membuka domain baru: `camera_logs` dan `system_logs` — bukan CCTV footage seperti Chapter 5 (yang murni metadata kehadiran/ketidakhadiran), tapi log kamera lalu lintas dengan timestamp presisi tinggi, dirancang khusus untuk analisis urutan multi-kendaraan. Ini pertama kalinya database dirancang eksplisit untuk perbandingan antar-baris, bukan pencarian satu entitas.

---

## Objective Walkthrough (selaras `chapter11.ts` + logic `App.tsx`)

### Objective 1

| | |
|---|---|
| **Story (kode)** | Temukan seluruh perjalanan mobil Budi (B2841PT) dan urutkan berdasarkan waktu. |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM camera_logs WHERE plate_number='B2841PT' ORDER BY capture_time;`~~ |
| **Goal (revisi)** | "Cari seluruh catatan camera_logs untuk plat B2841PT, diurutkan dari waktu paling awal." |
| **Expected SQL** | `SELECT * FROM camera_logs WHERE plate_number='B2841PT' ORDER BY capture_time;` |

**Detail hook:** Hasil: 3 baris — Hospital (09:20) → Gas Station (10:15) → Warehouse (11:20). Pemain sudah kenal rute serupa dari Chapter 7 (rute mobil Andi B2841PT lewat Hospital→SPBU→Warehouse), tapi di chapter ini datanya independen (kamera lalu lintas, bukan GPS log). Pengulangan pola rute yang sama dari sumber data berbeda memperkuat validitas temuan lama tanpa perlu dialog baru yang menyatakannya eksplisit.

---

### Objective 2 — Kapabilitas Baru (Penomoran Urutan)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Gunakan Window Function ROW_NUMBER() untuk memberi nomor urut pada setiap capture kendaraan."~~ |
| **Story (revisi)** | "Beri nomor urut pada setiap capture kendaraan, supaya urutan kemunculannya di tiap kamera lebih mudah dibaca — per kendaraan, dari yang paling awal." |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT plate_number, capture_time, ROW_NUMBER() OVER (PARTITION BY plate_number ORDER BY capture_time) AS sequence FROM camera_logs;`~~ |
| **Goal (revisi)** | "Tampilkan plate_number, capture_time, dan nomor urut kemunculan tiap kendaraan — dikelompokkan per plat nomor, diurutkan dari capture_time paling awal." |
| **Expected SQL** | `SELECT plate_number, capture_time, ROW_NUMBER() OVER (PARTITION BY plate_number ORDER BY capture_time) AS sequence FROM camera_logs;` |

**Popup lanjutan (`App.tsx`, `nextIdx === 2`, PERLU DIPATCH):**

> ~~"Gunakan LEAD() untuk membandingkan baris saat ini dengan baris berikutnya. Cari kendaraan yang mengikuti Budi."~~

Revisi: "Coba bandingkan setiap baris dengan baris tepat setelahnya, berdasarkan urutan waktu. Cari kendaraan yang selalu muncul tepat setelah Budi di titik yang sama."

**Detail hook:** Ini kapabilitas paling abstrak di seluruh CASE #001 — pemain sudah terbiasa `ORDER BY` menyusun *seluruh* tabel, tapi di sini butuh urutan **per kelompok** (per kendaraan), bukan urutan global. `availableTokens` menyediakan `PARTITION`, `BY`, `OVER` sebagai satu-satunya petunjuk visual — biarkan itu jadi jalan pemain menemukan konsepnya sendiri, bukan dijelaskan lewat dialog. Setelah objective ini selesai, `App.tsx` memindahkan pemain ke **TIMELINE** (bukan langsung TERM) sebelum popup lanjutan muncul — pastikan urutan ini tidak berubah, karena melihat Timeline dulu sebelum diberi hint LEAD() penting supaya pemain sempat mencoba menyimpulkan pola tailing secara visual dulu.

---

### Objective 3 — Kapabilitas Baru (Perbandingan Baris Berurutan)

| | |
|---|---|
| **Story (kode, PERLU DIPATCH)** | ~~"Lihat kendaraan apa yang muncul SETELAH kendaraan lain menggunakan LEAD(). Urutkan berdasarkan capture_time untuk melihat pola tailing."~~ |
| **Story (revisi)** | "Lihat kendaraan apa yang muncul SETELAH kendaraan lain di titik yang sama, dengan mengurutkan seluruh capture berdasarkan waktunya." |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT plate_number, capture_time, LEAD(plate_number) OVER (ORDER BY capture_time) AS next_vehicle FROM camera_logs;`~~ |
| **Goal (revisi)** | "Tampilkan plate_number, capture_time, dan plat kendaraan berikutnya yang muncul setelah baris ini — diurutkan berdasarkan capture_time." |
| **Expected SQL** | `SELECT plate_number, capture_time, LEAD(plate_number) OVER (ORDER BY capture_time) AS next_vehicle FROM camera_logs;` |

**Detail hook:** Ini titik "anjir" teknis chapter — hasil menunjukkan **B7710XR (mobil PT Arunika Logistics) selalu muncul tepat setelah B2841PT (mobil Budi) di kamera yang sama**: Hospital (09:20→09:25), Gas Station (10:15→10:18), Warehouse (11:20→11:25). Selisih waktu yang konsisten (~5 menit) di tiga lokasi berbeda adalah bukti pola, bukan kebetulan — jangan beri highlight otomatis atau kalkulasi selisih di UI manapun, biarkan pemain menghitung sendiri seperti pola "selisih 8 menit" Chapter 3 dan "57 menit" Chapter 7. Data juga menyimpan entri kelima B7710XR di **Police HQ (14:00)** dan kembali ke Warehouse (16:30) — dua baris ini tidak relevan untuk objective ini, tapi sengaja ditanam sebagai *seed* untuk chapter berikutnya (lihat GDD_CHAPTER_12, thread "insider Police HQ").

---

### Objective 4

| | |
|---|---|
| **Story (kode)** | Cari siapa yang mematikan kamera di tabel system_logs. |
| **Goal (kode, PERLU DIPATCH)** | ~~`SELECT * FROM system_logs WHERE action='Disable Camera';`~~ |
| **Goal (revisi)** | "Cari log di tabel system_logs dengan action 'Disable Camera'." |
| **Expected SQL** | `SELECT * FROM system_logs WHERE action='Disable Camera';` |

**Detail hook:** Hasil: satu baris — `user_id: 'Admin'`, timestamp `11:24`. Ini menutup rantai konfirmasi teknis dari Chapter 10 ("kamera dijadwalkan mati, bukan rusak") dengan bukti eksekusi langsung: bukan cuma jadwal maintenance di file, tapi log aksi nyata oleh akun bernama generik `Admin` — cukup samar untuk tidak menyebut nama spesifik siapa, sengaja menyisakan pertanyaan identitas untuk chapter berikutnya.

---

## Chapter End — Sequence Ancaman Final (di luar `chapter11.ts`, murni logic `App.tsx`)

Setelah Objective 4 selesai (`currentObjectiveIndex >= 4` dan tidak ada objective berikutnya), urutan berikut terjadi (sudah bersih, **tidak perlu diubah**):

1. `isFlickering` aktif, `appState` pindah ke `STATISTICS` dengan `isThreatMode` bernilai true — layar menampilkan angka palsu (742 queries, 49 evidence) sebagai efek "seseorang mengambil alih tampilan sistem", bukan statistik asli pemain.
2. Popup "REMOTE USER CONNECTED" → "UNAUTHORIZED REMOTE ACCESS DETECTED / TERMINAL LOCK INITIATED..."
3. Popup "CRITICAL WARNING" → "YOUR CURRENT LOCATION: [KNOWN]\n\n'Kamu mulai melihat yang tidak seharusnya.'"
4. `isFlickering` aktif lagi → `isLevelComplete = true` → `appState` ke `QUEST_COMPLETE`.

**Detail hook:** Ini eskalasi ancaman tertinggi sepanjang CASE #001 — sebelumnya ancaman selalu menyasar orang lain (Supervisor, di Ch8) atau abstrak (pengawasan sistem). Di sini untuk pertama kali ancaman menyasar **lokasi fisik pemain sendiri**, secara langsung, tanpa perantara. `StatisticsScreen` menampilkan `isThreatMode` sebagai kontras visual — statistik yang biasanya netral/informatif (RankScreen) di sini dipalsukan sebagai bagian dari serangan, penegasan bahwa bahkan sistem UI game sendiri tidak lagi bisa dipercaya sepenuhnya oleh pemain.

---

## Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** Tidak lewat CASE_FILES manual — `report.conclusion` yang sudah ada di kode dipakai sebagai isi `closing_11` message setelah pemain memilih jawaban benar via `ReportScreen` standar (dipicu di `QUEST_COMPLETE` flow chapter ini seperti biasa).

4 opsi:
- Budi hanya tersesat.
- **Mobil PT Arunika Logistics mengikuti mobil Budi di setiap titik (Hospital, Gas Station, Warehouse). Ini adalah operasi tailing yang direncanakan.** ← jawaban benar
- Polisi selalu mengawal mobil Budi.
- Semua kamera rusak secara alami.

**Twist penutup (perlu di-patch — hanya baris Reward/Rank/Unlocked):**

> "Ini bukan kebetulan.\nMereka mengikuti Budi.\n\ndan sekarang... Mereka tahu di mana kita berada."

**Detail hook:** Sama seperti Chapter 9, tidak ada "Supervisor Raka:" di depan kalimat ini — konsisten dengan pola kesunyian Raka sejak Ch9. Kalimat terakhir ("mereka tahu di mana kita berada") secara langsung menjustifikasi sequence STATISTICS/lokasi yang baru saja terjadi — bukan janji ancaman baru, tapi konfirmasi ancaman yang sudah terjadi barusan.

---

## Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter11.ts` (4 objective) **dan** logic bespoke `App.tsx` (Timeline detour di Objective 2→3, Statistics threat sequence di akhir).
* [x] Seluruh penyebutan eksplisit sintaks (Window Function, ROW_NUMBER(), LEAD(), PARTITION BY sebagai nama) di `story`/`files.content`/popup diperbaiki.
* [x] Seluruh `goal` yang berupa literal SQL diubah jadi deskripsi bahasa natural.
* [x] Status "chapter terakhir di LEVELS array, dead end sampai Ch12 dibangun" didokumentasikan eksplisit — bukan diasumsikan tersambung otomatis.
* [x] Sequence ancaman STATISTICS (lokasi diketahui) dikonfirmasi sudah bersih dari penyebutan sintaks, tidak diubah.
* [x] Seed data Police HQ (B7710XR, 14:00) dicatat eksplisit sebagai jembatan naratif ke Chapter 12.

---

## Shadows / Patch Instruksi Track B

```
1. Di file src/game/levels/case001/chapter11.ts:

a) Field files.content — ganti dari:
'DATABASE - TRAFFIC & LOGISTICS MONITORING\n\nTables:\n- camera_logs (camera_id, plate_number, capture_time, location)\n- system_logs (user_id, action, timestamp)\n\nAdvanced Analysis Tools:\n- Window Functions (ROW_NUMBER, LAG, LEAD) enabled for sequencing.'
menjadi:
'DATABASE - TRAFFIC & LOGISTICS MONITORING\n\nTables:\n- camera_logs (camera_id, plate_number, capture_time, location)\n- system_logs (user_id, action, timestamp)\n\nAdvanced Analysis Tools: Multi-vehicle sequencing and comparison enabled.'

b) Objective id: 1, field goal — ganti dari:
"SELECT * FROM camera_logs WHERE plate_number='B2841PT' ORDER BY capture_time;"
menjadi:
"Cari seluruh catatan camera_logs untuk plat B2841PT, diurutkan dari waktu paling awal."

c) Objective id: 2, field story — ganti dari:
"Gunakan Window Function ROW_NUMBER() untuk memberi nomor urut pada setiap capture kendaraan."
menjadi:
"Beri nomor urut pada setiap capture kendaraan, supaya urutan kemunculannya di tiap kamera lebih mudah dibaca — per kendaraan, dari yang paling awal."

d) Objective id: 2, field goal — ganti dari:
"SELECT plate_number, capture_time, ROW_NUMBER() OVER (PARTITION BY plate_number ORDER BY capture_time) AS sequence FROM camera_logs;"
menjadi:
"Tampilkan plate_number, capture_time, dan nomor urut kemunculan tiap kendaraan — dikelompokkan per plat nomor, diurutkan dari capture_time paling awal."

e) Objective id: 3, field story — ganti dari:
"Lihat kendaraan apa yang muncul SETELAH kendaraan lain menggunakan LEAD(). Urutkan berdasarkan capture_time untuk melihat pola tailing."
menjadi:
"Lihat kendaraan apa yang muncul SETELAH kendaraan lain di titik yang sama, dengan mengurutkan seluruh capture berdasarkan waktunya."

f) Objective id: 3, field goal — ganti dari:
"SELECT plate_number, capture_time, LEAD(plate_number) OVER (ORDER BY capture_time) AS next_vehicle FROM camera_logs;"
menjadi:
"Tampilkan plate_number, capture_time, dan plat kendaraan berikutnya yang muncul setelah baris ini — diurutkan berdasarkan capture_time."

g) Objective id: 4, field goal — ganti dari:
"SELECT * FROM system_logs WHERE action='Disable Camera';"
menjadi:
"Cari log di tabel system_logs dengan action 'Disable Camera'."

h) Field report.conclusion — hapus baris "Reward: +1000 XP" dan "Rank: Chief Digital Investigator" fully. Ubah baris "Unlocked: Traffic Camera, ROW_NUMBER(), LAG(), LEAD()" menjadi "Unlocked: Traffic Camera" saja.

2. Di file src/App.tsx:

a) Blok "currentLevelId === 11", "else if (nextIdx === 2)" — ubah pesan showSupervisorPopup dari:
'Gunakan LEAD() untuk membandingkan baris saat ini dengan baris berikutnya. Cari kendaraan yang mengikuti Budi.'
menjadi:
'Coba bandingkan setiap baris dengan baris tepat setelahnya, berdasarkan urutan waktu. Cari kendaraan yang selalu muncul tepat setelah Budi di titik yang sama.'

Blok "nextIdx === 1" dan "nextIdx === 3" TIDAK perlu diubah — sudah bersih.

b) Di handleAcceptMission, blok "else if (currentLevelId === 11)" — ubah popupMessage dari:
'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- TRAFFIC CAMERA LOGS\n  (camera_logs, system_logs)\n\nNew query capabilities unlocked: WINDOW FUNCTIONS (ROW_NUMBER, LEAD, LAG)'
menjadi:
'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- TRAFFIC CAMERA LOGS\n  (camera_logs, system_logs)'

Hapus baris "New query capabilities unlocked..." sepenuhnya.

Setelah semua perubahan, konfirmasi tidak ada lagi kata "Window Function", "ROW_NUMBER", "LEAD", "PARTITION BY", atau literal SQL apapun yang tampil ke pemain di story/goal/files.content/popup manapun untuk level 11.
```
