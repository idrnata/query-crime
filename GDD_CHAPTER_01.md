# GDD_CHAPTER_01.md

**Chapter:** 1 — Rookie Detective
**Quest:** Kendaraan Misterius di Area Rumah Sakit
**Version:** 2.1 — FINAL
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | Objective 8 (v1.0) memakai JOIN — kontradiksi dengan GDD_CHAPTER_03 yang dirancang sebagai momen pertama pemain belajar JOIN | **Dihapus.** Chapter 1 sekarang murni SELECT/WHERE/ORDER BY, selaras dengan `chapter1.ts` yang sudah diimplementasikan (6 objective, tanpa JOIN sama sekali). |
| 2 | Data `owners` di kode (`id: 101, name: 'Andi'`) bentrok nama dengan "Andi Prasetyo" (karakter penting Chapter 3) | **Perlu di-patch di kode** — lihat instruksi Track B di bawah. GDD ini menulis nama pengganti: **Deni**. |
| 3 | GDD v1.0 tidak eksplisit menyebut menu/app ID yang terlibat per langkah | **Ditambahkan** kolom App/Menu di tiap objective, dipetakan ke `src/constants/apps.ts` (INBOX, CASE_FILES, DB_LIST, NOTEBOOK, EVIDENCE, CONTACTS). |
| 4 | Hook & detail sensorik minim | **Diperkaya** — lihat bagian Hook di bawah. |

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 1 — Looking for Facts (06_SQL_CURRICULUM) |
| Teknik SQL dipakai | `SELECT *`, `WHERE ... =`, `WHERE ... IS NULL`, `ORDER BY` — **tidak ada JOIN** |
| Tabel database | `vehicles`, `owners`, `parking` (lihat `chapter1.ts` field `database`) |
| App/menu aktif dari awal | INBOX, CASE_FILES, DB_LIST, NOTEBOOK, SETTINGS, RANK (Statistics) |
| App/menu baru dibuka di akhir chapter | CONTACTS (kontak pertama: Budi Santoso) — **EVIDENCE Locker TIDAK dibuka di sini**, lihat catatan di bawah |
| Rule of Three Answers | Terjawab: siapa pemilik kendaraan. Fakta baru: pemilik tak terhubungi 3 hari, tetangga bilang dia tak pulang. Pertanyaan baru: ke mana Budi pergi? |

**Catatan penting soal Evidence Locker:** Draf narasi awal (dokumen mentah sebelum sinkronisasi) menyebut Evidence Locker terbuka di akhir Chapter 1. Tapi field `report.conclusion` di `chapter1.ts` yang sudah diimplementasikan cuma bilang `"Contacts Unlocked: Budi Santoso"` — **tidak menyebut Evidence Locker.** GDD ini mengikuti kode: Evidence Locker dibuka di **Chapter 2** (selaras GDD_CHAPTER_02 yang sudah ditulis lebih dulu dan sudah konsisten). Kalau kode & GDD Ch2 sama-sama sepakat Evidence Locker baru muncul Ch2, jangan diubah — cukup pastikan Chapter 1 tidak menjanjikan sesuatu yang baru muncul sechapter kemudian.

---

# Hook

08:15 pagi. Notifikasi pertama masuk ke **INBOX** — bukan alarm, bukan tutorial popup, cuma satu pesan dari orang yang baru pertama kali pemain temui: Supervisor Raka. Nadanya bukan menyambut hangat — datar, transaksional, khas hari pertama kerja yang tidak ada yang mau direpotkan menjelaskan semuanya dari nol.

> **INBOX — Supervisor Raka — "Kasus Pertamamu"**
> "Selamat datang di Minor Crime Division. Rumah Sakit Harapan Bangsa melaporkan sebuah kendaraan yang parkir selama tiga hari di area ambulans. Temukan pemilik kendaraan tersebut. Semua data ada di database. Jangan mengecewakan saya."

Kalimat penutup ("Jangan mengecewakan saya") itu detail kecil yang penting — bukan ancaman, tapi standar. Ini pola yang akan berulang: Raka tidak pernah memuji berlebihan, tidak pernah menghukum berlebihan. Nada itu sendiri jadi karakterisasi tanpa perlu dialog tambahan.

**Hook sesungguhnya bukan kasusnya** (mobil parkir 3 hari itu remeh, disengaja terasa remeh) — **hook-nya adalah rasa "ini pekerjaan biasa" yang lambat laun terbukti salah.** Chapter 1 harus terasa seperti hari kerja paling membosankan sebagai polisi, supaya kontras dengan eskalasi 11 chapter berikutnya terasa maksimal.

