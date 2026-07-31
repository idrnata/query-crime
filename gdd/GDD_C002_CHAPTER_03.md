# GDD_C002_CHAPTER_03.md

**Chapter:** 3 — Every Change Leaves A Trace / The Pattern Behind Time / The Invisible User (3 PU digabung)
**Version:** 1.0 — siap implementasi
**Status:** SIAP IMPLEMENTASI
**Classification:** Chapter GDD — CASE #002
**Sumber:** `GDD_C002_CH03_PU1/PU2/PU3.md` (draft asli, disesuaikan)

---

# Catatan Sinkronisasi — 2 Keputusan

| # | Isu | Keputusan |
|---|---|---|
| 1 | GDD minta tombol **"Create Evidence"** yang diklik manual tiap nemu bukti, plus klik baris hasil query buat drill-down detail. Sistem evidence dinamis kayak gitu gak ada di codebase — `EvidenceScreen.tsx`/`TimelineScreen.tsx` 100% hardcoded per-level (evidence/node muncul otomatis dari kondisi `notebookContent`, bukan aksi pemain). | **Reuse pola existing.** Evidence & Timeline node 3x di chapter ini muncul OTOMATIS begitu notebook keisi teks pemicu — bukan lewat tombol. Kehilangan momen "tekan Create Evidence", tapi zero mekanisme baru, konsisten sama Ch1-Ch2. |
| 2 | PU2 minta "fill-in-blank" query (Player cuma isi parameter waktu, sisanya fixed). Mekanisme UI baru lagi. | **Disederhanakan jadi query manual biasa** (pola Ch1) — Player nulis full query sendiri. `BETWEEN`+`ORDER BY` udah dikenal dari Case001, gak perlu tutorial. |

**Konsekuensi:** Timeline & Evidence Locker beneran ke-unlock chapter ini (pertama kali di Case002) — perlu ditambah ke `unlockedApps` lewat `handleAcceptMission`.

---

# Chapter Snapshot

| Item | Detail |
|---|---|
| SQL Stage | Reinforcement — `SELECT *`, `WHERE ... =`, `WHERE ... BETWEEN ... ORDER BY` (semua udah dikenal dari Case001, gak ada sintaks baru) |
| Teknik SQL dipakai | 3 query: full browse, filter rentang waktu, filter equality |
| Tabel database | `audit_log` (12 baris, lokal chapter ini — bukan master registry, khas investigasi chapter ini doang), `session_log` (1 baris, lokal) |
| App/menu terlibat | **Timeline & Evidence Locker resmi unlock** — pertama kali di Case002 |
| Report/Closing | Ada, pola standar |
| Rule of Three Answers | Terjawab: apakah kecurigaan "relasi database dimanipulasi" itu sistematis, bukan kebetulan (ya — 3 evidence independen semua nunjuk ke jam 02:11-02:17 dini hari). Fakta baru: pelakunya pakai akun sistem (`system_sync`), dan sesi login-nya gak punya identitas perangkat (`client_host: UNKNOWN`) — SOP internal bilang ini seharusnya gak mungkin. Pertanyaan baru: siapa yang tau cara masuk sistem tanpa ninggalin jejak perangkat? |

---

# Latar Belakang Naratif

Pagi berikutnya. Player datang lebih awal, ruangan masih kosong. Raka masuk bawa map abu-abu, gak langsung dibuka — nyalain monitor dulu. *"Banyak investigator gagal... karena mereka terlalu cepat menyimpulkan."*

Layar nunjukkin sesuatu yang baru: bukan Query Console, bukan Database — garis horizontal kosong. Timeline. *"Timeline tidak pernah berbohong. Orang bisa berbohong. Database bisa dimanipulasi. Tapi waktu... selalu meninggalkan jejak."*

Raka buka Audit Log — ribuan baris (di implementasi kita: 12 baris representatif, cukup buat nunjukkin polanya tanpa beneran butuh "ribuan"). *"Kita tidak akan membaca semuanya. Kita hanya mencari... perubahan pertama."*

