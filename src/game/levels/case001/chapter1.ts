import { Level } from '../../../types';

export const chapter1: Level = {
  id: 1,
  title: 'Case #001: Kendaraan Misterius',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Kasus Pertamamu',
    body: 'Selamat datang di Minor Crime Division.\nRumah Sakit Harapan Bangsa melaporkan sebuah kendaraan yang parkir selama tiga hari di area ambulans.\nTemukan pemilik kendaraan tersebut.\nSemua data ada di database.\nJangan mengecewakan saya.',
  },
  files: {
    title: 'Laporan Saksi',
    content: 'RS Harapan Bangsa\nArea: Parkir Khusus Ambulans\nPlat Nomor: B1734QAZ\nLama Parkir: 3 Hari',
  },
  database: {
    vehicles: [
      { id: 1, plate_number: 'D5555XX', brand: 'Honda', model: 'Civic', color: 'White', owner_id: 101 },
      { id: 2, plate_number: 'B1734QAZ', brand: 'Toyota', model: 'Camry', color: 'Black', owner_id: 482 },
      { id: 3, plate_number: 'A1111BB', brand: 'Suzuki', model: 'Ertiga', color: 'Silver', owner_id: 205 },
      { id: 4, plate_number: 'C2222CC', brand: 'Mitsubishi', model: 'Pajero', color: 'Black', owner_id: 310 }
    ],
    owners: [
      { id: 101, name: 'Andi', address: 'Jl Sudirman 10', phone: '08551234' },
      { id: 205, name: 'Siti', address: 'Jl Anggrek 5', phone: '08119876' },
      { id: 310, name: 'Rudi', address: 'Jl Mawar 22', phone: '08775555' },
      { id: 482, name: 'Budi Santoso', address: 'Jl Melati 15', phone: '08124444' }
    ],
    hospital_parking: [
      { id: 1, plate_number: 'C2222CC', entry_time: '2026-07-15 07:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 2, plate_number: 'B1734QAZ', entry_time: '2026-07-12 08:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 3, plate_number: 'D5555XX', entry_time: '2026-07-14 09:00', exit_time: '2026-07-14 10:00', location: 'RS Harapan Bangsa' },
      { id: 4, plate_number: 'A1111BB', entry_time: '2026-07-13 12:00', exit_time: null, location: 'RS Harapan Bangsa' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Supervisor mengirim pesan: "Sebelum mencari seseorang, lihat dulu isi databasenya."',
      goal: 'Lihat seluruh data kendaraan.',
      availableTokens: ['SELECT', '*', 'FROM', 'vehicles', 'WHERE', '=', "'B1734QAZ'"],
      validateResult: (res) => res && res.length === 4 && res[0].plate_number !== undefined && res[0].brand !== undefined
    },
    {
      id: 2,
      story: 'Database menampilkan ribuan kendaraan. Nomor polisi sesuai laporan adalah B1734QAZ.',
      goal: 'Temukan kendaraan B1734QAZ.',
      availableTokens: ['SELECT', '*', 'FROM', 'vehicles', 'WHERE', 'plate_number', '=', "'B1734QAZ'"],
      validateResult: (res) => res && res.length === 1 && res[0].plate_number === 'B1734QAZ'
    },
    {
      id: 3,
      story: 'Supervisor: "Bagus. Sekarang cari tahu siapa Owner ID 482."',
      goal: 'Cari pemilik dengan Owner ID 482 di tabel owners.',
      availableTokens: ['SELECT', '*', 'FROM', 'owners', 'WHERE', 'id', '=', '482'],
      validateResult: (res) => res && res.length === 1 && res[0].id === 482
    },
    {
      id: 4,
      story: 'Supervisor: "Bagus. Sekarang cari tahu apakah mobil itu masih berada di rumah sakit."',
      goal: 'Periksa riwayat parkir (hospital_parking) untuk plat B1734QAZ.',
      availableTokens: ['SELECT', '*', 'FROM', 'hospital_parking', 'WHERE', 'plate_number', '=', "'B1734QAZ'"],
      validateResult: (res) => res && res.length === 1 && res[0].plate_number === 'B1734QAZ'
    },
    {
      id: 5,
      story: 'Mobil masuk 3 hari lalu dan exit_time adalah NULL (belum keluar).',
      goal: 'Cari semua kendaraan yang belum keluar (exit_time IS NULL).',
      availableTokens: ['SELECT', '*', 'FROM', 'hospital_parking', 'WHERE', 'exit_time', 'IS', 'NULL'],
      validateResult: (res) => res && res.length === 3 && res.every(r => r.exit_time === null)
    },
    {
      id: 6,
      story: 'Supervisor: "Mobil mana yang paling lama berada di sana?"',
      goal: 'Urutkan kendaraan yang belum keluar berdasarkan waktu masuk (entry_time).',
      availableTokens: ['SELECT', '*', 'FROM', 'hospital_parking', 'WHERE', 'exit_time', 'IS', 'NULL', 'ORDER', 'BY', 'entry_time'],
      validateResult: (res) => res && res.length === 3 && res[0].plate_number === 'B1734QAZ'
    }
  ],
  report: {
    question: 'Apa kesimpulanmu?',
    options: [
      'Kendaraan Curian',
      'Kendaraan Terlantar',
      'Pelaku Tidak Diketahui'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nLaporan diterima.\nKerja bagus.\nTapi ada masalah.\nKami mencoba menghubungi pemilik kendaraan. Tidak ada jawaban.\nTetangganya mengatakan dia tidak pulang sejak tiga hari lalu.\nBesok pagi bersiaplah. Kasus ini ternyata lebih besar dari yang kita kira.\n\n*** QUEST COMPLETE ***\nContacts Unlocked: Budi Santoso'
  }
};
