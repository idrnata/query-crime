import { Level } from '../../../types';

export const chapter3: Level = {
  id: 15,
  caseId: 'CASE002',
  chapterNumber: 3,
  title: 'Case #002: Ch 03 - Setiap Perubahan Meninggalkan Jejak',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Timeline & Evidence Locker',
    body: 'Banyak investigator gagal karena terlalu cepat menyimpulkan.\nHari ini kita mulai dari awal: kronologi.\n\nAku membuka akses Timeline dan Evidence Locker untukmu.',
  },
  files: {
    title: 'CASE #002 — Status: OPEN',
    content: 'Case Type: Active Investigation\nPriority: MEDIUM\nSumber: Audit Log Internal\nCatatan: Membangun kronologi awal dari aktivitas database di luar jam kerja.',
  },
  database: {
    audit_log: [
      { timestamp: '09:15:00', username: 'admin_ops', action: 'SELECT', table_name: 'vehicle' },
      { timestamp: '10:42:00', username: 'admin_ops', action: 'SELECT', table_name: 'owner' },
      { timestamp: '14:05:00', username: 'finance_bot', action: 'SELECT', table_name: 'transaction_log' },
      { timestamp: '02:11:00', username: 'system_sync', action: 'LOGIN', table_name: '-' },
      { timestamp: '02:12:00', username: 'system_sync', action: 'SELECT', table_name: 'vehicle' },
      { timestamp: '02:13:42', username: 'system_sync', action: 'UPDATE', table_name: 'vehicle_relationship' },
      { timestamp: '02:14:10', username: 'system_sync', action: 'UPDATE', table_name: 'owner_relationship' },
      { timestamp: '02:15:05', username: 'system_sync', action: 'SELECT', table_name: 'address' },
      { timestamp: '02:16:30', username: 'system_sync', action: 'COMMIT', table_name: '-' },
      { timestamp: '02:17:00', username: 'system_sync', action: 'LOGOUT', table_name: '-' },
      { timestamp: '02:18:00', username: 'system_sync', action: 'SYSTEM_SYNC', table_name: '-' },
      { timestamp: '08:30:00', username: 'admin_ops', action: 'SELECT', table_name: 'sync_log' }
    ],
    session_log: [
      { session_id: 'S-884291', username: 'system_sync', login_time: '02:11:00', logout_time: '02:17:00', client_host: 'UNKNOWN' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Kita tidak akan membaca semuanya. Kita hanya mencari perubahan pertama.',
      goal: 'Lihat seluruh aktivitas di tabel audit_log.',
      availableTokens: ['SELECT', '*', 'FROM', 'audit_log'],
      validateResult: (res) => res && res.length === 12
    },
    {
      id: 2,
      story: 'Jika perubahan pertama terjadi pukul 02:13, mungkin ada aktivitas lain yang terjadi pada waktu yang berdekatan.',
      goal: 'Cari seluruh aktivitas audit_log antara pukul 02:10:00 dan 02:20:00, diurutkan berdasarkan waktu.',
      availableTokens: ['SELECT', '*', 'FROM', 'audit_log', 'WHERE', 'timestamp', 'BETWEEN', "'02:10:00'", 'AND', "'02:20:00'", 'ORDER', 'BY', 'timestamp'],
      validateResult: (res) => res && res.length === 8 && res.every(r => r.username === 'system_sync')
    },
    {
      id: 3,
      story: 'Kalau akun system_sync melakukan UPDATE, maka pasti ada Session yang memulainya.',
      goal: 'Lacak sesi akun system_sync di tabel session_log.',
      availableTokens: ['SELECT', '*', 'FROM', 'session_log', 'WHERE', 'username', '=', "'system_sync'"],
      validateResult: (res) => res && res.length === 1 && res[0].client_host === 'UNKNOWN'
    }
  ],
  report: {
    question: 'Apa kesimpulan dari kronologi yang sudah dibangun?',
    options: [
      'Sistem mengalami error acak yang tidak berbahaya.',
      'Admin biasa lupa logout, menyebabkan aktivitas tercatat aneh.',
      'Tiga bukti independen (waktu di luar jam kerja, akun sistem yang melakukan UPDATE manual, dan sesi tanpa identitas perangkat) menunjukkan pola yang sama — kemungkinan besar seseorang mengakses sistem secara tersembunyi.',
      'Karena pelakunya memakai akun sistem, sudah pasti itu adalah admin database resmi.'
    ],
    correctIndex: 2,
    conclusion: 'Supervisor Raka:\nItu asumsi.\nYang kita tahu, Host tidak tercatat.\nItu fakta.\n\nInvestigasi tidak berjalan menggunakan dugaan.\n\nInvestigasi berjalan menggunakan fakta.\n\nTiga node. Satu pola. Belum ada pelaku. Tapi kini ada arah.\n\n*** CHAPTER 3 (CASE #002) COMPLETE ***'
  }
};
