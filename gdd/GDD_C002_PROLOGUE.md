# GDD_C002_PROLOGUE.md

**Scope:** Momen pembuka Case #002 — dari Player pertama kali buka Home Screen sampai selesai nelpon Raka, SEBELUM objective SQL pertama (`SELECT * FROM vehicle;`) aktif.
**Sumber:** `GDD_CASE002_CH01_PU1.md` (Playable Unit 01, full — dokumen aslinya udah cukup detail, di sini disinkronkan ke struktur kode nyata)
**Version:** 1.0 — siap implementasi
**Status:** SIAP IMPLEMENTASI
**Classification:** Prologue GDD — CASE #002 Chapter 1

---

# Catatan Sinkronisasi — 1 Koreksi Penting

Percakapan sebelumnya sempat nyebut Case002 bakal pakai `OBJECTIVE_TRANSITIONS` registry (`objectiveTransitions.ts`) buat transisi antar-objective, ngikutin "pola matang dari refactor Case001". **Setelah dicek ulang ke kode yang ada di zip project lo, registry itu BELUM ADA.** Yang ada di `App.tsx` sekarang masih pola lama: rantai `if (currentLevelId === 1) {...} else if (currentLevelId === 2) {...}` dst sampai 12, langsung di dalam `handleObjectiveComplete`.

Ini gue klarifikasi sekarang karena kalau dibiarin, instruksi Track B di bawah bakal nyuruh AI Studio pakai infrastruktur yang gak eksis, dan errornya baru ketauan pas run. Ada 2 opsi:

1. **Bangun `objectiveTransitions.ts` dulu sebagai task terpisah** sebelum chapter manapun di-wire — lebih bersih jangka panjang, tapi nambah 1 langkah sebelum prolog ini bisa jalan.
2. **Prolog ini numpang pola lama dulu** (`else if (currentLevelId === 13)`), migrasi ke registry belakangan pas udah ada beberapa chapter buat dijadiin pola nyata (bikin registry dari 1 chapter contoh itu susah, biasanya lebih jelas polanya abis ada 2-3 chapter).

**Rekomendasi gue: opsi 2.** Prolog ini kecil, numpang pola lama gak nambah utang teknis besar. Track B di bawah pakai pola lama. Bilang kalau lo mau opsi 1 duluan.

---

# Latar Belakang Naratif

Tiga minggu setelah Case #001 ditutup. Unit Investigasi Digital balik ke rutinitas. Laporan yang masuk didominasi kesalahan administrasi, verifikasi data, koreksi identitas kendaraan — hari yang keliatan biasa buat sebagian besar tim.

Raka lagi meriksa beberapa laporan ketika notifikasi baru masuk dari Divisi Administrasi Database: *"Beberapa hubungan data kendaraan berubah setelah sinkronisasi malam."* Tim IT udah nganggep itu bug sinkronisasi biasa. Tapi Raka gak langsung setuju nutup tiketnya — bukan karena laporannya keliatan besar, justru karena **kelewat kecil**. Dia minta Player liat dulu sebelum ditutup.

**Pergeseran dinamika Raka-Player (fondasi seluruh Case002):** setelah Case001, Raka gak lagi memperlakukan Player sebagai staf baru — tapi juga belum investigator senior. Hubungan berubah jadi mentor & partner. Ini harus kerasa dari CARA dia ngasih tugas (gak ada lagi "jangan mengecewakan saya"), bukan dari statement eksplisit "aku sekarang percaya kamu".

---

# Hook Psikologis

Target emosi, harus kerasa progresif sepanjang prolog:

| Fase | Curiosity | Comfort | Suspicion | Urgency |
|---|---|---|---|---|
| Awal (Home Screen, sebelum baca Inbox) | 90% | 70% | 30% | 10% |

Progresi target: **"Hari ini terlihat biasa" → "Ada sesuatu yang aneh" → "Kenapa Raka terlihat tidak yakin?" → "Mungkin ini bukan bug."**

**Prinsip pacing (wajib dijaga pas implementasi):**
- Gak ada boot sequence baru, gak ada alarm, gak ada musik dramatis. Player mulai persis di Home Screen kayak biasa — kontinuitas rutinitas, bukan restart dramatis.
- Gak ada waypoint/panah yang nyuruh Player buka Contacts. Player harus nemuin sendiri kalau harus nelpon Raka, murni dari baca Objective text yang bilang "Temui Supervisor Raka".
- Isi pesan Inbox & dialog telepon HARUS PERSIS teks di bawah — jangan diparafrase pas coding, ini nada awal yang nentuin seluruh Case002.

---

# Walkthrough — Sinkronisasi 1:1 ke Kode

## Tahap 1 — Home Screen (state awal, tidak perlu kode baru)