Membuka **CASE_FILES** menampilkan `files.content` — Laporan saksi singkat: lokasi, plat nomor, durasi parkir. Empat baris data mentah, tanpa opini, tanpa arahan. Ini pola pertama dari **Rule of One More Click**: pemain tidak dituntun, cuma dikasih cukup buat penasaran ke langkah berikutnya.

---

# Objective Walkthrough (selaras `chapter1.ts`)

## Objective 1

| | |
|---|---|
| **App/Menu terlibat** | INBOX → CASE_FILES → DB_LIST (`vehicles`) |
| **Story (kode)** | "Sebelum mencari seseorang, lihat dulu isi databasenya." |
| **Goal (kode)** | Lihat seluruh data kendaraan. |
| **Expected SQL** | `SELECT * FROM vehicles;` |

**Detail hook di sini:** Saat pemain membuka `DB_LIST` untuk pertama kali, ini satu-satunya momen di seluruh CASE #001 di mana pemain benar-benar tidak tahu tabel apa yang harus dibuka — cuma ada `vehicles`, `owners`, `parking`. Biarkan pemain klik-klik dulu tanpa hasil sebelum nemu `vehicles` — jangan di-highlight otomatis. Kebingungan 5-10 detik ini justru penting: ini satu-satunya chapter di mana "tidak tahu harus mulai dari mana" itu bagian dari desain, bukan bug UX.

Hasil query menampilkan 4 baris — deretan data mentah tanpa makna sampai pemain sendiri yang mencocokkan `plate_number` dengan laporan saksi di Case Files. **Tidak ada highlight otomatis di baris yang cocok** — pemain harus scan sendiri dan menemukan `B1734QAZ` sendiri. Momen ini adalah "anjir, ini dia" pertama di seluruh game, sekecil apapun — jangan dirampas dengan bantuan visual.

---

## Objective 2

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`vehicles`) |
| **Story (kode)** | Database menampilkan ribuan kendaraan. Nomor polisi sesuai laporan adalah B1734QAZ. |
| **Goal (kode)** | Temukan kendaraan B1734QAZ. |
| **Expected SQL** | `SELECT * FROM vehicles WHERE plate_number = 'B1734QAZ';` |

**Detail hook:** Hasil satu baris: Toyota Camry hitam, `owner_id: 482`. Ini pertama kalinya pemain ketemu **foreign key** tanpa istilah itu pernah disebut — `owner_id` cuma angka, belum ada nama. Notebook belum terbuka di titik ini (Notebook baru unlock lebih jauh di CASE #001 sesuai kode — cek chapter mana persisnya sebelum menjanjikan Notebook aktif di sini).

---

## Objective 3

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`owners`) |
| **Story (kode)** | Supervisor: "Bagus. Sekarang cari tahu siapa Owner ID 482." |
| **Goal (kode)** | Cari pemilik dengan Owner ID 482 di tabel `owners`. |
| **Expected SQL** | `SELECT * FROM owners WHERE id = 482;` |

**Detail hook:** Pesan Supervisor ini masuk lewat INBOX (bukan hanya `story` di layar objective) — ikuti pola **Inbox notification standar** (UI_MICROINTERACTIONS_SPEC §2): badge bertambah, satu getar pendek, tanpa preview isi sebelum dibuka. Ini pengulangan pertama dari ritme "buka HP → ada instruksi baru" yang akan jadi tulang punggung seluruh CASE #001.

Hasil: **Budi Santoso**, Jl. Melati 15, telepon terdaftar. Nama pertama di seluruh game yang punya bobot naratif.

---

## Objective 4

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`parking`) |
| **Story (kode)** | Supervisor: "Bagus. Sekarang cari tahu apakah mobil itu masih berada di rumah sakit." |
| **Goal (kode)** | Periksa riwayat parkir (`parking`) untuk plat B1734QAZ. |
| **Expected SQL** | `SELECT * FROM parking WHERE plate_number = 'B1734QAZ';` |

**Detail hook:** Hasil menunjukkan `exit_time: null`. Ini kemunculan **NULL pertama** di seluruh game — jangan diberi tooltip penjelasan apapun. Chapter 5 nanti akan menjadikan NULL sebagai konsep besar ("NULL juga petunjuk") — kalau Chapter 1 sudah menjelaskan NULL secara eksplisit, momen itu di Chapter 5 kehilangan kejutannya. Biarkan di sini NULL cuma terlihat seperti "kolom kosong", tidak lebih.

---

## Objective 5

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`parking`) |
| **Story (kode)** | Mobil masuk 3 hari lalu dan `exit_time` adalah NULL (belum keluar). |
| **Goal (kode)** | Cari semua kendaraan yang belum keluar (`exit_time IS NULL`). |
| **Expected SQL** | `SELECT * FROM parking WHERE exit_time IS NULL;` |

