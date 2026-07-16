import { Level } from '../../../types';

const transactionsList = [
  { id: 1, sender: 'PT Arunika Logistics', receiver: 'Andi', amount: 15000000, date: '2026-07-10 14:30:00' },
  { id: 2, sender: 'PT Arunika Logistics', receiver: 'Maya', amount: 20000000, date: '2026-07-11 11:15:00' },
  { id: 3, sender: 'PT Arunika Logistics', receiver: 'Maya', amount: 18000000, date: '2026-07-12 09:45:00' },
  { id: 4, sender: 'PT Arunika Logistics', receiver: 'PT BBM Nusantara', amount: 150000000, date: '2026-07-09 10:00:00' },
  { id: 5, sender: 'PT Arunika Logistics', receiver: 'Rizky', amount: 50000000, date: '2026-07-08 08:30:00' },
  { id: 6, sender: 'PT Arunika Logistics', receiver: 'Budi', amount: 5000000, date: '2026-07-12 16:00:00' }
];

// Generate 48 small regular transactions to "Unknown Account" from "PT Arunika Logistics"
for (let idx = 1; idx <= 48; idx++) {
  const year = 2018 + Math.floor((idx - 1) / 6);
  const month = String(((idx - 1) % 12) + 1).padStart(2, '0');
  const day = String((idx * 7) % 28 + 1).padStart(2, '0');
  transactionsList.push({
    id: 6 + idx,
    sender: 'PT Arunika Logistics',
    receiver: 'Unknown Account',
    amount: 1200000,
    date: `${year}-${month}-${day} 10:00:00`
  });
}

