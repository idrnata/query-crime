import { Level } from '../../../types';

export const chapter5: Level = {
  id: 5,
  title: 'Case #001: Bukti yang Bertentangan',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Data CCTV Baru',
    body: 'Saya semalaman memikirkan laporanmu.\nAda sesuatu yang tidak masuk akal.\nData rumah sakit mengatakan Rizky keluar pukul 11.30.\nTapi kita belum punya bukti bahwa Budi pernah keluar.\nSaya baru mendapatkan akses ke sistem CCTV.\n\nNEW DATABASE: CCTV Database',
  },
  files: {
    title: 'Laporan CCTV',
    content: 'Main Gate\n↓\nCAM-03\n\n06 minutes\nNo Footage',
  },
  database: {
    cameras: [
      { camera_id: 'CAM-01', location: 'Lobby', status: 'ACTIVE' },
      { camera_id: 'CAM-02', location: 'Emergency Entrance', status: 'ACTIVE' },
      { camera_id: 'CAM-03', location: 'Main Gate', status: 'OFFLINE' },
      { camera_id: 'CAM-04', location: 'Parking Exit', status: 'ACTIVE' }
    ],
    footage: [
      { camera_id: 'CAM-03', person_name: 'Budi Santoso', capture_time: '09:18' },
      { camera_id: 'CAM-03', person_name: 'Maya', capture_time: '09:10' },
      { camera_id: 'CAM-03', person_name: 'Rudi', capture_time: '09:25' },
      { camera_id: 'CAM-03', person_name: 'Rizky Hidayat', capture_time: '11:31' }
    ],
    visitors: [
      { visitor_name: 'Budi Santoso', visit_time: '09:20' },
      { visitor_name: 'Maya', visit_time: '09:10' },
      { visitor_name: 'Rudi', visit_time: '09:25' },
      { visitor_name: 'Andi Prasetyo', visit_time: '11:20' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Cari kamera yang merekam pintu utama (Main Gate).',
      goal: 'Query tabel cameras.',
      availableTokens: ['SELECT', '*', 'FROM', 'cameras'],
      validateResult: (res) => res && res.length === 4 && res.find(r => r.location === 'Main Gate' && r.camera_id === 'CAM-03')
    },
    {
      id: 2,
      story: 'Cari rekaman Budi Santoso di CCTV.',
      goal: 'Query footage untuk Budi Santoso.',
      availableTokens: ['SELECT', '*', 'FROM', 'footage', 'WHERE', 'person_name', '=', "'Budi Santoso'"],
      validateResult: (res) => res && res.length === 1 && res[0].capture_time === '09:18'
    },
    {
      id: 3,
      story: 'Cari rekaman Rizky Hidayat di CCTV.',
      goal: 'Query footage untuk Rizky Hidayat.',
      availableTokens: ['SELECT', '*', 'FROM', 'footage', 'WHERE', 'person_name', '=', "'Rizky Hidayat'"],
      validateResult: (res) => res && res.length === 1 && res[0].capture_time === '11:31'
    },
    {
      id: 4,
      story: 'Bandingkan data pengunjung (visitors) dengan rekaman CCTV (footage) menggunakan LEFT JOIN.',
      goal: 'Gunakan LEFT JOIN antara visitors dan footage.',
      availableTokens: ['SELECT', 'v.visitor_name', ',', 'f.capture_time', 'FROM', 'visitors', 'v', 'LEFT', 'JOIN', 'footage', 'f', 'ON', 'v.visitor_name', '=', 'f.person_name'],
      validateResult: (res) => res && res.length === 4 && res.find(r => r.visitor_name === 'Andi Prasetyo' && r.capture_time === null)
    }
  ],
  report: {
    question: 'Kirim laporan bukti CCTV.',
    options: [
      'Budi tidak pernah masuk',
      'Andi tidak pernah muncul di CCTV',
      'Kamera berfungsi normal'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nLaporan diterima.\nTepat sekali. Andi tidak pernah muncul di CCTV.\nSiapa yang sebenarnya mengemudikan mobilnya?\n\nUnknown Number: Kamu akhirnya menemukan enam menit yang hilang. Sayangnya... Yang hilang bukan hanya rekamannya.\n\n*** CHAPTER 5 COMPLETE ***\nReward: +250 XP\nRank: Investigator II\nUnlocked: CCTV Database, LEFT JOIN'
  }
};
