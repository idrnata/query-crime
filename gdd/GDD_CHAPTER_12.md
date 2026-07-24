# GDD_CHAPTER_12.md

**Chapter:** 12 — *(judul diusulkan: "Orang di Dalam")*
**Version:** 1.1 — **PROPOSED, BELUM DIIMPLEMENTASIKAN**
**Status:** DRAFT — butuh kode baru, bukan sinkronisasi ke kode existing
**Classification:** Chapter GDD — CASE #001 (Finale + Epilog)

> **[High confidence]** Chapter 12 tidak ada di codebase saat ini. `levels.ts` cuma daftar chapter 1-11. Tidak ada `chapter12.ts`, tidak ada logic `currentLevelId === 12` di manapun di `App.tsx`, tidak ada entri tabel baru di `DBListScreen.tsx`. Dokumen ini BUKAN sinkronisasi 1:1 seperti Ch1-11 — ini proposal desain lengkap + kode implementasi siap-pakai.

**Perubahan dari v1.0:** Objective 4 (subquery) sekarang didefinisikan penuh, bukan opsional. Objective 5 versi lama ("pertemuan Raka" sebagai SQL objective kelima) **dihapus** — diganti Epilog non-SQL setelah Report, mengikuti pola mekanik yang sudah ada di Ch6/9/10/11 (pertemuan/twist penutup selalu hidup di "Level complete flow" `App.tsx`, bukan sebagai objective dengan `validateResult`, karena engine memaksa tiap objective lewat TERM→RESULT→validateResult — "ketemu orang" bukan hal yang bisa divalidasi lewat query).

---

## Kenapa Chapter 12 Perlu Ada

`QuestCompleteScreen.handleNextLevel` mengecek `currentLevelId < LEVELS.length`. Karena Chapter 11 = `LEVELS.length` (11), begitu pemain menekan "NEXT CHAPTER" di akhir Ch11, mereka cuma dilempar balik ke `HOME` tanpa konten apapun. Case 001 secara mekanik **belum ditutup** — cliffhanger "YOUR CURRENT LOCATION: [KNOWN]" menggantung tanpa resolusi.

CASE #002 Overview (`00_CASE_OVERVIEW.md`) eksplisit bilang: *"Player bukan lagi Rookie Investigator. Supervisor Raka mulai mempercayai kemampuan investigasi pemain."* Itu prasyarat relasi yang cuma masuk akal kalau Case 001 selesai dengan Raka **kembali**, bukan menghilang selamanya. Chapter 12 adalah penutup wajib sebelum Case 002 bisa mulai dengan koheren.

---

## Chapter Snapshot (Diusulkan)

| Item | Detail |
|---|---|
| SQL Stage | Stage 5 — Sintesis (WHERE, JOIN, LIKE, subquery, window function sudah dikuasai) — chapter ini tidak mengajarkan kapabilitas baru |
| Teknik SQL dipakai | Subquery (pengulangan pola Ch9), BETWEEN (pengulangan Ch4), pencocokan sederhana |
| Tabel database baru | `personnel`, `badge_logs` |
| Tabel database lama, didefinisikan ulang | `camera_logs` (dari Ch11), `cases`, `suspects` (dari Ch9) — engine (`executeSql`) hanya membaca `currentLevel.database`, tidak ada state lintas-chapter otomatis, jadi tabel yang dibutuhkan untuk query lintas-kasus harus di-declare ulang di `chapter12.ts` |
| App/menu terlibat | INBOX, CASE_FILES, DB_LIST (tabel baru), TERM, EVIDENCE, NOTEBOOK, **CONTACTS/CALLING** (untuk epilog) — tidak ada app baru |
| Struktur | 4 Objective SQL (sintesis) → Report → **Epilog non-SQL** (pertemuan Raka + penutup Case 001) |
| Thread yang diresolusi | Seed Ch11 (B7710XR di Police HQ 14:00) + seed Ch9-10 ("orang dalam kepolisian") + cliffhanger lokasi diketahui (Ch11 ending) |

---

## Latar Belakang Naratif

