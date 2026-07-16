const fs = require('fs');
let code = fs.readFileSync('src/components/screens/EvidenceScreen.tsx', 'utf8');

code = code.replace(
  "  setAppState: (state: any) => void;\n}",
  "  setAppState: (state: any) => void;\n  notebookContent?: string;\n  appState?: string;\n  unlockedApps?: string[];\n}"
);

code = code.replace(
  "({ currentLevelId, setAppState }) => {",
  "({ currentLevelId, setAppState, notebookContent = '', appState = '', unlockedApps = [] }) => {"
);

const filterLogic = `  const evidenceItems = allEvidence.filter(e => {
    if (e.level < currentLevelId) return true;
    if (e.level > currentLevelId) return false;
    
    // For the current level, check if evidence is actually unlocked yet
    if (e.level === 1) return unlockedApps.includes('EVIDENCE');
    if (e.level === 5) return notebookContent.includes('06 minutes\\nNo Footage');
    if (e.level === 6) return notebookContent.includes('Seseorang menghapus sebagian data perusahaan.');
    
    // For levels 2, 3, 4, 7, 8, evidence unlocks right when the report state is active 
    // or if the appState is EVIDENCE but we already know we're at the end of the level.
    // Wait, if appState is 'EVIDENCE' and currentLevelId === 2, is it unlocked?
    // In Level 2, appState goes straight to REPORT. If user opens EVIDENCE from MENU,
    // they shouldn't see it unless they are in the REPORT state.
    // But since they are opening it, appState is 'EVIDENCE'.
    // To be safe, let's just check if they have completed the last objective.
    return false; // We need currentObjectiveIndex for this! Let's just use currentObjectiveIndex.
  });`;

fs.writeFileSync('src/components/screens/EvidenceScreen.tsx', code);
