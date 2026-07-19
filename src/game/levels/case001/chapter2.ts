import { Level } from '../../../types';

export const chapter2: Level = {
  id: 2,
  title: 'Case #001: Pemilik yang Menghilang',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Selamat Pagi',
    body: 'Kemarin kita berhasil menemukan identitas pemilik kendaraan. Tim patroli sudah mendatangi alamat Budi Santoso. Rumahnya kosong. Tetangga mengatakan ia tidak terlihat selama tiga hari. Kami menemukan pintu rumah tidak terkunci. Tidak ada tanda kekerasan. Tapi ponsel miliknya hilang.\n\nSaya sudah membuka akses baru. Gunakan dengan bijak.\n\nNEW DATABASE: Citizens',
  },
  files: {
    title: 'Status: REOPENED',
    content: 'Kasus: Kendaraan Misterius (RS Harapan Bangsa)\nStatus: REOPENED\nSubjek: Budi Santoso\nCatatan: Pemilik menghilang secara misterius.',
  },
  database: {
    citizens: [
      { id: 1, nik: '3171010101', name: 'Andi Supriatna', birth_date: '1985-05-12', address: 'Jl Sudirman 10', phone: '08551234', status: 'ACTIVE' },
      { id: 2, nik: '3171010102', name: 'Siti Aminah', birth_date: '1990-08-20', address: 'Jl Anggrek 5', phone: '08119876', status: 'ACTIVE' },
      { id: 3, nik: '3171010103', name: 'Wawan Setiadi', birth_date: '1982-11-30', address: 'Jl Mawar 22', phone: '08775555', status: 'ACTIVE' },
      { id: 4, nik: '3171010104', name: 'Budi Santoso', birth_date: '1978-03-15', address: 'Jl Melati 15', phone: '08124444', status: 'ACTIVE' },
      { id: 5, nik: '3171010105', name: 'Dina Santoso', birth_date: '1982-06-22', address: 'Jl Melati 15', phone: '08125555', status: 'ACTIVE' },
      { id: 6, nik: '3171010106', name: 'Rizky Hidayat', birth_date: '1995-12-10', address: 'Jl Kamboja 8', phone: '08136666', status: 'ACTIVE' }
    ],
    visitors: [
      { id: 1, name: 'Budi Santoso', visit_time: '2026-07-12 09:20', ward: 'Ward C', patient_id: 10 },
      { id: 2, name: 'Ani', visit_time: '2026-07-12 10:00', ward: 'Ward A', patient_id: 11 },
      { id: 3, name: 'Budi Santoso', visit_time: '2026-07-11 14:00', ward: 'Ward C', patient_id: 10 }
    ],
    patients: [
      { id: 10, name: 'Rizky Hidayat', condition: 'STABLE', ward: 'Ward C' },
      { id: 11, name: 'Siti Aminah', condition: 'CRITICAL', ward: 'Ward A' }
    ],
    parking: [
      { id: 1, plate_number: 'C2222CC', entry_time: '2026-07-15 07:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 2, plate_number: 'B1734QAZ', entry_time: '2026-07-12 08:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 3, plate_number: 'D5555XX', entry_time: '2026-07-14 09:00', exit_time: '2026-07-14 10:00', location: 'RS Harapan Bangsa' },
      { id: 4, plate_number: 'A1111BB', entry_time: '2026-07-13 12:00', exit_time: null, location: 'RS Harapan Bangsa' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Supervisor: "Pastikan apakah data owner kendaraan sama dengan data kependudukan."',
      goal: 'Cari data Budi Santoso di tabel citizens.',
      availableTokens: ['SELECT', '*', 'FROM', 'citizens', 'WHERE', 'name', '=', "'Budi Santoso'"],
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Budi Santoso'
    },
    {
      id: 2,
      story: 'Supervisor: "Cari apakah dia tinggal sendirian."',
      goal: 'Cari orang lain yang tinggal di Jl Melati 15.',
      availableTokens: ['SELECT', '*', 'FROM', 'citizens', 'WHERE', 'address', '=', "'Jl Melati 15'"],
      validateResult: (res) => res && res.length === 2
    },
    {
      id: 3,
      story: 'Kamu menemukan Dina Santoso di alamat yang sama. Hubungi dia.',
      goal: 'Dapatkan nama dan nomor telepon dari Jl Melati 15.',
      availableTokens: ['SELECT', 'name', ',', 'phone', 'FROM', 'citizens', 'WHERE', 'address', '=', "'Jl Melati 15'"],
      validateResult: (res) => res && res.length === 2 && res[0].phone !== undefined
    },
    {
      id: 4,
      story: 'Dina Santoso mengatakan kakaknya (Budi) mengunjungi seseorang di RS Harapan Bangsa. Supervisor membuka akses Hospital Database.',
      goal: 'Lihat daftar pengunjung (visitors) di rumah sakit.',
      availableTokens: ['SELECT', '*', 'FROM', 'visitors'],
      validateResult: (res) => res && res.length >= 1
    },
    {
      id: 5,
      story: 'Budi Santoso mengunjungi Ward C pada jam 09:20. Cari tahu siapa pasiennya.',
      goal: 'Cari data pasien dengan ID yang dikunjungi Budi.',
      availableTokens: ['SELECT', '*', 'FROM', 'patients', 'WHERE', 'id', '=', '10'],
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Rizky Hidayat'
    }
  ],
  report: {
    question: 'Kirim laporan perkembangan kasus.',
    options: [
      'Budi Santoso Melarikan Diri',
      'Budi Santoso Menghilang Setelah Mengunjungi Rizky Hidayat',
      'Kasus Ditutup Sementara'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nKerja bagus. Saya baru menerima informasi baru. Pasien bernama Rizky Hidayat keluar dari rumah sakit dua jam setelah Budi datang. Anehnya... tidak ada data siapa yang menjemputnya.\n\n*** CHAPTER 2 COMPLETE ***\nUnlocked: Witnesses'
  }
};
