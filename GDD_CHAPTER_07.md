# GDD_CHAPTER_07.md

**Chapter:** 7 — Jalan yang Berbohong
**Version:** 2.0 — disinkronkan mutlak 1:1 ke `chapter7.ts` **dan** logic bespoke di `App.tsx`
**Status:** FINAL — siap implementasi
**Classification:** Chapter GDD — CASE #001

---

# Catatan Sinkronisasi v2.0

| # | Isu di v1.0 | Perbaikan |
|---|---|---|
| 1 | Objective 1 `goal`: **"Gunakan SELECT untuk melihat seluruh lokasi."** — menyebut nama sintaks eksplisit, tidak konsisten dengan gaya deskriptif di semua chapter lain | **Perlu di-patch** — lihat instruksi Track B. |
| 2 | Popup unlock awal chapter (`App.tsx`, chapterId 7): "New query capabilities unlocked: ORDER BY, LIMIT" | **Perlu di-patch.** |
| 3 | `report.conclusion` — `+400 XP`, `Rank: Digital Investigator`, `Unlocked: Maps, ORDER BY, LIMIT, Route Timeline` | **Perlu di-patch** — pola sama seperti chapter sebelumnya. |
| 4 | Sisanya (Objective 2-4 `goal`, sequence "perangkat diretas" di akhir chapter) | **Sudah bersih.** Tidak ada penyebutan sintaks eksplisit di Objective 2-4 (deskripsi hasil yang diinginkan, bukan nama teknik). Sequence hack di akhir chapter sudah rapi dan durasinya (6 detik) sudah cocok dengan UI_MICROINTERACTIONS_SPEC §7 "Boot Terganggu" — tidak perlu diubah. |

---

# Latar Belakang Naratif

Chapter 7 sengaja dirancang sebagai jeda ritme (breather chapter) di tengah eskalasi — bukan berarti lebih mudah, tapi fokusnya bergeser dari "siapa" ke "ke mana dan kapan". Setelah Chapter 6 membuka rahasia besar (kecelakaan 8 tahun lalu, PT Arunika, data yang dihapus), Chapter 7 menariknya kembali ke hal yang lebih konkret dan bisa dilacak: rute perjalanan kendaraan.

Tapi chapter ini juga jadi titik balik terbesar dalam hubungan pemain dengan dunia game itu sendiri: untuk pertama kali sejak Chapter 1, ancaman berpindah dari abstrak (pesan anonim di Inbox) menjadi langsung — perangkat investigasi pemain sendiri diretas secara real-time di akhir chapter. Sampai titik ini, pemain merasa aman selama mereka cuma "melihat" data dari jarak jauh. Chapter 7 mematahkan itu: seseorang bisa masuk balik ke sistem yang pemain pakai.

---

# Hook Psikologis

INBOX dari Supervisor Raka:

> "Saya berhasil menemukan sesuatu dari perusahaan Arunika. Mereka mempunyai gudang lama di pinggiran kota. Tetapi... saya tidak tahu siapa yang terakhir pergi ke sana. Saya membuka akses ke sistem peta kepolisian."

**Efek psikologis yang dituju:** nada Raka di sini kembali percaya diri dan taktis (beda dari kegetiran di akhir Chapter 6) — dia menemukan lokasi fisik nyata untuk pertama kalinya, dan itu terasa seperti kemajuan konkret setelah dua chapter berturut-turut isinya cuma dokumen dan data abstrak. Kontras nada inilah yang membuat twist di akhir chapter terasa lebih menampar — chapter dibuka dengan optimisme taktis, ditutup dengan pemain sadar mereka sendiri sedang diawasi.

**MAPS terbuka** — app baru, tapi `files.content` langsung menegaskan **ini bukan peta jelajah bebas**: "Menampilkan lokasi log perjalanan kendaraan" — murni database posisi dan waktu, sama seperti Browser di Chapter 6 yang murni database berita, bukan browser sungguhan. Pastikan UI tetap dalam kerangka data (tabel/list), tidak ada rendering peta visual penuh di titik awal chapter — visual peta sederhana baru relevan di akhir chapter sebagai bagian dari twist "seseorang menggambar garis merah di petamu".

CASE_FILES membuka 3 target: temukan kendaraan terakhir ke gudang, susun urutan perjalanan, pastikan apakah kendaraan Andi benar menuju lokasi itu. Pola familiar — chapter dengan investigasi bercabang selalu dibuka dengan banyak target sekaligus (sama seperti Chapter 4 dan 6).

