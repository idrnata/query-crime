import { Level } from '../../../types';

export const chapter3: Level = {
  id: 3,
  title: 'Case #001: Jejak yang Tidak Terlihat',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Perkembangan Kasus',
    body: 'Selamat pagi.\nRumah sakit sudah mengirim data tambahan.\nPasien bernama Rizky Hidayat memang keluar pukul 11.30.\nTetapi CCTV rumah sakit sedang rusak.\nSatu-satunya petunjuk hanyalah data parkir kendaraan.\n\nNEW TABLE: Hospital Parking',
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
    hospital_parking: [
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
      goal: 'Query tabel visitors untuk Budi Santoso.',
      availableTokens: ['SELECT', '*', 'FROM', 'visitors', 'WHERE', 'visitor_name', '=', "'Budi Santoso'"],
      validateResult: (res) => res && res.length >= 1 && res[0].patient_id === 41
    },
    {
      id: 2,
      story: 'Dapatkan data pasien dengan ID 41.',
      goal: 'Query tabel patients untuk ID 41.',
      availableTokens: ['SELECT', '*', 'FROM', 'patients', 'WHERE', 'id', '=', '41'],
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Rizky Hidayat'
    },
    {
      id: 3,
      story: 'Rizky memiliki emergency_contact bernomor 7. Cari siapa itu.',
      goal: 'Cari data di citizens dengan ID 7.',
      availableTokens: ['SELECT', '*', 'FROM', 'citizens', 'WHERE', 'id', '=', '7'],
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Andi Prasetyo'
    },
    {
      id: 4,
      story: 'Cari kendaraan milik Andi Prasetyo (Owner ID 7).',
      goal: 'Cari data di vehicles untuk owner_id 7.',
      availableTokens: ['SELECT', '*', 'FROM', 'vehicles', 'WHERE', 'owner_id', '=', '7'],
      validateResult: (res) => res && res.length === 1 && res[0].plate_number === 'B 2841 PT'
    },
    {
      id: 5,
      story: 'Cek data parkir untuk plat nomor B 2841 PT.',
      goal: 'Cari data di hospital_parking untuk plat B 2841 PT.',
      availableTokens: ['SELECT', '*', 'FROM', 'hospital_parking', 'WHERE', 'plate_number', '=', "'B 2841 PT'"],
      validateResult: (res) => res && res.length === 1 && res[0].exit_time === '11:34'
    },
    {
      id: 6,
      story: 'Supervisor: "Bagus. Sekarang gunakan JOIN untuk melihat nama pemilik dan plat nomornya secara langsung."',
      goal: 'Gunakan JOIN antara citizens dan vehicles.',
      availableTokens: ['SELECT', 'c.name', ',', 'v.plate_number', 'FROM', 'citizens', 'c', 'JOIN', 'vehicles', 'v', 'ON', 'c.id', '=', 'v.owner_id'],
      validateResult: (res) => res && res.length >= 1 && res[0].name !== undefined && res[0].plate_number !== undefined
    },
    {
      id: 7,
      story: 'Supervisor: "Sekarang gunakan JOIN untuk mencari kendaraan milik Andi Prasetyo."',
      goal: 'Query JOIN dengan filter nama Andi Prasetyo.',
      availableTokens: ['SELECT', 'c.name', ',', 'v.plate_number', 'FROM', 'citizens', 'c', 'JOIN', 'vehicles', 'v', 'ON', 'c.id', '=', 'v.owner_id', 'WHERE', 'c.name', '=', "'Andi Prasetyo'"],
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
    conclusion: 'Supervisor Raka:\nBagus.\nSekarang saya ingin tahu...\nApakah Andi pernah berhubungan dengan Budi sebelumnya?\nSaya mendapat kabar buruk. Andi Prasetyo ternyata juga tidak bisa dihubungi. Dua orang hilang. Satu pasien. Satu pengunjung. Dan satu kendaraan yang membawa mereka pergi.\n\n*** CHAPTER 3 COMPLETE ***\nReward: +180 XP\nRank: Detective\nUnlocked: JOIN, Hospital Parking'
  }
};
