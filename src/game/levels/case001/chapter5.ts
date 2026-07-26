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
    vehicles: [
      { id: 1, plate_number: 'D5555XX', brand: 'Honda', model: 'Civic', color: 'White', owner_id: 101 },
      { id: 2, plate_number: 'B1734QAZ', brand: 'Toyota', model: 'Camry', color: 'Black', owner_id: 482 },
      { id: 3, plate_number: 'A1111BB', brand: 'Suzuki', model: 'Ertiga', color: 'Silver', owner_id: 205 },
      { id: 4, plate_number: 'C2222CC', brand: 'Mitsubishi', model: 'Pajero', color: 'Black', owner_id: 310 },
      { plate_number: 'B2841PT', owner_id: 1 },
      { plate_number: 'B9921KD', owner_id: 3 },
      { plate_number: 'B1182AA', owner_id: 4 }
    ],
    owners: [
      { id: 101, name: 'Deni', address: 'Jl Sudirman 10', phone: '08551234' },
      { id: 205, name: 'Siti', address: 'Jl Anggrek 5', phone: '08119876' },
      { id: 310, name: 'Wawan Setiadi', address: 'Jl Mawar 22', phone: '08775555' },
      { id: 482, name: 'Budi Santoso', address: 'Jl Melati 15', phone: '08124444' }
    ],
    citizens: [
      { id: 1, name: 'Andi Prasetyo', nik: '317101' },
      { id: 2, name: 'Rudi Hartono', nik: '317102' },
      { id: 3, name: 'Linda Wijaya', nik: '317103' },
      { id: 4, name: 'PT Medika Nusantara', nik: '317104' },
      { id: 10, name: 'Rizky Hidayat', nik: '317110' }
    ],
    patients: [
      { id: 10, name: 'Rizky Hidayat', condition: 'STABLE', ward: 'Ward C' },
      { id: 11, name: 'Siti Aminah', condition: 'CRITICAL', ward: 'Ward A' },
      { id: 12, name: 'Bambang' },
      { id: 15, name: 'Sarah' }
    ],
    parking: [
      { id: 1, plate_number: 'C2222CC', entry_time: '2026-07-15 07:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 2, plate_number: 'B1734QAZ', entry_time: '2026-07-12 08:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 3, plate_number: 'D5555XX', entry_time: '2026-07-14 09:00', exit_time: '2026-07-14 10:00', location: 'RS Harapan Bangsa' },
      { id: 4, plate_number: 'A1111BB', entry_time: '2026-07-13 12:00', exit_time: null, location: 'RS Harapan Bangsa' },
      { id: 100, plate_number: 'B2841PT', entry_time: '09:15', exit_time: '11:34', location: 'RS Harapan Bangsa' },
      { id: 101, plate_number: 'B9921KD', entry_time: '10:00', exit_time: '11:31', location: 'RS Harapan Bangsa' },
      { id: 102, plate_number: 'B1182AA', entry_time: '09:30', exit_time: '11:36', location: 'RS Harapan Bangsa' }
    ],
    visitors: [
      { visitor_name: 'Budi Santoso', visit_time: '09:20' },
      { visitor_name: 'Maya', visit_time: '09:10' },
      { visitor_name: 'Wawan Setiadi', visit_time: '09:25' },
      { visitor_name: 'Andi Prasetyo', visit_time: '11:20' }
    ],
    cameras: [
      { camera_id: 'CAM-01', location: 'Lobby', status: 'ACTIVE' },
      { camera_id: 'CAM-02', location: 'Emergency Entrance', status: 'ACTIVE' },
      { camera_id: 'CAM-03', location: 'Main Gate', status: 'OFFLINE' },
      { camera_id: 'CAM-04', location: 'Parking Exit', status: 'ACTIVE' }
    ],
    footage: [
      { camera_id: 'CAM-03', person_name: 'Budi Santoso', capture_time: '09:18' },
      { camera_id: 'CAM-03', person_name: 'Maya', capture_time: '09:10' },
      { camera_id: 'CAM-03', person_name: 'Wawan Setiadi', capture_time: '09:25' },
      { camera_id: 'CAM-03', person_name: 'Rizky Hidayat', capture_time: '11:31' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Jangan berharap ada video. Sistem lama hanya menyimpan metadata. Pertama, cari kamera yang merekam pintu utama (Main Gate).',
      goal: 'Cari kamera yang merekam pintu utama (Main Gate).',
      availableTokens: ['SELECT', '*', 'FROM', 'cameras'],
      hint: "Tampilkan semua baris di tabel cameras.",
      validateResult: (res) => res && res.length === 4 && res.find(r => r.location === 'Main Gate' && r.camera_id === 'CAM-03')
    },
    {
      id: 2,
      story: 'Cari Budi. Apakah ada bukti visual dia masuk?',
      goal: 'Cari rekaman Budi Santoso di CCTV.',
      availableTokens: ['SELECT', '*', 'FROM', 'footage', 'WHERE', 'person_name', '=', "'Budi Santoso'"],
      hint: "Cari di tabel footage, baris yang person_name-nya cocok dengan nama yang dicari.",
      validateResult: (res) => res && res.length === 1 && res[0].capture_time === '09:18'
    },
    {
      id: 3,
      story: 'Sekarang cari Rizky. Kapan dia terekam kamera?',
      goal: 'Cari rekaman Rizky Hidayat di CCTV.',
      availableTokens: ['SELECT', '*', 'FROM', 'footage', 'WHERE', 'person_name', '=', "'Rizky Hidayat'"],
      hint: "Sama seperti sebelumnya, ganti nama yang dicari.",
      validateResult: (res) => res && res.length === 1 && res[0].capture_time === '11:31'
    },
    {
      id: 4,
      story: 'Tampilkan semua pengunjung rumah sakit, lalu bandingkan dengan seluruh rekaman kamera sekaligus — termasuk yang tidak cocok.',
      goal: 'Bandingkan data pengunjung (visitors) dengan rekaman CCTV (footage), termasuk pengunjung yang tidak muncul di rekaman manapun.',
      availableTokens: ['SELECT', 'v.visitor_name', ',', 'f.capture_time', 'FROM', 'visitors', 'v', 'LEFT', 'JOIN', 'footage', 'f', 'ON', 'v.visitor_name', '=', 'f.person_name'],
      hint: "Gabungkan visitors dan footage lewat nama, tapi pakai jenis gabungan yang tetap menampilkan pengunjungnya meskipun dia gak punya rekaman footage sama sekali — bukan cuma yang cocok doang.",
      validateResult: (res) => res && res.length === 4 && res.find(r => r.visitor_name === 'Andi Prasetyo' && r.capture_time === null)
    }
  ],
  report: {
    question: 'Kirim laporan bukti CCTV.',
    options: [
      'Budi tidak pernah masuk ke rumah sakit, Rizky terekam keluar, dan kamera gate normal.',
      'Budi hanya masuk, Rizky keluar, kamera mati selama 6 menit, dan Andi tidak pernah terekam (kemungkinan orang lain mengemudi).',
      'Semua orang terekam masuk dan keluar dengan tertib di waktu yang tepat.'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nLaporan diterima.\nTepat sekali. Andi tidak pernah muncul di CCTV.\nSiapa yang sebenarnya mengemudikan mobilnya?\n\nUnknown Number: Kamu akhirnya menemukan enam menit yang hilang. Sayangnya... Yang hilang bukan hanya rekamannya.\n\n*** CHAPTER 5 COMPLETE ***\nUnlocked: CCTV Database'
  }
};
