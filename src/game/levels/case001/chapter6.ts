import { Level } from '../../../types';

export const chapter6: Level = {
  id: 6,
  title: 'Case #001: Jejak Digital',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Akses Arsip Digital',
    body: 'Kamera memang mati selama enam menit. Tapi orang tidak bisa menghapus semua jejaknya. Setiap orang meninggalkan jejak digital. Saya membuka akses ke Arsip Digital Nasional untukmu.\n\nNEW APP: Browser Unlocked',
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
        content: 'Seorang mahasiswa bernama Rizky Hidayat menjadi satu-satunya korban selamat dalam kecelakaan mobil yang menewaskan tiga orang. Rizky kemudian dilarikan ke Hospital terdekat untuk perawatan intensif. Mobil tersebut diketahui milik PT Arunika Logistics.',
        publish_date: '2018-05-12'
      },
      {
        id: 2,
        title: 'Sopir Truk Menghilang Setelah Kecelakaan Arunika',
        content: 'Pihak kepolisian melaporkan bahwa sopir truk PT Arunika Logistics yang terlibat dalam kecelakaan maut di Jalan Merdeka menghilang secara misterius tak lama setelah kejadian. Saksi bernama Budi melihat truk tersebut melaju kencang.',
        publish_date: '2018-05-13'
      },
      {
        id: 3,
        title: 'Data Kendaraan Arunika Belum Ditemukan',
        content: 'Penyidik mengonfirmasi bahwa data operasional dan logistik kendaraan PT Arunika Logistics pada malam kejadian belum ditemukan atau kemungkinan sengaja dihapus. Status data: Missing from database.',
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
        id: 101,
        company_name: 'PT Arunika Logistics',
        owner: 'R.... [DATA CORRUPTED]',
        status: 'ACTIVE'
      }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari apakah Rizky pernah muncul di berita menggunakan nama lengkap (Rizky Hidayat).',
      goal: "Cari artikel dengan judul persis 'Rizky Hidayat' di tabel articles.",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'title', '=', "'Rizky Hidayat'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes("where title = 'rizky hidayat'") && res && res.length === 0;
      }
    },
    {
      id: 2,
      story: 'Coba gunakan pencarian yang lebih fleksibel untuk menemukan berita tentang Rizky.',
      goal: "Cari artikel yang judulnya mengandung kata 'Rizky', menggunakan pencarian yang lebih fleksibel.",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'title', 'LIKE', "'%Rizky%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%rizky%') && res && res.length > 0;
      }
    },
    {
      id: 3,
      story: 'Cari apakah nama Andi atau Prasetyo pernah disebut publik di isi artikel.',
      goal: "Cari artikel yang isinya menyebut nama 'Andi', menggunakan pencarian yang lebih fleksibel.",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Andi%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && (q.includes('%andi%') || q.includes('%prasetyo%')) && res && res.length === 0;
      }
    },
    {
      id: 4,
      story: 'Cari semua artikel yang mengandung kata "Arunika".',
      goal: "Cari semua artikel yang isinya menyebut kata 'Arunika'.",
      availableTokens: ['SELECT', '*', 'FROM', 'articles', 'WHERE', 'content', 'LIKE', "'%Arunika%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('like') && q.includes('%arunika%') && res && res.length >= 4;
      }
    },
    {
      id: 5,
      story: 'Cari data perusahaan PT Arunika Logistics di database perusahaan.',
      goal: "Cari data perusahaan PT Arunika Logistics di tabel companies.",
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
    conclusion: 'Supervisor Raka:\nLaporan diterima.\nTepat sekali. Rizky selamat dari kecelakaan 8 tahun lalu yang melibatkan PT Arunika Logistics.\nData pemilik perusahaan juga ditemukan dalam keadaan rusak: R....\n\nSaya rasa kita tidak lagi menyelidiki orang hilang.\nKita sedang menyelidiki seseorang yang bisa menghapus sejarah.\n\n*** CHAPTER 6 COMPLETE ***\nUnlocked: Browser, Companies Database'
  }
};
