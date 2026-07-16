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
    content: 'Kunjungan Budi: 09:20\nTarget: Cari siapa saja yang di RS pada waktu yang sama.',
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
      { id: 3, name: 'Linda Wijaya', nik: '317103' }
    ],
    vehicles: [
      { plate_number: 'B2841PT', owner_id: 1 },
      { plate_number: 'B9921KD', owner_id: 3 }
    ],
    parking: [
      { plate_number: 'B2841PT', entry_time: '09:15', exit_time: '11:34' },
      { plate_number: 'B9921KD', entry_time: '10:00', exit_time: '11:31' },
      { plate_number: 'B1182AA', entry_time: '09:30', exit_time: '11:36' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari siapa saja yang berada di rumah sakit antara pukul 09:00 dan 09:30.',
      goal: 'Gunakan BETWEEN pada visit_time.',
      availableTokens: ['SELECT', '*', 'FROM', 'visitors', 'WHERE', 'visit_time', 'BETWEEN', "'09:00'", 'AND', "'09:30'"],
      validateResult: (res) => res && res.length === 3
    },
    {
      id: 2,
      story: 'Tentukan siapa yang mungkin bertemu Budi dengan melihat pasien yang dikunjungi.',
      goal: 'Gunakan JOIN antara visitors dan patients.',
      availableTokens: ['SELECT', 'v.visitor_name', ',', 'p.name', ',', 'v.visit_time', 'FROM', 'visitors', 'v', 'JOIN', 'patients', 'p', 'ON', 'v.patient_id', '=', 'p.id', 'WHERE', 'visit_time', 'BETWEEN', "'09:00'", 'AND', "'09:30'"],
      validateResult: (res) => res && res.length === 3 && res.filter(r => r.name === 'Rizky Hidayat').length === 2
    },
    {
      id: 3,
      story: 'Cari tahu siapa pemilik kendaraan yang keluar sekitar pukul 11:30.',
      goal: 'Gunakan triple JOIN: parking, vehicles, dan citizens.',
      availableTokens: ['SELECT', 'c.name', ',', 'v.plate_number', ',', 'p.exit_time', 'FROM', 'parking', 'p', 'JOIN', 'vehicles', 'v', 'ON', 'p.plate_number', '=', 'v.plate_number', 'JOIN', 'citizens', 'c', 'ON', 'v.owner_id', '=', 'c.id', 'WHERE', 'p.exit_time', 'BETWEEN', "'11:25'", 'AND', "'11:40'"],
      validateResult: (res) => res && res.length >= 1 && res.some(r => r.name === 'Andi Prasetyo')
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
    conclusion: 'Supervisor Raka:\nKronologi berhasil disusun. Rudi juga menemui Rizky.\nTiga kendaraan keluar sekitar waktu Rizky pulang. Kendaraan Andi adalah yang paling mencurigakan.\n\nUnknown Number: Kamu terlalu lambat. Kalau ingin menemukan Budi... Cari tempat yang tidak pernah tercatat di database.\n\n*** CHAPTER 4 COMPLETE ***\nReward: +220 XP\nRank: Investigator\nUnlocked: Timeline, Multi JOIN, BETWEEN'
  }
};