Sejak Chapter 8, ancaman berulang kali menegaskan sesuatu yang tidak pernah dikonfirmasi identitasnya: **ada orang di dalam kepolisian sendiri** yang membantu Arunika menutupi jejak — investigator 8 tahun lalu dihapus (Ch9), IT Dept diduga bekerja sama menjadwalkan maintenance kamera (Ch10), dan mobil perusahaan Arunika singgah ke Police HQ sendiri (Ch11). Chapter 12 menyatukan ketiga thread ini lewat teknik yang sudah sepenuhnya dikuasai pemain — bukan pelajaran baru, murni koneksi.

Objective 4 secara sengaja memakai subquery untuk **membuktikan ketidakterhubungan**, bukan menemukan koneksi baru — pengulangan pola Ch9 (subquery dipakai untuk konfirmasi "record memang dihapus/tidak ada", bukan cuma untuk "menemukan sesuatu"). Ini penting temanya: staf yang ditemukan di Objective 3 bukan dalang, cuma titik akses yang dimanfaatkan — subquery Objective 4 yang membuktikan itu lewat hasil kosong, bukan dialog yang menyatakannya.

---

## Hook Psikologis

`mail.body` (diusulkan) — pertama kalinya sejak Ch10 pesan datang bukan dari `SYSTEM MESSAGE` atau `Unknown Number`, tapi kembali dari Raka sendiri, disamarkan:

> "Ini saya. Jangan balas ke nomor ini — pakai jalur lama. Kalau kamu masih membaca ini, artinya kamu belum berhenti. Saya butuh satu hal terakhir: cari tahu siapa di Police HQ yang membuka pintu untuk mobil Arunika itu. Setelah itu... temui saya."

**Efek psikologis yang dituju:** pesan pertama Raka setelah 3 chapter absen (Ch9-11) — bukan lagi ancaman dari pihak lawan, tapi konfirmasi dia masih hidup, disertai instruksi terakhir sekaligus permintaan pertemuan personal. Kalimat "kalau kamu masih membaca ini, artinya kamu belum berhenti" mengakui risiko yang sudah pemain jalani tanpa pernah dinyatakan eksplisit sepanjang 11 chapter.

---

## Objective Walkthrough (Diusulkan)

### Objective 1

**Story:** Tinjau ulang kapan mobil PT Arunika Logistics (B7710XR) pernah muncul di Police HQ.
**Goal:** Cari catatan camera_logs dengan plate_number B7710XR dan location Police HQ.
**Expected SQL:** `SELECT * FROM camera_logs WHERE plate_number='B7710XR' AND location='Police HQ';`

*Detail hook:* Data ini sudah ada di `chapter11.ts` — Objective 1 chapter 12 sengaja query ulang tabel lama (didefinisikan ulang di `database` chapter12.ts, lihat catatan sinkronisasi di Chapter Snapshot), menegaskan pola "chapter finale = koneksi ulang, bukan data baru".

---

### Objective 2 — Tabel Baru (badge_logs)

**Story:** Cari siapa yang menggunakan badge akses di Police HQ tepat di sekitar jam 14:00 hari itu.
**Goal:** Cari data di tabel badge_logs dengan waktu akses antara 13:55 dan 14:05.
**Expected SQL:** `SELECT * FROM badge_logs WHERE access_time BETWEEN '13:55' AND '14:05';`

*Detail hook:* Hasil: 1 baris — `badge_id: 'B-118'`, `gate: 'Visitor Entrance'`. Cuma nomor badge, belum ada nama — pola foreign key familiar sejak Ch3/Ch9, dipakai tanpa penjelasan.

---

### Objective 3 — Tabel Baru (personnel)

**Story:** Cari siapa pemilik badge B-118 di tabel personnel.
**Goal:** Cari data personnel dengan badge_id B-118.
**Expected SQL:** `SELECT * FROM personnel WHERE badge_id='B-118';`

*Detail hook:* Hasil: **Yusuf Hamdani**, `role: 'Administrasi Umum'` — nama baru, level rendah, bukan Raka atau tersangka utama manapun. Mengonfirmasi pola korupsi sistemik (orang kecil dipakai sebagai celah), bukan konspirasi satu penjahat besar.

---

### Objective 4 — Sintesis (Subquery, WAJIB ADA)

