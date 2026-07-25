export interface MissionPopupData {
  title: string;
  message: string;
}

export const DEFAULT_MISSION_POPUP: MissionPopupData = {
  title: 'SYSTEM',
  message: 'Mission Accepted. Objective updated in Case Files.'
};

export const MISSION_ACCEPTED_POPUPS: Record<number, MissionPopupData> = {
  1: {
    title: 'MISSION ACCEPTED',
    message: 'ACCESS GRANTED TO:\n- VEHICLES DATABASE\n- OWNERS DATABASE\n- PARKING LOGS\n\nAnalyze the tables to identify the owner of vehicle B1734QAZ.'
  },
  2: {
    title: 'NEW DATABASE ACCESS',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CITIZENS DATABASE (citizens, visitors, patients)\n- CONTACTS APP UNLOCKED\n\nVerify if Budi Santoso\'s address matches citizens registration data.'
  },
  3: {
    title: 'DATA UPDATED',
    message: 'MISSION ACCEPTED\n\nDATA UPDATED:\n- Parking Log (entri baru)\n\nNew query capabilities unlocked: menggabungkan dua tabel sekaligus'
  },
  4: {
    title: 'NEW INVESTIGATION TOOL',
    message: 'MISSION ACCEPTED\n\nNEW FEATURE UNLOCKED:\n- CHRONOLOGICAL TIMELINE SCREEN'
  },
  5: {
    title: 'CCTV SYSTEM GRANTED',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CCTV DATABASE (cameras, footage)'
  },
  6: {
    title: 'DIGITAL ARCHIVE ACCESS',
    message: 'MISSION ACCEPTED\n\nNEW APP UNLOCKED:\n- POLICE SECURE BROWSER\n- COMPANIES DATABASE\n\nSupervisor Raka:\nKamera memang mati selama enam menit. Tapi orang tidak bisa menghapus semua jejaknya. Setiap orang meninggalkan jejak digital. Saya membuka akses ke Arsip Digital Nasional.'
  },
  7: {
    title: 'GPS TRACKING INTERFACE',
    message: 'MISSION ACCEPTED\n\nNEW APP UNLOCKED:\n- GPS MAPS TRACKER\n  (locations, routes, checkpoints)'
  },
  8: {
    title: 'FINANCIAL AUDIT GRANTED',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- FINANCIAL BANK DATABASE\n  (accounts, transactions, branches)'
  },
  9: {
    title: 'NEW DATABASE ACCESS',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CRIMINAL RECORDS\n  (persons, cases, suspects, evidence)'
  },
  10: {
    title: 'ACCESS GRANTED',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- EMAIL SERVER ARCHIVE\n  (emails, deleted, attachments)'
  },
  11: {
    title: 'FINAL DATABASE ACCESS',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- TRAFFIC CAMERA LOGS\n  (camera_logs, system_logs)'
  },
  12: {
    title: 'INTERNAL AFFAIRS ACCESS',
    message: 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- POLICE INTERNAL DATABASE\n  (personnel, badge_logs)'
  }
};

export function getMissionAcceptedPopup(chapterId: number): MissionPopupData {
  return MISSION_ACCEPTED_POPUPS[chapterId] || DEFAULT_MISSION_POPUP;
}
