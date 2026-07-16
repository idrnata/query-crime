const fs = require('fs');
let code = fs.readFileSync('src/components/screens/EvidenceScreen.tsx', 'utf8');

code = code.replace(
  "  unlockedApps?: string[];\n}",
  "  unlockedApps?: string[];\n  currentObjectiveIndex?: number;\n  objectivesLength?: number;\n}"
);

code = code.replace(
  "({ currentLevelId, setAppState, notebookContent = '', appState = '', unlockedApps = [] }) => {",
  "({ currentLevelId, setAppState, notebookContent = '', appState = '', unlockedApps = [], currentObjectiveIndex = 0, objectivesLength = 0 }) => {"
);

const filterLogic = `  const evidenceItems = allEvidence.filter(e => {
    if (e.level < currentLevelId) return true;
    if (e.level > currentLevelId) return false;
    
    // For the current level, check if evidence is actually unlocked yet
    if (e.level === 1) return unlockedApps.includes('EVIDENCE');
    if (e.level === 5) return notebookContent.includes('06 minutes\\nNo Footage');
    if (e.level === 6) return notebookContent.includes('Seseorang menghapus sebagian data perusahaan.');
    
    // For other levels, it unlocks at the end of the level (when they are on the last objective)
    // and they have transitioned to the final 'REPORT' stage.
    // If they are on the last objective and appState is not a mid-level state like TERM/DB_LIST/NOTEBOOK/INBOX,
    // they are likely at the end. Actually, it's safer to just show if they have reached the last objective.
    return currentObjectiveIndex >= objectivesLength - 1;
  });`;

code = code.replace(
  "  const evidenceItems = allEvidence.filter(e => e.level <= currentLevelId);",
  filterLogic
);

fs.writeFileSync('src/components/screens/EvidenceScreen.tsx', code);