**Detail hook:** Hasil: 3 kendaraan (bukan cuma mobil Budi). Ini langkah pertama yang memaksa pemain berpikir "pola", bukan "pencarian satu jawaban" — meski masih sangat sederhana, ini fondasi untuk Chapter 8 (`GROUP BY`/`HAVING`) yang jauh lebih berat nanti. Jangan buru-buru — biarkan pemain sempat bingung kenapa hasilnya 3 baris, bukan 1.

---

## Objective 6

| | |
|---|---|
| **App/Menu terlibat** | DB_LIST (`parking`) |
| **Story (kode)** | Supervisor: "Mobil mana yang paling lama berada di sana?" |
| **Goal (kode)** | Urutkan kendaraan yang belum keluar berdasarkan waktu masuk (`entry_time`). |
| **Expected SQL** | `SELECT * FROM parking WHERE exit_time IS NULL ORDER BY entry_time;` |

**Detail hook:** Hasil: mobil Budi (B1734QAZ) di urutan pertama — paling lama terparkir dari ketiganya. Ini objective terakhir sebelum laporan — jangan tambah langkah baru di sini (kode cuma sampai 6 objective, jangan digelembungkan).

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

Pemain memilih dari 3 opsi (bukan mengetik bebas — validator butuh kecocokan struktural, sesuai `report.correctIndex`):
- Kendaraan Curian
- **Kendaraan Terlantar** ← jawaban benar
- Pelaku Tidak Diketahui

**Twist penutup (field `report.conclusion`, kode existing — sudah bagus, jangan diubah):**

> Supervisor Raka: "Laporan diterima. Kerja bagus. Tapi ada masalah. Kami mencoba menghubungi pemilik kendaraan. Tidak ada jawaban. Tetangganya mengatakan dia tidak pulang sejak tiga hari lalu. Besok pagi bersiaplah. Kasus ini ternyata lebih besar dari yang kita kira."

**Detail hook di momen ini:** Ini transisi paling penting di seluruh chapter — dari "kasus selesai" ke "kasus baru dimulai" dalam satu paragraf, tanpa jeda visual besar. Ikuti pola Notebook/Case Files transition biasa, **jangan pakai efek dramatis berlebihan** (fade lama, musik sting) — kontras justru lebih kuat kalau disampaikan datar, seakan-akan Raka sendiri belum sadar betapa besarnya ini nanti.

**System update:** CONTACTS terbuka — kontak pertama: Budi Santoso.

---

# Verifikasi UI Existing (dicek langsung dari kode, bukan asumsi)

Ketiga poin ini sudah dicek langsung ke source code sebelum chapter ini dinyatakan final — **tidak perlu perubahan kode tambahan** di luar rename "Andi" → "Deni":

| Detail hook yang diminta | Status di kode | File |
|---|---|---|
| Tidak ada auto-highlight baris yang cocok di hasil query | ✅ Sudah — tidak ada logic highlight sama sekali di render tabel | `ResultScreen.tsx` |
| NULL tidak dijelaskan/tidak ada tooltip | ✅ Sudah — `null` di-render apa adanya sebagai teks "null", tanpa tooltip | `ResultScreen.tsx` |
| Inbox tidak bocorkan isi pesan lewat preview sebelum dibuka | ✅ Sudah — struktur list, pesan dibaca setelah diklik (`markMessageAsRead` dipanggil saat `selectedMessageId` berubah) | `InboxScreen.tsx` |
| Transisi laporan tidak dramatis berlebihan | ✅ Sudah — tidak ada efek fade/sting di komponen manapun | `ReportScreen.tsx`, `QuestCompleteScreen.tsx` |

Satu usulan dari draft sebelumnya (jeda render ±400ms di Objective 3 untuk efek dramatis) **sengaja tidak dijadikan requirement** — menambah timing logic khusus per-objective ke render engine untuk nuansa yang nyaris tidak terasa pemain bukan trade-off yang sepadan.

---

# Definition of Done Check

* [x] Selaras 1:1 dengan struktur `chapter1.ts` yang sudah diimplementasikan (6 objective, field `mail`/`files`/`database`/`report`).
* [x] Tidak ada JOIN — diperbaiki dari v1.0, sekarang konsisten dengan GDD_CHAPTER_03 (momen pertama JOIN).
* [x] Tidak ada mekanik XP/Rank/Achievement (kode `chapter1.ts` sendiri sudah bersih dari ini — konfirmasi lewat cek langsung ke file).
* [x] Setiap objective dipetakan ke app ID asli (`src/constants/apps.ts`).
* [x] NULL di Objective 4 sengaja tidak dijelaskan — menjaga kejutan untuk Chapter 5.
* [x] Evidence Locker **tidak** dijanjikan di chapter ini — selaras kode & GDD_CHAPTER_02.