| | |
|---|---|
| **Story** | Cek apakah Yusuf Hamdani pernah tercatat sebagai tersangka di kasus Arunika lama — cari case_id-nya dulu, lalu langsung pakai di query yang sama. |
| **Goal** | Cari data di tabel suspects yang case_id-nya sama dengan case_id dari kasus Arunika, dengan menyisipkan pencarian kasus itu langsung di dalam query ini. |
| **Expected SQL** | `SELECT * FROM suspects WHERE case_id = (SELECT case_id FROM cases WHERE title LIKE '%Arunika%');` |

**Detail hook:** Ini pengulangan pola subquery persis Chapter 9 Objective 5 (sudah terbukti jalan di engine — memakai mekanisme subquery-di-WHERE yang sama, risiko implementasi rendah). Hasil: **0 baris** — Yusuf tidak pernah tercatat sebagai suspect resmi kasus Arunika. Hasil kosong ini justru jawaban yang dicari (pola ketiga kalinya di CASE #001: Ch4 Obj4, Ch9 Obj2/3/5) — mengonfirmasi Yusuf cuma alat akses, bukan bagian dari catatan resmi kasus lama. Pastikan UI tetap netral, bukan ditampilkan sebagai kegagalan.

---

## Report Submission (field `report`, bukan objective)

**App/Menu terlibat:** CASE_FILES → Submit Report

4 opsi:
- Kasus ditutup total, semua pelaku tertangkap.
- **Badge staf administrasi Police HQ (B-118, Yusuf Hamdani) dipakai untuk membuka akses bagi kendaraan PT Arunika Logistics. Yusuf tidak pernah tercatat sebagai tersangka resmi kasus lama — ia kemungkinan cuma dimanfaatkan sebagai celah akses, bukan dalang. Pihak yang sebenarnya mengendalikan operasi ini masih belum teridentifikasi.** ← jawaban benar
- PT Arunika Logistics sepenuhnya tidak bersalah.
- Supervisor Raka adalah dalang di balik semuanya.

*Detail hook — opsi jebakan:* "Raka adalah dalang" sengaja dipasang sebagai jebakan paling agresif di CASE #001 — memanfaatkan kecurigaan alami pemain terhadap tokoh yang absen 3 chapter (Ch9-11). Tidak ada bukti data mendukung ini di manapun; opsi ini melatih pemain tetap berbasis data, bukan kecurigaan naratif — sesuai Investigation Pillar CASE #002 *"Evidence Before Conclusion"*.

---

## EPILOG — Penutup Case #001 (non-SQL, hidup di `App.tsx`)

Ini bagian yang diminta eksplisit: pertemuan Raka + penutup Case #001. Karena engine memvalidasi tiap objective lewat query (`validateResult`), "bertemu Raka" **tidak** dijadikan objective kelima — mengikuti pola mekanik yang sudah established di Ch6 (call setelah report benar), Ch9 (flicker→notebook→timeline→quest complete), Ch10 (popup chain→video call), Ch11 (flicker→popup chain threat→quest complete). Epilog Ch12 hidup di percabangan `else` (Level complete flow) `handleReportSelect`, sama seperti chapter-chapter itu.

### Urutan Scripted Event (setelah report benar dipilih, sebelum `QUEST_COMPLETE`)

1. **Flicker singkat** (`isFlickering`, pola standar) — transisi, bukan ancaman kali ini, jadi durasi lebih pendek dari Ch9/Ch11 (kira-kira 1.5 detik, bukan 2-3 detik — nada epilog harus terasa lega, bukan tegang).
2. **Popup SYSTEM:** "Incoming call: Raka (Nomor Tidak Dikenal)" → memicu `appState = 'CALLING'`, `activeCallContact = { id: 'raka', name: 'Raka' }`, kode `callStep` khusus (mis. `1212`, beda dari `666` yang sudah dipakai Ch6) supaya `CallingScreen` tahu harus render dialog epilog Ch12, bukan dialog ending Ch6.
3. **Dialog telepon** (lihat draft `RAKA_CH12_DIALOGUE` di kode di bawah) — 3 tahap, nada Raka lemah tapi hidup, mengonfirmasi dia tahu soal Yusuf, dan menutup dengan pengakuan kasus ini lebih besar dari berdua.
4. **Hang up** → popup penutup non-dialog, murni teks epilog (`EPILOGUE` style, layar gelap dengan teks putih/hijau muncul bertahap — ikuti pola visual `showUnknownMessage` Ch5 tapi tanpa nada ancaman):

   > "Delapan tahun lalu, sebuah kecelakaan menghapus tiga nyawa dan satu identitas.
   > Hari ini, kau menemukan siapa yang menghapusnya — tapi bukan siapa yang memerintahkan penghapusan itu.
   >
   > Raka selamat. Kasus lama ditutup ulang, kali ini dengan benar.
   > Tapi Unknown Number belum pernah tertangkap. PT Arunika Logistics masih beroperasi.
   > Dan seseorang, di suatu tempat, masih tahu persis di mana kau berada.
   >
   > *** CASE #001: COMPLETE ***
   >
   > Kau bukan lagi Rookie Investigator.
   >
   > *** CASE #002 AKAN SEGERA DIMULAI ***"

5. `isLevelComplete = true` → `appState = 'QUEST_COMPLETE'` (memakai `report.conclusion` singkat sebagai isi box standar, sedangkan teks epilog panjang di atas tampil sebagai popup terpisah **sebelum** QUEST_COMPLETE, bukan menggantikannya — supaya `QuestCompleteScreen` tidak perlu diubah strukturnya).

**Detail hook:** Epilog sengaja tidak menjawab semua — Unknown Number dan dalang utama tetap terbuka. Ini konsisten dengan `00_CASE_OVERVIEW.md`: CASE #002 dimulai dari "Finding Connections", bukan dari nol; harus ada benang yang sengaja belum diputus. Raka selamat (bukan mati) karena relasi pemain-Raka adalah fondasi mekanik CASE #002 (Supervisor yang mempercayai pemain) — kalau Raka mati di sini, prasyarat itu runtuh.

---

## Definition of Done Check (Diusulkan)

* [x] Objective 4 (subquery) didefinisikan penuh dengan pola yang sudah terbukti jalan di engine (identik struktur Ch9 Obj5) — bukan lagi opsional.
* [x] Pertemuan Raka + penutup Case #001 diimplementasikan sebagai Epilog non-SQL di `App.tsx`, bukan objective kelima — selaras batasan teknis engine (semua objective wajib lewat `validateResult`).
* [x] Epilog sengaja menyisakan 2 thread terbuka (Unknown Number, dalang utama) sebagai jembatan ke CASE #002.
* [x] Raka dipastikan selamat — prasyarat mekanik CASE #002 ("Supervisor mempercayai pemain").
* [x] Tidak ada penyebutan sintaks eksplisit di `story`/`goal`/dialog manapun.

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
    content: 'POLICE INTERNAL DATABASE\n\nTables:\n- personnel (id, badge_id, name, role)\n- badge_logs (badge_id, gate, access_time)\n- camera_logs (arsip lalu lintas)\n- cases, suspects (arsip criminal records lama)',
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
    ],
    // Didefinisikan ulang dari chapter9.ts agar subquery Objective 4 bisa jalan
    // (engine hanya membaca currentLevel.database, tidak ada state lintas-chapter)
    cases: [
      { case_id: 1, title: 'Traffic Accident Arunika', lead_investigator: 52, status: 'Closed' },
      { case_id: 2, title: 'Warehouse Theft', lead_investigator: 12, status: 'Open' }
    ],
    suspects: [
      { id: 101, case_id: 2, name: 'Unknown' }
      // Sengaja kosong untuk case_id 1 (Arunika) — inti reveal Objective 4
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
    },
    {
      id: 4,
      story: 'Cek apakah Yusuf Hamdani pernah tercatat sebagai tersangka di kasus Arunika lama — cari case_id-nya dulu, lalu langsung pakai di query yang sama.',
      goal: "Cari data di tabel suspects yang case_id-nya sama dengan case_id dari kasus Arunika, dengan menyisipkan pencarian kasus itu langsung di dalam query ini.",
      availableTokens: ['SELECT', '*', 'FROM', 'suspects', 'WHERE', 'case_id', '=', '(', 'SELECT', 'case_id', 'FROM', 'cases', 'WHERE', 'title', 'LIKE', "'%Arunika%'", ')'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('suspects') && q.includes('case_id') && q.includes('(') && q.includes('select') && res && res.length === 0;
      }
    }
  ],
  report: {
    question: 'Apa kesimpulan akhir Case #001?',
    options: [
      'Kasus ditutup total, semua pelaku tertangkap.',
      'Badge staf administrasi Police HQ (B-118, Yusuf Hamdani) dipakai untuk membuka akses bagi kendaraan PT Arunika Logistics. Yusuf tidak pernah tercatat sebagai tersangka resmi kasus lama — ia kemungkinan cuma dimanfaatkan sebagai celah akses, bukan dalang. Pihak yang sebenarnya mengendalikan operasi ini masih belum teridentifikasi.',
      'PT Arunika Logistics sepenuhnya tidak bersalah.',
      'Supervisor Raka adalah dalang di balik semuanya.'
    ],
    correctIndex: 1,
    conclusion: 'Raka:\nKamu benar. Bukan cuma satu orang.\nKasus ini... lebih besar dari yang kita berdua kira.\nTapi untuk sekarang — istirahatlah. Kita baru saja mulai.\n\n*** CASE #001 COMPLETE ***'
  }
};
```

```typescript
// src/components/screens/CallingScreen.tsx — TAMBAHAN, bukan pengganti
// Tambahkan array dialog baru di samping DINA_DIALOGUE dan RAKA_ENDING_DIALOGUE yang sudah ada:

const RAKA_CH12_DIALOGUE = [
  {
    text: "...Ini aku. Maaf baru bisa kontak lagi sekarang.",
    choices: [
      { text: "Kamu di mana? Kamu baik-baik saja?", nextStep: 1 },
      { text: "Aku menemukan siapa yang membuka akses untuk mobil Arunika di HQ.", nextStep: 1 }
    ]
  },
  {
    text: "Aku aman. Untuk sekarang. Badge B-118... Yusuf, staf administrasi. Dia bukan dalangnya — dia cuma disuruh, atau dibayar, atau diancam. Aku belum tahu yang mana.",
    choices: [
      { text: "Jadi siapa yang sebenarnya mengendalikan semua ini?", nextStep: 2 },
      { text: "Apa yang harus kita lakukan sekarang?", nextStep: 2 }
    ]
  },
  {
    text: "Aku tidak tahu. Belum. Tapi kamu baru saja membuktikan sesuatu yang penting: kamu bisa menemukan orang yang tidak ingin ditemukan. Itu bukan kemampuan yang kupunya delapan tahun lalu. Istirahatlah dulu. Kasus ini belum selesai — tapi untuk malam ini, cukup.",
    choices: [
      { text: "...Baik, Pak.", nextStep: -1 }
    ]
  }
];