export const chapter8: Level = {
  id: 8,
  title: 'Case #001: Pola yang Disembunyikan',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Gudang Kosong & Izin Transaksi',
    body: 'Indra... dengarkan saya baik-baik.\nGudang Arunika kosong. Tidak ada siapa-siapa.\nSeolah-olah mereka sudah tahu kita akan datang.\n\nSaya baru mendapatkan surat izin.\nSekarang kita bisa membuka data transaksi keuangan.\n\nNEW DATABASE: Bank Unlocked',
  },
  files: {
    title: 'Surat Izin Akses Finansial',
    content: 'POLICE FINANCIAL DATABASE ACCESS\n\nMenampilkan data akun dan transaksi bank terkait kasus.\nTabel tersedia:\n- accounts\n- transactions\n- branches',
  },
  web: {
    'https://www.nasionalnews.id/archive/arunika-silence': `NASIONAL NEWS ARCHIVE — 8 YEARS AGO

PT Arunika Logistics Menolak Berkomentar Terkait Insiden Kecelakaan Maut

JAKARTA — Pihak manajemen PT Arunika Logistics memilih bungkam dan menolak memberikan komentar resmi terkait insiden kecelakaan maut yang melibatkan salah satu truk operasional mereka di tol dalam kota delapan tahun silam.

Saat ditemui di kantor pusat, perwakilan hukum perusahaan hanya menyatakan bahwa kasus ini telah diselesaikan secara kekeluargaan dan menolak memberikan rincian santunan atau dokumen kompensasi apa pun kepada publik.

Saksi mata di tempat kejadian menyebutkan adanya kejanggalan dalam penanganan barang bukti sesaat setelah tabrakan terjadi.`
  },
  database: {
    accounts: [
      { account_number: 'ACC-001', owner_name: 'Andi', balance: 500000, type: 'Savings' },
      { account_number: 'ACC-002', owner_name: 'Maya', balance: 15000000, type: 'Checking' },
      { account_number: 'ACC-003', owner_name: 'PT BBM Nusantara', balance: 850000000, type: 'Business' },
      { account_number: 'ACC-004', owner_name: 'Rizky', balance: 0, type: 'Savings' },
      { account_number: 'ACC-005', owner_name: 'Budi', balance: 120000, type: 'Savings' }
    ],
    transactions: transactionsList,
    branches: [
      { id: 1, name: 'MCD Central Branch', location: 'Central City' },
      { id: 2, name: 'MCD North Branch', location: 'North District' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari apakah PT Arunika membayar seseorang. Lihat semua transaksi dari sender PT Arunika Logistics.',
      goal: "Gunakan SELECT untuk melihat seluruh transaksi dengan filter sender='PT Arunika Logistics'.",
      availableTokens: ['SELECT', '*', 'FROM', 'transactions', 'WHERE', 'sender', '=', "'PT Arunika Logistics'"],
      validateResult: (res) => res && res.length === 54 && res.every(r => r.sender === 'PT Arunika Logistics')
    },
    {
      id: 2,
      story: 'Supervisor: "Bagaimana kalau kita kelompokkan berdasarkan penerima untuk mempermudah analisis?"',
      goal: "Query tabel transactions untuk menampilkan receiver yang dikelompokkan (GROUP BY receiver) dengan filter sender='PT Arunika Logistics'.",
      availableTokens: ['SELECT', 'receiver', 'FROM', 'transactions', 'WHERE', 'sender', '=', "'PT Arunika Logistics'", 'GROUP', 'BY', 'receiver'],
      validateResult: (res) => res && res.length === 6 && res.some(r => r.receiver === 'Unknown Account')
    },
    {
      id: 3,
      story: 'Supervisor: "Kelompok sudah ada. Sekarang hitung jumlah transaksi untuk masing-masing penerima menggunakan COUNT(*)."',
      goal: "Query tabel transactions dengan menampilkan receiver dan COUNT(*) yang dikelompokkan berdasarkan receiver dengan filter sender='PT Arunika Logistics'.",
      availableTokens: ['SELECT', 'receiver', 'COUNT(*)', 'FROM', 'transactions', 'WHERE', 'sender', '=', "'PT Arunika Logistics'", 'GROUP', 'BY', 'receiver'],
      validateResult: (res) => res && res.length === 6 && res.some(r => r.receiver === 'Unknown Account' && (r['COUNT(*)'] === 48 || r['count(*)'] === 48 || r['count'] === 48))
    },
    {
      id: 4,
      story: 'Supervisor: "Cari kelompok yang jumlah transaksinya lebih dari lima menggunakan HAVING COUNT(*) > 5."',
      goal: 'Query tabel transactions dengan menampilkan receiver dan COUNT(*) dikelompokkan berdasarkan receiver dengan filter jumlah transaksi lebih dari 5.',
      availableTokens: ['SELECT', 'receiver', 'COUNT(*)', 'FROM', 'transactions', 'GROUP', 'BY', 'receiver', 'HAVING', 'COUNT(*)', '>', '5'],
      validateResult: (res) => res && res.length === 1 && res[0].receiver === 'Unknown Account' && (res[0]['COUNT(*)'] === 48 || res[0]['count(*)'] === 48 || res[0]['count'] === 48)
    }
  ],
  report: {
    question: 'Kirim laporan penyelidikan mengenai temuan anomali transaksi mencurigakan ini.',
    options: [
      'PT Arunika Logistics tidak pernah melakukan pembayaran aneh ke mana pun.',
      'Ditemukan transaksi mencurigakan rutin sebanyak 48 kali ke rekening yang telah dihapus (Unknown Account), yang dibayarkan setiap bulan secara teratur setelah kejadian kecelakaan maut delapan tahun lalu.',
      'Saksi Andi menerima pembayaran rutin puluhan kali setiap bulannya dari PT Arunika Logistics.',
      'Uang kompensasi dari PT Arunika Logistics dibayarkan penuh ke semua keluarga korban kecelakaan.'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nLuar biasa! Penyelidikan yang sangat tajam.\nAkun yang terhapus (Unknown Account) menerima 48 transaksi kecil secara rutin setiap bulan... tepat setelah tabrakan maut itu terjadi.\nIni bukan kompensasi resmi, karena asuransi dan kompensasi resmi tidak ada di arsip berita publik. Seseorang membayarkan uang tutup mulut secara teratur!\n\nWait... Telepon seluler saya bergetar...\n"Unknown Number" mengirimkan foto saya sedang diawasi di ruang briefing kepolisian!\n"STOP OR HE DIES"\n\n*** CHAPTER 8 COMPLETE ***\nReward: +520 XP\nRank: Digital Investigator II\nUnlocked: Bank Database, GROUP BY, COUNT(*), HAVING'
  }
};
