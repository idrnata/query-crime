import { Level } from '../../../types';
import { MASTER_REGISTRY } from '../../masterRegistry';

export const chapter1: Level = {
  id: 13,
  caseId: 'CASE002',
  chapterNumber: 1,
  title: 'Case #002: Ch 01 - Rutinitas yang Terganggu',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Laporan Kecil',
    body: 'Pagi.\nAda laporan kecil dari Administrasi Database.\nIT menganggapnya bug sinkronisasi.\nAku ingin kamu melihatnya dulu sebelum tiket ditutup.\n\nTemui aku setelah membacanya.',
  },
  files: {
    title: 'CASE #002 — Status: OPEN',
    content: 'Case Type: Database Verification\nPriority: LOW\nSumber: Divisi Administrasi Database\nCatatan: Beberapa hubungan data kendaraan berubah setelah sinkronisasi malam. Dianggap bug sinkronisasi oleh tim IT.',
  },
  database: {
    vehicle: MASTER_REGISTRY.vehicle,
    owner: MASTER_REGISTRY.owner,
    address: MASTER_REGISTRY.address,
    sync_log: MASTER_REGISTRY.sync_log
  },
  objectives: [
    {
      id: 1,
      story: 'Kalau ini memang bug, kenapa Pak Raka terlihat tidak yakin? Coba temui dia.',
      goal: 'Hubungi Supervisor Raka lewat Contacts sebelum melanjutkan investigasi.',
      availableTokens: [],
      validateResult: () => true
    },
    {
      id: 2,
      story: 'Raka minta kamu lihat sendiri laporannya. Mulai dari data kendaraan.',
      goal: 'Lihat seluruh data kendaraan di tabel vehicle.',
      availableTokens: ['SELECT', '*', 'FROM', 'vehicle'],
      hint: 'Tampilkan semua baris di tabel vehicle.',
      validateResult: (res) => res && res.length === 3
    },
    {
      id: 3,
      story: 'Bandingkan dengan data pemiliknya.',
      goal: 'Lihat seluruh data pemilik kendaraan di tabel owner.',
      availableTokens: ['SELECT', '*', 'FROM', 'owner'],
      hint: 'Tampilkan semua baris di tabel owner.',
      validateResult: (res) => res && res.length === 3
    },
    {
      id: 4,
      story: 'Sistem mencatat riwayat alamat secara terpisah. Mungkin ada jawabannya di sana.',
      goal: 'Lihat riwayat alamat di tabel address.',
      availableTokens: ['SELECT', '*', 'FROM', 'address'],
      hint: 'Tampilkan semua baris di tabel address.',
      validateResult: (res) => res && res.length === 2
    },
    {
      id: 5,
      story: 'Cek juga log sinkronisasinya. Kalau ada bug, biasanya kelihatan di sini.',
      goal: 'Lihat log sinkronisasi di tabel sync_log.',
      availableTokens: ['SELECT', '*', 'FROM', 'sync_log'],
      hint: 'Tampilkan semua baris di tabel sync_log.',
      validateResult: (res) => res && res.length === 2 && res.every(r => r.status === 'SUCCESS')
    }
  ],
  report: {
    question: 'Kirim laporan observasi awal.',
    options: [
      'Ini murni bug sinkronisasi seperti yang dilaporkan tim IT.',
      'Data di setiap tabel valid, tapi hubungan antar data tidak konsisten — kemungkinan bukan bug biasa.',
      'Sistem sinkronisasi mengalami kegagalan yang belum terdeteksi.',
      'Data pemilik kendaraan salah dimasukkan oleh admin.'
    ],
    correctIndex: 1,
    conclusion: 'Supervisor Raka:\nBertahun-tahun aku menangani database.\nKalau ada bug, biasanya sistem meninggalkan bekas.\nTapi ini terlalu bersih.\n\nIni bukan kesalahan. Ini keputusan.\nAyo kita cari tahu apa lagi yang terlihat normal, padahal tidak.\n\n*** CHAPTER 1 (CASE #002) COMPLETE ***'
  }
};
