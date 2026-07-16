const fs = require('fs');
let code = fs.readFileSync('src/components/screens/EvidenceScreen.tsx', 'utf8');

code = code.replace(
  "interface EvidenceScreenProps {\n  currentLevelId: number;\n  setAppState: (state: any) => void;\n  notebookContent?: string;\n  appState?: string;\n  unlockedApps?: string[];\n  currentObjectiveIndex?: number;\n  objectivesLength?: number;\n}",
  "interface EvidenceScreenProps {\n  currentLevelId: number;\n  setAppState: (state: any) => void;\n  isLevelComplete?: boolean;\n  unlockedApps?: string[];\n  notebookContent?: string;\n}"
);

code = code.replace(
  "({ currentLevelId, setAppState, notebookContent = '', appState = '', unlockedApps = [], currentObjectiveIndex = 0, objectivesLength = 0 }) => {",
  "({ currentLevelId, setAppState, isLevelComplete = false, unlockedApps = [], notebookContent = '' }) => {"
);

const filterLogic = `  const evidenceItems = allEvidence.filter(e => {
    if (e.level < currentLevelId) return true;
    if (e.level > currentLevelId) return false;
    
    // For the current level, check if evidence is actually unlocked yet
    if (e.level === 1) return unlockedApps.includes('EVIDENCE');
    if (e.level === 5) return notebookContent.includes('06 minutes\\nNo Footage');
    if (e.level === 6) return notebookContent.includes('Seseorang menghapus sebagian data perusahaan.');
    
    // For other levels, evidence unlocks when the level is marked as complete
    return isLevelComplete;
  });`;

code = code.replace(
  /  const evidenceItems = allEvidence\.filter\([\s\S]*?\}\);/m,
  filterLogic
);

fs.writeFileSync('src/components/screens/EvidenceScreen.tsx', code);
