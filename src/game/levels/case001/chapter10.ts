import { Level } from '../../../types';

export const chapter10: Level = {
  id: 10,
  title: 'Case #001: Percakapan yang Terputus',
  mail: {
    sender: 'SYSTEM MESSAGE',
    subject: 'Access Request Approved',
    body: 'ACCESS GRANTED: Police Mail Archive Server.\n\nNote: Supervisor Raka status is CURRENTLY UNAVAILABLE.\nSystem auto-login initiated.',
  },
  files: {
    title: 'Police Mail Archive Index',
    content: 'DATABASE - MAIL SERVER ARCHIVE\n\nTables:\n- emails (id, thread_id, sender, receiver, subject, body, sent_at)\n- deleted (id, thread_id, sender, receiver, subject, body, sent_at)\n- attachments (id, email_id, file_name)\n\nNOTICE: Access to deleted items is restricted. Complex reconstruction may require combining multiple queries in stages.',
  },
  database: {
    emails: [
      { id: 201, thread_id: 18, sender: 'Investigator 52', receiver: 'IT Dept', subject: 'Inquiry: Arunika CCTV', body: 'Saya membutuhkan seluruh CCTV di gerbang utama PT Arunika Logistics tanggal 14 Agustus.', sent_at: '2018-08-14 09:00' },
      { id: 202, thread_id: 18, sender: 'IT Dept', receiver: 'Investigator 52', subject: 'Re: Arunika CCTV', body: 'Sebagian file hilang atau tidak dapat diakses pada jam tersebut.', sent_at: '2018-08-14 10:30' },
      { id: 203, thread_id: 18, sender: 'Investigator 52', receiver: 'IT Dept', subject: 'Re: Re: Arunika CCTV', body: 'Saya yakin seseorang menghapusnya dari server pusat.', sent_at: '2018-08-14 11:45' },
      { id: 204, thread_id: 18, sender: 'Unknown', receiver: 'Investigator 52', subject: 'Re: Re: Re: Arunika CCTV', body: null, sent_at: '2018-08-14 13:00' },
      { id: 301, thread_id: 25, sender: 'Admin', receiver: 'Staff', subject: 'Holiday Notice', body: 'Kantor tutup besok.', sent_at: '2024-07-16 17:00' }
    ],
    deleted: [
      { id: 501, thread_id: 18, sender: 'Investigator 52', receiver: 'Unknown', subject: 'Recovered Message', body: 'Jika sesuatu terjadi pada saya... Jangan percaya pada sistem ini. Seseorang di dalam membantu Arunika. [corrupted]', sent_at: '2018-08-14 14:00' },
      { id: 502, thread_id: 12, sender: 'Spam', receiver: 'User', subject: 'Win a Prize', body: 'Click here!', sent_at: '2024-01-01 00:00' }
    ],
    attachments: [
      { id: 1, email_id: 201, file_name: 'warehouse_plan.pdf' },
      { id: 2, email_id: 202, file_name: 'employee_list.csv' },
      { id: 3, email_id: 204, file_name: 'camera_maintenance.xlsx' }
    ]
  },
  objectives: [
    {
      id: 1,
      story: 'Temukan email yang berkaitan dengan kasus kecelakaan Arunika di tabel emails.',
      goal: "Cari email bertema 'Arunika' (subject LIKE '%Arunika%') di tabel emails.",
      availableTokens: ['SELECT', '*', 'FROM', 'emails', 'WHERE', 'subject', 'LIKE', "'%Arunika%'"],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('emails') && q.includes('like') && q.includes('%arunika%') && res && res.length >= 4;
      }
    },
    {
      id: 2,
      story: 'Arsip email ini berantakan. Kelompokkan email terkait Arunika ke dalam tabel sementara (CTE WITH), lalu urutkan berdasarkan waktu kirim.',
      goal: 'Kelompokkan email terkait Arunika menggunakan CTE (WITH), lalu urutkan berdasarkan sent_at.',
      availableTokens: ['WITH', 'arunika_emails', 'AS', '(', 'SELECT', '*', 'FROM', 'emails', 'WHERE', 'subject', 'LIKE', "'%Arunika%'", ')', 'SELECT', '*', 'FROM', 'arunika_emails', 'ORDER', 'BY', 'sent_at'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('with') && q.includes('arunika_emails') && q.includes('order by') && res && res.length >= 4;
      }
    },
    {
      id: 3,
      story: 'Satu email (ID 204) isinya kosong. Cek pesan yang dihapus di tabel deleted dengan thread_id 18 menggunakan tabel sementara (CTE WITH).',
      goal: 'Kelompokkan pesan di tabel deleted dengan thread_id 18 menggunakan CTE (WITH).',
      availableTokens: ['WITH', 'deleted_mail', 'AS', '(', 'SELECT', '*', 'FROM', 'deleted', 'WHERE', 'thread_id', '=', '18', ')', 'SELECT', '*', 'FROM', 'deleted_mail'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('with') && q.includes('deleted_mail') && q.includes('thread_id') && res && res.length > 0;
      }
    },
    {
      id: 4,
      story: 'Cari lampiran (attachments) dari email terkait Arunika dengan menggabungkan tabel sementara (CTE WITH) dan filter IN.',
      goal: 'Cari lampiran (attachments) dari email bertema Arunika menggunakan CTE (WITH).',
      availableTokens: ['WITH', 'suspicious_email', 'AS', '(', 'SELECT', 'id', 'FROM', 'emails', 'WHERE', 'subject', 'LIKE', "'%Arunika%'", ')', 'SELECT', '*', 'FROM', 'attachments', 'WHERE', 'email_id', 'IN', '(', 'SELECT', 'id', 'FROM', 'suspicious_email', ')'],
      validateResult: (res, query) => {
        if (!query) return false;
        const q = query.toLowerCase().replace(/\s+/g, ' ');
        return q.includes('with') && q.includes('attachments') && q.includes('in') && res && res.length >= 3;
      }
    }
  ],
  report: {
    question: 'Apa temuan terpenting dari file camera_maintenance.xlsx?',
    options: [
      'Kamera benar-benar rusak karena petir.',
      'Kamera sedang dalam perbaikan rutin selama sebulan.',
      'Kamera sengaja dijadwalkan mati (maintenance) tepat saat Budi hilang (11:24 - 11:31). Ini bukan kerusakan teknis, melainkan sabotase yang direncanakan.',
      'Tidak ada data maintenance.'
    ],
    correctIndex: 2,
    conclusion: 'Semua clue mulai terhubung.\nKamera tidak rusak. Kamera dijadwalkan mati.\n\nSeseorang di kepolisian atau IT Dept bekerja sama dengan Arunika.\nDan sekarang... Supervisor Raka hilang.\n\n*** CHAPTER 10 COMPLETE ***\nUnlocked: Email Database, Recovered Deleted Mail'
  }
};
