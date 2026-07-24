import { Level } from '../../../types';

export const chapter9: Level = {
  id: 9,
  title: 'Case #001: Nama yang Dihapus',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Surat Izin Lama & Criminal Records',
    body: 'Saya menemukan surat izin lama dari delapan tahun lalu. Ada seorang penyidik yang menangani kecelakaan Arunika, tapi seluruh identitasnya telah dihapus dari arsip. Saya membuka akses ke Criminal Records. Cari tahu siapa yang menangani kasus ini.',
  },
  files: {
    title: 'Criminal Records Index',
    content: 'POLICE DATABASE - CRIMINAL DIVISION\n\nTables Unlocked:\n- persons (id, name, bio)\n- cases (case_id, title, lead_investigator, status)\n- suspects (id, case_id, name)\n- evidence (id, owner_id, document, status)',
  },
  database: {
    persons: [
      { id: 1, name: 'Budi Santoso', bio: 'Reporter' },
      { id: 2, name: 'Rizky Hidayat', bio: 'Penyintas' }
      // ID 52 is missing!
    ],
    cases: [
      { case_id: 1, title: 'Traffic Accident Arunika', lead_investigator: 52, status: 'Closed' },
      { case_id: 2, title: 'Warehouse Theft', lead_investigator: 12, status: 'Open' }
    ],
    suspects: [
      // Empty for Arunika case
      { id: 101, case_id: 2, name: 'Unknown' }
    ],
    evidence: [
      { id: 1, owner_id: 52, document: 'Digital Notebook - Archived', status: 'Archived' },
      { id: 2, owner_id: 12, document: 'CCTV Clip', status: 'Stored' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Buka arsip Criminal Records. Cari data kasus kecelakaan Arunika di tabel cases.',
      goal: "Cari data kasus berjuluk 'Arunika' di tabel cases.",
      availableTokens: ['SELECT', '*', 'FROM', 'cases', 'WHERE', 'title', 'LIKE', "'%Arunika%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('cases') && q.includes('like') && q.includes('%arunika%') && res && res.length > 0;
      }
    },
    {
      id: 2,
      story: 'Kasus itu ditangani oleh investigator ID 52. Periksa identitas investigator tersebut di tabel persons.',
      goal: "Cari data warga/personil dengan ID 52 di tabel persons.",
      availableTokens: ['SELECT', '*', 'FROM', 'persons', 'WHERE', 'id', '=', '52'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('persons') && q.includes('id') && q.includes('52') && res && res.length === 0;
      }
    },
    {
      id: 3,
      story: 'Record ID 52 kosong di persons. Cari personil yang menangani kasus Arunika tanpa mengetik ID-nya secara manual — gunakan hasil pencarian sebelumnya langsung di dalam query ini.',
      goal: "Cari data person yang ID-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika langsung di dalam query ini.",
      availableTokens: ['SELECT', '*', 'FROM', 'persons', 'WHERE', 'id', '=', '(', 'SELECT', 'lead_investigator', 'FROM', 'cases', 'WHERE', 'title', 'LIKE', "'%Arunika%'", ')'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('select') && q.includes('(') && q.includes('lead_investigator') && res && res.length === 0;
      }
    },
    {
      id: 4,
      story: 'Identitasnya disunting, namun bukti kasus mungkin masih tertinggal. Cari barang bukti (evidence) milik penyidik kasus Arunika, dengan cara yang sama seperti sebelumnya.',
      goal: "Cari evidence yang owner_id-nya sama dengan lead_investigator dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama.",
      availableTokens: ['SELECT', '*', 'FROM', 'evidence', 'WHERE', 'owner_id', '=', '(', 'SELECT', 'lead_investigator', 'FROM', 'cases', 'WHERE', 'title', 'LIKE', "'%Arunika%'", ')'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('evidence') && q.includes('owner_id') && q.includes('(') && res && res.length > 0;
      }
    },
    {
      id: 5,
      story: 'Periksa apakah ada daftar tersangka (suspects) resmi yang tercatat untuk kasus kecelakaan Arunika ini.',
      goal: "Cari suspects yang case_id-nya sama dengan case_id dari kasus Arunika, dengan menyisipkan pencarian kasus Arunika di dalam query yang sama.",
      availableTokens: ['SELECT', '*', 'FROM', 'suspects', 'WHERE', 'case_id', '=', '(', 'SELECT', 'case_id', 'FROM', 'cases', 'WHERE', 'title', 'LIKE', "'%Arunika%'", ')'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('suspects') && q.includes('case_id') && q.includes('(') && res && res.length === 0;
      }
    }
  ],
  report: {
    question: 'Kesimpulan apa yang kamu dapatkan dari investigasi Criminal Records?',
    options: [
      'Tidak ada bukti yang tersisa.',
      'Kasus Arunika adalah kecelakaan biasa.',
      'Identitas investigator (ID 52) sengaja dihapus dari database persons, namun jejaknya masih tertinggal di tabel evidence sebagai "Archived Notebook". Tidak ada tersangka yang pernah ditangkap.',
      'Semua data telah dihapus total.'
    ],
    correctIndex: 2,
    conclusion: 'Itu bukan catatan korban. Itu catatan seorang polisi.\nSeseorang telah menghapus identitas investigator resmi kasus ini.\nArtinya musuh kita memiliki akses yang sangat dalam ke sistem kepolisian.\n\n*** CHAPTER 9 COMPLETE ***\nUnlocked: Criminal Records'
  }
};