Player nemuin baris `02:13:42 — UPDATE — vehicle_relationship` — di luar jam kerja, gak ada aktivitas resmi jam segitu. Evidence pertama dibuat, Timeline dapet node pertamanya. Raka ngingetin: *"Jangan pernah menyamakan waktu... dengan pelaku."* (waktu nunjukkin KAPAN, bukan SIAPA — prinsip penting yang harus tetep dipegang sepanjang chapter).

Player lanjut nyari aktivitas di sekitar jam itu — ketemu 8 baris berurutan (02:11 LOGIN sampai 02:18 SYSTEM_SYNC), SEMUANYA dari akun yang sama: `system_sync`. Ini akun sistem — kenapa dia yang ngelakuin UPDATE manual? Evidence kedua, Timeline node kedua.

Player lacak lebih jauh lewat Session Log — ketemu 1 sesi: login 02:11, logout 02:17, tapi `client_host: UNKNOWN`. Gak ada nama server, gak ada IP, gak ada lokasi. SOP internal eksplisit bilang "Semua Service Account wajib memiliki Host terdaftar." Kalau host-nya hilang, berarti ada yang sengaja disembunyiin. Evidence ketiga, Timeline node ketiga — sekarang urutannya jelas: 02:11 → 02:13 → 02:14.

Raka nutup dengan disiplin investigatif yang jadi fondasi seluruh case: *"Itu asumsi... Yang kita tahu, Host tidak tercatat. Itu fakta. Investigasi tidak berjalan menggunakan dugaan. Investigasi berjalan menggunakan fakta."*

---

# Hook Psikologis

| Fase | Curiosity | Lainnya |
|---|---|---|
| PU1 (Timeline & Evidence lahir) | 90% | Professionalism 70%, Discovery 80%, Confidence 50% |
| PU2 (pola mulai kebentuk) | — | Filtering, interpretasi — bukan sekadar baca output |
| PU3 (reveal identitas hilang) | 90% | Understanding — Timeline jadi 3 node berurutan, "belum ada pelaku, tapi kini ada arah" |

**Prinsip wajib dijaga:**
- Timeline & Evidence Locker BUKAN fitur kosmetik — jangan render sebagai inventory RPG biasa. Evidence Locker cuma nyimpen FAKTA tervalidasi, bukan hipotesis/opini.
- Dialog Raka gak pernah langsung nyimpulin siapa pelakunya. Prinsip "observasi ≠ bukti" dan "waktu ≠ pelaku" harus konsisten dijaga sepanjang dialog manapun ke depan, bukan cuma chapter ini.

---

# Objective Walkthrough

## Objective 1 — Audit Log Pertama

| | |
|---|---|
| **Story** | "Kita tidak akan membaca semuanya. Kita hanya mencari perubahan pertama." |
| **Goal** | "Lihat seluruh aktivitas di tabel audit_log." |
| **Expected SQL** | `SELECT * FROM audit_log;` |
| **Hasil valid** | 12 baris |

**Detail hook:** Player harus notice sendiri baris `02:13:42 UPDATE vehicle_relationship` di antara 11 baris lain yang normal (aktivitas jam kerja). Jangan highlight apapun.

**Transisi (notebook otomatis, popup):**
> NB-C002-006: "Perubahan pertama terjadi pukul 02:13. Tidak ada aktivitas resmi pada jam tersebut."

Ini teks yang men-trigger Evidence #1 (`EV-C002-001`) dan Timeline Node #1 muncul otomatis di Evidence Locker/Timeline (lihat Track B).

---

## Objective 2 — Pola di Sekitar 02:13

| | |
|---|---|
| **Story** | "Jika perubahan pertama terjadi pukul 02:13, mungkin ada aktivitas lain yang terjadi pada waktu yang berdekatan." |
| **Goal** | "Cari seluruh aktivitas audit_log antara pukul 02:10:00 dan 02:20:00, diurutkan berdasarkan waktu." |
| **Expected SQL** | `SELECT * FROM audit_log WHERE timestamp BETWEEN '02:10:00' AND '02:20:00' ORDER BY timestamp;` |
| **Hasil valid** | 8 baris, semua `username: 'system_sync'` |

