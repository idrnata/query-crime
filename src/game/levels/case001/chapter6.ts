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
        content: 'Seorang mahasiswa bernama Rizky Hidayat menjadi satu-satunya korban selamat dalam kecelakaan mobil yang menewaskan tiga orang. Mobil tersebut diketahui milik PT Arunika Logistics.',
        publish_date: '2018-05-12'
      },
      {
        id: 2,
        title: 'Sopir Truk Menghilang Setelah Kecelakaan Arunika',
        content: 'Pihak kepolisian melaporkan bahwa sopir truk PT Arunika Logistics yang terlibat dalam kecelakaan maut di Jalan Merdeka menghilang secara misterius tak lama setelah kejadian.',
        publish_date: '2018-05-13'
      },
      {
        id: 3,
        title: 'Data Kendaraan Arunika Belum Ditemukan',
        content: 'Penyidik mengonfirmasi bahwa data operasional dan logistik kendaraan PT Arunika Logistics pada malam kejadian belum ditemukan atau kemungkinan sengaja dihapus.',
        publish_date: '2018-05-15'
      },
      {
        id: 4,
        title: 'Kasus Kecelakaan Arunika Resmi Dihentikan',
        content: 'Karena kurangnya bukti fisik dan menghilangnya saksi-saksi kunci dari PT Arunika Logistics, termasuk sopir truk, penyelidikan kasus kecelakaan resmi dihentikan.',
        publish_date: '2018-06-01'
      },
      {
        id: 5,
        title: 'Trauma Penyintas Kecelakaan Maut Arunika',
        content: 'Rizky Hidayat, penyintas tunggal kecelakaan maut PT Arunika Logistics delapan tahun lalu, dilaporkan masih mengalami trauma mendalam terkait peristiwa tersebut.',
        publish_date: '2018-06-15'
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
      story: 'Cari Rizky Hidayat pada artikel.',
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
      story: 'Cari nama Andi di database artikel.',
      goal: "SELECT * FROM articles WHERE content LIKE '%Andi%';",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Andi%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%andi%') && res && res.length === 0;
      }
    },
    {
      id: 4,
      story: 'Coba cari nama Prasetyo di database artikel.',
      goal: "SELECT * FROM articles WHERE content LIKE '%Prasetyo%';",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Prasetyo%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%prasetyo%') && res && res.length === 0;
      }
    },
    {
      id: 5,
      story: 'Cari PT Arunika Logistics pada artikel.',
      goal: "SELECT * FROM articles WHERE content LIKE '%Arunika%';",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Arunika%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%arunika%') && res && res.length >= 5;
      }
    },
    {
      id: 6,
      story: 'Cari data perusahaan PT Arunika Logistics di database perusahaan.',
      goal: "SELECT * FROM companies WHERE company_name LIKE '%Arunika%';",
      availableTokens: ['SELECT', '*', 'FROM', 'companies', 'WHERE', 'company_name', 'LIKE', "'%Arunika%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%arunika%') && res && res.length > 0;
      }
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
