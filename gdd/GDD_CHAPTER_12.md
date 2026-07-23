# GDD_CHAPTER_12.md

**Chapter:** 12 — *(judul diusulkan: "Orang di Dalam")*
**Version:** 1.0 — **PROPOSED, BELUM DIIMPLEMENTASIKAN**
**Status:** DRAFT — butuh kode baru, bukan sinkronisasi ke kode existing
**Classification:** Chapter GDD — CASE #001 (Finale)

> **[High confidence]** Chapter 12 tidak ada di codebase saat ini. `levels.ts` cuma daftar chapter 1-11. Tidak ada `chapter12.ts`, tidak ada logic `currentLevelId === 12` di manapun di `App.tsx`, tidak ada entri tabel baru di `DBListScreen.tsx`. Dokumen ini BUKAN sinkronisasi 1:1 seperti Ch1-11 — ini proposal desain lengkap + kode implementasi siap-pakai, supaya bisa langsung dijalankan sebagai instruksi build, bukan dokumentasi retroaktif.

---

## Kenapa Chapter 12 Perlu Ada

`QuestCompleteScreen.handleNextLevel` mengecek `currentLevelId < LEVELS.length`. Karena Chapter 11 = `LEVELS.length` (11), begitu pemain menekan "NEXT CHAPTER" di akhir Ch11, mereka cuma dilempar balik ke `HOME` tanpa konten apapun. Case 001 secara mekanik **belum ditutup** — cliffhanger "YOUR CURRENT LOCATION: [KNOWN]" menggantung tanpa resolusi.

CASE #002 Overview (`00_CASE_OVERVIEW.md`) eksplisit bilang: *"Player bukan lagi Rookie Investigator. Supervisor Raka mulai mempercayai kemampuan investigasi pemain."* Itu prasyarat relasi yang cuma masuk akal kalau Case 001 selesai dengan Raka **kembali**, bukan menghilang selamanya. Chapter 12 adalah penutup wajib sebelum Case 002 bisa mulai dengan koheren.

---

## Chapter Snapshot (Diusulkan)

