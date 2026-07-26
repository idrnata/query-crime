import { Level } from '../../../types';

export const chapter7: Level = {
  id: 7,
  title: 'Case #001: Jalan yang Berbohong',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Gudang Arunika & Peta',
    body: 'Saya berhasil menemukan sesuatu dari perusahaan Arunika.\nMereka mempunyai gudang lama di pinggiran kota.\n\nTetapi...\nSaya tidak tahu siapa yang terakhir pergi ke sana.\n\nSaya membuka akses ke sistem peta kepolisian.\n\nNEW APP: Maps Unlocked',
  },
  files: {
    title: 'Sistem Pelacakan GPS Kepolisian',
    content: 'POLICE GPS DATABASE ACCESS\n\nMenampilkan lokasi log perjalanan kendaraan.\nTabel tersedia:\n- locations\n- routes\n- checkpoints',
  },
  database: {
    locations: [
      { id: 21, name: 'Hospital', type: 'Public' },
      { id: 34, name: 'Police HQ', type: 'Government' },
      { id: 56, name: 'Arunika Warehouse', type: 'Storage' },
      { id: 71, name: 'Fuel Station', type: 'Business' }
    ],
    routes: [
      { plate_number: 'B 2841 PT', location_id: 21, timestamp: '2026-07-13 09:13:00' },
      { plate_number: 'B 2841 PT', location_id: 71, timestamp: '2026-07-13 10:10:00' },
      { plate_number: 'B 2841 PT', location_id: 56, timestamp: '2026-07-13 11:07:00' },
      { plate_number: 'B 7710 XR', location_id: 34, timestamp: '2026-07-13 07:15:00' },
      { plate_number: 'B 7710 XR', location_id: 56, timestamp: '2026-07-13 10:45:00' },
      { plate_number: 'B 1024 AA', location_id: 56, timestamp: '2026-07-12 14:00:00' },
      { plate_number: 'B 8899 CK', location_id: 56, timestamp: '2026-07-12 15:30:00' },
      { plate_number: 'B 4112 YY', location_id: 56, timestamp: '2026-07-13 09:00:00' },
      { plate_number: 'B 3012 EX', location_id: 56, timestamp: '2026-07-13 09:45:00' },
      { plate_number: 'B 5991 WP', location_id: 56, timestamp: '2026-07-13 10:05:00' },
      { plate_number: 'B 1234 AB', location_id: 21, timestamp: '2026-07-13 08:30:00' },
      { plate_number: 'B 5678 CD', location_id: 71, timestamp: '2026-07-13 09:15:00' },
      { plate_number: 'B 9911 EF', location_id: 34, timestamp: '2026-07-13 10:00:00' }
    ],
    checkpoints: [
      { id: 1, name: 'Pos Utara', status: 'ACTIVE' },
      { id: 2, name: 'Pos Selatan', status: 'ACTIVE' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Saya menemukan catatan lokasi di database kepolisian. Cari ID lokasi milik Arunika Warehouse.',
      goal: 'Lihat seluruh lokasi yang tercatat di tabel locations.',
      availableTokens: ['SELECT', '*', 'FROM', 'locations'],
      hint: "Tampilkan semua baris di tabel locations.",
      validateResult: (res) => res && res.length >= 1 && res.some(r => r.id === 56)
    },
    {
      id: 2,
      story: 'Gudang itu terisolasi. Cari kendaraan mana yang paling terakhir mengunjungi gudang tersebut (location_id 56).',
      goal: 'Cari 1 kendaraan paling terakhir yang mendatangi location_id 56 di tabel routes.',
      availableTokens: ['SELECT', '*', 'FROM', 'routes', 'WHERE', 'location_id', '=', '56', 'ORDER', 'BY', 'timestamp', 'DESC', 'LIMIT', '1'],
      hint: "Cari di tabel routes yang location_id-nya cocok dengan gudang itu, urutkan dari waktu paling baru, lalu ambil cuma satu baris paling atas.",
      validateResult: (res) => res && res.length === 1 && res[0].plate_number && res[0].plate_number.replace(/\s+/g, '') === 'B2841PT' && Number(res[0].location_id) === 56
    },
    {
      id: 3,
      story: 'Rute kendaraan ini terlihat ganjil. Urutkan seluruh riwayat perjalanan mobil B 2841 PT untuk menyusun kronologi.',
      goal: 'Urutkan seluruh rute perjalanan kendaraan B 2841 PT berdasarkan waktu.',
      availableTokens: ['SELECT', '*', 'FROM', 'routes', 'WHERE', 'plate_number', '=', "'B 2841 PT'", 'ORDER', 'BY', 'timestamp'],
      hint: "Cari di tabel routes yang plate_number-nya cocok dengan plat itu, urutkan berdasarkan waktu supaya keliatan urutan kejadiannya.",
      validateResult: (res) => res && res.length === 3 && res.some(r => r.location_id === 21) && res.some(r => r.location_id === 71) && res.some(r => r.location_id === 56)
    },
    {
      id: 4,
      story: 'Mungkin ada kendaraan lain yang mencurigakan di lokasi gudang Arunika. Periksa 10 riwayat kedatangan terakhir.',
      goal: 'Tampilkan 10 riwayat kedatangan kendaraan terakhir di location_id 56.',
      availableTokens: ['SELECT', '*', 'FROM', 'routes', 'WHERE', 'location_id', '=', '56', 'ORDER', 'BY', 'timestamp', 'DESC', 'LIMIT', '10'],
      hint: "Sama seperti objective kedua tadi (urutkan dari terbaru), tapi kali ini ambil 10 baris teratas, bukan cuma satu.",
      validateResult: (res) => res && res.length >= 2 && res.some(r => r.plate_number && r.plate_number.replace(/\s+/g, '') === 'B7710XR')
    }
  ],
  report: {
    question: 'Kirim laporan penyelidikan mengenai rute perjalanan mencurigakan ini.',
    options: [
      'Andi mengemudikan mobilnya langsung ke gudang Arunika dari rumah sakit.',
      'Mobil Andi B 2841 PT pergi ke gudang Arunika dengan rute yang tidak masuk akal dan sempat berhenti 57 menit di SPBU, serta ada mobil perusahaan PT Arunika Logistics B 7710 XR yang juga aktif mengunjungi gudang.',
      'Gudang tersebut sudah lama kosong dan tidak ada kendaraan lain yang berkunjung.',
      'Sopir truk adalah orang yang memarkir mobil di SPBU.'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nBagus! Analisis yang sangat cermat.\nRute perjalanan mobil Andi sangat aneh dan tidak efisien. Berhenti 57 menit di SPBU... ada sesuatu yang disembunyikan di sana.\nDan mobil PT Arunika Logistics juga aktif mengunjungi gudang lama tersebut. Kasus ini semakin mengerikan.\n\nWait... Apa ini? Seseorang menggambar garis merah di petamu!\n"YOU ARE LOOKING AT THE WRONG DESTINATION"\nPerangkat kita diretas! Seseorang mengawasi kita...\n\n*** CHAPTER 7 COMPLETE ***\nUnlocked: Maps, Route Timeline'
  }
};