**Detail hook:** 8 baris berurutan (LOGIN → SELECT → UPDATE → UPDATE → SELECT → COMMIT → LOGOUT → SYSTEM_SYNC), semua akun sama. Player harus sendiri notice bahwa akun SISTEM ngelakuin UPDATE manual — itu ganjil.

**Transisi (notebook otomatis, popup):**
> NB-C002-008: "Aktivitas UPDATE dilakukan menggunakan akun sistem. Jika benar... seseorang mungkin berusaha menyembunyikan identitasnya."

Trigger Evidence #2 (`EV-C002-002`) + Timeline Node #2.

---

## Objective 3 — Lacak Sesi system_sync

| | |
|---|---|
| **Story** | "Kalau akun system_sync melakukan UPDATE... maka pasti ada Session yang memulainya." |
| **Goal** | "Lacak sesi akun system_sync di tabel session_log." |
| **Expected SQL** | `SELECT * FROM session_log WHERE username = 'system_sync';` |
| **Hasil valid** | 1 baris, `client_host: 'UNKNOWN'` |

**Detail hook:** Ini titik reveal chapter — `client_host: UNKNOWN` berarti gak ada nama server/IP/lokasi. SOP eksplisit bilang ini seharusnya gak mungkin buat service account. Setelah ini selesai, chapter tamat (gak ada objective SQL lagi).

**Transisi (level-complete, custom, bukan lewat registry — lihat Track B):**
> NB-C002-010: "Session berhasil ditemukan. Tetapi identitas perangkat hilang. Seolah koneksi berasal dari tempat yang tidak dikenal."

Trigger Evidence #3 (`EV-C002-003`) + Timeline Node #3. Diikuti dialog singkat Raka soal "observasi ≠ bukti" (dipadetin jadi 1 popup, bukan chain panjang), lalu → Report.

---

## Report Submission

4 opsi:
- Sistem mengalami error acak yang tidak berbahaya.
- Admin biasa lupa logout, menyebabkan aktivitas tercatat aneh.
- **Tiga bukti independen (waktu di luar jam kerja, akun sistem yang melakukan UPDATE manual, dan sesi tanpa identitas perangkat) menunjukkan pola yang sama — kemungkinan besar seseorang mengakses sistem secara tersembunyi.** ← jawaban benar
- Karena pelakunya memakai akun sistem, sudah pasti itu adalah admin database resmi.

**Detail hook — opsi jebakan:** Opsi keempat sengaja jebakan "menyamakan waktu/akun dengan pelaku" — persis yang diperingatkan Raka di PU1 ("Jangan pernah menyamakan waktu dengan pelaku"). Pemain yang gak merhatiin peringatan itu bakal kepancing pilih opsi ini.

**Twist penutup:**
> Supervisor Raka: "Itu asumsi. Yang kita tahu, Host tidak tercatat. Itu fakta.\n\nInvestigasi tidak berjalan menggunakan dugaan.\n\nInvestigasi berjalan menggunakan fakta.\n\nTiga node. Satu pola. Belum ada pelaku. Tapi kini ada arah.\n\n*** CHAPTER 3 (CASE #002) COMPLETE ***"

---

# Definition of Done Check

* [ ] `audit_log`/`session_log` lokal di `chapter3.ts` (bukan `masterRegistry.ts` — ini data investigasi spesifik chapter, bukan entitas lintas-case).
* [ ] Timeline & Evidence Locker masuk `unlockedApps` chapter ini.
* [ ] 3 evidence + 3 timeline node muncul otomatis dari kondisi notebook, gak ada tombol "Create Evidence" manual.
* [ ] Gak ada highlight visual di baris anomali manapun.
* [ ] Dialog Raka gak pernah eksplisit nunjuk pelaku — tetep "observasi ≠ bukti".
* [ ] Gak ada penyebutan sintaks SQL eksplisit di `story`/`goal`/dialog.
