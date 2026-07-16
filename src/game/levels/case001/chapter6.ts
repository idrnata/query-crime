import { Level } from '../../../types';

export const chapter6: Level = {
  id: 6,
  title: 'Case #001: Jejak Digital',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Arsip Digital Nasional',
    body: 'Kamera memang mati selama enam menit.\nTapi orang tidak bisa menghapus semua jejaknya.\nSetiap orang meninggalkan jejak digital.\nSaya membuka akses ke Arsip Digital Nasional. Coba cari nama target di tabel Articles.\n\nNEW APP: Browser Unlocked',
  },
  files: {
    title: 'Digital Archive Online',
    content: 'POLICE BROWSER SECURE ACCESS\n\nIndeks database terbuka:\n- Articles (id, title, content, publish_date)\n- Public Records\n- News\n- Announcements',
  },
  database: {
    articles: [
      {
        id: 1,
        title: 'Kecelakaan di Jalan Merdeka, Rizky Selamat dari Insiden',
        content: 'Seorang mahasiswa bernama Rizky Hidayat menjadi satu-satunya korban selamat dalam kecelakaan mobil yang menewaskan tiga orang. Mobil diketahui milik PT Arunika Logistics.',
        publish_date: '2018-05-12'
      },
      {
        id: 2,
        title: 'Sopir Truk Menghilang Setelah Kecelakaan Merdeka',
        content: 'Penyelidik menyatakan sopir truk pengangkut yang bertabrakan dengan mobil PT Arunika Logistics menghilang tanpa jejak setelah kecelakaan.',
        publish_date: '2018-05-14'
      },
      {
        id: 3,
        title: 'Data Kendaraan Kecelakaan Belum Ditemukan',
        content: 'Kepolisian mengonfirmasi bahwa kotak hitam dan data kendaraan dari PT Arunika Logistics belum ditemukan di lokasi kejadian.',
        publish_date: '2018-05-16'
      },
      {
        id: 4,
        title: 'Kasus Kecelakaan PT Arunika Dihentikan',
        content: 'Karena kurangnya bukti dan hilangnya saksi kunci, penyelidikan kasus kecelakaan lalu lintas PT Arunika Logistics resmi dihentikan.',
        publish_date: '2018-06-01'
      },
      {
        id: 5,
        title: 'Profil PT Arunika Logistics',
        content: 'PT Arunika Logistics didirikan untuk melayani kebutuhan logistik medis dan farmasi regional.',
        publish_date: '2017-02-10'
      }
    ],
    companies: [
      {
        id: 1,
        company_name: 'PT Arunika Logistics',
        owner: 'R....',
        status: 'ACTIVE'
      },
      {
        id: 2,
        company_name: 'PT Harapan Jaya',
        owner: 'Budi Santoso',
        status: 'INACTIVE'
      }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Mulai penyelidikan dengan mencari nama "Rizky Hidayat" di database artikel.',
      goal: "SELECT * FROM articles WHERE title='Rizky Hidayat';",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'title', '=', "'Rizky Hidayat'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes("where title = 'rizky hidayat'") && res && res.length === 0;
      }
    },
    {
      id: 2,
      story: 'Coba pencarian yang lebih fleksibel untuk menemukan berita tentang Rizky.',
      goal: "SELECT * FROM articles WHERE title LIKE '%Rizky%';",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'title', 'LIKE', "'%Rizky%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%rizky%') && res && res.length > 0;
      }
    },
    {
      id: 3,
      story: 'Cari apakah Andi pernah disebut publik.',
      goal: 'Query tabel articles menggunakan LIKE untuk mencari Andi atau Prasetyo di content.',
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Andi%'", "'%Prasetyo%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toUpperCase();
        return q.includes('FROM') && q.includes('ARTICLES') && q.includes('LIKE') && (q.includes('ANDI') || q.includes('PRASETYO'));
      }
    },
    {
      id: 4,
      story: 'Temukan hubungan yang tidak terlihat dengan mencari PT Arunika Logistics di database artikel.',
      goal: 'Query tabel articles menggunakan LIKE \'%Arunika%\'.',
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Arunika%'"],
      validateResult: (res) => res && res.length === 5 && res.every(r => r.content.includes('Arunika') || r.title.includes('Arunika'))
    },
    {
      id: 5,
      story: 'Cari data perusahaan PT Arunika Logistics di database perusahaan.',
      goal: 'Query tabel companies menggunakan LIKE \'%Arunika%\'.',
      availableTokens: ['SELECT', '*', 'FROM', 'companies', 'WHERE', 'company_name', 'LIKE', "'%Arunika%'"],
      validateResult: (res) => res && res.length === 1 && res[0].company_name.includes('Arunika')
    }
  ],
  report: {
    question: 'Kirim laporan investigasi jejak digital.',
    options: [
      'Rizky adalah pelaku kecelakaan 8 tahun lalu.',
      'Kasus kecelakaan lama PT Arunika Logistics disengaja.',
      'Rizky selamat dari kecelakaan 8 tahun lalu yang melibatkan PT Arunika Logistics, namun data perusahaan telah dimodifikasi dan sopirnya menghilang.',
      'Sopir truk adalah Andi Prasetyo.'
    ],
    correctIndex: 2,
    conclusion: 'Supervisor Raka:\nLaporan diterima.\nTepat sekali. Rizky selamat dari kecelakaan 8 tahun lalu yang melibatkan PT Arunika Logistics.\nData direktur perusahaan di database juga sengaja dirusak (R....).\n\nSaya rasa kita tidak lagi menyelidiki orang hilang.\nKita sedang menyelidiki seseorang yang bisa menghapus sejarah.\n\n*** CHAPTER 6 COMPLETE ***\nReward: +320 XP\nRank: Senior Investigator\nUnlocked: Browser, LIKE, Wildcard Search, Companies Database'
  }
};