| Item | Detail |
|---|---|
| SQL Stage | Stage 5 — Sintesis (menggabungkan seluruh teknik: WHERE, JOIN, LIKE, subquery, window function) tanpa kapabilitas baru |
| Teknik SQL dipakai | Tidak ada kapabilitas baru — chapter ini sengaja murni aplikasi ulang teknik lama, bukan pengajaran teknik baru (pola "chapter finale = sintesis" ini konsisten dengan CASE #002 Overview: *"Tidak ada tutorial eksplisit"*) |
| Tabel database baru | `personnel` (staf/petugas dengan badge ID), `badge_logs` (log akses fisik Police HQ) |
| App/menu terlibat | INBOX, CASE_FILES, DB_LIST (tabel baru), TERM, TIMELINE, EVIDENCE, NOTEBOOK — **tidak ada app baru**, selaras constraint `00_CASE_OVERVIEW.md`: *"Tidak ada menu baru tanpa kebutuhan investigasi."* |
| Thread yang diresolusi | Seed Chapter 11 (B7710XR muncul di Police HQ jam 14:00) + seed Chapter 9-10 ("musuh punya akses dalam ke sistem kepolisian", "seseorang di dalam membantu Arunika") |

---

## Latar Belakang Naratif

Sejak Chapter 8, ancaman berulang kali menegaskan sesuatu yang tidak pernah dikonfirmasi identitasnya: **ada orang di dalam kepolisian sendiri** yang membantu Arunika menutupi jejak — investigator 8 tahun lalu dihapus (Ch9), IT Dept diduga bekerja sama menjadwalkan maintenance kamera (Ch10), dan mobil perusahaan Arunika singgah ke Police HQ sendiri (Ch11, seed data `B7710XR` di lokasi `Police HQ` jam 14:00). Chapter 12 adalah titik di mana ketiga thread ini disatukan lewat satu teknik yang sudah sepenuhnya dikuasai pemain: menghubungkan bukti lintas-tabel, bukan mempelajari yang baru.

Ini selaras filosofi CASE #002 (*"Finding Connections"*) sebagai jembatan — Chapter 12 secara sengaja dirancang sebagai **chapter transisi gaya bermain**: bukan lagi "pelajari alat baru per chapter" (pola CASE #001 dari Ch1-11), tapi "pakai semua alat sekaligus untuk satu kesimpulan besar" — persis pola yang akan jadi default di CASE #002.

---

## Hook Psikologis

`mail.body` (diusulkan) — pertama kalinya sejak Ch10 pesan datang bukan dari `SYSTEM MESSAGE` atau `Unknown Number`, tapi kembali dari Raka sendiri, disamarkan:

> "Ini saya. Jangan balas ke nomor ini — pakai jalur lama. Kalau kamu masih membaca ini, artinya kamu belum berhenti. Saya butuh satu hal terakhir: cari tahu siapa di Police HQ yang membuka pintu untuk mobil Arunika itu. Setelah itu... temui saya."

**Efek psikologis yang dituju:** ini pesan pertama Raka setelah 3 chapter absen (Ch9-11) — bukan lagi ancaman dari pihak lawan, tapi konfirmasi dia masih hidup, disertai instruksi terakhir sekaligus permintaan pertemuan personal (mengulang kalimat pembuka Ch11: "temui saya setelah kasus selesai"). Kalimat "kalau kamu masih membaca ini, artinya kamu belum berhenti" secara implisit mengakui risiko yang sudah pemain jalani tanpa pernah dinyatakan eksplisit sepanjang 11 chapter — pengakuan itu sendiri adalah bentuk penghormatan yang belum pernah diberikan Raka sebelumnya (selaras `00_CASE_OVERVIEW.md`: *"Supervisor Raka mulai mempercayai kemampuan investigasi pemain"*).

---

## Objective Walkthrough (Diusulkan)

### Objective 1

**Story:** Tinjau ulang kapan mobil PT Arunika Logistics (B7710XR) pernah muncul di Police HQ.
**Goal:** Cari catatan camera_logs dengan plate_number B7710XR dan location Police HQ.
**Expected SQL:** `SELECT * FROM camera_logs WHERE plate_number='B7710XR' AND location='Police HQ';`

*Detail hook:* Data ini **sudah ada** di `chapter11.ts` (`{ camera_id: 'H01', plate_number: 'B7710XR', capture_time: '2024-07-16 14:00', location: 'Police HQ' }`) — Objective 1 chapter 12 sengaja query ulang tabel lama dari chapter sebelumnya (bukan tabel baru), menegaskan pola "chapter finale = koneksi ulang, bukan data baru". Kalau engine tidak membawa data lintas-chapter secara otomatis, tabel `camera_logs` dengan baris ini perlu didefinisikan ulang di `database` chapter12.ts (lihat kode di bawah).

---

### Objective 2 — Tabel Baru (badge_logs)

**Story:** Cari siapa yang menggunakan badge akses di Police HQ tepat di sekitar jam 14:00 hari itu.
**Goal:** Cari data di tabel badge_logs dengan waktu akses antara 13:55 dan 14:05.
**Expected SQL:** `SELECT * FROM badge_logs WHERE access_time BETWEEN '13:55' AND '14:05';`

*Detail hook:* Hasil: 1 baris — `badge_id: 'B-118'`, `gate: 'Visitor Entrance'`. Cuma nomor badge, belum ada nama — pola foreign key yang sudah sangat familiar sejak Ch3 dan Ch9, dipakai ulang tanpa penjelasan.

---

### Objective 3 — Tabel Baru (personnel)

**Story:** Cari siapa pemilik badge B-118 di tabel personnel.
**Goal:** Cari data personnel dengan badge_id B-118.
**Expected SQL:** `SELECT * FROM personnel WHERE badge_id='B-118';`

*Detail hook:* Hasil: nama seorang staf administrasi (**bukan** Raka, bukan tersangka utama manapun yang sudah dikenal pemain — sengaja nama baru, level rendah, `role: 'Administrasi Umum'`) — mengonfirmasi pola korupsi sistemik (orang kecil dipakai sebagai celah), bukan konspirasi satu penjahat besar. Ini penting secara tematik: villain sebenarnya (dalang di balik penghapusan data, siapa yang memerintah) **sengaja tidak diberi nama utuh di chapter ini** — dibiarkan terbuka untuk CASE #002.

---

### Objective 4 — Sintesis (subquery + JOIN, tanpa kapabilitas baru)

**Story:** Cari apakah staf ini juga pernah terhubung dengan kasus Arunika di masa lalu.
**Goal:** Cari staf ini di tabel evidence/suspects/cases lama (chapter 9) berdasarkan nama yang sama.
**Expected SQL (contoh):** `SELECT * FROM cases WHERE lead_investigator = (SELECT id FROM personnel WHERE badge_id='B-118');` *(atau pola serupa, tergantung skema final)*

*Detail hook:* [Medium confidence — tergantung keputusan desain final] Idealnya staf ini **bukan** investigator ID 52 yang hilang di Ch9 (supaya tidak menyederhanakan dua misteri jadi satu orang yang sama, yang akan terasa terlalu rapi/murah secara naratif). Lebih kuat kalau staf ini cuma "penghubung" — orang yang membukakan akses fisik, bukan otak di baliknya. Objective ini murni mengonfirmasi ketiadaan hubungan langsung (hasil kosong lagi, pola callback ke Ch9), memperkuat kesan bahwa jaringan ini lebih besar dari satu orang.

---

### Objective 5 — Penutup

**Story:** Laporkan temuan sekaligus coba hubungi Raka di titik pertemuan yang disebutkan.
**Goal:** (Non-SQL / cutscene) — transisi ke CALLING atau lokasi pertemuan via popup, bukan query baru.

*Detail hook:* Alih-alih objective SQL kelima, chapter ditutup dengan sequence non-SQL (pola sudah ada presedennya: Ch6 ending pakai `CallingScreen`, Ch9 ending pakai `TIMELINE` lalu `QUEST_COMPLETE` tanpa SQL tambahan). Raka ditemukan **hidup, tapi terluka/dalam persembunyian** — bukan mati (menjaga nada CASE #002 yang menyiratkan hubungan pemain-Raka berlanjut), bukan juga sepenuhnya aman (kasus dalang utama belum tertangkap).

---

## Report Submission (Diusulkan)

**Pertanyaan:** "Apa kesimpulan akhir Case #001?"

4 opsi (pola 4-opsi konsisten Ch6/Ch8/Ch9):
- Kasus ditutup total, semua pelaku tertangkap.
- **Badge staf administrasi Police HQ (B-118) dipakai untuk membuka akses bagi kendaraan PT Arunika Logistics, mengonfirmasi ada pihak di dalam kepolisian yang membantu menutupi kasus lama. Dalang utama di balik penghapusan data investigator dan pengawasan real-time terhadap tim penyelidik masih belum teridentifikasi.** ← jawaban benar
- PT Arunika Logistics sepenuhnya tidak bersalah.
- Supervisor Raka adalah dalang di balik semuanya.

*Detail hook — opsi jebakan terakhir:* Opsi "Raka adalah dalang" sengaja dipasang sebagai jebakan paling agresif di seluruh CASE #001 — memanfaatkan kecurigaan alami pemain terhadap tokoh yang absen lama (Ch9-11). Tidak ada bukti data yang mendukung ini di manapun; opsi ini melatih pemain untuk tidak menyimpulkan dari ketidakhadiran/kecurigaan naratif semata, harus tetap berbasis data — sesuai Investigation Pillar #1 CASE #002 (*"Evidence Before Conclusion"*).

**Twist penutup (diusulkan):**

> Raka (suara lemah, lewat telepon/pesan): "Kamu benar. Bukan cuma satu orang. Kasus ini... lebih besar dari yang kita berdua kira. Tapi untuk sekarang — istirahatlah. Kita baru saja mulai."
>
> *** CASE #001 COMPLETE ***
> *** CASE #002: [Judul TBD] — akan segera dimulai ***

---

## Kode Implementasi (Draft — Siap Dijalankan)

```typescript
// src/game/levels/case001/chapter12.ts
import { Level } from '../../../types';

export const chapter12: Level = {
  id: 12,
  title: 'Case #001: Orang di Dalam',
  mail: {
    sender: 'Raka (Nomor Tidak Dikenal)',
    subject: 'Ini saya.',
    body: 'Ini saya. Jangan balas ke nomor ini — pakai jalur lama.\nKalau kamu masih membaca ini, artinya kamu belum berhenti.\n\nSaya butuh satu hal terakhir: cari tahu siapa di Police HQ yang membuka pintu untuk mobil Arunika itu.\n\nSetelah itu... temui saya.',
  },
  files: {
    title: 'Internal Affairs Access Index',
    content: 'POLICE INTERNAL DATABASE\n\nTables:\n- personnel (id, badge_id, name, role)\n- badge_logs (badge_id, gate, access_time)\n- camera_logs (dari arsip lalu lintas)',
  },
  database: {
    camera_logs: [
      { camera_id: 'H01', plate_number: 'B7710XR', capture_time: '14:00', location: 'Police HQ' }
    ],
    badge_logs: [
      { badge_id: 'B-118', gate: 'Visitor Entrance', access_time: '13:58' },
      { badge_id: 'B-042', gate: 'Staff Entrance', access_time: '08:02' }
    ],
    personnel: [
      { id: 1, badge_id: 'B-118', name: 'Yusuf Hamdani', role: 'Administrasi Umum' },
      { id: 2, badge_id: 'B-042', name: 'Siti Marlina', role: 'IT Support' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Tinjau ulang kapan mobil PT Arunika Logistics (B7710XR) pernah muncul di Police HQ.',
      goal: "Cari catatan camera_logs dengan plate_number B7710XR dan location Police HQ.",
      availableTokens: ['SELECT', '*', 'FROM', 'camera_logs', 'WHERE', 'plate_number', '=', "'B7710XR'", 'AND', 'location', '=', "'Police HQ'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('camera_logs') && q.includes('police hq') && res && res.length > 0;
      }
    },
    {
      id: 2,
      story: 'Cari siapa yang menggunakan badge akses di Police HQ tepat di sekitar jam 14:00 hari itu.',
      goal: "Cari data di tabel badge_logs dengan waktu akses antara 13:55 dan 14:05.",
      availableTokens: ['SELECT', '*', 'FROM', 'badge_logs', 'WHERE', 'access_time', 'BETWEEN', "'13:55'", 'AND', "'14:05'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('badge_logs') && q.includes('between') && res && res.length === 1 && res[0].badge_id === 'B-118';
      }
    },
    {
      id: 3,
      story: 'Cari siapa pemilik badge B-118 di tabel personnel.',
      goal: "Cari data personnel dengan badge_id B-118.",
      availableTokens: ['SELECT', '*', 'FROM', 'personnel', 'WHERE', 'badge_id', '=', "'B-118'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('personnel') && q.includes('b-118') && res && res.length === 1 && res[0].name === 'Yusuf Hamdani';
      }
    }
  ],
  report: {
    question: 'Apa kesimpulan akhir Case #001?',
    options: [
      'Kasus ditutup total, semua pelaku tertangkap.',
      'Badge staf administrasi Police HQ (B-118) dipakai untuk membuka akses bagi kendaraan PT Arunika Logistics, mengonfirmasi ada pihak di dalam kepolisian yang membantu menutupi kasus lama. Dalang utama masih belum teridentifikasi.',
      'PT Arunika Logistics sepenuhnya tidak bersalah.',
      'Supervisor Raka adalah dalang di balik semuanya.'
    ],
    correctIndex: 1,
    conclusion: 'Raka:\nKamu benar. Bukan cuma satu orang.\nKasus ini... lebih besar dari yang kita berdua kira.\nTapi untuk sekarang — istirahatlah. Kita baru saja mulai.\n\n*** CASE #001 COMPLETE ***'
  }
};
```

---

## Patch Wajib Agar Chapter 12 Bisa Jalan (Track B)

```
PENTING: Ini BUKAN patch ke kode existing yang salah — ini instruksi WIRING kode baru yang belum ada sama sekali. Tanpa langkah ini, chapter12.ts di atas TIDAK akan muncul di game meski filenya dibuat.

1. src/game/levels.ts
   - Tambah: import { chapter12 } from './levels/case001/chapter12';
   - Tambah chapter12 ke array LEVELS, setelah chapter11.

2. src/components/screens/DBListScreen.tsx
   - Tambah 'Personnel', 'Badge Logs' ke array tableNames.
   - Tambah kondisi isLocked baru:
     ((t === 'Personnel' || t === 'Badge Logs') && currentLevelId < 12)
   - Tanpa ini, tabel personnel/badge_logs TIDAK akan muncul sebagai tombol di DB_LIST meski ada di database chapter — pemain harus tahu nama tabel persis dan mengetik manual di TERM, yang melanggar pola akses semua chapter sebelumnya.

3. src/App.tsx, handleObjectiveComplete
   - Tambah blok "else if (currentLevelId === 12) { ... }" dengan transisi antar-objective (pola sama seperti blok currentLevelId === 9/10/11).
   - Tambah handling ending chapter 12 di bagian "Level complete flow" (else block) — perlu keputusan apakah pakai CALLING screen (reuse pola Ch6) atau popup chain biasa untuk sequence "temui Raka".

4. src/App.tsx, handleAcceptMission
   - Tambah blok "else if (currentLevelId === 12)" dengan popupTitle/popupMessage MISSION ACCEPTED standar (pola Ch1-11), TANPA baris "New query capabilities unlocked" (chapter ini tidak punya kapabilitas baru, sesuai desain).

5. src/game/chapterSetup.ts, getChapterSetupData
   - Tidak perlu app baru ditambahkan ke baseApps (chapter 12 tidak butuh app baru).
   - Perlu tambah reconstructedMessages case untuk chapter 12 di loop for (mengikuti pola c===6 dsb) KALAU chapter 12 punya pesan anonim/spesial yang perlu direkonstruksi saat replay chapter.

6. QuestCompleteScreen.tsx
   - Tidak perlu diubah — handleNextLevel sudah otomatis menangani "currentLevelId < LEVELS.length" dengan benar begitu chapter12 masuk LEVELS array. Setelah Ch12 selesai (currentLevelId = 12 = LEVELS.length), tombol akan kembali ke HOME — ini SEKARANG benar secara desain (Case 001 selesai, Case 002 belum ada kodenya), bukan bug.

Setelah langkah 1-4 selesai, uji: buka DevConsole → CHAPTERS tab → jump ke Chapter 12 → pastikan Objective 1-3 bisa diselesaikan lewat DB_LIST/TERM tanpa error "TABLE NOT FOUND".
```
