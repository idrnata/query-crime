export interface TableUnlockRule {
  label: string;
  minChapter: number;
  minObjectiveIndexAtMinChapter?: number;
}

export const TABLE_UNLOCK_RULES: TableUnlockRule[] = [
  { label: 'Vehicles', minChapter: 1 },
  { label: 'Owners', minChapter: 1 },
  { label: 'Citizens', minChapter: 2 },
  { label: 'Visitors', minChapter: 2 },
  { label: 'Patients', minChapter: 2 },
  { label: 'Parking', minChapter: 1 },
  { label: 'Cameras', minChapter: 5 },
  { label: 'Footage', minChapter: 5 },
  { label: 'Articles', minChapter: 6 },
  { label: 'Companies', minChapter: 6, minObjectiveIndexAtMinChapter: 3 },
  { label: 'Accounts', minChapter: 8 },
  { label: 'Transactions', minChapter: 8 },
  { label: 'Branches', minChapter: 8 },
  { label: 'Persons', minChapter: 9 },
  { label: 'Cases', minChapter: 9 },
  { label: 'Suspects', minChapter: 9 },
  { label: 'Evidence', minChapter: 9 },
  { label: 'Emails', minChapter: 10 },
  { label: 'Deleted', minChapter: 10 },
  { label: 'Attachments', minChapter: 10 },
  { label: 'Camera Logs', minChapter: 11 },
  { label: 'System Logs', minChapter: 11 },
  { label: 'Personnel', minChapter: 12 },
  { label: 'Badge Logs', minChapter: 12 }
];

export function isTableLocked(
  label: string,
  currentLevelId: number,
  currentObjectiveIndex: number
): boolean {
  const rule = TABLE_UNLOCK_RULES.find(r => r.label === label);
  if (!rule) return false;

  if (currentLevelId < rule.minChapter) return true;

  if (
    rule.minObjectiveIndexAtMinChapter !== undefined &&
    currentLevelId === rule.minChapter &&
    currentObjectiveIndex < rule.minObjectiveIndexAtMinChapter
  ) {
    return true;
  }

  return false;
}
