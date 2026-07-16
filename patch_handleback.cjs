const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, newNote, contacts, witnesses, messages, stats);",
  "setMessages(prevMsgs => { saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, newNote, contacts, witnesses, prevMsgs, stats); return prevMsgs; });"
);

fs.writeFileSync('src/App.tsx', code);