---

# Objective Walkthrough (selaras `chapter7.ts`)

## Objective 1

| | |
|---|---|
| **Story (kode)** | Cari ID lokasi milik Arunika Warehouse dari tabel locations. |
| **Goal (kode, PERLU DIPATCH)** | ~~"Gunakan SELECT untuk melihat seluruh lokasi."~~ |
| **Goal (revisi)** | "Lihat seluruh lokasi yang tercatat di tabel locations." |
| **Expected SQL** | `SELECT * FROM locations;` |

**Detail hook:** Hasil: 4 lokasi — Hospital, **Police HQ**, Arunika Warehouse, Fuel Station. Perhatikan "Police HQ" ada di daftar ini sejak awal chapter, tapi belum ada alasan bagi pemain untuk curiga kenapa markas polisi sendiri masuk daftar lokasi yang relevan — kejanggalan ini baru terasa penuh saat pemain nanti (Objective 4) melihat kendaraan perusahaan Arunika juga pernah singgah ke Police HQ. Jangan beri highlight atau catatan apapun di titik ini; biarkan nama itu lewat begitu saja sampai konteksnya muncul sendiri nanti.

---

## Objective 2

| | |
|---|---|
| **Story (kode)** | Supervisor: "Cari kendaraan yang PALING TERAKHIR datang ke gudang tersebut." (location_id 56) |
| **Goal (kode)** | Query tabel routes dengan filter location_id=56, urutkan berdasarkan timestamp descending, batasi 1 hasil. |
| **Expected SQL** | `SELECT * FROM routes WHERE location_id = 56 ORDER BY timestamp DESC LIMIT 1;` |

**Detail hook:** Ini kapabilitas baru (mengurutkan + membatasi hasil), tapi diperkenalkan lewat deskripsi kebutuhan ("paling terakhir", "batasi 1 hasil") bukan nama sintaks — pola yang benar sejak awal, tidak seperti masalah di Chapter 6. Hasil: **B 2841 PT** — plat yang sudah pemain kenal sejak Chapter 3 (mobil Andi). Momen pengenalan kembali ini seharusnya terasa familiar tanpa bantuan visual apapun — pemain sendiri yang mengenali plat itu dari memori chapter-chapter sebelumnya.

---

## Objective 3

| | |
|---|---|
| **Story (kode)** | Supervisor: "Sekarang lihat seluruh perjalanan mobil itu untuk menyusun kronologinya." |
| **Goal (kode)** | Query tabel routes dengan filter plate_number='B 2841 PT', urutkan berdasarkan timestamp. |
| **Expected SQL** | `SELECT * FROM routes WHERE plate_number = 'B 2841 PT' ORDER BY timestamp;` |

**Detail hook:** Hasil: 3 baris membentuk rute — Hospital (09:13) → Fuel Station (10:10) → Arunika Warehouse (11:07). Rute ini yang jadi dasar kecurigaan utama chapter: kenapa mobil berhenti di SPBU nyaris satu jam sebelum lanjut ke gudang? Biarkan pemain menghitung sendiri durasinya dari selisih timestamp (10:10 ke 11:07 = 57 menit) — jangan tampilkan durasi itu secara otomatis di UI manapun, ini harus jadi temuan pemain sendiri seperti pola "selisih 8 menit" di Chapter 3.

---

## Objective 4

| | |
|---|---|
| **Story (kode)** | Supervisor: "Coba lihat 10 kendaraan terakhir yang mengunjungi gudang Arunika untuk melihat aktivitas lain." |
| **Goal (kode)** | Query tabel routes dengan filter location_id=56, urutkan berdasarkan timestamp descending, batasi 10 hasil. |
| **Expected SQL** | `SELECT * FROM routes WHERE location_id = 56 ORDER BY timestamp DESC LIMIT 10;` |

**Detail hook:** Hasil menampilkan banyak kendaraan berbeda yang pernah singgah ke gudang di hari-hari sebelumnya — termasuk **B 7710 XR**, terdaftar atas nama PT Arunika Logistics sendiri (perusahaan itu masih aktif memakai gudang tersebut, bukan sekadar lokasi lama yang ditinggalkan). Ini reveal penting: gudang bukan cuma tempat kejadian satu kali, tapi lokasi yang terus dipakai. Setelah objective ini, `isHackedMap` bisa terpicu begitu pemain mencoba keluar dari layar MAP — lihat bagian Chapter End di bawah.

