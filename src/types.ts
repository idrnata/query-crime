export interface Objective {
  id: number;
  story: string;
  goal: string;
  availableTokens: string[];
  validateResult: (result: any[], query?: string) => boolean;
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
  xp: number;
  queriesRun: number;
  successfulQueries: number;
  accuracy: number;
  hintsUsed: number;
  casesCompleted: number;
  achievements: string[];
  battery?: number;
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
}

export type AppState = 'BOOT' | 'HOME' | 'MENU' | 'INBOX' | 'CASE_FILES' | 'DB_LIST' | 'TERM' | 'RESULT' | 'REPORT' | 'QUEST_COMPLETE' | 'ERROR' | 'EVIDENCE' | 'NOTEBOOK' | 'CONTACTS' | 'BROWSER' | 'MAP' | 'RANK' | 'SETTINGS' | 'WITNESSES' | 'CALLING' | 'TIMELINE';
