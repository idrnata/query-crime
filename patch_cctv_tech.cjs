const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHandleBackBlock = `            let newApps = [...unlockedApps];
            if (!newApps.includes('EVIDENCE')) {
              newApps.push('EVIDENCE');
            }
            setUnlockedApps(newApps);
            setAppState('EVIDENCE');
            
            setPopup({
              title: 'SYSTEM',
              message: 'NEW EVIDENCE ADDED:\\n- Camera Offline\\n- Missing Footage\\n- Visitor Without Match\\n- Timeline Updated',
              onClose: () => {
                setPopup(null);
                showSupervisorPopup('✔ Budi hanya terlihat masuk.\\n✔ Rizky terlihat keluar.\\n✔ Kamera mati selama enam menit.\\n✔ Andi tidak pernah muncul di CCTV.\\n✔ Ada kemungkinan orang lain mengemudikan kendaraan.\\n\\nSekarang buat laporan.', () => {
                  setAppState('REPORT');
                });
              }
            });
            
            setMessages(prevMsgs => { saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, newNote, contacts, witnesses, prevMsgs, stats); return prevMsgs; });`;

const newHandleBackBlock = `            let newApps = [...unlockedApps];
            if (!newApps.includes('EVIDENCE')) {
              newApps.push('EVIDENCE');
            }
            setUnlockedApps(newApps);
            triggerBlink('EVIDENCE');
            setAppState('HOME');
            
            setPopup({
              title: 'SYSTEM',
              message: 'NEW EVIDENCE ADDED:\\n- Camera Offline\\n- Missing Footage\\n- Visitor Without Match\\n- Timeline Updated\\n\\nSilakan buka EVIDENCE LOCKER untuk mengecek temuan.',
              onClose: () => {
                setPopup(null);
                const nextIdx = 4;
                setCurrentObjectiveIndex(nextIdx);
                setMessages(prevMsgs => { saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, newApps, newNote, contacts, witnesses, prevMsgs, stats); return prevMsgs; });
              }
            });`;

code = code.replace(oldHandleBackBlock, newHandleBackBlock);

// Also we need to add the useEffect in App.tsx
const useEffectToAdd = `
  useEffect(() => {
    if (appState === 'EVIDENCE' && currentLevelId === 5 && currentObjectiveIndex === 4 && !popup) {
      showSupervisorPopup('✔ Budi hanya terlihat masuk.\\n✔ Rizky terlihat keluar.\\n✔ Kamera mati selama enam menit.\\n✔ Andi tidak pernah muncul di CCTV.\\n✔ Ada kemungkinan orang lain mengemudikan kendaraan.\\n\\nSekarang buat laporan.', () => {
        setAppState('REPORT');
      });
    }
  }, [appState, currentLevelId, currentObjectiveIndex, popup]);
`;

// Insert it right before the return statement of App component
code = code.replace("  return (", useEffectToAdd + "\n  return (");

fs.writeFileSync('src/App.tsx', code);
