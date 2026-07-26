export interface Objective {
  id: number;
  story: string;
  goal: string;
  availableTokens: string[];
  validateResult: (result: any[], query?: string) => boolean;
  hint?: string;
}

export interface Level {
  id: number;
  title: string;
  mail: { sender: string; subject: string; body: string };
  files: { title: string; content: string };
  web?: Record<string, string>;
  database: Record<string, any[]>;
  objectives: Objective[];
  report: {
    question: string;
    options: string[];
    correctIndex: number;
    conclusion: string;
  };
}

export interface PlayerStats {
  queriesRun: number;
  successfulQueries: number;
  hintsUsed: number;
  casesCompleted: number;
  battery?: number;
  evidenceReviewed?: number;
}

export interface EvidenceMetadata {
  id: string;
  foundAt: { chapter: number; step: number };
  reviewedCount: number;
  status: 'Evidence' | 'Critical Evidence';
  firstLinkedAt?: { chapter: number; step: number };
  criticalAt?: { chapter: number; step: number };
}

export interface SaveData {
  currentLevelId: number;
  currentObjectiveIndex: number;
  unlockedLevelIds: number[];
  hasAcceptedMission?: boolean;
  unlockedApps?: string[];
  notebookContent?: string;
  contacts?: any[];
  witnesses?: any[];
  messages?: any[];
  stats?: PlayerStats;
  playerName?: string;
  evidenceMetadata?: Record<string, EvidenceMetadata>;
}

export type AppState = 'BOOT' | 'HOME' | 'MENU' | 'INBOX' | 'CASE_FILES' | 'DB_LIST' | 'TERM' | 'RESULT' | 'REPORT' | 'QUEST_COMPLETE' | 'ERROR' | 'EVIDENCE' | 'NOTEBOOK' | 'CONTACTS' | 'BROWSER' | 'MAP' | 'RANK' | 'SETTINGS' | 'WITNESSES' | 'CALLING' | 'TIMELINE' | 'EMAIL' | 'STATISTICS' | 'DEV_CONSOLE';
