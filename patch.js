const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldLevel5Block = `      } else if (currentLevelId === 5) {
        // CCTV Technician mail
        const techMsg = {
          id: 'cctv_tech_msg',
          sender: 'Teknisi CCTV',
          subject: 'Kamera Main Gate',
          body: 'Maaf Pak.\\nSaya baru ingat.\\nKamera Main Gate sempat mati selama enam menit.\\nTepat sebelum Rizky keluar.',
          timestamp: formatTime(currentTime),
          read: false
        };
        const updatedMessages = [...messages, techMsg];
        setMessages(updatedMessages);
        triggerBlink('INBOX');

        // Update Notebook
        const newNotebook = notebookContent + '\\n\\n06 minutes\\nNo Footage';
        setNotebookContent(newNotebook);

        // Make sure EVIDENCE is in unlockedApps
        let newApps = [...unlockedApps];
        if (!newApps.includes('EVIDENCE')) {
          newApps.push('EVIDENCE');
          triggerBlink('EVIDENCE');
        }
        setUnlockedApps(newApps);
        
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, newNotebook, contacts, witnesses, updatedMessages);
        
        setPopup({
          title: 'INBOX UPDATE',
          message: 'Pesan baru masuk dari Teknisi CCTV di Kotak Masuk (Inbox) Anda.',
          onClose: () => {
            setPopup(null);
            showSupervisorPopup('Ada pesan baru dari Teknisi CCTV. Dan data dari LEFT JOIN menunjukkan kejanggalan pada Andi. Sekarang, buatlah laporan fakta investigasimu segera.', () => {
              setAppState('REPORT');
            });
          }
        });
      } else {`;

const newLevel5Block = `      } else if (currentLevelId === 5) {
        setPopup({
          title: 'PLAYER',
          message: '"Hah?"\\nKenapa NULL?',
          onClose: () => {
            setPopup({
              title: 'SUPERVISOR RAKA',
              message: 'NULL juga merupakan petunjuk.',
              onClose: () => {
                const newNote = notebookContent + '\\n\\nAndi\\nTidak pernah muncul\\ndi CCTV.';
                setNotebookContent(newNote);
                triggerBlink('NOTEBOOK');
                
                setTimeout(() => {
                  setPopup({
                    title: 'PLAYER',
                    message: '*Player mulai curiga*\\nKalau Andi tidak muncul...\\nSiapa yang membawa mobilnya?',
                    onClose: () => {
                      setPopup({
                        title: 'SUPERVISOR RAKA',
                        message: 'Tepat.\\nKita selama ini menganggap Andi mengemudi.\\nTapi database tidak pernah mengatakan itu.\\nItu hanya asumsi kita.',
                        onClose: () => {
                          setAppState('HOME');
                          
                          const techMsg = {
                            id: 'cctv_tech_msg',
                            sender: 'Teknisi CCTV',
                            subject: 'Kamera Main Gate',
                            body: 'Maaf Pak.\\nSaya baru ingat.\\nKamera Main Gate sempat mati selama enam menit.',
                            timestamp: formatTime(currentTime),
                            read: false
                          };
                          const updatedMessages = [...messages, techMsg];
                          setMessages(updatedMessages);
                          triggerBlink('INBOX');
                          saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, newNote, contacts, witnesses, updatedMessages);
                        }
                      });
                    }
                  });
                }, 2000);
              }
            });
          }
        });
      } else {`;

code = code.replace(oldLevel5Block, newLevel5Block);

const oldInboxBack = `    } else if (appState === 'INBOX' && selectedMessageId) {
      setSelectedMessageId(null);
    } else if (appState === 'CALLING') {`;

const newInboxBack = `    } else if (appState === 'INBOX' && selectedMessageId) {
      if (selectedMessageId === 'cctv_tech_msg' && currentLevelId === 5) {
        setPopup({
          title: 'SUPERVISOR RAKA',
          message: 'Tepat sebelum Rizky keluar.',
          onClose: () => {
            setPopup(null);
            setNotebookContent(prev => prev + '\\n\\n06 minutes\\nNo Footage');
            triggerBlink('NOTEBOOK');
            triggerBlink('TIMELINE');
            
            setTimeout(() => {
              let newApps = [...unlockedApps];
              if (!newApps.includes('EVIDENCE')) {
                newApps.push('EVIDENCE');
              }
              setUnlockedApps(newApps);
              setAppState('EVIDENCE');
              
              setPopup({
                title: 'SYSTEM',
                message: 'NEW EVIDENCE ADDED:\\n✓ Camera Offline\\n✓ Missing Footage\\n✓ Visitor Without Match\\n✓ Timeline Updated',
                onClose: () => {
                  setPopup(null);
                  showSupervisorPopup('✔ Budi hanya terlihat masuk.\\n✔ Rizky terlihat keluar.\\n✔ Kamera mati selama enam menit.\\n✔ Andi tidak pernah muncul di CCTV.\\n✔ Ada kemungkinan orang lain mengemudikan kendaraan.\\n\\nSekarang buat laporan.', () => {
                    setAppState('REPORT');
                  });
                }
              });
            }, 1500);
          }
        });
      }
      setSelectedMessageId(null);
    } else if (appState === 'CALLING') {`;

code = code.replace(oldInboxBack, newInboxBack);
fs.writeFileSync('src/App.tsx', code);
