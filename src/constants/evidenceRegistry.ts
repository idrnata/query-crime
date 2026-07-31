export interface EvidenceItem {
  id: string;
  level: number;
  label: string;
  value: string;
}

// Data mentah semua evidence sepanjang CASE #001. Sebelumnya array 48 baris
// ini nempel langsung di EvidenceScreen.tsx, campur sama logic unlock-nya.
export const ALL_EVIDENCE: EvidenceItem[] = [
  // Level 1
  { id: 'plate_1734', level: 1, label: 'Plate', value: 'B 1734 QAZ' },
  { id: 'vehicle_avanza', level: 1, label: 'Vehicle', value: 'Silver Avanza' },
  // Level 2
  { id: 'patient_rizky', level: 2, label: 'Patient', value: 'Rizky Hidayat' },
  { id: 'hospital_room', level: 2, label: 'Hospital', value: 'Room 402' },
  // Level 3
  { id: 'owner_andi', level: 3, label: 'Owner', value: 'Andi Prasetyo' },
  { id: 'relation_colleague', level: 3, label: 'Relation', value: 'Colleague' },
  // Level 4
  { id: 'gap_8min', level: 4, label: 'Gap', value: '8 Minutes' },
  { id: 'suspect_rudi', level: 4, label: 'Suspect', value: 'Rudi Hartono' },
  // Level 5
  { id: 'cam_offline', level: 5, label: 'Camera Offline', value: 'CAM-03 (Main Gate) Offline' },
  { id: 'missing_footage', level: 5, label: 'Missing Footage', value: '6 Minutes Offline at 11:25-11:31' },
  { id: 'visitor_no_match', level: 5, label: 'Visitor Without Match', value: 'Andi Prasetyo has no CCTV record' },
  { id: 'timeline_updated', level: 5, label: 'Timeline Updated', value: 'Timeline sequence adjusted' },
  // Level 6
  { level: 6, id: 'accident_survivor', label: 'Evidence', value: 'Accident Survivor' },
  { level: 6, id: 'old_accident', label: 'History', value: 'Old Accident' },
  { level: 6, id: 'arunika_assoc', label: 'Company', value: 'PT Arunika Logistics' },
  { level: 6, id: 'missing_driver', label: 'Missing Person', value: 'Missing Driver' },
  { level: 6, id: 'corrupted', label: 'Status', value: 'Corrupted Company Record' },
  // Level 7
  { level: 7, id: 'warehouse_loc', label: 'Location', value: 'Arunika Warehouse' },
  { level: 7, id: 'suspicious_route', label: 'Route', value: 'Suspicious 57m Delay' },
  { level: 7, id: 'arunika_fleet', label: 'Activity', value: 'Fleet B 7710 XR detected' },
  { level: 7, id: 'hacked_map', label: 'Warning', value: 'Red Lines / Hacked Map' },
  // Level 8
  { level: 8, id: 'unknown_acc', label: 'Financial', value: 'Unknown Account Found' },
  { level: 8, id: 'hush_money', label: 'Payments', value: '48 Hush Money Transactions' },
  { level: 8, id: 'surveillance', label: 'Threat', value: 'Supervisor Surveillance Photo' },
  { level: 8, id: 'stop_dies', label: 'Warning', value: 'STOP OR HE DIES' },
  // Level 9
  { level: 9, id: 'missing_investigator', label: 'Missing Person', value: 'Missing Investigator (ID 52)' },
  { level: 9, id: 'archived_notebook', label: 'Archived File', value: 'Digital Notebook Polisi' },
  { level: 9, id: 'deleted_record', label: 'Status', value: 'Deleted Criminal Record' },
  { level: 9, id: 'empty_suspects', label: 'Case Result', value: 'Empty Suspect List' },
  // Level 10
  { level: 10, id: 'recovered_email', label: 'Email', value: 'Recovered Email (Raka/52)' },
  { level: 10, id: 'camera_maint', label: 'Schedule', value: 'Camera Maintenance Schedule' },
  { level: 10, id: 'warehouse_blueprint', label: 'Asset', value: 'Warehouse Blueprint' },
  { level: 10, id: 'employee_list_ev', label: 'People', value: 'Arunika Employee List' },
  // Level 11
  { level: 11, id: 'tailing_pattern', label: 'Critical', value: 'Vehicle Tailing Pattern' },
  { level: 11, id: 'hq_visit', label: 'Suspicious', value: 'Police HQ Visit (XR)' },
  { level: 11, id: 'admin_disable', label: 'Sabotage', value: 'Admin Camera Override' },
  // Level 12
  { level: 12, id: 'hq_camera_log', label: 'HQ CCTV', value: 'Fleet B 7710 XR at Police HQ' },
  { level: 12, id: 'badge_gate_access', label: 'Badge Log', value: 'Badge B-118 Visitor Entrance Access' },
  { level: 12, id: 'personnel_yusuf', label: 'Personnel', value: 'Yusuf Hamdani (HQ Staff)' },
  { level: 12, id: 'clean_suspect_record', label: 'Record Status', value: 'No Suspect Record (Yusuf)' },
  // Level 13 (Case 002 Ch 01)
  { level: 13, id: 'address_mismatch', label: 'Anomaly', value: 'Herlina Wijaya Address Mismatch' },
  { level: 13, id: 'sync_log_pass', label: 'System Integrity', value: 'Replication & Sync Log PASS' },
  // Level 14 (Case 002 Ch 02)
  { level: 14, id: 'rendra_vehicle_mismatch', label: 'Relation Anomaly', value: 'Rendra Saputra / B-1824-QC Relation' },
  { level: 14, id: 'manipulated_relation', label: 'Investigation Findings', value: 'Valid Individual Data, Manipulated Relations' },
  // Level 15 (Case 002 Ch 03)
  { level: 15, id: 'audit_unauthorized_update', label: 'Anomaly', value: 'Unauthorized Update at 02:13' },
  { level: 15, id: 'system_account_activity', label: 'Account Anomaly', value: 'system_sync Account UPDATE at 02:14' },
  { level: 15, id: 'unknown_host_session', label: 'Session Anomaly', value: 'system_sync Session - Unknown Host' }
];

