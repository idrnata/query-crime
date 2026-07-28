import { Level } from '../../../types';

export const chapter11: Level = {
  id: 11,
  caseId: 'CASE001',
  chapterNumber: 11,
  title: 'Case #001: Ch 11 - Jejak Terakhir',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Jangan balas pesan ini.',
    body: 'Kalau HP ini masih aman, temui saya setelah kasus selesai. Sementara itu... Saya membuka database terakhir: Traffic Camera Database.',
  },
  files: {
    title: 'Traffic Camera Database Index',
    content: 'DATABASE - TRAFFIC & LOGISTICS MONITORING\n\nTables:\n- camera_logs (camera_id, plate_number, capture_time, location)\n- system_logs (user_id, action, timestamp)\n\nAdvanced Analysis Tools: Multi-vehicle sequencing and comparison enabled.',
  },
  database: {
    camera_logs: [
      { camera_id: 'C01', plate_number: 'B2841PT', capture_time: '2024-07-16 09:20', location: 'Hospital' },
      { camera_id: 'C05', plate_number: 'B2841PT', capture_time: '2024-07-16 10:15', location: 'Gas Station' },
      { camera_id: 'C09', plate_number: 'B2841PT', capture_time: '2024-07-16 11:20', location: 'Warehouse' },
      { camera_id: 'C01', plate_number: 'B7710XR', capture_time: '2024-07-16 09:25', location: 'Hospital' },
      { camera_id: 'C05', plate_number: 'B7710XR', capture_time: '2024-07-16 10:18', location: 'Gas Station' },
      { camera_id: 'C09', plate_number: 'B7710XR', capture_time: '2024-07-16 11:25', location: 'Warehouse' },
      { camera_id: 'H01', plate_number: 'B7710XR', capture_time: '2024-07-16 14:00', location: 'Police HQ' },
      { camera_id: 'C09', plate_number: 'B7710XR', capture_time: '2024-07-16 16:30', location: 'Warehouse' }
    ],
    system_logs: [
      { user_id: 'Admin', action: 'Disable Camera', timestamp: '2024-07-16 11:24' },
      { user_id: 'IT_Staff', action: 'Login', timestamp: '2024-07-16 08:00' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Temukan seluruh perjalanan mobil Budi (B2841PT) dan urutkan berdasarkan waktu.',
      goal: 'Cari seluruh catatan camera_logs untuk plat B2841PT, diurutkan dari waktu paling awal.',
      availableTokens: ['SELECT', '*', 'FROM', 'camera_logs', 'WHERE', 'plate_number', '=', "'B2841PT'", 'ORDER', 'BY', 'capture_time'],
      hint: "Cari di tabel camera_logs, baris yang plate_number-nya cocok dengan plat itu, urutkan berdasarkan waktu capture.",
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('camera_logs') && q.includes('order by') && res && res.length >= 3;
      }
    },
    {
      id: 2,
      story: 'Beri nomor urut pada setiap capture kendaraan, supaya urutan kemunculannya di tiap kamera lebih mudah dibaca — per kendaraan, dari yang paling awal.',
      goal: 'Tampilkan plate_number, capture_time, dan nomor urut kemunculan tiap kendaraan — dikelompokkan per plat nomor, diurutkan dari capture_time paling awal.',
      availableTokens: ['SELECT', 'plate_number', ',', 'capture_time', ',', 'ROW_NUMBER', '(', ')', 'OVER', '(', 'PARTITION', 'BY', 'plate_number', 'ORDER', 'BY', 'capture_time', ')', 'AS', 'sequence', 'FROM', 'camera_logs'],
      hint: "Beri nomor urut ke tiap baris, tapi penomorannya dimulai ulang dari 1 lagi tiap ganti plat nomor kendaraan — bukan nomor urut global buat semua baris sekaligus.",
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('row_number') && q.includes('over') && res && res.length > 0 && res[0].sequence !== undefined;
      }
    },
    {
      id: 3,
      story: 'Lihat kendaraan apa yang muncul SETELAH kendaraan lain di titik yang sama, dengan mengurutkan seluruh capture berdasarkan waktunya.',
      goal: 'Tampilkan plate_number, capture_time, dan plat kendaraan berikutnya yang muncul setelah baris ini — diurutkan berdasarkan capture_time.',
      availableTokens: ['SELECT', 'plate_number', ',', 'capture_time', ',', 'LEAD', '(', 'plate_number', ')', 'OVER', '(', 'ORDER', 'BY', 'capture_time', ')', 'AS', 'next_vehicle', 'FROM', 'camera_logs'],
      hint: "Urutkan semua baris berdasarkan waktu, lalu bandingkan tiap baris dengan baris TEPAT SETELAHNYA untuk lihat kendaraan apa yang muncul berikutnya di kamera yang sama.",
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('lead') && q.includes('over') && res && res.length > 0 && res[0].next_vehicle !== undefined;
      }
    },
    {
      id: 4,
      story: 'Cari siapa yang mematikan kamera di tabel system_logs.',
      goal: "Cari log di tabel system_logs dengan action 'Disable Camera'.",
      availableTokens: ['SELECT', '*', 'FROM', 'system_logs', 'WHERE', 'action', '=', "'Disable Camera'"],
      hint: "Cari di tabel system_logs, baris yang action-nya cocok dengan aksi mematikan kamera.",
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('system_logs') && q.includes('disable camera') && res && res.length > 0;
      }
    }
  ],
  report: {
    question: 'Apa kesimpulan akhir dari pola perjalanan kendaraan?',
    options: [
      'Budi hanya tersesat.',
      'Mobil PT Arunika Logistics mengikuti mobil Budi di setiap titik (Hospital, Gas Station, Warehouse). Ini adalah operasi tailing yang direncanakan.',
      'Polisi selalu mengawal mobil Budi.',
      'Semua kamera rusak secara alami.'
    ],
    correctIndex: 1,
    conclusion: 'Ini bukan kebetulan.\nMereka mengikuti Budi.\n\ndan sekarang... Mereka tahu di mana kita berada.\n\n*** CHAPTER 11 COMPLETE ***\nUnlocked: Traffic Camera'
  }
};
