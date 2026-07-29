# GDD_C002_CHAPTER_02.md

**Chapter:** 2 — Questions Without Answers / Asking The Database / The Wrong Connection (3 PU digabung jadi 1 chapter)
**Version:** 1.0 — siap implementasi
**Status:** SIAP IMPLEMENTASI
**Classification:** Chapter GDD — CASE #002
**Sumber:** `GDD_C002_CH01_PU1.md` + `PU2.md` + `PU3.md` (draft asli, disesuaikan ke batasan engine)

---

# Catatan Sinkronisasi — 4 Keputusan

| # | Isu | Keputusan |
|---|---|---|
| 1 | PU1 didesain sengaja TANPA SQL (QA checklist GDD: "SQL Query Console belum muncul"). Beda dari Chapter 1 yang udah disederhanain jadi SQL semua. | **Dipertahankan non-SQL.** Ini bukan filler observasi seperti Ch1 — ini pondasi naratif "kenapa SQL diperkenalkan". Objective 0 non-SQL, `validateResult: () => true`, completion dipicu dari luar (lihat #2). |
| 2 | Dialog PU1 (Player-Raka bolak-balik) itu in-person, bukan telepon. `CallingScreen` gak cocok dipakai (temanya literal "sedang menelpon"). | **Reuse pola `useEffect` trigger-popup-saat-buka-DB_LIST** (persis pola Chapter 5 Case001, `hasShownCCTVWarning`) + popup chain Player/Raka gantian (persis pola ending Chapter 5 Case001, title `'PLAYER'` vs `'SUPERVISOR RAKA'`). Zero mekanisme baru. |
| 3 | Query pertama PU2 pre-written oleh Raka, `Editable: FALSE`, wajib selalu berhasil. | **Tambah 2 field opsional ke `Objective`:** `prefilledQuery?: string`, `readOnlyQuery?: boolean`. Kalau ada, `TerminalScreen` auto-isi `queryString` dan textarea jadi read-only. Scope kecil, dipakai cuma di sini. |
| 4 | "Case Priority berubah LOW→MEDIUM" ingin terlihat visual di UI. | **Gak butuh kode baru.** `MenuScreen.tsx` udah nampilin app yang belum di-unlock sebagai tile "LOCKED" — itu udah persis "silhouette Timeline/Evidence Locker muncul terkunci" yang diminta GDD. `Case Files` priority text ditulis statis di `files.content` (gak live-update), perubahan LOW→MEDIUM disampaikan lewat popup, bukan animasi UI. |

**Konsekuensi struktural:** Chapter ini cuma punya **2 objective sebenarnya** (bukan 5+ kayak Chapter 1) — Objective 0 (non-SQL, dialog) dan Objective 1 (1 query terpandu). PU3 (validasi + reveal + eskalasi kasus) gak punya query baru sama sekali — seluruhnya jadi popup chain otomatis setelah Objective 1 selesai, sebelum masuk Report.

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Stage 1→2 transisi — kelahiran SQL sebagai alat (bukan materi) |
| Teknik SQL dipakai | 1 query aja: `INNER JOIN` — pre-written, read-only, dijamin selalu berhasil |
| Tabel database | `vehicle`, `owner` (dari `masterRegistry.ts`, nambah dari 3 jadi 12 baris), `address` (nambah 1 baris) |
| App/menu terlibat | Semua udah unlocked dari Ch1 — **tidak ada app baru**. Timeline/Evidence Locker keliatan "LOCKED" di menu (otomatis, bukan fitur baru) |
| Report/Closing | Ada, pola standar |
| Rule of Three Answers | Terjawab: apakah kecurigaan "hubungan data salah" itu nyata atau ilusi (nyata, dibuktikan lewat query). Fakta baru: satu kendaraan (Rendra Saputra, B-1824-QC) punya pola yang sama — data individual valid, tapi alamat di Address Registry beda dari Owner Registry. Pertanyaan baru: siapa yang ngerti struktur database sedalam ini buat ngubah RELASI tanpa ninggalin jejak di DATA-nya sendiri? |

---

# Latar Belakang Naratif

Masih hari yang sama, ruangan yang sama — GDD eksplisit bilang "Tidak ada transisi" dari akhir Chapter 1. Raka duduk di samping Player, gak ngasih instruksi lagi, cuma merhatiin layar. Player mulai buka satu tabel demi satu tabel sendiri. Semua keliatan bener. Tapi tiap kali dibandingin ke tabel lain, ada detail kecil yang ganjil — alamat beda, tanggal beda, hubungan pemilik yang berubah tanpa alasan. Player mulai kehilangan gambaran besar; makin banyak tabel dibuka, makin susah diinget hubungannya. Kelelahan ini SENGAJA didesain — bukan puzzle yang susah, tapi alat investigasinya yang emang belum cukup.

Raka mecah keheningan: *"Kalau satu data salah... itu bug. Kalau semuanya benar... tapi hasil akhirnya salah... itu sesuatu yang jauh lebih berbahaya."*

Setelah Player mentok, Raka nunjukkin panel baru — Query Console. Bukan diperkenalkan sebagai "belajar SQL", tapi sebagai *"tempat bertanya"*. Raka ngetik 1 query (JOIN vehicle+owner), berhenti sebelum Execute, terus bilang: *"Aku bisa saja menjalankannya. Tapi sekarang giliranmu."* Player tekan Execute — hasil keluar dalam 0.03 detik, 12 baris, dan salah satu baris (Rendra Saputra, plat B-1824-QC) nunjukkin kejanggalan yang sama kayak temuan Chapter 1: alamat di Address Registry beda dari Owner Registry.

Raka gambar 3 kotak di papan tulis (Vehicle-Owner-Address), tanya "apa yang berubah?", Player jawab "alamat"/"pemilik" — SALAH, Raka hapus terus-menerus. Baru pas Raka gambar ULANG bukan isi kotaknya tapi GARIS di antaranya, poinnya kena: *"Yang berubah bukan datanya. Tetapi hubungan di antaranya."* — kalimat titik balik seluruh Case002.

Chapter ditutup: laporan Administrasi masuk jam 8 pagi, tapi perubahan pertama di database terjadi jam 2 dini hari. Raka: *"Kalau seseorang bisa mengubah hubungan data tanpa meninggalkan jejak, berarti dia tahu persis bagaimana database ini bekerja. Kita tidak sedang mencari bug... kita sedang mencari seseorang."* Case Priority berubah LOW→MEDIUM, Case Type berubah Database Verification→Active Investigation.

---

# Hook Psikologis

| Fase | Curiosity | Confusion/Frustration | Suspicion | Lainnya |
|---|---|---|---|---|
| PU1 (frustrasi manual) | 70% | Confusion 100%, Frustration 50% | 90% | — |
| PU2 (Query Console lahir) | 90% | Confidence 30% | — | Discovery 80%, Wonder 50% |
| PU3 (reveal + eskalasi) | 90% | — | 100% | Understanding 70%, Determination 70% |

**Prinsip pacing wajib dijaga:**
- PU1: **JANGAN kasih bantuan visual apapun** — gak ada garis relasi, gak ada highlight, gak ada indikator inkonsistensi. Target emosinya justru "aku kehilangan gambaran besarnya" — kalau UI bantuin, momen ini gagal total.
- PU2: Query pertama **WAJIB selalu sukses**. Gak boleh ada syntax error state, gak ada debugging. Ini kebalikan dari filosofi "let player struggle" — momen ini murni buat bangun kepercayaan diri terhadap SQL sebelum chapter-chapter berikutnya makin berat.
- PU3: Reveal "yang berubah bukan data, tapi hubungan" harus berasa "Aha!" — jangan didahului petunjuk apapun di PU1/PU2 yang bikin Player udah nebak duluan.

---

# Objective Walkthrough

## Pra-Objective — Inbox (transisi minimal, non-dramatis)

Karena GDD asli eksplisit "Tidak ada transisi" dari Chapter 1, isi `mail` chapter2.ts dibikin sesingkat mungkin, murni ngelanjutin percakapan (bukan pesan "hari baru"):

```
sender: 'Supervisor Raka'
subject: 'Lanjutkan'
body: 'Baik.\nSekarang bandingkan laporan Administrasi dengan seluruh database.\nJangan hanya percaya satu sumber.'
```

`handleAcceptMission` buat chapter ini nambah entri Notebook otomatis (NB-C002-003, isi di bawah) — TIDAK ada popup "New database unlocked" apapun (semua app udah kebuka dari Ch1).

## Objective 0 — Bandingkan Manual (non-SQL)

| | |
|---|---|
| **Story** | "Semuanya terlihat benar. Tapi kenapa terasa salah? Bandingkan laporan Administrasi dengan seluruh database." |
| **Goal** | "Buka Police Database, bandingkan datanya dengan laporan Administrasi." |
| **Mekanik** | Non-SQL. `availableTokens: []`, `validateResult: () => true`. Completion dipicu popup chain (lihat Track B), bukan query. |

**Notebook auto (segera setelah accept mission, sebelum player buka apapun):**
> NB-C002-003: "Semua tabel terlihat benar. Tapi aku mulai kehilangan hubungan antar datanya. Mungkin masalahnya bukan isi tabel... melainkan cara aku melihatnya."

**Trigger popup chain (begitu Player buka DB_LIST pertama kali di chapter ini):** urutan Player/Raka bolak-balik (persis teks GDD):
```
Raka: "Apa yang kamu lihat?"
Player: "Datanya benar."
Raka: "Lalu?"
Player: "..."
Raka: "Itulah masalahnya. Kalau investigator mulai bingung... database pasti lebih membingungkan."
Player: "Kalau begitu bagaimana cara melihat hubungan semuanya sekaligus?"
Raka: "Tidak sekarang."
```
Popup terakhir nutup → `handleObjectiveComplete()` dipanggil langsung dari `onClose`.

**Penting:** Player TETEP bebas browse tabel manapun sebelum/sesudah popup chain ini muncul — gak ada yang dikunci, popup ini murni trigger sekali begitu DB_LIST pertama dibuka, gak nunggu Player "selesai" liat semua tabel (simplifikasi dari GDD asli yang minta "setelah player membuka seluruh registry" — di-drop demi menghindari mekanisme visit-tracking baru).

---

## Objective 1 — Query Pertama (dipandu, read-only)

| | |
|---|---|
| **Story** | "Raka mengetik satu query, lalu berhenti sebelum menekan Execute. 'Aku bisa saja menjalankannya. Tapi sekarang giliranmu.'" |
| **Goal** | "Jalankan query yang sudah disiapkan Raka." |
| **prefilledQuery** | `SELECT vehicle.vehicle_plate, owner.owner_name FROM vehicle INNER JOIN owner ON vehicle.owner_id = owner.owner_id;` |
| **readOnlyQuery** | `true` |
| **Expected hasil** | 12 baris |

**Detail hook:** Ini query PERTAMA di seluruh Case002 yang beneran dijalanin (Objective 0 gak ada SQL sama sekali). Player gak nulis apapun — textarea udah keisi otomatis, tombol Execute aja yang bisa ditekan. Hasil keluar cepat (flavour text "0.03 sec" di GDD, gak perlu diimplementasi literal, cukup instant kayak biasa). Salah satu baris — `B-1824-QC` / `Rendra Saputra` — punya alamat yang beda antara `owner.address` dan entri di `address` registry. **Jangan kasih highlight apapun di baris ini** — Player harus notice sendiri, persis prinsip yang sama kayak Chapter 1.

**Setelah query sukses, notebook auto-update:**
> NB-C002-004: "Aku akhirnya bisa melihat hubungan antar data. Masalahnya memang bukan isi tabel. Masalahnya hubungan mereka."

---

## Penutup Chapter — Popup Chain PU3 (non-SQL) → Report

Setelah Objective 1 selesai, TIDAK ada objective SQL baru — langsung masuk urutan popup (gantian, sebelum Report):

1. Dialog singkat: Player *"Ini jauh lebih cepat..."* → Raka *"SQL tidak membuatmu lebih pintar. SQL hanya membuatmu bisa bertanya dengan benar."*
2. Notebook hipotesis baru:
   > NB-C002-005: "Semua data lolos validasi. Tetapi hubungan antar data menghasilkan identitas yang berbeda. Ini bukan bug. Ini pola."
3. Dialog reveal: Player *"Kalau begitu... ada seseorang yang sengaja mengubah hubungan antar data?"* → Raka *"Aku belum tahu."* → Player *"Tapi sekarang kita tahu... ini bukan kesalahan sistem."* → Raka *"Dan itu jauh lebih buruk."*
4. Popup status: *"Case Priority: LOW → MEDIUM. Case Type: Database Verification → Active Investigation."*
5. → `setAppState('REPORT')`

---

## Report Submission

4 opsi:
- Ini murni bug sinkronisasi, semua kendaraan dan pemilik cocok.
- Beberapa data individual salah dimasukkan oleh admin.
- **Data tiap tabel valid, tapi hubungan (relasi) antar data telah diubah secara sengaja — bukan bug.** ← jawaban benar
- Query yang dijalankan tidak dapat dipercaya karena hasilnya berbeda tiap kali.

**Detail hook — opsi jebakan:** Opsi keempat sengaja dipasang buat nge-tes apakah Player udah percaya sama SQL sebagai alat (bukan meragukannya) — jawaban ini kontradiktif sama seluruh pembelajaran chapter ini (query yang sama akan selalu ngasih hasil yang sama, itu justru POIN-nya SQL, bukan kelemahannya).

**Twist penutup:**
> Supervisor Raka: "Laporan ini masuk pukul delapan pagi. Perubahan pertama terjadi pukul dua dini hari. Kalau seseorang bisa mengubah hubungan data tanpa meninggalkan jejak, berarti dia tahu persis bagaimana database ini bekerja.\n\nKita tidak sedang mencari bug.\n\n...kita sedang mencari seseorang.\n\n*** CHAPTER 2 (CASE #002) COMPLETE ***"

---

# Definition of Done Check

* [ ] Objective 0 gak pernah nge-trigger lewat TERM — cuma lewat popup chain di DB_LIST.
* [ ] Objective 1 textarea read-only, pre-filled, Execute selalu sukses (gak ada validasi syntax error path).
* [ ] Gak ada highlight visual di baris Rendra Saputra pas hasil query keluar.
* [ ] `MenuScreen` nunjukkin Timeline/Evidence Locker sebagai "LOCKED" — dicek TANPA kode tambahan, `unlockedApps` chapter ini emang gak nambah apapun.
* [ ] Case Priority/Type escalation disampein lewat popup, bukan animasi UI baru.
* [ ] Data `vehicle`/`owner` di `masterRegistry.ts` nambah dari 3 jadi 12 baris (bukan file/tabel baru).
* [ ] Gak ada penyebutan sintaks SQL eksplisit di `story`/`goal`/dialog manapun.
