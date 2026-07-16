const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const markMessageAsRead = `  const markMessageAsRead = (id: string) => {
    setMessages(prev => {
      const msg = prev.find(m => m.id === id);
      if (msg && !msg.read) {
        const updated = prev.map(m => m.id === id ? { ...m, read: true } : m);
        saveProgress(
          currentLevelId,
          currentObjectiveIndex,
          unlockedLevelIds,
          hasAcceptedMission,
          unlockedApps,
          notebookContent,
          contacts,
          witnesses,
          updated,
          stats
        );
        return updated;
      }
      return prev;
    });
  };`;

code = code.replace(
  /  const markMessageAsRead = \(id: string\) => \{[\s\S]*?    \}\n  \};\n/m,
  markMessageAsRead + '\n'
);

fs.writeFileSync('src/App.tsx', code);
