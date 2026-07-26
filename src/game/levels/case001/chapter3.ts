import { Level } from '../../../types';

export const chapter3: Level = {
  id: 3,
  title: 'Case #001: Jejak yang Tidak Terlihat',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Perkembangan Kasus',
    body: 'Selamat pagi.\nRumah sakit sudah mengirim data tambahan.\nPasien bernama Rizky Hidayat memang keluar pukul 11.30.\nTetapi CCTV rumah sakit sedang rusak.\nSatu-satunya petunjuk hanyalah data parkir kendaraan.\n\nDATA UPDATED: Parking Log (entri baru ditambahkan)',
  },
  files: {
    title: 'Laporan Tambahan RS',
    content: 'Subjek: Rizky Hidayat\nWaktu Keluar: 11.30\nCCTV: Rusak/Offline\nPetunjuk: Cek Log Parkir Rumah Sakit',
  },
  database: {
    citizens: [
      { id: 1, nik: '3171010101', name: 'Andi Supriatna', birth_date: '1985-05-12', address: 'Jl Sudirman 10', phone: '08551234', status: 'ACTIVE' },
      { id: 4, nik: '3171010104', name: 'Budi Santoso', birth_date: '1978-03-15', address: 'Jl Melati 15', phone: '08124444', status: 'ACTIVE' },
      { id: 7, nik: '3171010107', name: 'Andi Prasetyo', birth_date: '1988-09-10', address: 'Jl Kebon Jeruk 4', phone: '08127777', status: 'ACTIVE' },
      { id: 10, nik: '3171010110', name: 'Rizky Hidayat', birth_date: '1995-12-10', address: 'Jl Kamboja 8', phone: '08136666', status: 'ACTIVE' }
    ],
    visitors: [
      { id: 1, visitor_name: 'Budi Santoso', visit_time: '2026-07-12 09:20', ward: 'Ward C', patient_id: 41 }
    ],
    patients: [
      { id: 41, name: 'Rizky Hidayat', condition: 'STABLE', ward: 'Ward C', emergency_contact: 7 }
    ],
    vehicles: [
      { id: 10, plate_number: 'B 2841 PT', brand: 'Toyota', model: 'Avanza', color: 'Silver', owner_id: 7 }
    ],
    parking: [
      { id: 1, plate_number: 'C2222CC', entry_time: '2026-07-15 07:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 2, plate_number: 'B1734QAZ', entry_time: '2026-07-12 08:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 3, plate_number: 'D5555XX', entry_time: '2026-07-14 09:00', exit_time: '2026-07-14 10:00', location: 'RS Harapan Bangsa' },
      { id: 4, plate_number: 'A1111BB', entry_time: '2026-07-13 12:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 100, plate_number: 'B 2841 PT', entry_time: '11:26', exit_time: '11:34', location: 'RS Harapan Bangsa' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari data kunjungan Budi Santoso di rumah sakit.',
      goal: 'Lihat catatan riwayat kunjungan Budi Santoso di tabel visitors.',
      availableTokens: ['SELECT', '*', 'FROM', 'visitors', 'WHERE', 'visitor_name', '=', "'Budi Santoso'"],
      hint: "Cari di tabel visitors, baris yang visitor_name-nya cocok dengan nama yang kamu cari.",
      validateResult: (res) => res && res.length >= 1 && res[0].patient_id === 41
    },
    {
      id: 2,
      story: 'Dapatkan data pasien dengan ID 41.',
      goal: 'Cari data pasien yang memiliki ID 41 di tabel patients.',
      availableTokens: ['SELECT', '*', 'FROM', 'patients', 'WHERE', 'id', '=', '41'],
      hint: "Cari di tabel patients, baris yang id-nya sama dengan angka patient_id dari hasil sebelumnya.",
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Rizky Hidayat'
    },
    {
      id: 3,
      story: 'Rizky memiliki emergency_contact bernomor 7. Cari siapa itu.',
      goal: 'Cari identitas warga dengan ID 7 di tabel citizens.',
      availableTokens: ['SELECT', '*', 'FROM', 'citizens', 'WHERE', 'id', '=', '7'],
      hint: "Cari di tabel citizens, baris yang id-nya sama dengan angka emergency_contact dari hasil sebelumnya.",
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Andi Prasetyo'
    },
    {
      id: 4,
      story: 'Cari kendaraan milik Andi Prasetyo (Owner ID 7).',
      goal: 'Cari kendaraan yang terdaftar atas nama owner_id 7 di tabel vehicles.',
      availableTokens: ['SELECT', '*', 'FROM', 'vehicles', 'WHERE', 'owner_id', '=', '7'],
      hint: "Cari di tabel vehicles, baris yang owner_id-nya sama dengan ID orang yang baru kamu temukan.",
      validateResult: (res) => res && res.length === 1 && res[0].plate_number === 'B 2841 PT'
    },
    {
      id: 5,
      story: 'Cek data parkir untuk plat nomor B 2841 PT.',
      goal: 'Periksa catatan parkir untuk plat B 2841 PT di tabel parking.',
      availableTokens: ['SELECT', '*', 'FROM', 'parking', 'WHERE', 'plate_number', '=', "'B 2841 PT'"],
      hint: "Cari di tabel parking, baris yang plate_number-nya cocok dengan plat kendaraan itu.",
      validateResult: (res) => res && res.length === 1 && res[0].exit_time === '11:34'
    },
    {
      id: 6,
      story: 'Bagus. Sekarang aku ingin tahu nama pemilik dan plat kendaraannya sekaligus — tanpa harus bolak-balik dua tabel. Bisa?',
      goal: 'Gabungkan tabel citizens dan vehicles untuk melihat nama pemilik dan plat nomor.',
      availableTokens: ['SELECT', 'c.name', ',', 'v.plate_number', 'FROM', 'citizens', 'c', 'JOIN', 'vehicles', 'v', 'ON', 'c.id', '=', 'v.owner_id'],
      hint: "Gabungkan tabel citizens dan vehicles lewat kolom yang menghubungkan keduanya — id pemilik di satu tabel harus sama dengan owner_id di tabel lain — lalu tampilkan nama dan plat nomornya.",
      validateResult: (res) => res && res.length >= 1 && res[0].name !== undefined && res[0].plate_number !== undefined
    },
    {
      id: 7,
      story: 'Sekarang cari kendaraan milik Andi Prasetyo dengan cara yang sama.',
      goal: 'Gabungkan tabel citizens dan vehicles khusus untuk nama Andi Prasetyo.',
      availableTokens: ['SELECT', 'c.name', ',', 'v.plate_number', 'FROM', 'citizens', 'c', 'JOIN', 'vehicles', 'v', 'ON', 'c.id', '=', 'v.owner_id', 'WHERE', 'c.name', '=', "'Andi Prasetyo'"],
      hint: "Sama seperti gabungan tabel sebelumnya, tinggal tambahkan filter nama supaya cuma 'Andi Prasetyo' yang muncul.",
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Andi Prasetyo'
    }
  ],
  report: {
    question: 'Apa temuan utamamu dalam kasus ini?',
    options: [
      'Andi Prasetyo adalah pelaku penculikan',
      'Andi menjemput Rizky dengan mobil Toyota Avanza',
      'Budi Santoso melarikan diri bersama Andi'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nBagus.\nSekarang saya ingin tahu...\nApakah Andi pernah berhubungan dengan Budi sebelumnya?\nSaya mendapat kabar buruk. Andi Prasetyo ternyata juga tidak bisa dihubungi. Dua orang hilang. Satu pasien. Satu pengunjung. Dan satu kendaraan yang membawa mereka pergi.\n\n*** CHAPTER 3 COMPLETE ***\nUnlocked: Kemampuan menggabungkan data dari dua tabel sekaligus'
  }
};