// Di dalam CallingScreen component, tambahkan ke percabangan render dialog:
// if (activeCallContact?.id === 'raka' && callStep === 1212) { return RAKA_CH12_DIALOGUE[...] }
// dengan state terpisah, mis. const [ch12Step, setCh12Step] = useState(0), mengikuti pola dinaStep/rakaStep yang sudah ada.
```

```typescript
// src/App.tsx — potongan tambahan di handleReportSelect, blok else-if baru untuk currentLevelId === 12
// Ditempatkan sejajar dengan currentLevelId === 5/6 yang sudah ada di fungsi yang sama.

else if (currentLevelId === 12) {
  setIsFlickering(true);
  setTimeout(() => {
    setIsFlickering(false);
    setPopup({
      title: 'SYSTEM',
      message: 'Incoming call: Raka (Nomor Tidak Dikenal)',
      onClose: () => {
        setPopup(null);
        setActiveCallContact({ id: 'raka', name: 'Raka', phone: 'UNKNOWN' });
        setCallStatus('DIALING');
        setAppState('CALLING');
        setCallStep(1212);
        setTimeout(() => setCallStatus('CONNECTING'), 1200);
        setTimeout(() => setCallStatus('ACTIVE'), 2400);
      }
    });
  }, 1500);
}

// Di handleHangUp (CallingScreen prop, sudah ada di App.tsx), tambahkan percabangan:
// if (activeCallContact?.id === 'raka' && callStep === 1212) {
//   setCallStatus('IDLE');
//   setPopup({
//     title: 'EPILOGUE',
//     message: 'Delapan tahun lalu, sebuah kecelakaan menghapus tiga nyawa dan satu identitas.\nHari ini, kau menemukan siapa yang menghapusnya — tapi bukan siapa yang memerintahkan penghapusan itu.\n\nRaka selamat. Kasus lama ditutup ulang, kali ini dengan benar.\nTapi Unknown Number belum pernah tertangkap. PT Arunika Logistics masih beroperasi.\nDan seseorang, di suatu tempat, masih tahu persis di mana kau berada.\n\n*** CASE #001: COMPLETE ***\n\nKau bukan lagi Rookie Investigator.\n\n*** CASE #002 AKAN SEGERA DIMULAI ***',
//     onClose: () => {
//       setPopup(null);
//       setIsLevelComplete(true);
//       setAppState('QUEST_COMPLETE');
//     }
//   });
//   return;
// }
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
   - Tanpa ini, tabel personnel/badge_logs TIDAK akan muncul sebagai tombol di DB_LIST meski ada di database chapter.

