const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /saveProgress\(currentLevelId, currentObjectiveIndex, unlockedLevelIds, true, newApps, notebookContent, contacts, witnesses, messages, stats\);/g,
  "setMessages(prevMsgs => { saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, true, newApps, notebookContent, contacts, witnesses, prevMsgs, stats); return prevMsgs; });"
);

fs.writeFileSync('src/App.tsx', code);