export interface EvidenceUnlockContext {
  currentLevelId: number;
  currentObjectiveIndex: number;
  isLevelComplete: boolean;
  unlockedApps: string[];
  notebookContent: string;
}

type UnlockPredicate = (ctx: EvidenceUnlockContext) => boolean;

// Buat level yang UNLOCK-nya berlaku buat SELURUH evidence di level itu
// sekaligus (bukan per-item) — cuma level 1 (nunggu app EVIDENCE ke-unlock)
// dan level 5 (nunggu notebook entry CCTV) yang begini.
const LEVEL_WIDE_PREDICATES: Record<number, UnlockPredicate> = {
  1: (ctx) => ctx.unlockedApps.includes('EVIDENCE'),
  5: (ctx) => ctx.notebookContent.includes('06 minutes\nNo Footage'),
};

// Predikat per-item, keyed by evidence id. Item yang levelnya sama dengan
// currentLevelId tapi id-nya TIDAK ada di sini otomatis fallback ke
// `isLevelComplete` (lihat isEvidenceUnlocked di bawah) — persis behavior
// lama ("return isLevelComplete" di akhir tiap blok if level===X).
const ID_PREDICATES: Record<string, UnlockPredicate> = {
  accident_survivor: (ctx) => ctx.notebookContent.includes('Rizky pernah'),
  old_accident: (ctx) => ctx.notebookContent.includes('Arunika'),
  arunika_assoc: (ctx) => ctx.notebookContent.includes('Arunika'),
  missing_driver: (ctx) => ctx.notebookContent.includes('Sopir'),
  warehouse_loc: (ctx) => ctx.notebookContent.includes('Warehouse'),
  suspicious_route: (ctx) => ctx.notebookContent.includes('delay'),
  unknown_acc: (ctx) => ctx.notebookContent.includes('Unknown Account'),
  missing_investigator: (ctx) => ctx.notebookContent.includes('ID 52'),
  archived_notebook: (ctx) => ctx.notebookContent.includes('Notebook Polisi'),
  deleted_record: (ctx) => ctx.notebookContent.includes('Record person'),
  empty_suspects: (ctx) => ctx.notebookContent.includes('Tidak ada tersangka'),
  recovered_email: (ctx) => ctx.notebookContent.includes('Email terakhir'),
  camera_maint: (ctx) => ctx.notebookContent.includes('Maintenance?'),
  tailing_pattern: (ctx) => ctx.notebookContent.includes('mengikuti Budi'),
  admin_disable: (ctx) => ctx.currentObjectiveIndex >= 4,
  // Level 12
  hq_camera_log: (ctx) => ctx.currentObjectiveIndex >= 1,
  badge_gate_access: (ctx) => ctx.currentObjectiveIndex >= 2,
  personnel_yusuf: (ctx) => ctx.currentObjectiveIndex >= 3,
  clean_suspect_record: (ctx) => ctx.isLevelComplete,
  // Level 13
  address_mismatch: (ctx) => ctx.currentObjectiveIndex >= 1,
  sync_log_pass: (ctx) => ctx.isLevelComplete,
  // Level 14
  rendra_vehicle_mismatch: (ctx) => ctx.currentObjectiveIndex >= 1,
  manipulated_relation: (ctx) => ctx.isLevelComplete,
  // Level 15
  audit_unauthorized_update: (ctx) => ctx.notebookContent.includes('Perubahan pertama terjadi pukul 02:13'),
  system_account_activity: (ctx) => ctx.notebookContent.includes('menggunakan akun sistem'),
  unknown_host_session: (ctx) => ctx.notebookContent.includes('identitas perangkat hilang'),
};

export function isEvidenceUnlocked(item: EvidenceItem, ctx: EvidenceUnlockContext): boolean {
  if (item.level < ctx.currentLevelId) return true;
  if (item.level > ctx.currentLevelId) return false;

  const levelPredicate = LEVEL_WIDE_PREDICATES[item.level];
  if (levelPredicate) return levelPredicate(ctx);

  const idPredicate = ID_PREDICATES[item.id];
  if (idPredicate) return idPredicate(ctx);

  // Default: evidence unlock begitu level ditandai selesai.
  return ctx.isLevelComplete;
}

export function getVisibleEvidence(ctx: EvidenceUnlockContext): EvidenceItem[] {
  return ALL_EVIDENCE.filter(item => isEvidenceUnlocked(item, ctx));
}
