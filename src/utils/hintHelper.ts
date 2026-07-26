import { Objective } from '../types';

export function getObjectiveHint(objective: Objective | undefined): string {
  if (!objective) return "Gunakan klausa SQL yang sesuai dengan tujuan objektif.";
  
  if (objective.hint && objective.hint.trim() !== '') {
    return objective.hint;
  }

  if (objective.availableTokens && objective.availableTokens.length > 0) {
    const tokens = objective.availableTokens.join(' ');
    return `Petunjuk Query: Gunakan kata kunci SQL berikut — ${tokens}`;
  }

  if (objective.goal) {
    return `Petunjuk: ${objective.goal}`;
  }

  return "Petunjuk: Periksa tabel dan nama kolom yang tersedia di database.";
}
