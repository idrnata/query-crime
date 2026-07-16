const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
code = code.replace(
  "  const [isHackedMap, setIsHackedMap] = useState<boolean>(false);",
  "  const [isHackedMap, setIsHackedMap] = useState<boolean>(false);\n  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);"
);

// Set to true in outer else block
code = code.replace(
  "    } else {\n      // Step 12: Quest complete (objectives done), Evidence Unlocked\n      if (currentLevelId === 6) {",
  "    } else {\n      setIsLevelComplete(true);\n      // Step 12: Quest complete (objectives done), Evidence Unlocked\n      if (currentLevelId === 6) {"
);

// Set to false on next chapter
code = code.replace(
  "          setCurrentLevelId(currentLevelId + 1);\n          setCurrentObjectiveIndex(0);\n          setHasAcceptedMission(false);",
  "          setCurrentLevelId(currentLevelId + 1);\n          setCurrentObjectiveIndex(0);\n          setIsLevelComplete(false);\n          setHasAcceptedMission(false);"
);

// Update EvidenceScreen props
code = code.replace(
  "<EvidenceScreen currentLevelId={currentLevelId} setAppState={setAppState} />",
  "<EvidenceScreen currentLevelId={currentLevelId} setAppState={setAppState} isLevelComplete={isLevelComplete} unlockedApps={unlockedApps} notebookContent={notebookContent} />"
);

fs.writeFileSync('src/App.tsx', code);
