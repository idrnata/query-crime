import { LEVELS } from './levels';

export function getInitialNotebookForChapter(chapterId: number): string {
  let content = 'Kemungkinan pemilik kendaraan...';
  if (chapterId >= 3) {
    content += '\n\nDina Santoso: Kemungkinan anggota keluarga.';
  }
  if (chapterId >= 4) {
    content += '\n\nSemua data saling terhubung. Cari hubungan antar tabel.';
  }
  if (chapterId >= 5) {
    content += '\n\nData terlalu banyak. Perlu difilter.\nAda dua orang lain yang berada di lokasi hampir bersamaan.';
    content += '\n\nRudi juga mengunjungi Rizky.';
    content += '\n\nData Rudi tidak lengkap.';
    content += '\n\nRudi tidak memiliki kendaraan.';
    content += '\n\nAda tiga kendaraan.';
  }
  if (chapterId > 6) {
    content += '\n\nRizky pernah mengalami kecelakaan.';
    content += '\n\nAndi tidak pernah muncul di berita.';
    content += '\n\nArunika -> Kecelakaan -> Rizky';
    content += '\n\nSopir truk menghilang.';
    content += '\n\nData perusahaan telah dimodifikasi.';
  }
  if (chapterId >= 7) {
    content += '\n\nSeseorang menghapus sebagian data perusahaan.';
  }
  if (chapterId >= 11) {
    content += '\n\nMobil B7710XR mengikuti Budi.';
  }
  return content;
}

export function getChapterSetupData(chapterId: number, currentTimeStr: string) {
  const newUnlocked = Array.from({ length: chapterId }, (_, i) => i + 1);

  const baseApps = ['INBOX', 'CASE_FILES', 'DB_LIST', 'NOTEBOOK', 'RANK', 'SETTINGS'];
  if (chapterId >= 2) baseApps.push('CONTACTS');
  if (chapterId >= 3) baseApps.push('WITNESSES');
  if (chapterId >= 4) baseApps.push('TIMELINE');
  if (chapterId >= 5) baseApps.push('EVIDENCE');
  if (chapterId >= 6) baseApps.push('BROWSER');
  if (chapterId >= 7) baseApps.push('MAP');
  if (chapterId >= 10) baseApps.push('EMAIL');

  const initialContacts = [
    { name: 'Raka (Supervisor)', role: 'MCD Commander', phone: '911-SUPER', id: 'raka' },
    { name: 'Budi Santoso', role: 'Warga Sipil', phone: '08124444', id: 'budi' }
  ];
  if (chapterId >= 3) {
    initialContacts.push({ name: 'Dina Santoso', role: 'Anggota Keluarga', phone: '08125555', id: 'dina' });
  }

  const initialWitnesses: any[] = [];
  if (chapterId >= 3) {
    initialWitnesses.push({ name: 'Dina Santoso', statement: 'Budi (kakaknya) pergi menemui seseorang di RS Harapan Bangsa 3 hari lalu.' });
  }

  const reconstructedMessages: any[] = [];
  for (let c = 1; c < chapterId; c++) {
    const lvl = LEVELS.find(l => l.id === c);
    if (lvl) {
      reconstructedMessages.push({
        id: `initial_${c}`,
        sender: lvl.mail.sender,
        subject: lvl.mail.subject,
        body: lvl.mail.body,
        timestamp: '08:15',
        read: true
      });
      reconstructedMessages.push({
        id: `closing_${c}`,
        sender: 'Supervisor Raka',
        subject: `RE: ${lvl.title} - SELESAI`,
        body: lvl.report.conclusion,
        timestamp: '08:30',
        read: true
      });
    }
    if (c === 2) {
      reconstructedMessages.push({
        id: 'call_dina',
        sender: 'Supervisor Raka',
        subject: 'Hubungi Dina',
        body: 'Bagus. Hubungi Dina.',
        timestamp: '08:20',
        read: true
      });
    }
    if (c === 3) {
      reconstructedMessages.push({
        id: 'anon_msg',
        sender: 'Unknown Number',
        subject: '!!!',
        body: 'Berhenti mencari Budi. Kalau tidak... kamu akan menjadi orang berikutnya.',
        timestamp: '08:35',
        read: true
      });
    }
    if (c === 6) {
      reconstructedMessages.push({
        id: 'anon_msg_6',
        sender: 'Unknown Number',
        subject: '!!! WARNING !!!',
        body: 'Kamu mencari kejadian delapan tahun lalu. Itu kesalahan terbesar yang bisa kamu lakukan.',
        timestamp: '08:35',
        read: true
      });
    }
  }

  const activeLevel = LEVELS.find(l => l.id === chapterId);
  const initialMsgId = `initial_${chapterId}`;
  if (activeLevel) {
    reconstructedMessages.push({
      id: initialMsgId,
      sender: activeLevel.mail.sender,
      subject: activeLevel.mail.subject,
      body: activeLevel.mail.body,
      timestamp: '08:15',
      read: false
    });
  }

  const initialNotebook = getInitialNotebookForChapter(chapterId);

  return {
    newUnlocked,
    baseApps,
    initialContacts,
    initialWitnesses,
    reconstructedMessages,
    initialNotebook
  };
}
