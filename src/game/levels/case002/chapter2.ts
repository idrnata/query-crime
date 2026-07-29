import { Level } from '../../../types';
import { MASTER_REGISTRY } from '../../masterRegistry';

export const chapter2: Level = {
  id: 14,
  caseId: 'CASE002',
  chapterNumber: 2,
  title: 'Case #002: Ch 02 - Pertanyaan Tanpa Jawaban',
  mail: {
    sender: 'Supervisor Raka',
    subject: 'Lanjutkan',
    body: 'Baik.\nSekarang bandingkan laporan Administrasi dengan seluruh database.\nJangan hanya percaya satu sumber.',
  },
  files: {
    title: 'CASE #002 — Status: OPEN',
    content: 'Case Type: Database Verification\nPriority: LOW\nSumber: Divisi Administrasi Database\nCatatan: Perbandingan manual menunjukkan beberapa inkonsistensi hubungan data.',
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
      story: 'Semuanya terlihat benar. Tapi kenapa terasa salah? Bandingkan laporan Administrasi dengan seluruh database.',
      goal: 'Buka Police Database, bandingkan datanya dengan laporan Administrasi.',
      availableTokens: [],
      validateResult: () => true
    },
    {
      id: 2,
      story: "Raka mengetik satu query, lalu berhenti sebelum menekan Execute. \"Aku bisa saja menjalankannya. Tapi sekarang giliranmu.\"",
      goal: 'Jalankan query yang sudah disiapkan Raka.',
      availableTokens: [],
      prefilledQuery: 'SELECT vehicle.vehicle_plate, owner.owner_name FROM vehicle INNER JOIN owner ON vehicle.owner_id = owner.owner_id;',
      readOnlyQuery: true,
      validateResult: (res) => res && res.length === 12
    }
  ],
  report: {
    question: 'Apa kesimpulan investigasi sejauh ini?',
    options: [
      'Ini murni bug sinkronisasi, semua kendaraan dan pemilik cocok.',
      'Beberapa data individual salah dimasukkan oleh admin.',
      'Data tiap tabel valid, tapi hubungan (relasi) antar data telah diubah secara sengaja — bukan bug.',
      'Query yang dijalankan tidak dapat dipercaya karena hasilnya berbeda tiap kali.'
    ],
    correctIndex: 2,
    conclusion: 'Supervisor Raka:\nLaporan ini masuk pukul delapan pagi.\nPerubahan pertama terjadi pukul dua dini hari.\n\nKalau seseorang bisa mengubah hubungan data tanpa meninggalkan jejak, berarti dia tahu persis bagaimana database ini bekerja.\n\nKita tidak sedang mencari bug.\n\n...kita sedang mencari seseorang.\n\n*** CHAPTER 2 (CASE #002) COMPLETE ***'
  }
};
