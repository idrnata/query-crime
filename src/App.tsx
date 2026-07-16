import React, { useState, useEffect, useRef } from 'react';
import { LEVELS } from './game/levels';
import { executeSql } from './game/engine';
import { saveGame, loadGame } from './game/saveSystem';
import { PlayerStats, AppState } from './types';
import { ALL_APPS } from './constants/apps';
import { formatTime, formatDate } from './utils/date';

// Components
import { StatusBar } from './components/ui/StatusBar';
import { Popup } from './components/ui/Popup';
import { NameInput } from './components/ui/NameInput';

// Screens
import { BootScreen } from './components/screens/BootScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { InboxScreen } from './components/screens/InboxScreen';
import { CaseFilesScreen } from './components/screens/CaseFilesScreen';
import { DBListScreen } from './components/screens/DBListScreen';
import { TerminalScreen } from './components/screens/TerminalScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { QuestCompleteScreen } from './components/screens/QuestCompleteScreen';
import { ErrorScreen } from './components/screens/ErrorScreen';
import { EvidenceScreen } from './components/screens/EvidenceScreen';
import { NotebookScreen } from './components/screens/NotebookScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { ContactsScreen } from './components/screens/ContactsScreen';
import { WitnessesScreen } from './components/screens/WitnessesScreen';
import { CallingScreen } from './components/screens/CallingScreen';
import { BrowserScreen } from './components/screens/BrowserScreen';
import { MapScreen } from './components/screens/MapScreen';
import { RankScreen } from './components/screens/RankScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [appState, setAppState] = useState<AppState>('BOOT');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentObjectiveIndex, setCurrentObjectiveIndex] = useState<number>(0);
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([1]);
  
  const [hasAcceptedMission, setHasAcceptedMission] = useState<boolean>(false);
  const [unlockedApps, setUnlockedApps] = useState<string[]>(['INBOX', 'CASE_FILES', 'DB_LIST', 'NOTEBOOK', 'RANK', 'SETTINGS']);
  
  const [queryString, setQueryString] = useState<string>('');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [isBrowsingTable, setIsBrowsingTable] = useState(false);
  const [isFlickering, setIsFlickering] = useState<boolean>(false);
  const [showUnknownMessage, setShowUnknownMessage] = useState<boolean>(false);
  const [isHacked, setIsHacked] = useState<boolean>(false);
  const [isHackedMap, setIsHackedMap] = useState<boolean>(false);
  const [isObjectiveMet, setIsObjectiveMet] = useState<boolean>(false);
  
  const [activeTable, setActiveTable] = useState<string>('');
  
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [popup, setPopup] = useState<{title: string, message: string, onClose: () => void} | null>(null);
  
  const [blinkingApps, setBlinkingApps] = useState<string[]>(['INBOX']);
  const [notebookContent, setNotebookContent] = useState<string>('Kemungkinan pemilik kendaraan...');

  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const [contacts, setContacts] = useState<any[]>([
    { name: 'Raka (Supervisor)', role: 'MCD Commander', phone: '911-SUPER', id: 'raka' },
    { name: 'Budi Santoso', role: 'Warga Sipil', phone: '08124444', id: 'budi' }
  ]);
  
  const [witnesses, setWitnesses] = useState<any[]>([]);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTING' | 'ACTIVE' | 'DISCONNECTED'>('IDLE');
  const [activeCallContact, setActiveCallContact] = useState<any | null>(null);
  const [callStep, setCallStep] = useState(0);

  const [stats, setStats] = useState<PlayerStats>({
    xp: 0,
    queriesRun: 0,
    successfulQueries: 0,
    accuracy: 100,
    hintsUsed: 0,
    casesCompleted: 0,
    achievements: [],
    battery: 100
  });

  useEffect(() => {
    if (currentLevel) {
       const initialMsgId = `initial_${currentLevelId}`;
       setMessages(prev => {
         if (prev.find(m => m.id === initialMsgId)) return prev;
         
         const newMsg = {
           id: initialMsgId,
           sender: currentLevel.mail.sender,
           subject: currentLevel.mail.subject,
           body: currentLevel.mail.body,
           timestamp: '08:15',
           read: false
         };
         return [...prev, newMsg];
       });
       setSelectedMessageId(initialMsgId);
    }
  }, [currentLevelId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setUnlockedLevelIds(saved.unlockedLevelIds);
      setCurrentLevelId(saved.currentLevelId);
      if (saved.currentObjectiveIndex !== undefined) {
         setCurrentObjectiveIndex(saved.currentObjectiveIndex);
      }
      if (saved.hasAcceptedMission !== undefined) {
         setHasAcceptedMission(saved.hasAcceptedMission);
      }
      if (saved.unlockedApps) {
         setUnlockedApps(saved.unlockedApps);
      }
      if (saved.notebookContent) {
         setNotebookContent(saved.notebookContent);
      }
      if (saved.contacts) {
         setContacts(saved.contacts);
      }
      if (saved.witnesses) {
         setWitnesses(saved.witnesses);
      }
      if (saved.messages) {
         setMessages(saved.messages);
      }
      if (saved.stats) {
         setStats({
           ...saved.stats,
           battery: saved.stats.battery !== undefined ? saved.stats.battery : 100
         });
      }
      if (saved.playerName) {
         setPlayerName(saved.playerName);
      }
    }
  }, []);

  // State Healer: Ensure players in Chapter 2 have necessary tools/contacts
  useEffect(() => {
    if (currentLevelId === 2) {
      let changed = false;
      let newContacts = [...contacts];
      let newApps = [...unlockedApps];
      
      // If we are past the objective where we find Dina (Objective 2 is done, so Index >= 3)
      if (currentObjectiveIndex >= 3 && !contacts.find(c => c.id === 'dina')) {
        newContacts.push({ name: 'Dina Santoso', role: 'Anggota Keluarga', phone: '08125555', id: 'dina' });
        changed = true;
      }
      
      // If we are past the call with Dina (Objective 3 is done, so Index >= 4)
      if (currentObjectiveIndex >= 4) {
        if (!unlockedApps.includes('WITNESSES')) {
          newApps.push('WITNESSES');
          changed = true;
        }
        if (witnesses.length === 0) {
          setWitnesses([{ name: 'Dina Santoso', statement: 'Budi (kakaknya) pergi menemui seseorang di RS Harapan Bangsa 3 hari lalu.' }]);
        }
      }
      
      if (changed) {
        setContacts(newContacts);
        setUnlockedApps(newApps);
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, newContacts);
      }
    }
  }, [currentLevelId, currentObjectiveIndex, contacts.length, unlockedApps.length, witnesses.length]);

  // State Healer for Chapter 7: Ensure Maps is unlocked
  useEffect(() => {
    if (currentLevelId === 7) {
      if (!unlockedApps.includes('MAP')) {
        const newApps = [...unlockedApps, 'MAP'];
        setUnlockedApps(newApps);
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent);
      }
    }
  }, [currentLevelId, unlockedApps.length]);

  useEffect(() => {
    if (appState === 'BOOT') {
      const isChapter7Reboot = currentLevelId === 7 && currentObjectiveIndex >= 4;
      const duration = isChapter7Reboot ? 6000 : 2500;
      const timer = setTimeout(() => {
        if (isChapter7Reboot) {
          setIsHacked(false);
          setPopup({
            title: 'SYSTEM SECURITY ALERT',
            message: 'SECURITY OVERRIDE TERMINATED. LOCAL DEVICE SECURED.',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('YA AMPUN! Perangkat penyelidikanmu baru saja diretas secara langsung!\nSeseorang menimpa peta kepolisian dengan rute merah misterius dan pesan "YOU ARE LOOKING AT THE WRONG DESTINATION".\n\nMereka mengawasi perangkat kita secara real-time! Kirimkan laporan fakta analisismu segera sekarang sebelum mereka mematikan sistem kita!', () => {
                setAppState('REPORT');
              });
            }
          });
        } else {
          setAppState('HOME');
        }
      }, duration);
      return () => clearTimeout(timer);
    }

    // Auto-select mission message if not accepted - REMOVED to allow BACK button to work
    /*
    if (appState === 'INBOX' && !hasAcceptedMission && !selectedMessageId) {
      setSelectedMessageId(`initial_${currentLevelId}`);
    }
    */
  }, [appState, hasAcceptedMission, selectedMessageId, currentLevelId]);

  const saveProgress = (levelId: number, objectiveIndex: number, unlockedLvl: number[], accepted: boolean, apps: string[], notebook?: string, currentContacts?: any[], currentWitnesses?: any[], currentMessages?: any[], currentStats?: PlayerStats, name?: string) => {
    saveGame({ 
      currentLevelId: levelId, 
      currentObjectiveIndex: objectiveIndex, 
      unlockedLevelIds: unlockedLvl, 
      hasAcceptedMission: accepted, 
      unlockedApps: apps,
      notebookContent: notebook || notebookContent,
      contacts: currentContacts || contacts,
      witnesses: currentWitnesses || witnesses,
      messages: currentMessages || messages,
      stats: currentStats || stats,
      playerName: name || playerName
    });
  };

  useEffect(() => {
    if (appState === 'HOME' && !playerName && !showNameInput && !popup && currentLevelId === 1 && currentObjectiveIndex === 0) {
      showSupervisorPopup(
        "Hari ini, hari pertamamu sebagai Database Detective. Jam menunjukkan pukul 08.15 pagi ketika Supervisor Raka memanggilmu ke ruang briefing dan menanyakan namamu.",
        () => setShowNameInput(true)
      );
    }
  }, [appState, playerName, showNameInput, popup, currentLevelId, currentObjectiveIndex]);

  const handleNameSubmit = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    setPlayerName(trimmedName);
    setShowNameInput(false);
    saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, stats, trimmedName);
    
    setTimeout(() => {
      showSupervisorPopup(`Selamat datang ${trimmedName} di Minor Crime Division. Ini bukan kasus besar. Tapi beginilah semua detektif memulai kariernya.`);
    }, 500);
  };

  // Battery decrease effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        battery: Math.max(0, (prev.battery || 100) - 1)
      }));
    }, 180000); // Decrease 1% every 3 minutes
    return () => clearInterval(timer);
  }, []);

  // Battery warning popup
  const [hasWarnedBattery, setHasWarnedBattery] = useState(false);
  useEffect(() => {
    if (stats.battery <= 25 && !hasWarnedBattery && !popup) {
      setPopup({
        title: 'LOW BATTERY',
        message: 'Baterai handphonemu tinggal 25%. Segera isi daya sebelum melanjutkan penyelidikan!',
        onClose: () => setPopup(null)
      });
      setHasWarnedBattery(true);
    } else if (stats.battery > 25 && hasWarnedBattery) {
      setHasWarnedBattery(false);
    }
  }, [stats.battery, popup, hasWarnedBattery]);

  // Reset isBrowsingTable when appState is TERM
  useEffect(() => {
    if (appState === 'TERM') {
      setIsBrowsingTable(false);
    }
  }, [appState]);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const currentObjective = currentLevel.objectives[currentObjectiveIndex] || currentLevel.objectives[0];

  const triggerBlink = (appId: string) => {
    if (!blinkingApps.includes(appId)) {
      setBlinkingApps(prev => [...prev, appId]);
    }
  };
  
  const clearBlink = (appId: string) => {
    setBlinkingApps(prev => prev.filter(a => a !== appId));
  };

  const showSupervisorPopup = (msg: string, onClose?: () => void) => {
    setPopup({
      title: 'Supervisor Raka',
      message: msg,
      onClose: () => {
        setPopup(null);
        if (onClose) onClose();
      }
    });
  };

  const handleBrowseTable = (tableName: string) => {
    try {
      const query = `SELECT * FROM ${tableName} LIMIT 50`;
      setQueryString(query);
      const res = executeSql(query, currentLevel.database);
      setStats(prev => ({
        ...prev,
        battery: Math.max(0, (prev.battery || 100) - 1)
      }));
      setQueryResult(res);
      setIsBrowsing(true);
      setIsBrowsingTable(true);
      setIsObjectiveMet(false);
      setAppState('RESULT');
    } catch (e: any) {
      setErrorMessage(e.message || "ERROR LOADING TABLE");
      setAppState('ERROR');
    }
  };

  const handleRunQuery = () => {
    const query = queryString;
    try {
      setIsBrowsing(false);
      setIsBrowsingTable(false);
      const res = executeSql(query, currentLevel.database);
      setQueryResult(res);
      const met = currentObjective.validateResult(res, query);
      setIsObjectiveMet(met);
      setAppState('RESULT');
      
      const newStats = { ...stats };
      newStats.queriesRun += 1;
      newStats.battery = Math.max(0, (newStats.battery || 100) - 1);
      if (met) {
        newStats.successfulQueries += 1;
      }
      newStats.accuracy = Math.round((newStats.successfulQueries / newStats.queriesRun) * 100);
      
      if (queryString.toUpperCase().includes('JOIN') && !newStats.achievements.includes('Join Specialist')) {
        newStats.achievements.push('Join Specialist');
      }
      
      setStats(newStats);
      
      if (met) {
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, newStats);
      } else {
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, newStats);
      }
    } catch (e: any) {
      setErrorMessage(e.message || "SYNTAX ERROR");
      setAppState('ERROR');
      
      const newStats = { ...stats };
      newStats.queriesRun += 1;
      newStats.accuracy = Math.round((newStats.successfulQueries / newStats.queriesRun) * 100);
      setStats(newStats);
      saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, newStats);
    }
  };

  const handleObjectiveComplete = (overrides?: { apps?: string[], contacts?: any[], witnesses?: any[], messages?: any[], stats?: PlayerStats }) => {
    const hasNextObjective = currentObjectiveIndex < currentLevel.objectives.length - 1;
    const finalApps = overrides?.apps || unlockedApps;
    const finalContacts = overrides?.contacts || contacts;
    const finalWitnesses = overrides?.witnesses || witnesses;
    const finalMessages = overrides?.messages || messages;
    const finalStats = overrides?.stats || stats;

    if (hasNextObjective) {
      const nextIdx = currentObjectiveIndex + 1;
      setCurrentObjectiveIndex(nextIdx);
      saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, finalApps, notebookContent, finalContacts, finalWitnesses, finalMessages, finalStats);
      
      if (currentLevelId === 1) {
        if (nextIdx === 2) { 
          triggerBlink('INBOX');
          showSupervisorPopup('Bagus. Sekarang cari tahu siapa Owner ID 482.');
          setAppState('TERM');
          setQueryString('');
        }
        else if (nextIdx === 3) { 
          setAppState('NOTEBOOK');
          setQueryString('');
          setTimeout(() => {
             triggerBlink('INBOX');
             showSupervisorPopup('Bagus. Sekarang cari tahu apakah mobil itu masih berada di rumah sakit.');
          }, 3000);
        }
        else if (nextIdx === 5) {
          showSupervisorPopup('Mobil mana yang paling lama?');
          setAppState('TERM');
          setQueryString('');
        }
        else {
          setAppState('TERM');
          setQueryString('');
        }
      } else if (currentLevelId === 2) {
        if (nextIdx === 1) {
          showSupervisorPopup('Cari apakah dia tinggal sendirian.');
          setAppState('TERM');
          setQueryString('');
        }
        else if (nextIdx === 2) {
          // Found Dina.
          setNotebookContent(prev => prev + '\n\nDina Santoso: Kemungkinan anggota keluarga.');
          showSupervisorPopup('Kamu menemukan Dina Santoso di alamat yang sama. Hubungi dia.');
          setAppState('TERM');
          setQueryString('');
        }
        else if (nextIdx === 3) {
          // Got phone numbers.
          const newContacts = contacts.find(c => c.name === 'Dina Santoso') 
            ? contacts 
            : [...contacts, { name: 'Dina Santoso', role: 'Anggota Keluarga', phone: '08125555', id: 'dina' }];
          
          setContacts(newContacts);
          triggerBlink('INBOX');
          triggerBlink('CONTACTS');
          setAppState('INBOX');
          const newMsg = {
             id: 'call_dina',
             sender: 'Supervisor Raka',
             subject: 'Hubungi Dina',
             body: 'Bagus. Hubungi Dina.',
             timestamp: formatTime(currentTime),
             read: false
          };
          const newMessages = [...messages, newMsg];
          setMessages(newMessages);
          setSelectedMessageId('call_dina');
          saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, newContacts, witnesses, newMessages);
        }
        else if (nextIdx === 4) {
          showSupervisorPopup('Cari tahu siapa pasien yang dikunjungi.');
          setAppState('TERM');
          setQueryString('');
        }
        else {
          setAppState('TERM');
          setQueryString('');
        }
      } else if (currentLevelId === 3) {
        if (nextIdx === 1) {
          showSupervisorPopup('Dapatkan data pasien dengan ID 41.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 2) {
          showSupervisorPopup('Rizky memiliki emergency_contact bernomor 7. Cari siapa itu.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 3) {
          setNotebookContent(prev => prev + '\n\nSemua data saling terhubung. Cari hubungan antar tabel.');
          showSupervisorPopup('Bagus. Sekarang cari kendaraan milik Andi Prasetyo (Owner ID 7).');
          setAppState('NOTEBOOK');
          setQueryString('');
        } else if (nextIdx === 4) {
          showSupervisorPopup('Cek data parkir untuk plat nomor B 2841 PT.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 5) {
          setPopup({
            title: 'NEW LESSON',
            message: 'JOIN Unlocked. Kadang jawaban tidak ada di satu tabel. JOIN digunakan untuk menggabungkan data.',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('Bagus. Sekarang gunakan JOIN untuk melihat nama pemilik dan plat nomornya secara langsung.');
              setAppState('TERM');
              setQueryString('');
            }
          });
        } else if (nextIdx === 6) {
          showSupervisorPopup('Sekarang gunakan JOIN untuk mencari kendaraan milik Andi Prasetyo.');
          setAppState('TERM');
          setQueryString('');
        } else {
          setAppState('TERM');
          setQueryString('');
        }
      } else if (currentLevelId === 4) {
        if (nextIdx === 1) {
          showSupervisorPopup('Fokus ke pasien yang mereka kunjungi. Gunakan JOIN antara visitors dan patients.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 2) {
          showSupervisorPopup('Sekarang cari siapa pemilik kendaraan yang keluar sekitar pukul 11:30. Kamu butuh triple JOIN: parking, vehicles, dan citizens.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 3) {
          if (!unlockedApps.includes('TIMELINE')) {
            setUnlockedApps(prev => [...prev, 'TIMELINE']);
            triggerBlink('TIMELINE');
          }
          setAppState('TERM');
          setQueryString('');
        } else {
          setAppState('TERM');
          setQueryString('');
        }
      } else if (currentLevelId === 5) {
        if (nextIdx === 1) {
          showSupervisorPopup('Cari rekaman Budi Santoso di CCTV (tabel footage).');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 2) {
          showSupervisorPopup('Cari rekaman Rizky Hidayat di CCTV.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 3) {
          setPopup({
            title: 'NEW LESSON',
            message: 'LEFT JOIN Unlocked. Digunakan untuk menampilkan semua data di tabel kiri, meskipun tidak ada pasangan di tabel kanan. NULL artinya tidak ditemukan.',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('Bandingkan data pengunjung (visitors) dengan rekaman CCTV (footage) menggunakan LEFT JOIN.');
              setAppState('TERM');
              setQueryString('');
              if (!unlockedApps.includes('TIMELINE')) {
                setUnlockedApps(prev => [...prev, 'TIMELINE']);
                triggerBlink('TIMELINE');
              }
            }
          });
        } else {
          setAppState('TERM');
          setQueryString('');
        }
      } else if (currentLevelId === 6) {
        if (nextIdx === 1) {
          setNotebookContent(prev => prev + '\n\nRizky pernah mengalami kecelakaan.');
          showSupervisorPopup('Rizky ternyata pernah mengalami kecelakaan 8 tahun lalu. Sekarang, coba cari apakah Andi Prasetyo pernah disebut publik di berita.');
          setAppState('TERM');
          setQueryString('');
        } else if (nextIdx === 2) {
          setNotebookContent(prev => prev + '\n\nAndi tidak pernah muncul di berita.');
          setPopup({
            title: 'NEW LESSON',
            message: 'LIKE Unlocked. Digunakan untuk pencarian teks fleksibel menggunakan wildcard % (mewakili karakter apa saja). Contoh: LIKE \'%Rizky%\'',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('Andi tidak pernah disebut publik. Tapi coba perhatikan artikel kecelakaan Rizky tadi, ada nama perusahaan "PT Arunika Logistics". Coba cari berita terkait perusahaan itu.', () => {
                setAppState('TERM');
                setQueryString('');
              });
            }
          });
        } else if (nextIdx === 3) {
          setNotebookContent(prev => prev + '\n\nArunika -> Kecelakaan -> Rizky');
          setPopup({
            title: 'NEW DATABASE',
            message: 'Companies Unlocked. Supervisor Raka: Saya menemukan sesuatu, nama perusahaan PT Arunika Logistics ternyata masih aktif.',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('Cari data perusahaan PT Arunika Logistics di database perusahaan menggunakan LIKE.', () => {
                setAppState('TERM');
                setQueryString('');
              });
            }
          });
        } else {
          setAppState('TERM');
          setQueryString('');
        }
      }
    } else {
      // Step 12: Quest complete (objectives done), Evidence Unlocked
      if (currentLevelId === 6) {
        setIsFlickering(true);
        setPopup({
          title: 'SYSTEM WARNING',
          message: 'Unauthorized Access Detected',
          onClose: () => {
            setIsFlickering(false);
            setPopup(null);
            
            // Add Unknown Number message
            const anonMsg = {
              id: 'anon_msg_6',
              sender: 'Unknown Number',
              subject: '!!! WARNING !!!',
              body: 'Kamu mencari kejadian delapan tahun lalu. Itu kesalahan terbesar yang bisa kamu lakukan.',
              timestamp: formatTime(currentTime),
              read: false
            };
            setMessages(prev => [...prev, anonMsg]);
            triggerBlink('INBOX');
            
            // Unlocked EVIDENCE app if not already
            let newApps = [...unlockedApps];
            if (!newApps.includes('EVIDENCE')) {
              newApps.push('EVIDENCE');
              triggerBlink('EVIDENCE');
            }
            setUnlockedApps(newApps);
            
            // Add notebook entries as specified:
            setNotebookContent(prev => prev + '\n\nSeseorang menghapus sebagian data perusahaan.');
            
            // Save progress
            saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, contacts, witnesses, [...messages, anonMsg]);

            showSupervisorPopup('Sistem kita disusupi! Seseorang mendeteksi pencarian kita tentang kejadian 8 tahun lalu dan mengirim pesan ancaman. Kirimkan laporan fakta investigasimu segera.', () => {
              setAppState('REPORT');
            });
          }
        });
      } else {
        if (!unlockedApps.includes('EVIDENCE')) {
          const newApps = [...unlockedApps, 'EVIDENCE'];
          setUnlockedApps(newApps);
          saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps);
          setPopup({
            title: 'SYSTEM',
            message: 'NEW APP UNLOCKED: Evidence Locker',
            onClose: () => {
              setPopup(null);
              showSupervisorPopup('Sekarang buat laporan.');
              setAppState('REPORT');
            }
          });
        } else {
          showSupervisorPopup('Sekarang buat laporan.');
          setAppState('REPORT');
        }
      }
    }
  };

  const handleReportSelect = (idx: number) => {
    if (idx === currentLevel.report.correctIndex) {
      if (currentLevelId === 5) {
        setIsFlickering(true);
        setTimeout(() => {
          setIsFlickering(false);
          setShowUnknownMessage(true);
        }, 3000);
      } else {
        setAppState('QUEST_COMPLETE');
      }
      
      const newStats = { 
        ...stats, 
        xp: stats.xp + (currentLevelId === 1 ? 100 : currentLevelId === 2 ? 120 : currentLevelId === 3 ? 180 : currentLevelId === 4 ? 220 : 250),
        casesCompleted: stats.casesCompleted + 1 
      };
      
      if (newStats.casesCompleted === 1 && !newStats.achievements.includes('SQL Rookie')) {
        newStats.achievements.push('SQL Rookie');
      }
      if (newStats.casesCompleted === 2 && !newStats.achievements.includes('Junior Detective')) {
        newStats.achievements.push('Junior Detective');
      }
      if (newStats.casesCompleted === 3 && !newStats.achievements.includes('Detective')) {
        newStats.achievements.push('Detective');
      }
      setStats(newStats);
      
      // Add closing message to inbox
      const closingMsg = {
        id: `closing_${currentLevelId}`,
        sender: 'Supervisor Raka',
        subject: `RE: ${currentLevel.title} - SELESAI`,
        body: currentLevel.report.conclusion,
        timestamp: formatTime(currentTime),
        read: false
      };
      
      let newMessages = [...messages, closingMsg];
      
      if (currentLevelId === 3) {
        // Unknown Number message
        const anonMsg = {
          id: 'anon_msg',
          sender: 'Unknown Number',
          subject: '!!!',
          body: 'Berhenti mencari Budi. Kalau tidak... kamu akan menjadi orang berikutnya.',
          timestamp: formatTime(currentTime),
          read: false
        };
        newMessages.push(anonMsg);
      }
      
      setMessages(newMessages);
      triggerBlink('INBOX');
      if (unlockedApps.includes('EVIDENCE')) {
        triggerBlink('EVIDENCE');
      }
      
      let newApps = [...unlockedApps];
      if (!newApps.includes('CONTACTS')) {
         newApps.push('CONTACTS');
         triggerBlink('CONTACTS');
      }
      setUnlockedApps(newApps);
      
      if (!unlockedLevelIds.includes(currentLevelId + 1) && currentLevelId < LEVELS.length) {
        const newUnlocked = [...unlockedLevelIds, currentLevelId + 1];
        setUnlockedLevelIds(newUnlocked);
        saveProgress(currentLevelId + 1, 0, newUnlocked, false, newApps, notebookContent, contacts, witnesses, newMessages, newStats);
      } else {
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, contacts, witnesses, newMessages, newStats);
      }
    } else {
      setErrorMessage("KESIMPULAN SALAH. CEK KEMBALI FAKTA.");
      setAppState('ERROR');
    }
  };

  const handleAcceptMission = () => {
    setHasAcceptedMission(true);
    triggerBlink('CASE_FILES');
    let newApps = [...unlockedApps];
    if (currentLevelId === 6 && !newApps.includes('BROWSER')) {
      newApps.push('BROWSER');
      triggerBlink('BROWSER');
    }
    setUnlockedApps(newApps);
    saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, true, newApps, notebookContent, contacts, witnesses, messages, stats);
    setPopup({
      title: 'SYSTEM',
      message: currentLevelId === 3 
        ? 'Mission Accepted. NEW TABLE: Hospital Parking Unlocked.'
        : currentLevelId === 6
        ? 'Mission Accepted. NEW APP: Browser Unlocked.'
        : 'Mission Accepted. Objective updated in Case Files.',
      onClose: () => {
        setPopup(null);
        setAppState('HOME');
      }
    });
  };

  const handleDeleteWord = () => {
    setQueryString(prev => {
      const trimmed = prev.trimEnd();
      const lastSpaceIndex = trimmed.lastIndexOf(' ');
      if (lastSpaceIndex === -1) return '';
      return trimmed.substring(0, lastSpaceIndex).trimEnd();
    });
  };

  const handleBack = () => {
    if (appState === 'MAP' && currentLevelId === 7 && currentObjectiveIndex >= 4) {
      setIsHackedMap(true);
      return;
    }
    if (appState === 'MENU') {
      setAppState('HOME');
    } else if (appState === 'RESULT' || appState === 'ERROR') {
      if (isBrowsingTable) {
        setAppState('DB_LIST');
      } else {
        setAppState('TERM');
      }
    } else if (appState === 'TERM') {
      setAppState('DB_LIST');
    } else if (appState === 'INBOX' && selectedMessageId) {
      setSelectedMessageId(null);
    } else if (appState === 'CALLING') {
      setCallStatus('IDLE');
      setAppState('CONTACTS');
    } else if (appState !== 'HOME' && appState !== 'BOOT') {
      setAppState('MENU');
    }
  };

  const handleEnter = () => {
    switch (appState) {
      case 'HOME':
        setAppState('MENU');
        break;
      case 'TERM':
        handleRunQuery();
        break;
      case 'RESULT':
        if (isBrowsingTable) setAppState('DB_LIST');
        else if (isObjectiveMet) handleObjectiveComplete();
        else setAppState('TERM');
        break;
      case 'ERROR':
        setAppState('TERM');
        break;
      case 'INBOX':
        if (!hasAcceptedMission) handleAcceptMission();
        break;
      case 'QUEST_COMPLETE':
        if (currentLevelId < LEVELS.length) {
          setCurrentLevelId(currentLevelId + 1);
          setCurrentObjectiveIndex(0);
          setHasAcceptedMission(false);
          setAppState('HOME');
          setQueryString('');
        } else {
          setAppState('HOME');
        }
        break;
      default:
        break;
    }
  };

  const renderScreenContent = () => {
    switch (appState) {
      case 'BOOT':
        return <BootScreen />;
      case 'HOME':
        return <HomeScreen playerName={playerName} formatDate={formatDate} currentTime={currentTime} />;
      case 'MENU':
        return (
          <MenuScreen 
            unlockedApps={unlockedApps} 
            blinkingApps={blinkingApps} 
            ALL_APPS={ALL_APPS} 
            clearBlink={clearBlink} 
            setAppState={setAppState} 
          />
        );
      case 'INBOX':
        return (
          <InboxScreen 
            messages={messages} 
            selectedMessageId={selectedMessageId} 
            setSelectedMessageId={setSelectedMessageId} 
            setAppState={setAppState} 
            currentLevel={currentLevel} 
            hasAcceptedMission={hasAcceptedMission} 
            setHasAcceptedMission={setHasAcceptedMission} 
          />
        );
      case 'CASE_FILES':
        return (
          <CaseFilesScreen 
            currentLevel={currentLevel} 
            currentObjectiveIndex={currentObjectiveIndex} 
            setAppState={setAppState} 
          />
        );
      case 'DB_LIST':
        return (
          <DBListScreen 
            currentLevel={currentLevel} 
            currentLevelId={currentLevelId}
            setActiveTable={setActiveTable} 
            setAppState={setAppState} 
            handleBrowseTable={handleBrowseTable}
            hasAcceptedMission={hasAcceptedMission}
            showSupervisorPopup={showSupervisorPopup}
            currentObjectiveIndex={currentObjectiveIndex}
          />
        );
      case 'TERM':
        return (
          <TerminalScreen 
            activeTable={activeTable} 
            currentObjective={currentObjective} 
            queryString={queryString} 
            setQueryString={setQueryString} 
            handleRunQuery={handleRunQuery} 
            handleDeleteWord={handleDeleteWord} 
            currentLevelId={currentLevelId} 
            unlockedLevelIds={unlockedLevelIds} 
            currentLevel={currentLevel} 
          />
        );
      case 'RESULT':
        return (
          <ResultScreen 
            isBrowsing={isBrowsing} 
            activeTable={activeTable} 
            errorMessage={errorMessage} 
            queryResult={queryResult} 
            setIsBrowsing={setIsBrowsing} 
            setAppState={setAppState} 
            isObjectiveMet={isObjectiveMet} 
            handleObjectiveComplete={handleObjectiveComplete}
            hasNextObjective={currentObjectiveIndex < currentLevel.objectives.length - 1}
          />
        );
      case 'REPORT':
        return (
          <ReportScreen 
            currentLevel={currentLevel} 
            handleAnswer={handleReportSelect} 
            setAppState={setAppState} 
          />
        );
      case 'QUEST_COMPLETE':
        return (
          <QuestCompleteScreen 
            currentLevel={currentLevel} 
            handleNextLevel={() => {
              if (currentLevelId < LEVELS.length) {
                setCurrentLevelId(currentLevelId + 1);
                setCurrentObjectiveIndex(0);
                setHasAcceptedMission(false);
                setAppState('HOME');
                setQueryString('');
              } else {
                setAppState('HOME');
              }
            }} 
          />
        );
      case 'ERROR':
        return <ErrorScreen setAppState={setAppState} />;
      case 'EVIDENCE':
        return <EvidenceScreen currentLevelId={currentLevelId} setAppState={setAppState} />;
      case 'NOTEBOOK':
        return (
          <NotebookScreen 
            notebookContent={notebookContent} 
            setNotebookContent={(val) => {
              setNotebookContent(val);
              saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, val);
            }} 
            setAppState={setAppState} 
          />
        );
      case 'TIMELINE':
        return <TimelineScreen currentLevelId={currentLevelId} setAppState={setAppState} />;
      case 'CONTACTS':
        return (
          <ContactsScreen 
            contacts={contacts} 
            handleCall={(c) => {
              if (c.id === 'dina' && currentLevelId === 2 && currentObjectiveIndex === 3) {
                setActiveCallContact(c);
                setCallStatus('DIALING');
                setAppState('CALLING');
                setCallStep(0);
                setTimeout(() => setCallStatus('CONNECTING'), 2000);
                setTimeout(() => setCallStatus('ACTIVE'), 4000);
              } else {
                showSupervisorPopup('Nomor tidak dapat dihubungi atau sibuk.');
              }
            }} 
            setAppState={setAppState} 
          />
        );
      case 'WITNESSES':
        return (
          <WitnessesScreen 
            witnesses={witnesses} 
            handleCall={(w) => {
              // Implementation if needed for witness interaction
            }} 
            setAppState={setAppState} 
          />
        );
      case 'CALLING':
        return (
          <CallingScreen 
            callStatus={callStatus} 
            activeCallContact={activeCallContact} 
            callStep={callStep} 
            handleHangUp={() => {
              setCallStatus('IDLE');
              setAppState('CONTACTS');
              
              if (activeCallContact?.id === 'dina' && currentLevelId === 2 && currentObjectiveIndex === 3) {
                // Unlock WITNESSES app and add testimony
                const newWitnesses = [{ name: 'Dina Santoso', statement: 'Budi (kakaknya) pergi menemui seseorang di RS Harapan Bangsa 3 hari lalu.' }];
                setWitnesses(newWitnesses);
                
                let newApps = [...unlockedApps];
                if (!newApps.includes('WITNESSES')) {
                  newApps.push('WITNESSES');
                  setUnlockedApps(newApps);
                }
                
                triggerBlink('WITNESSES');
                saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, contacts, newWitnesses, messages, stats);
                showSupervisorPopup("Bagus! Informasi dari Dina Santoso sangat penting. Sekarang periksa database rumah sakit.");
              }
            }} 
          />
        );
      case 'BROWSER':
        return <BrowserScreen currentLevel={currentLevel} setAppState={setAppState} />;
      case 'MAP':
        return (
          <MapScreen 
            currentLevelId={currentLevelId}
            currentObjectiveIndex={currentObjectiveIndex}
            isHackedMap={isHackedMap}
            setAppState={setAppState} 
            onRebootDevice={() => {
              setIsHackedMap(false);
              setIsHacked(true);
              setAppState('BOOT');
            }}
          />
        );
      case 'RANK':
        return <RankScreen stats={stats} setAppState={setAppState} />;
      case 'SETTINGS':
        return (
          <SettingsScreen 
            stats={stats} 
            setAppState={setAppState} 
            handleSaveGame={() => {
               saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent);
               showSupervisorPopup("Data penyelidikan telah disimpan ke dalam memori lokal.");
            }} 
            handleResetGame={() => {
              if (confirm("Reset seluruh penyelidikan? Ini tidak bisa dibatalkan.")) {
                localStorage.removeItem('query_crime_save');
                window.location.reload();
              }
            }} 
            handleChargeBattery={() => {
              setStats(prev => ({ ...prev, battery: 100 }));
              showSupervisorPopup("Baterai telah diisi penuh. Daya sekarang 100%.");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#8cb07d] text-[#1b2118] font-mono select-none overflow-hidden relative">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #7a996d; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1b2118; border-radius: 3px; }
      `}</style>
      
      <StatusBar 
        currentTime={currentTime} 
        formatTime={formatTime} 
        battery={stats.battery || 0} 
      />
      
      <div className={`w-full flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col hide-scrollbar bg-[#8cb07d] ${isFlickering ? 'animate-pulse' : ''}`}>
        {isFlickering && (
          <div className="absolute inset-0 z-[100] bg-black animate-pulse opacity-50 pointer-events-none" />
        )}

        {showUnknownMessage && (
          <div className="absolute inset-0 bg-black z-[101] flex flex-col items-center justify-center p-8 text-[#8cb07d] font-bold">
            <div className="text-red-600 mb-4 animate-pulse">UNKNOWN NUMBER</div>
            <div className="text-center leading-relaxed mb-8">
              "Kamu akhirnya menemukan enam menit yang hilang. Sayangnya... Yang hilang bukan hanya rekamannya."
            </div>
            <div className="text-[10px] opacity-40 animate-bounce">SYSTEM BREACH DETECTED...</div>
            <button 
              onClick={() => {
                setShowUnknownMessage(false);
                setIsHacked(true);
                setTimeout(() => {
                  setIsHacked(false);
                  setAppState('QUEST_COMPLETE');
                }, 2000);
              }}
              className="mt-8 border-2 border-[#8cb07d] px-6 py-2 text-xs hover:bg-[#8cb07d] hover:text-black transition-colors"
            >
              ACKNOWLEDGE
            </button>
          </div>
        )}

        {isHacked && (
          <div className="absolute inset-0 bg-[#1b2118] z-[102] flex items-center justify-center">
            <div className="text-[#8cb07d] font-mono text-xs animate-pulse">
              [CRITICAL ERROR: DATABASE_UNREACHABLE]<br/>
              [RESTORING SYSTEM INTEGRITY...]
            </div>
          </div>
        )}

        {renderScreenContent()}
        
        {popup && (
          <Popup 
            title={popup.title} 
            message={popup.message} 
            onClose={popup.onClose} 
          />
        )}
        
        {showNameInput && (
          <NameInput 
            nameInput={nameInput} 
            setNameInput={setNameInput} 
            onSubmit={() => handleNameSubmit(nameInput)} 
          />
        )}
      </div>

      {/* Persistent Bottom Action Bar */}
      {appState !== 'BOOT' && (
        <div className="w-full flex items-stretch text-sm font-bold border-t-2 border-[#1b2118] shrink-0 uppercase bg-[#7a996d] z-10">
           <button 
             className={`flex-1 py-4 px-4 border-r-2 border-[#1b2118] text-center transition-colors active:bg-[#1b2118] active:text-[#8cb07d]`}
             onClick={() => {
               if (appState === 'HOME') setAppState('MENU');
               else if (appState === 'MENU') {
                  const target = blinkingApps.length > 0 ? blinkingApps[0] : 'INBOX';
                  setAppState(target as AppState);
               }
               else handleEnter();
             }}
           >
             {appState === 'HOME' ? 'MENU' : appState === 'MENU' ? 'OPEN' : (appState === 'TERM' || appState === 'ERROR') ? 'EXECUTE' : appState === 'RESULT' ? (isObjectiveMet ? 'NEXT' : 'RETRY') : 'ENTER'}
           </button>
           <button 
             className={`flex-1 py-4 px-4 text-center transition-colors 
               ${(appState === 'HOME') ? 'opacity-30' : 'active:bg-[#1b2118] active:text-[#8cb07d]'}`} 
             onClick={() => {
               if (appState === 'HOME') return;
               handleBack();
             }}
             disabled={appState === 'HOME'}
           >
             BACK
           </button>
        </div>
      )}
    </div>
  );
}
