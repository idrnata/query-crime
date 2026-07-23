import { Level } from '../../../types';

export const chapter12: Level = {
  id: 12,
  title: 'Case #001: Orang di Dalam',
  mail: {
    sender: 'Raka (Nomor Tidak Dikenal)',
    subject: 'Ini saya.',
    body: 'Ini saya. Jangan balas ke nomor ini — pakai jalur lama.\nKalau kamu masih membaca ini, artinya kamu belum berhenti.\n\nSaya butuh satu hal terakhir: cari tahu siapa di Police HQ yang membuka pintu untuk mobil Arunika itu.\n\nSetelah itu... temui saya.',
  },
  files: {
    title: 'Internal Affairs Access Index',
    content: 'POLICE INTERNAL DATABASE\n\nTables:\n- personnel (id, badge_id, name, role)\n- badge_logs (badge_id, gate, access_time)\n- camera_logs (dari arsip lalu lintas)',
  },
  database: {
    camera_logs: [
      { camera_id: 'H01', plate_number: 'B7710XR', capture_time: '14:00', location: 'Police HQ' }
    ],
    badge_logs: [
      { badge_id: 'B-118', gate: 'Visitor Entrance', access_time: '13:58' },
      { badge_id: 'B-042', gate: 'Staff Entrance', access_time: '08:02' }
    ],
    personnel: [
      { id: 1, badge_id: 'B-118', name: 'Yusuf Hamdani', role: 'Administrasi Umum' },
      { id: 2, badge_id: 'B-042', name: 'Siti Marlina', role: 'IT Support' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Tinjau ulang kapan mobil PT Arunika Logistics (B7710XR) pernah muncul di Police HQ.',
      goal: 'Cari catatan camera_logs dengan plate_number B7710XR dan location Police HQ.',
      availableTokens: ['SELECT', '*', 'FROM', 'camera_logs', 'WHERE', 'plate_number', '=', "'B7710XR'", 'AND', 'location', '=', "'Police HQ'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('camera_logs') && q.includes('police hq') && res && res.length > 0;
      }
    },
    {
      id: 2,
      story: 'Cari siapa yang menggunakan badge akses di Police HQ tepat di sekitar jam 14:00 hari itu.',
      goal: 'Cari data di tabel badge_logs dengan waktu akses antara 13:55 dan 14:05.',
      availableTokens: ['SELECT', '*', 'FROM', 'badge_logs', 'WHERE', 'access_time', 'BETWEEN', "'13:55'", 'AND', "'14:05'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('badge_logs') && q.includes('between') && res && res.length === 1 && res[0].badge_id === 'B-118';
      }
    },
    {
      id: 3,
      story: 'Cari siapa pemilik badge B-118 di tabel personnel.',
      goal: 'Cari data personnel dengan badge_id B-118.',
      availableTokens: ['SELECT', '*', 'FROM', 'personnel', 'WHERE', 'badge_id', '=', "'B-118'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('personnel') && q.includes('b-118') && res && res.length === 1 && res[0].name === 'Yusuf Hamdani';
      }
    }
  ],
  report: {
    question: 'Apa kesimpulan akhir Case #001?',
    options: [
      'Kasus ditutup total, semua pelaku tertangkap.',
      'Badge staf administrasi Police HQ (B-118) dipakai untuk membuka akses bagi kendaraan PT Arunika Logistics, mengonfirmasi ada pihak di dalam kepolisian yang membantu menutupi kasus lama. Dalang utama masih belum teridentifikasi.',
      'PT Arunika Logistics sepenuhnya tidak bersalah.',
      'Supervisor Raka adalah dalang di balik semuanya.'
    ],
    correctIndex: 1,
    conclusion: 'Raka:\nKamu benar. Bukan cuma satu orang.\nKasus ini... lebih besar dari yang kita berdua kira.\nTapi untuk sekarang — istirahatlah. Kita baru saja mulai.\n\n*** CASE #001 COMPLETE ***'
  }
};