3. src/components/screens/CallingScreen.tsx
   - Tambah RAKA_CH12_DIALOGUE array (lihat kode di atas).
   - Tambah state ch12Step (useState(0)).
   - Tambah percabangan render: kalau activeCallContact?.id === 'raka' DAN callStep === 1212, render RAKA_CH12_DIALOGUE bukan RAKA_ENDING_DIALOGUE (yang dipakai callStep === 666 untuk Ch6).
   - handleChoiceSelect perlu tahu update ch12Step, bukan dinaStep/rakaStep, saat activeCallContact?.id === 'raka' && callStep === 1212.

4. src/App.tsx, handleObjectiveComplete
   - Tambah blok "else if (currentLevelId === 12) { ... }" dengan transisi antar-objective standar (popup Supervisor per nextIdx, pola sama seperti blok currentLevelId === 9).

5. src/App.tsx, handleReportSelect
   - Tambah blok "else if (currentLevelId === 12)" — lihat kode lengkap di atas (flicker → incoming call popup → CALLING dengan callStep 1212).

6. src/App.tsx, handleHangUp (dalam CallingScreen prop render)
   - Tambah percabangan activeCallContact?.id === 'raka' && callStep === 1212 → popup EPILOGUE → QUEST_COMPLETE (lihat kode di atas).

7. src/App.tsx, handleAcceptMission
   - Tambah blok "else if (currentLevelId === 12)" dengan popupTitle/popupMessage MISSION ACCEPTED standar (pola Ch1-11), TANPA baris "New query capabilities unlocked" (chapter ini tidak punya kapabilitas baru).

8. src/game/chapterSetup.ts, getChapterSetupData
   - Tidak perlu app baru ditambahkan ke baseApps.
   - Kalau replay chapter 12 dari Settings perlu direkonstruksi pesan Raka "Ini saya." di reconstructedMessages loop (pola c===6 dsb) — opsional, tidak blocking untuk playtest pertama.

9. QuestCompleteScreen.tsx
   - Tidak perlu diubah struktural — begitu chapter12 masuk LEVELS array, handleNextLevel otomatis benar (currentLevelId 12 = LEVELS.length setelah update, kembali ke HOME setelah Ch12 selesai — ini benar secara desain, Case 001 tuntas, Case 002 belum ada kodenya).

Setelah langkah 1-7 selesai, uji dua jalur:
(a) DevConsole → CHAPTERS → jump ke Chapter 12 → selesaikan Objective 1-4 lewat DB_LIST/TERM tanpa error "TABLE NOT FOUND", pastikan Objective 4 subquery mengembalikan 0 baris dan tervalidasi sebagai sukses (bukan dianggap error).
(b) Submit Report jawaban benar → pastikan flicker → popup incoming call → CALLING screen render RAKA_CH12_DIALOGUE (bukan dialog Dina/Ch6 yang salah) → hang up di pilihan terakhir → popup EPILOGUE tampil penuh → QUEST_COMPLETE.
```