Player masuk ke Home Screen persis kayak biasa (`appState: 'HOME'`). Semua UI/menu yang udah dikenal dari Case001 tetep ada, gak ada perubahan layout. Ini murni state yang udah otomatis kejadian begitu `currentLevelId` pindah ke 13 (lewat unlock progression dari Case001 ch12 — gak butuh kode tambahan, `App.tsx`'s `useEffect` yang nge-generate pesan Inbox awal via `initial_${currentLevelId}` udah otomatis jalan).

## Tahap 2 — Inbox Berkedip

Badge Inbox otomatis +1, blink aktif — ini **sudah** kejadian otomatis lewat mekanisme `messages` state existing (pesan `initial_13` masuk dengan `read: false`). Tidak perlu kode tambahan.

## Tahap 3 — Player Buka Inbox, Baca Pesan Raka

| Field | Isi (PERSIS, jangan diparafrase) |
|---|---|
| `mail.sender` | `'Supervisor Raka'` |
| `mail.subject` | `'Laporan Kecil'` |
| `mail.body` | `'Pagi.\nAda laporan kecil dari Administrasi Database.\nIT menganggapnya bug sinkronisasi.\nAku ingin kamu melihatnya dulu sebelum tiket ditutup.\n\nTemui aku setelah membacanya.'` |

Ini udah sesuai `chapter1.ts` yang udah ditulis sebelumnya — gak berubah.

**Tombol yang ditekan Player:** "ACCEPT THIS MISSION" (tombol existing di `InboxScreen.tsx`, muncul otomatis buat `selectedMessage.id === initial_${currentLevel.id}` selama `!hasAcceptedMission`). Ini yang jadi pemicu `handleAcceptMission()`.

## Tahap 4 — `handleAcceptMission()` — Notebook & Case Files Auto-Update

Ini titik yang butuh kode baru (existing `handleAcceptMission` belum ada logic khusus buat ini). Yang harus kejadian PERSIS di titik ini (gabungan STEP 04-05 GDD asli):

1. Notebook otomatis nambah entri: `"Kalau ini memang bug... kenapa Pak Raka terlihat tidak yakin?"` — monolog internal, BUKAN hipotesis/teori, murni rasa penasaran.
2. Popup `MISSION ACCEPTED` — versi minimal, **tanpa** baris "New query capabilities unlocked" (chapter ini gak ngenalin kapabilitas SQL baru — `SELECT *` udah dikenal dari Case001).
3. `unlockedApps` TIDAK berubah (semua app yang relevan — Inbox, Case Files, Notebook, Police Database, Contacts, Statistics — udah unlocked dari Case001; Timeline/Evidence/Witnesses TETAP locked, gak dibuka chapter ini).

**Setelah titik ini:** `currentObjectiveIndex` masih di 0. Objective pertama (`objectives[0]`) BUKAN soal SQL — isinya "Temui Supervisor Raka" (lihat Tahap 5). Ini beda dari pola Case001 di mana objective pertama selalu langsung SQL.

## Tahap 5 — Objective 0: "Temui Supervisor Raka" (non-SQL)

| | |
|---|---|
| **Story** | "Kalau ini memang bug, kenapa Pak Raka terlihat tidak yakin? Coba temui dia." |
| **Goal** | "Hubungi Supervisor Raka lewat Contacts sebelum melanjutkan investigasi." |
| **Mekanik** | **Tidak ada SQL.** `availableTokens: []`, `validateResult: () => true` (gak pernah dipanggil lewat TERM — completion-nya dipicu dari luar, lewat hang-up telepon, lihat Tahap 6). |
| **Kenapa gak lewat TERM sama sekali** | Player gak dituntun ke DB_LIST/TERM buat objective ini. `CaseFilesScreen` bakal nampilin story/goal ini apa adanya (itu udah otomatis, gak butuh kode baru — `CaseFilesScreen` render semua objective sampe `currentObjectiveIndex`). Yang butuh kode baru: mekanisme buat NANDAIN objective ini selesai, karena gak ada query yang dijalanin. |

**Catatan penting:** Police Database TETEP bisa dibuka Player kalau mereka penasaran duluan (sesuai GDD: "Player bebas membuka... Police Database" — app-nya emang gak dikunci). Kalau Player klik tabel di titik ini, `handleBrowseTable` tetep jalan normal, cuma gak nge-trigger apapun soal objective (browsing emang gak pernah trigger `isObjectiveMet`, itu perilaku existing). Ini AMAN, gak perlu dicegah — cuma gak akan majuin progress.

## Tahap 6 — Player Buka Contacts → Telepon Raka

Player harus **inisiatif sendiri** buka CONTACTS lalu pilih Raka (kontak ini udah ada dari Case001, `id: 'raka'`). Ini men-trigger `CallingScreen` existing (pola sama kayak telepon Dina di Case001 Ch2).

**Dialog (dua tahap, persis teks GDD):**

```
Tahap 1: "Aku harap ini cuma bug. Kalau benar bug, selesai hari ini."
  Pilihan: "Dan kalau bukan?"
Tahap 2: "Kalau bukan... kita jangan membuat orang yang melakukannya sadar. [TUTUP TELEPON]"
  Pilihan: "Dimengerti."
```

**Ini butuh kode baru** di `CallingScreen.tsx` (array dialog baru, pola identik `DINA_DIALOGUE`), DAN kondisi aktivasi baru yang bedain ini dari `RAKA_ENDING_DIALOGUE` (dialog Raka di akhir Case001 Ch6) — kuncinya cek `currentLevelId === 13`, bukan cuma `activeCallContact?.id === 'raka'`.

## Tahap 7 — Hang Up → Objective 0 Selesai → Lanjut ke Objective 1 (SQL pertama)

Ini titik kunci teknis: **hang-up telepon inilah yang nandain Objective 0 selesai**, bukan `validateResult`. Butuh cabang baru di `handleHangUp` (dipanggil dari `CallingScreen`'s `onClose`): kalau kontaknya Raka, chapter-nya 13, dan objective index masih 0 → panggil `handleObjectiveComplete()` langsung dari situ (majuin ke objective 1 — Vehicle Registry query), bukan cuma balik ke layar Contacts kayak biasa.

Fade out, autosave — ini otomatis kejadian lewat `saveProgress` yang udah dipanggil di dalam `handleObjectiveComplete`, gak butuh kode tambahan.

**Setelah titik ini:** Objective 1 ("Lihat seluruh data kendaraan di tabel vehicle") aktif — persis yang udah ditulis di `GDD_C002_CHAPTER_01.md` sebelumnya. Prolog selesai, chapter lanjut normal.
