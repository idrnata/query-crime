import { Level } from '../../../types';

export const chapter4: Level = {
  id: 4,
  title: 'Case #001: Delapan Menit',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Log Parkir Baru',
    body: 'Semalam kami mencoba melacak kendaraan Andi Prasetyo. Mobilnya belum ditemukan. \nTapi kami mendapatkan log parkir rumah sakit yang lebih lengkap. \nSaya merasa ada sesuatu yang terlewat. \nCoba susun kembali seluruh kejadian hari itu.\n\nNEW FEATURE: Timeline',
  },
  files: {
    title: 'Log Parkir RS',
    content: 'Kunjungan Budi: 09:20\nTarget:\n- Susun kronologi kunjungan Budi.\n- Cari siapa saja yang berada di RS pada waktu yang sama.\n- Tentukan siapa yang mungkin bertemu Budi.',
  },
  database: {
    visitors: [
      { visitor_name: 'Budi Santoso', patient_id: 10, visit_time: '09:20' },
      { visitor_name: 'Maya Putri', patient_id: 15, visit_time: '09:11' },
      { visitor_name: 'Rudi Hartono', patient_id: 10, visit_time: '09:24' },
      { visitor_name: 'Siska', patient_id: 12, visit_time: '10:05' }
    ],
    patients: [
      { id: 10, name: 'Rizky Hidayat' },
      { id: 12, name: 'Bambang' },
      { id: 15, name: 'Sarah' }
    ],
    citizens: [
      { id: 1, name: 'Andi Prasetyo', nik: '317101' },
      { id: 2, name: 'Rudi Hartono', nik: '317102' },
      { id: 3, name: 'Linda Wijaya', nik: '317103' },
      { id: 4, name: 'PT Medika Nusantara', nik: '317104' }
    ],
    vehicles: [
      { plate_number: 'B2841PT', owner_id: 1 },
      { plate_number: 'B9921KD', owner_id: 3 },
      { plate_number: 'B1182AA', owner_id: 4 }
    ],
    parking: [
      { id: 1, plate_number: 'C2222CC', entry_time: '2026-07-15 07:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 2, plate_number: 'B1734QAZ', entry_time: '2026-07-12 08:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 3, plate_number: 'D5555XX', entry_time: '2026-07-14 09:00', exit_time: '2026-07-14 10:00', location: 'RS Harapan Bangsa' },
      { id: 4, plate_number: 'A1111BB', entry_time: '2026-07-13 12:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 100, plate_number: 'B2841PT', entry_time: '09:15', exit_time: '11:34', location: 'RS Harapan Bangsa' },
      { id: 101, plate_number: 'B9921KD', entry_time: '10:00', exit_time: '11:31', location: 'RS Harapan Bangsa' },
      { id: 102, plate_number: 'B1182AA', entry_time: '09:30', exit_time: '11:36', location: 'RS Harapan Bangsa' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari siapa saja yang berada di rumah sakit antara pukul 09:00 dan 09:30.',
      goal: "Cari semua pengunjung yang datang di rentang waktu 09:00 sampai 09:30 pada tabel visitors.",
      availableTokens: ['SELECT', '*', 'FROM', 'visitors', 'WHERE', 'visit_time', 'BETWEEN', "'09:00'", 'AND', "'09:30'"],
      validateResult: (res) => res && res.length === 3 && res.some(r => r.visitor_name === 'Budi Santoso')
    },
    {
      id: 2,
      story: 'Jangan fokus ke orangnya. Fokus ke pasien yang mereka kunjungi.',
      goal: 'Hubungkan tabel visitors dan patients berdasarkan patient_id untuk melihat siapa menemui siapa di rentang waktu tersebut.',
      availableTokens: [
        'SELECT', 'v.visitor_name', ',', 'p.name', ',', 'v.visit_time', 
        'FROM', 'visitors', 'v', 'JOIN', 'patients', 'p', 'ON', 'v.patient_id', '=', 'p.id', 
        'WHERE', 'visit_time', 'BETWEEN', "'09:00'", 'AND', "'09:30'"
      ],
      validateResult: (res) => res && res.length === 3 && res.filter(r => r['p.name'] === 'Rizky Hidayat' || r['name'] === 'Rizky Hidayat').length === 2
    },
    {
      id: 3,
      story: 'Rudi Hartono ternyata mengunjungi pasien yang sama dengan Budi (Rizky Hidayat). Sekarang, cari identitas Rudi Hartono.',
      goal: "Cari data Rudi Hartono di tabel citizens.",
      availableTokens: ['SELECT', '*', 'FROM', 'citizens', 'WHERE', 'name', '=', "'Rudi Hartono'"],
      validateResult: (res) => res && res.length === 1 && res[0].name === 'Rudi Hartono'
    },
    {
      id: 4,
      story: 'Data Rudi sangat minim. Bagaimana kalau Rudi memiliki kendaraan terdaftar? Coba periksa.',
      goal: 'Hubungkan citizens dan vehicles untuk mencari plat nomor kendaraan Rudi Hartono.',
      availableTokens: [
        'SELECT', 'c.name', ',', 'v.plate_number', 
        'FROM', 'citizens', 'c', 'JOIN', 'vehicles', 'v', 'ON', 'c.id', '=', 'v.owner_id', 
        'WHERE', 'c.name', '=', "'Rudi Hartono'"
      ],
      validateResult: (res) => res && res.length === 0
    },
    {
      id: 5,
      story: 'Rudi tidak memiliki kendaraan pribadi terdaftar. Atau dia memakai kendaraan orang lain. Cari semua kendaraan yang keluar sekitar pukul 11:30.',
      goal: "Query tabel parking untuk mencari semua kendaraan yang keluar antara pukul '11:25' dan '11:40'.",
      availableTokens: ['SELECT', '*', 'FROM', 'parking', 'WHERE', 'exit_time', 'BETWEEN', "'11:25'", 'AND', "'11:40'"],
      validateResult: (res) => res && res.length === 3
    },
    {
      id: 6,
      story: 'Ada tiga kendaraan. Sekarang hubungkan semuanya untuk mengetahui siapa pemilik dari kendaraan-kendaraan tersebut.',
      goal: 'Hubungkan tabel parking, vehicles, dan citizens sekaligus untuk menampilkan nama pemilik, plat nomor, dan waktu keluar dari ketiga kendaraan tersebut.',
      availableTokens: [
        'SELECT', 'c.name', ',', 'v.plate_number', ',', 'p.exit_time', 
        'FROM', 'parking', 'p', 
        'JOIN', 'vehicles', 'v', 'ON', 'p.plate_number', '=', 'v.plate_number', 
        'JOIN', 'citizens', 'c', 'ON', 'v.owner_id', '=', 'c.id', 
        'WHERE', 'p.exit_time', 'BETWEEN', "'11:25'", 'AND', "'11:40'"
      ],
      validateResult: (res) => res && res.length === 3 && res.some(r => r.name === 'Andi Prasetyo' || r['c.name'] === 'Andi Prasetyo')
    }
  ],
  report: {
    question: 'Siapa orang mencurigakan yang juga menemui Rizky?',
    options: [
      'Maya Putri',
      'Rudi Hartono',
      'Siska'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nKronologi berhasil disusun. Rudi juga menemui Rizky.\nTiga kendaraan keluar sekitar waktu Rizky pulang. Kendaraan Andi adalah yang paling mencurigakan.\n\nUnknown Number: Kamu terlalu lambat. Kalau ingin menemukan Budi... Cari tempat yang tidak pernah tercatat di database.\n\n*** CHAPTER 4 COMPLETE ***\nUnlocked: Timeline'
  }
};