---

# Chapter End — Sequence "Perangkat Diretas" (di luar `chapter7.ts`, murni logic `App.tsx`)

Setelah Objective 4 selesai (`currentObjectiveIndex >= 4`), dua mekanisme baru aktif khusus untuk sisa chapter ini:

1. **Saat pemain menekan Back dari layar MAP** (`handleBack`, `appState === 'MAP' && currentLevelId === 7 && currentObjectiveIndex >= 4`): alih-alih kembali ke Home seperti biasa, `isHackedMap` diset `true` — memicu visual peta yang "diganggu" (garis merah, pesan "YOU ARE LOOKING AT THE WRONG DESTINATION"). Ini murni state visual, tidak mengubah data.
2. **Boot Reboot Paksa** (`isChapter7Reboot`): begitu kondisi ini aktif, durasi boot screen berikutnya otomatis jadi **6 detik** (bukan 2.5 detik standar) — sudah cocok dengan pola Boot Terganggu di UI_MICROINTERACTIONS_SPEC §7. Setelah boot selesai, muncul popup "SYSTEM SECURITY ALERT": "SECURITY OVERRIDE TERMINATED. LOCAL DEVICE SECURED." → lanjut popup Supervisor panik: "YA AMPUN! Perangkat penyelidikanmu baru saja diretas secara langsung! Seseorang menimpa peta kepolisian dengan rute merah misterius dan pesan 'YOU ARE LOOKING AT THE WRONG DESTINATION'. Mereka mengawasi perangkat kita secara real-time! Kirimkan laporan fakta analisismu segera sekarang sebelum mereka mematikan sistem kita!" → langsung ke REPORT screen.

**Detail hook:** Ini sequence paling terkoordinasi (Map visual + Boot durasi + Popup berantai) yang pernah diimplementasikan sejauh ini, dan sudah bagus — **tidak perlu diubah**. Yang penting dicatat di GDD: nada Supervisor di sini untuk pertama kalinya terdengar benar-benar panik ("YA AMPUN"), bukan tenang seperti biasa — sinyal bagi penulis chapter berikutnya bahwa eskalasi emosi Raka sendiri (bukan cuma isi kasusnya) adalah bagian dari kurva cerita yang harus terus dijaga naik.

---

# Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** REPORT (dipicu otomatis dari sequence hack, bukan lewat Case Files manual seperti chapter lain)

4 opsi:
- Andi mengemudikan mobilnya langsung ke gudang Arunika dari rumah sakit.
- **Mobil Andi B 2841 PT pergi ke gudang Arunika dengan rute yang tidak masuk akal dan sempat berhenti 57 menit di SPBU, serta ada mobil perusahaan PT Arunika Logistics B 7710 XR yang juga aktif mengunjungi gudang.** ← jawaban benar
- Gudang tersebut sudah lama kosong dan tidak ada kendaraan lain yang berkunjung.
- Sopir truk adalah orang yang memarkir mobil di SPBU.

**Twist penutup (perlu di-patch, lihat instruksi Track B):**

> Supervisor Raka: "Bagus! Analisis yang sangat cermat. Rute perjalanan mobil Andi sangat aneh dan tidak efisien. Berhenti 57 menit di SPBU... ada sesuatu yang disembunyikan di sana. Dan mobil PT Arunika Logistics juga aktif mengunjungi gudang lama tersebut. Kasus ini semakin mengerikan."

---

# Definition of Done Check

* [x] Selaras mutlak 1:1 dengan `chapter7.ts` (4 objective) **dan** logic bespoke `App.tsx` (Map hack sequence, Boot reboot 6 detik).
* [x] Objective 1 `goal` tidak lagi menyebut "SELECT" secara eksplisit.
* [x] Popup unlock awal chapter dan `report.conclusion` dibersihkan dari penyebutan sintaks + XP/Rank.
* [x] Objective 2-4 dikonfirmasi sudah bersih sejak awal (deskriptif, bukan naming) — dicatat eksplisit sebagai contoh pola yang benar.
* [x] Sequence hack akhir chapter dikonfirmasi sudah selaras with UI_MICROINTERACTIONS_SPEC §7, tidak diubah.
* [x] Eskalasi nada emosional Supervisor (dari tenang ke panik) dicatat sebagai penanda kurva cerita untuk chapter berikutnya.

---
