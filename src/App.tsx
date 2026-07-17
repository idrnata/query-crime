import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LEVELS } from './game/levels';
import { executeSql } from './game/engine';
import { saveGame, loadGame } from './game/saveSystem';
import { PlayerStats, AppState, EvidenceMetadata } from './types';
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
import { EmailScreen } from './components/screens/EmailScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';

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
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [isObjectiveMet, setIsObjectiveMet] = useState<boolean>(false);
  const [hasShownCCTVWarning, setHasShownCCTVWarning] = useState<boolean>(false);
  
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
  const [evidenceMetadata, setEvidenceMetadata] = useState<Record<string, EvidenceMetadata>>({});
  const [isBlackout, setIsBlackout] = useState<boolean>(false);

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
       setSelectedMessageId(null);
    }
  }, [currentLevelId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Chapter 5 Ending Transition
    if (appState === 'EVIDENCE' && currentLevelId === 5 && currentObjectiveIndex === 4 && !popup) {
      showSupervisorPopup('✔ Budi hanya terlihat masuk.\n✔ Rizky terlihat keluar.\n✔ Kamera mati selama enam menit.\n✔ Andi tidak pernah muncul di CCTV.\n✔ Ada kemungkinan orang lain mengemudikan kendaraan.\n\nSekarang buat laporan.', () => {
        setAppState('REPORT');
      });
    }

    // Chapter 9 Opening Effect
    if (currentLevelId === 9 && hasAcceptedMission && currentObjectiveIndex === 0 && appState === 'HOME' && !popup) {
      setIsFlickering(true);
      setTimeout(() => {
        setIsFlickering(false);
        setPopup({
          title: '07:42',
          message: 'HP bergetar.\nTidak ada Inbox.\nTidak ada telepon.\nLayar menghitam...',
          onClose: () => {
            setPopup(null);
            showSupervisorPopup('Saya menemukan surat izin lama. Delapan tahun lalu ada seorang penyidik yang menangani kasus Arunika. Tapi identitasnya dihapus. Saya membuka Criminal Records.', () => {
               setAppState('BROWSER');
            });
          }
        });
      }, 2000);
    }
  }, [currentLevelId, hasAcceptedMission, currentObjectiveIndex, appState, popup]);

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
      if (saved.evidenceMetadata) {
         setEvidenceMetadata(saved.evidenceMetadata);
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
    if (currentLevelId === 7 && hasAcceptedMission) {
      if (!unlockedApps.includes('MAP')) {
        const newApps = [...unlockedApps, 'MAP'];
        setUnlockedApps(newApps);
        saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent);
      }
    }
  }, [currentLevelId, hasAcceptedMission, unlockedApps.length]);

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

  const saveProgress = (levelId: number, objectiveIndex: number, unlockedLvl: number[], accepted: boolean, apps: string[], notebook?: string, currentContacts?: any[], currentWitnesses?: any[], currentMessages?: any[], currentStats?: PlayerStats, name?: string, meta?: Record<string, EvidenceMetadata>) => {
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
      playerName: name || playerName,
      evidenceMetadata: meta || evidenceMetadata
    });
  };

  const getInitialNotebookForChapter = (chapterId: number): string => {
    let content = 'Kemungkinan pemilik kendaraan...';
    if (chapterId >= 3) {
      content += '\n\nDina Santoso: Kemungkinan anggota keluarga.';
    }
    if (chapterId >= 4) {
      content += '\n\nSemua data saling terhubung. Cari hubungan antar tabel.';
    }
    if (chapterId >= 5) {
      content += '\n\nData terlalu banyak. Perlu difilter.\nAda dua orang lain yang berada di lokasi hampir bersamaan.';
      content += '\n\nRudi juga mengunjungi Rizky.';
      content += '\n\nData Rudi tidak lengkap.';
      content += '\n\nRudi tidak memiliki kendaraan.';
      content += '\n\nAda tiga kendaraan.';
    }
    if (chapterId > 6) {
      content += '\n\nRizky pernah mengalami kecelakaan.';
      content += '\n\nAndi tidak pernah muncul di berita.';
      content += '\n\nArunika -> Kecelakaan -> Rizky';
      content += '\n\nSopir truk menghilang.';
      content += '\n\nData perusahaan telah dimodifikasi.';
    }
    if (chapterId >= 7) {
      content += '\n\nSeseorang menghapus sebagian data perusahaan.';
    }
    return content;
  };

  const handleJumpToChapter = (chapterId: number) => {
    setCurrentLevelId(chapterId);
    setCurrentObjectiveIndex(0);
    setHasAcceptedMission(false);
    setQueryString('');
    setQueryResult(null);
    setIsObjectiveMet(false);
    
    let baseApps = ['INBOX', 'CASE_FILES', 'DB_LIST', 'NOTEBOOK', 'RANK', 'SETTINGS'];
    if (chapterId >= 2) baseApps.push('CONTACTS');
    if (chapterId >= 3) baseApps.push('WITNESSES');
    if (chapterId >= 4) baseApps.push('TIMELINE');
    if (chapterId >= 5) baseApps.push('EVIDENCE');
    if (chapterId >= 6) baseApps.push('BROWSER');
    if (chapterId >= 7) baseApps.push('MAP');
    
    setUnlockedApps(baseApps);
    
    let initialContacts = [
      { name: 'Raka (Supervisor)', role: 'MCD Commander', phone: '911-SUPER', id: 'raka' },
      { name: 'Budi Santoso', role: 'Warga Sipil', phone: '08124444', id: 'budi' }
    ];
    if (chapterId >= 3) {
      initialContacts.push({ name: 'Dina Santoso', role: 'Anggota Keluarga', phone: '08125555', id: 'dina' });
    }
    setContacts(initialContacts);

    let initialWitnesses: any[] = [];
    if (chapterId >= 3) {
      initialWitnesses.push({ name: 'Dina Santoso', statement: 'Budi (kakaknya) pergi menemui seseorang di RS Harapan Bangsa 3 hari lalu.' });
    }
    setWitnesses(initialWitnesses);
    
    const reconstructedMessages: any[] = [];
    for (let c = 1; c < chapterId; c++) {
      const lvl = LEVELS.find(l => l.id === c);
      if (lvl) {
        reconstructedMessages.push({
          id: `initial_${c}`,
          sender: lvl.mail.sender,
          subject: lvl.mail.subject,
          body: lvl.mail.body,
          timestamp: '08:15',
          read: true
        });
        reconstructedMessages.push({
          id: `closing_${c}`,
          sender: 'Supervisor Raka',
          subject: `RE: ${lvl.title} - SELESAI`,
          body: lvl.report.conclusion,
          timestamp: '08:30',
          read: true
        });
      }
      if (c === 2) {
        reconstructedMessages.push({
          id: 'call_dina',
          sender: 'Supervisor Raka',
          subject: 'Hubungi Dina',
          body: 'Bagus. Hubungi Dina.',
          timestamp: '08:20',
          read: true
        });
      }
      if (c === 3) {
        reconstructedMessages.push({
          id: 'anon_msg',
          sender: 'Unknown Number',
          subject: '!!!',
          body: 'Berhenti mencari Budi. Kalau tidak... kamu akan menjadi orang berikutnya.',
          timestamp: '08:35',
          read: true
        });
      }
      if (c === 6) {
        reconstructedMessages.push({
          id: 'anon_msg_6',
          sender: 'Unknown Number',
          subject: '!!! WARNING !!!',
          body: 'Kamu mencari kejadian delapan tahun lalu. Itu kesalahan terbesar yang bisa kamu lakukan.',
          timestamp: '08:35',
          read: true
        });
      }
    }
    
    const activeLevel = LEVELS.find(l => l.id === chapterId);
    const initialMsgId = `initial_${chapterId}`;
    if (activeLevel) {
      reconstructedMessages.push({
        id: initialMsgId,
        sender: activeLevel.mail.sender,
        subject: activeLevel.mail.subject,
        body: activeLevel.mail.body,
        timestamp: '08:15',
        read: false
      });
    }
    setMessages(reconstructedMessages);
    setSelectedMessageId(null);

    const initialNotebook = getInitialNotebookForChapter(chapterId);
    setNotebookContent(initialNotebook);
    
    saveProgress(chapterId, 0, unlockedLevelIds, false, baseApps, initialNotebook, initialContacts, initialWitnesses, reconstructedMessages);
    setAppState('HOME');
    showSupervisorPopup(`Chapter ${chapterId} berhasil di-reset. Silakan buka Inbox untuk membaca instruksi misi.`);
  };

  const markMessageAsRead = useCallback((id: string) => {
    setMessages(prev => {
      const hasUnread = prev.some(m => m.id === id && !m.read);
      if (hasUnread) {
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
  }, [currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, stats]);

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

  // Show Supervisor CCTV metadata warning when opening DB_LIST in Chapter 5
  useEffect(() => {
    if (appState === 'DB_LIST' && currentLevelId === 5 && !hasShownCCTVWarning) {
      setHasShownCCTVWarning(true);
      showSupervisorPopup('Jangan berharap ada video. Sistem lama hanya menyimpan metadata.');
    }
  }, [appState, currentLevelId, hasShownCCTVWarning]);

  // Reset the warning when changing levels
  useEffect(() => {
    if (currentLevelId !== 5) {
      setHasShownCCTVWarning(false);
    }
  }, [currentLevelId]);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const currentObjective = currentLevel.objectives[currentObjectiveIndex] || currentLevel.objectives[0];
  
  const firstName = playerName ? playerName.split(' ')[0] : 'Detective';

  const triggerBlink = (appId: string) => {
    if (!blinkingApps.includes(appId)) {
      setBlinkingApps(prev => [...prev, appId]);
    }
  };
  
  const clearBlink = (appId: string) => {
    setBlinkingApps(prev => prev.filter(a => a !== appId));
  };

  const showSupervisorPopup = (message: string, onConfirm?: () => void) => {
    setPopup({
      title: 'Supervisor Raka',
      message,
      onClose: () => {
        setPopup(null);
        if (onConfirm) onConfirm();
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
      setErrorMessage('');
      setIsBrowsing(true);
      setIsBrowsingTable(true);
      setIsObjectiveMet(false);
      setAppState('RESULT');
    } catch (e: any) {
      setErrorMessage(e.message || "ERROR LOADING TABLE");
      setQueryResult(null);
      setAppState('RESULT');
    }
  };

  const handleRunQuery = () => {
    const query = queryString;
    try {
      setIsBrowsing(false);
      setIsBrowsingTable(false);
      const res = executeSql(query, currentLevel.database);
      setQueryResult(res);
      setErrorMessage('');
      const met = currentObjective.validateResult(res, query);
      setIsObjectiveMet(met);
      
      // Allow browsing for certain tables or if the query looks like a table dump
      const isArticleQuery = query.toLowerCase().includes('from articles');
      const isCompanyQuery = query.toLowerCase().includes('from companies');
      setIsBrowsingTable(isArticleQuery || isCompanyQuery);
      
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
      setQueryResult(null);
      setIsObjectiveMet(false);
      setAppState('RESULT');
      
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
      setIsObjectiveMet(false);
      setQueryResult(null);
      setErrorMessage('');
      
      const nextIdx = currentObjectiveIndex + 1;
      setCurrentObjectiveIndex(nextIdx);
      saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, finalApps, notebookContent, finalContacts, finalWitnesses, finalMessages, finalStats);
      
      const length = currentLevel?.objectives.length || 0;
      if (nextIdx < length) {
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
            setAppState('NOTEBOOK');
            showSupervisorPopup('Kamu menemukan Dina Santoso di alamat yang sama. Hubungi dia.');
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
            setMessages(prev => {
              if (prev.find(m => m.id === 'call_dina')) return prev;
              const newMsg = {
                 id: 'call_dina',
                 sender: 'Supervisor Raka',
                 subject: 'Hubungi Dina',
                 body: 'Bagus. Hubungi Dina.',
                 timestamp: formatTime(currentTime),
                 read: false
              };
              const newMessages = [...prev, newMsg];
              saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, newContacts, witnesses, newMessages);
              return newMessages;
            });
            setSelectedMessageId(null);
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
            setAppState('NOTEBOOK');
            showSupervisorPopup('Bagus. Sekarang cari kendaraan milik Andi Prasetyo (Owner ID 7).');
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
            setNotebookContent(prev => prev + '\n\nData terlalu banyak. Perlu difilter.\nAda dua orang lain yang berada di lokasi hampir bersamaan.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Fokus ke pasien yang mereka kunjungi. Gunakan JOIN antara visitors and patients.');
            setQueryString('');
          } else if (nextIdx === 2) {
            setNotebookContent(prev => prev + '\n\nRudi juga mengunjungi Rizky.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Bagus. Sekarang cari identitas Rudi Hartono di tabel citizens.');
            setQueryString('');
          } else if (nextIdx === 3) {
            setNotebookContent(prev => prev + '\n\nData Rudi tidak lengkap.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Rudi Hartono terdaftar sebagai warga. Sekarang periksa apakah Rudi memiliki kendaraan terdaftar.');
            setQueryString('');
          } else if (nextIdx === 4) {
            setNotebookContent(prev => prev + '\n\nRudi tidak memiliki kendaraan.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Rudi tidak memiliki kendaraan. Sekarang cari semua kendaraan yang keluar dari tempat parkir rumah sakit sekitar pukul 11:30.');
            setQueryString('');
          } else if (nextIdx === 5) {
            setNotebookContent(prev => prev + '\n\nAda tiga kendaraan.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Ada tiga kendaraan. Sekarang hubungkan data parkir, kendaraan, dan warga menggunakan triple JOIN untuk mengetahui siapa pemilik kendaraan-kendaraan tersebut.');
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
              title: 'SUPERVISOR RAKA',
              message: 'Bandingkan keduanya (Visitors dan Footage).',
              onClose: () => {
                // Wait a few seconds to let the player "think" or try manually
                setTimeout(() => {
                  setNotebookContent(prev => prev + '\n\nData mulai banyak.\nSulit dibandingkan.');
                  triggerBlink('NOTEBOOK');
                  setAppState('NOTEBOOK');
                  
                  setPopup({
                    title: 'SUPERVISOR RAKA',
                    message: '*Supervisor tersenyum*\n\nAda satu teknik lagi.\nTidak semua data memiliki pasangan.',
                    onClose: () => {
                      setPopup({
                        title: 'NEW LESSON',
                        message: 'LEFT JOIN\n\nUnlocked',
                        onClose: () => {
                          setPopup({
                            title: 'TUTORIAL',
                            message: 'Supervisor memberikan contoh sederhana.\n\nINNER JOIN hanya menampilkan data yang cocok di kedua tabel.\nTapi bagaimana jika kamu ingin mencari siapa yang tidak muncul di CCTV?\n\n(Pemain belum pernah memikirkan itu...)',
                            onClose: () => {
                              setPopup(null);
                              showSupervisorPopup('Gunakan LEFT JOIN untuk membandingkan tabel visitors dengan tabel footage.');
                              setAppState('TERM');
                              setQueryString('');
                              if (!unlockedApps.includes('TIMELINE')) {
                                setUnlockedApps(prev => [...prev, 'TIMELINE']);
                                triggerBlink('TIMELINE');
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }, 4000);
              }
            });
          } else {
            setAppState('TERM');
            setQueryString('');
          }
        } else if (currentLevelId === 6) {
          if (nextIdx === 1) {
            // STEP 4: After Rizky Hidayat exact search (0 rows)
            setNotebookContent(prev => prev + '\n\nTidak ditemukan.\nApakah dia memang tidak pernah diberitakan?');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Atau... Kamu mencari dengan cara yang salah.', () => {
              setPopup({
                title: 'Supervisor Raka',
                message: 'Tidak semua orang ditulis dengan nama lengkap. Kadang hanya nama depan. Kadang hanya nama belakang. Gunakan pencarian yang lebih fleksibel.',
                onClose: () => {
                  setPopup({
                    title: 'NEW LESSON UNLOCKED',
                    message: 'LIKE\n\nUnlocked\n\nContoh:\nSELECT *\nFROM articles\nWHERE title\nLIKE \'%Rizky%\';',
                    onClose: () => {
                      setPopup(null);
                      setAppState('TERM');
                      setQueryString('');
                    }
                  });
                }
              });
            });
          } else if (nextIdx === 2) {
            // STEP 5: After LIKE '%Rizky%' (Found)
            setNotebookContent(prev => prev + '\n\n?\nRizky pernah mengalami kecelakaan.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Menarik. Rizky ternyata penyintas kecelakaan. Sekarang coba cari nama Andi.', () => {
              setAppState('TERM');
              setQueryString('');
            });
          } else if (nextIdx === 3) {
            // STEP 6: After LIKE '%Andi%' (0 rows)
            setNotebookContent(prev => prev + '\n\nAndi\ntidak pernah muncul.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Andi bersih di media. Tapi coba perhatikan nama perusahaan di artikel kecelakaan Rizky: PT Arunika Logistics. Coba telusuri kata itu.', () => {
              setAppState('TERM');
              setQueryString('');
            });
          } else if (nextIdx === 4) {
            // STEP 7 & 8: After LIKE '%Arunika%' (Found articles)
            setNotebookContent(prev => prev + '\n\nArunika\n↓\nKecelakaan\n↓\nRizky\n\nSopir truk menghilang.\nRizky adalah penyintas kecelakaan.');
            setAppState('NOTEBOOK');
            showSupervisorPopup('Delapan tahun lalu... Ada orang yang juga menghilang. Saya menemukan sesuatu. Nama perusahaan itu masih aktif.', () => {
              setPopup({
                title: 'NEW DATABASE UNLOCKED',
                message: 'COMPANIES\n\nUnlocked',
                onClose: () => {
                  setPopup(null);
                  setAppState('TERM');
                  setQueryString('');
                }
              });
            });
          } else {
            setAppState('TERM');
            setQueryString('');
          }
        } else if (currentLevelId === 9) {
          if (nextIdx === 1) {
             setNotebookContent(prev => prev + '\n\nLead Investigator ID: 52');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Sama seperti foreign key. Cari siapa nomor 52 di tabel persons.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 2) {
             setNotebookContent(prev => prev + '\n\nID 52 tidak ditemukan di persons.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Tidak mungkin. Kalau seseorang menghapus identitas, apakah datanya benar-benar hilang? Gunakan SUBQUERY untuk mencari data person yang menjadi investigator kasus Arunika.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 3) {
             setNotebookContent(prev => prev + '\n\nRecord person benar-benar hilang.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Menarik... Berarti bukan datanya yang hilang, tapi record-nya sudah dihapus. Tapi apakah evidence miliknya juga hilang? Gunakan SUBQUERY di tabel evidence.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 4) {
             setNotebookContent(prev => prev + '\n\nNotebook Polisi masih ada di Evidence.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Pesan di Notebook: "Jangan percaya database. Percayalah pada ketidakkonsistenannya."\n\nIni catatan seorang polisi, bukan korban. Cek apakah ada tersangka (suspects) untuk kasus ini.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          }
        } else if (currentLevelId === 10) {
          if (nextIdx === 1) {
             setNotebookContent(prev => prev + '\n\nSulit mengikuti percakapan.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Archive email sangat berantakan. Gunakan WITH untuk menyusun result bertahap agar lebih mudah dibaca.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 2) {
             setNotebookContent(prev => prev + '\n\nEmail terakhir (ID 204) telah dihapus.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Jika email utama hilang, cek di tabel deleted. Gunakan CTE untuk memproses thread yang sama.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 3) {
             setNotebookContent(prev => prev + '\n\nEmail terakhir: "Jangan percaya..."');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Pesan itu terpotong. Cek lampiran (attachments) yang berkaitan dengan email Arunika menggunakan CTE dan subquery.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 4) {
             setNotebookContent(prev => prev + '\n\nMaintenance? Kamera Offline di Chapter 5... Clue terhubung.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Jadwal Maintenance:\n- 11:24 Start\n- 11:31 End\n\nKamera tidak rusak. Seseorang mematikannya.', () => {
               setAppState('REPORT');
               setQueryString('');
             });
          }
        } else if (currentLevelId === 11) {
          if (nextIdx === 1) {
             setNotebookContent(prev => prev + '\n\n15 lokasi. 15 waktu. Masih terlalu banyak. Aku harus mengurutkannya.');
             setAppState('NOTEBOOK');
             showSupervisorPopup('Data mentah sulit dianalisis. Kita butuh urutan kronologis yang pasti.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 2) {
             setAppState('TIMELINE');
             showSupervisorPopup('Gunakan LEAD() untuk membandingkan baris saat ini dengan baris berikutnya. Cari kendaraan yang mengikuti Budi.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          } else if (nextIdx === 3) {
             setNotebookContent(prev => prev + '\n\nIni bukan kebetulan. Mereka mengikuti Budi.');
             setAppState('EVIDENCE');
             showSupervisorPopup('Critical Evidence Unlocked: Vehicle Tailing Pattern. Sekarang cari siapa yang mematikan kamera di system_logs.', () => {
               setAppState('TERM');
               setQueryString('');
             });
          }
      }
    }
  } else {
    // Level complete flow - Save progress first to ensure consistency
    saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, finalApps, notebookContent, finalContacts, finalWitnesses, finalMessages, finalStats);

      if (currentLevelId === 5) {
        setAppState('HOME');
        setPopup({
          title: 'PLAYER',
          message: '"Hah?"\nKenapa NULL?',
          onClose: () => {
            setPopup({
              title: 'SUPERVISOR RAKA',
              message: 'NULL juga merupakan petunjuk.',
              onClose: () => {
                const newNote = notebookContent + '\n\nAndi\nTidak pernah muncul\ndi CCTV.';
                setNotebookContent(newNote);
                triggerBlink('NOTEBOOK');
                setAppState('NOTEBOOK');
                
                setPopup({
                  title: 'PLAYER',
                  message: '*Player mulai curiga*\nKalau Andi tidak muncul...\nSiapa yang membawa mobilnya?',
                  onClose: () => {
                    setPopup({
                      title: 'SUPERVISOR RAKA',
                      message: 'Tepat.\nKita selama ini menganggap Andi mengemudi.\nTapi database tidak pernah mengatakan itu.\nItu hanya asumsi kita.',
                      onClose: () => {
                        setPopup(null);
                        
                        setMessages(prev => {
                          if (prev.find(m => m.id === 'cctv_tech_msg')) return prev;
                          const techMsg = {
                            id: 'cctv_tech_msg',
                            sender: 'Teknisi CCTV',
                            subject: 'Kamera Main Gate',
                            body: 'Maaf Pak.\nSaya baru ingat.\nKamera Main Gate sempat mati selama enam menit.',
                            timestamp: formatTime(currentTime),
                            read: false
                          };
                          const updatedMessages = [...prev, techMsg];
                          saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, newNote, contacts, witnesses, updatedMessages);
                          return updatedMessages;
                        });
                        triggerBlink('INBOX');
                        
                        // Now show report
                        showSupervisorPopup('Sekarang buat laporan.', () => {
                          setAppState('REPORT');
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else if (currentLevelId === 6) {
        // STEP 10: Police Database corrupted flow
        // Transition to Notebook IMMEDIATELY
        setAppState('NOTEBOOK');
        setIsObjectiveMet(false);
        setQueryResult(null);
        setErrorMessage('');
        
        const updatedNote = notebookContent + '\n\nSeseorang\nmenghapus sebagian data.';
        setNotebookContent(updatedNote);
        triggerBlink('NOTEBOOK');

        setPopup({
          title: 'DATABASE ERROR',
          message: 'Nama direktur terpotong.\nDatabase rusak.',
          onClose: () => {
            setPopup(null);
            
            setPopup({
              title: 'INVESTIGATION LOG',
              message: 'Seseorang menghapus sebagian data.',
              onClose: () => {
                setPopup(null);
                
                // STEP 11: Trigger Twist after a delay in Notebook
                setTimeout(() => {
                  setIsFlickering(true);
                  setAppState('HOME'); // Simulate "Freeze" state by going home
                  
                  setTimeout(() => {
                    setPopup({
                      title: 'SYSTEM WARNING',
                      message: 'Unauthorized Access Detected',
                      onClose: () => {
                        setIsFlickering(false);
                        setPopup(null);
                        
                        // Inbox masuk: Unknown Number
                        setMessages(prevMsgs => {
                          if (prevMsgs.find(m => m.id === 'anon_msg_6')) return prevMsgs;
                          const anonMsg = {
                            id: 'anon_msg_6',
                            sender: 'Unknown Number',
                            subject: '!!! WARNING !!!',
                            body: 'Kamu mencari kejadian delapan tahun lalu. Itu kesalahan terbesar yang bisa kamu lakukan.',
                            timestamp: formatTime(currentTime),
                            read: false
                          };
                          const updatedMsgs = [...prevMsgs, anonMsg];
                          saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, updatedNote, contacts, witnesses, updatedMsgs);
                          return updatedMsgs;
                        });
                        triggerBlink('INBOX');

                        setTimeout(() => {
                          setAppState('INBOX');
                          showSupervisorPopup('Gawat! Sistem kepolisian sedang diawasi seseorang. Seseorang mendeteksi aktivitas kita! Kirimkan laporan investigasimu segera sebelum akses kita diputus.', () => {
                            setAppState('REPORT');
                          });
                        }, 2000);
                      }
                    });
                  }, 1500); // Show warning popup after flicker starts
                }, 3000); // Stay in notebook for 3 seconds before freeze
              }
            });
          }
        });
        return;
      } else if (currentLevelId === 9) {
          // Chapter 9 Ending - THE TWIST
          setIsFlickering(true);
          setAppState('HOME');
          
          setTimeout(() => {
            setIsFlickering(false);
            setMessages(prev => {
              const anonMsg = {
                id: 'anon_msg_9',
                sender: 'Unknown Number',
                subject: 'Bagus.',
                body: 'Sekarang kamu tahu bahwa polisi pun bisa dihapus. Pertanyaannya... Masih yakin Supervisor-mu masih hidup?',
                timestamp: formatTime(currentTime),
                read: false
              };
              return [...prev, anonMsg];
            });
            triggerBlink('INBOX');
            
            // Set Raka offline
            setContacts(prev => prev.map(c => c.id === 'raka' ? { ...c, status: 'OFFLINE' } : c));
            
            setPopup({
              title: 'INCOMING MESSAGE',
              message: 'UNKNOWN: "Sekarang kamu tahu bahwa polisi pun bisa dihapus. Pertanyaannya... Masih yakin Supervisor-mu masih hidup?"',
              onClose: () => {
                setPopup(null);
                setAppState('NOTEBOOK');
                setNotebookContent(prev => prev + '\n\nSupervisor Raka tidak bisa dihubungi.\nPolisi pun bisa dihapus.');
                
                // Show Timeline change
                setTimeout(() => {
                   setAppState('TIMELINE');
                   // Simulate dramatic pause before completion
                   // User requested ~10 seconds
                   setTimeout(() => {
                     setAppState('QUEST_COMPLETE');
                   }, 10000);
                }, 2000);
              }
            });
          }, 2000);
        } else if (currentLevelId === 10) {
          // Chapter 10 Ending - THE CLIFFHANGER
          setIsFlickering(true);
          setAppState('HOME');
          
          setTimeout(() => {
            setIsFlickering(false);
            setPopup({
              title: 'REMOTE SESSION DETECTED',
              message: 'DEVICE CONTROL REQUEST FROM: [RAKA_ENCRYPTED]\n\nACCEPTING UNAUTHORIZED CONTROL...',
              onClose: () => {
                setPopup(null);
                // Trigger "Video" style popup
                setTimeout(() => {
                  setPopup({
                    title: 'VIDEO_MESSAGE_RAKA.MP4',
                    message: 'Wajah Raka terlihat panik di layar gelap.\n\n"Kalau kamu melihat video ini... Jangan datang ke kantor. Mereka sudah di sini. Lari, dan percayalah pada datamu. Jangan percaya siapa pun di dalam..."\n\n[FILE_AUTO_DESTRUCT_SUCCESS]',
                    onClose: () => {
                      setPopup(null);
                      setAppState('NOTEBOOK');
                      setNotebookContent(prev => prev + '\n\nRAKA: "Jangan datang ke kantor. Lari."');
                      
                      setTimeout(() => {
                        setIsLevelComplete(true);
                        setAppState('QUEST_COMPLETE');
                      }, 2000);
                    }
                  });
                }, 1500);
              }
            });
          }, 2000);
        } else if (currentLevelId === 11) {
          // Chapter 11 Ending - THE CLIFFHANGER
          setIsFlickering(true);
          setAppState('STATISTICS');
          
          setTimeout(() => {
            setPopup({
              title: 'REMOTE USER CONNECTED',
              message: 'UNAUTHORIZED REMOTE ACCESS DETECTED\n\nTERMINAL LOCK INITIATED...',
              onClose: () => {
                setPopup(null);
                setTimeout(() => {
                   setPopup({
                     title: 'CRITICAL WARNING',
                     message: 'YOUR CURRENT LOCATION: [KNOWN]\n\n"Kamu mulai melihat yang tidak seharusnya."',
                     onClose: () => {
                       setPopup(null);
                       setIsFlickering(true);
                       setTimeout(() => {
                         setIsLevelComplete(true);
                         setAppState('QUEST_COMPLETE');
                         setIsFlickering(false);
                       }, 3000);
                     }
                   });
                }, 2000);
              }
            });
          }, 2000);
        } else {
          setIsLevelComplete(true);
          showSupervisorPopup('Sekarang buat laporan.', () => {
            setAppState('REPORT');
          });
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
      } else if (currentLevelId === 6) {
        // Ending Chapter 6 - Supervisor menelepon
        setTimeout(() => {
          setPopup({
            title: 'INCOMING CALL: SUPERVISOR RAKA',
            message: 'Supervisor Raka menelepon...\n\n"Saya rasa kita tidak lagi menyelidiki orang hilang."\n\n(Diam beberapa detik)\n\n"Kita sedang menyelidiki seseorang yang bisa menghapus sejarah."',
            onClose: () => {
              setPopup({
                title: 'CALL TERMINATED',
                message: 'Telepon terputus.\nLayar gelap.',
                onClose: () => {
                  setPopup(null);
                  setAppState('QUEST_COMPLETE');
                }
              });
            }
          });
        }, 1000);
      } else {
        setAppState('QUEST_COMPLETE');
      }
      
      const newStats = { 
        ...stats, 
        xp: stats.xp + (currentLevelId === 1 ? 100 : currentLevelId === 2 ? 120 : currentLevelId === 3 ? 180 : currentLevelId === 4 ? 220 : currentLevelId === 5 ? 250 : currentLevelId === 6 ? 320 : currentLevelId === 9 ? 700 : currentLevelId === 10 ? 850 : currentLevelId === 11 ? 1000 : 300),
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
      
      setMessages(prev => {
        const closingId = `closing_${currentLevelId}`;
        if (prev.find(m => m.id === closingId)) return prev;
        
        const closingMsg = {
          id: closingId,
          sender: 'Supervisor Raka',
          subject: `RE: ${currentLevel.title} - SELESAI`,
          body: currentLevel.report.conclusion,
          timestamp: formatTime(currentTime),
          read: false
        };
        
        let newMessages = [...prev, closingMsg];
        
        if (currentLevelId === 3 && !prev.find(m => m.id === 'anon_msg')) {
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
        
        if (!unlockedLevelIds.includes(currentLevelId + 1) && currentLevelId < LEVELS.length) {
          const newUnlocked = [...unlockedLevelIds, currentLevelId + 1];
          setUnlockedLevelIds(newUnlocked);
          saveProgress(currentLevelId + 1, 0, newUnlocked, false, newApps, notebookContent, contacts, witnesses, newMessages, newStats);
        } else {
          saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, contacts, witnesses, newMessages, newStats);
        }
        
        return newMessages;
      });

      triggerBlink('INBOX');
      if (unlockedApps.includes('EVIDENCE')) {
        triggerBlink('EVIDENCE');
        setAppState('EVIDENCE');
      }
      
      let newApps = [...unlockedApps];
      if (!newApps.includes('CONTACTS')) {
         newApps.push('CONTACTS');
         triggerBlink('CONTACTS');
      }
      setUnlockedApps(newApps);
    } else {
      setPopup({
        title: 'WRONG ANALYSIS',
        message: 'INCORRECT CONCLUSION. PLEASE DOUBLE-CHECK THE FACTS IN THE DATABASE OR WITNESS REPORTS BEFORE REPORTING YOUR CONCLUSION.',
        onClose: () => setPopup(null)
      });
    }
  };

  const handleAcceptMission = () => {
    setHasAcceptedMission(true);
    triggerBlink('CASE_FILES');
    let newApps = [...unlockedApps];
    
    if (currentLevelId === 2 && !newApps.includes('CONTACTS')) {
      newApps.push('CONTACTS');
      triggerBlink('CONTACTS');
    }
    if (currentLevelId === 4 && !newApps.includes('TIMELINE')) {
      newApps.push('TIMELINE');
      triggerBlink('TIMELINE');
    }
    if (currentLevelId === 6 && !newApps.includes('BROWSER')) {
      newApps.push('BROWSER');
      triggerBlink('BROWSER');
    }
    if (currentLevelId === 7 && !newApps.includes('MAP')) {
      newApps.push('MAP');
      triggerBlink('MAP');
    }
    if (currentLevelId === 9 && !newApps.includes('BROWSER')) {
      // Ensure Browser is unlocked for Criminal Records if not already
      newApps.push('BROWSER');
      triggerBlink('BROWSER');
    }
    if (currentLevelId === 10 && !newApps.includes('EMAIL')) {
      newApps.push('EMAIL');
      triggerBlink('EMAIL');
    }
    
    setUnlockedApps(newApps);
    setMessages(prevMsgs => { saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, true, newApps, notebookContent, contacts, witnesses, prevMsgs, stats); return prevMsgs; });
    
    let popupTitle = 'SYSTEM';
    let popupMessage = 'Mission Accepted. Objective updated in Case Files.';
    
    if (currentLevelId === 1) {
      popupTitle = 'MISSION ACCEPTED';
      popupMessage = 'ACCESS GRANTED TO:\n- VEHICLES DATABASE\n- OWNERS DATABASE\n- PARKING LOGS\n\nAnalyze the tables to identify the owner of vehicle B1734QAZ.';
    } else if (currentLevelId === 2) {
      popupTitle = 'NEW DATABASE ACCESS';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CITIZENS DATABASE (citizens, visitors, patients)\n- CONTACTS APP UNLOCKED\n\nVerify if Budi Santoso\'s address matches citizens registration data.';
    } else if (currentLevelId === 3) {
      popupTitle = 'HOSPITAL DATABASE GRANTED';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- HOSPITAL DATABASE\n- HOSPITAL PARKING EXTENDED LOGS\n\nNew query capabilities unlocked: SQL JOIN';
    } else if (currentLevelId === 4) {
      popupTitle = 'NEW INVESTIGATION TOOL';
      popupMessage = 'MISSION ACCEPTED\n\nNEW FEATURE UNLOCKED:\n- CHRONOLOGICAL TIMELINE SCREEN\n\nNew query capabilities unlocked: BETWEEN, Multi-Table JOINs';
    } else if (currentLevelId === 5) {
      popupTitle = 'CCTV SYSTEM GRANTED';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CCTV DATABASE (cameras, footage)\n\nNew query capabilities unlocked: SQL LEFT JOIN';
    } else if (currentLevelId === 6) {
      popupTitle = 'DIGITAL ARCHIVE ACCESS';
      popupMessage = 'MISSION ACCEPTED\n\nNEW APP UNLOCKED:\n- POLICE SECURE BROWSER\n- COMPANIES DATABASE\n\nNew query capabilities unlocked: LIKE with % wildcards\n\nSupervisor Raka:\nKamera memang mati selama enam menit. Tapi orang tidak bisa menghapus semua jejaknya. Setiap orang meninggalkan jejak digital. Saya membuka akses ke Arsip Digital Nasional.';
    } else if (currentLevelId === 7) {
      popupTitle = 'GPS TRACKING INTERFACE';
      popupMessage = 'MISSION ACCEPTED\n\nNEW APP UNLOCKED:\n- GPS MAPS TRACKER\n  (locations, routes, checkpoints)\n\nNew query capabilities unlocked: ORDER BY, LIMIT';
    } else if (currentLevelId === 8) {
      popupTitle = 'FINANCIAL AUDIT GRANTED';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- FINANCIAL BANK DATABASE\n  (accounts, transactions, branches)\n\nNew query capabilities unlocked: GROUP BY, COUNT(*), HAVING';
    } else if (currentLevelId === 9) {
      popupTitle = 'NEW DATABASE ACCESS';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- CRIMINAL RECORDS\n  (persons, cases, suspects, evidence)\n\nNew query capabilities unlocked: SUBQUERY (Nested SELECT)';
    } else if (currentLevelId === 10) {
      popupTitle = 'ACCESS GRANTED';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- EMAIL SERVER ARCHIVE\n  (emails, deleted, attachments)\n\nNew query capabilities unlocked: WITH (CTE)';
    } else if (currentLevelId === 11) {
      popupTitle = 'FINAL DATABASE ACCESS';
      popupMessage = 'MISSION ACCEPTED\n\nNEW DATABASE UNLOCKED:\n- TRAFFIC CAMERA LOGS\n  (camera_logs, system_logs)\n\nNew query capabilities unlocked: WINDOW FUNCTIONS (ROW_NUMBER, LEAD, LAG)';
    }
    
    setPopup({
      title: popupTitle,
      message: popupMessage,
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
      if (selectedMessageId === 'cctv_tech_msg' && currentLevelId === 5) {
        setPopup({
          title: 'SUPERVISOR RAKA',
          message: 'Tepat sebelum Rizky keluar.',
          onClose: () => {
            const newNote = notebookContent + '\n\n06 minutes\nNo Footage';
            setNotebookContent(newNote);
            triggerBlink('NOTEBOOK');
            setAppState('NOTEBOOK');
            triggerBlink('TIMELINE');
            
            let newApps = [...unlockedApps];
            if (!newApps.includes('EVIDENCE')) {
              newApps.push('EVIDENCE');
            }
            setUnlockedApps(newApps);
            triggerBlink('EVIDENCE');
            setAppState('EVIDENCE');
            
            setPopup({
              title: 'SYSTEM',
              message: 'NEW EVIDENCE ADDED:\n- Camera Offline\n- Missing Footage\n- Visitor Without Match\n- Timeline Updated\n\nSilakan buka EVIDENCE LOCKER untuk mengecek temuan.',
              onClose: () => {
                setPopup(null);
                const nextIdx = 4;
                setCurrentObjectiveIndex(nextIdx);
                setMessages(prevMsgs => { saveProgress(currentLevelId, nextIdx, unlockedLevelIds, hasAcceptedMission, newApps, newNote, contacts, witnesses, prevMsgs, stats); return prevMsgs; });
              }
            });
          }
        });
      }
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
        if (isObjectiveMet) handleObjectiveComplete();
        else if (isBrowsingTable) setAppState('DB_LIST');
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
          const nextLevelId = currentLevelId + 1;
          setCurrentLevelId(nextLevelId);
          setCurrentObjectiveIndex(0);
          setIsLevelComplete(false);
          setHasAcceptedMission(false);
          setQueryString('');
          
          if (nextLevelId === 11) {
            setAppState('BOOT'); // Show boot screen again
            setTimeout(() => {
              setIsFlickering(true);
              setTimeout(() => {
                setIsFlickering(false);
                setPopup({
                  title: 'SYSTEM LOG',
                  message: 'Someone is watching.',
                  onClose: () => {
                    setPopup(null);
                    setAppState('HOME');
                  }
                });
              }, 2000);
            }, 5000); // Wait for boot screen to "finish"
          } else {
            setAppState('HOME');
          }
        } else {
          setAppState('HOME');
        }
        break;
      default:
        break;
    }
  };

  const onReviewEvidence = useCallback((evidenceId: string) => {
    setEvidenceMetadata(prev => {
      const existing = prev[evidenceId] || {
        id: evidenceId,
        foundAt: { chapter: currentLevelId, step: currentObjectiveIndex + 1 },
        reviewedCount: 0,
        status: 'Evidence'
      };
      
      const newMeta = {
        ...prev,
        [evidenceId]: {
          ...existing,
          reviewedCount: existing.reviewedCount + 1
        }
      };
      saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, stats, playerName, newMeta);
      return newMeta;
    });
  }, [currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, stats, playerName, evidenceMetadata]);

  const setEvidenceStatus = useCallback((evidenceId: string, status: 'Evidence' | 'Critical Evidence') => {
    setEvidenceMetadata(prev => {
      const existing = prev[evidenceId] || {
        id: evidenceId,
        foundAt: { chapter: currentLevelId, step: currentObjectiveIndex + 1 },
        reviewedCount: 0,
        status: 'Evidence'
      };
      
      const newMeta = {
        ...prev,
        [evidenceId]: {
          ...existing,
          status,
          criticalAt: status === 'Critical Evidence' && existing.status !== 'Critical Evidence' ? { chapter: currentLevelId, step: currentObjectiveIndex + 1 } : existing.criticalAt
        }
      };
      saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, stats, playerName, newMeta);
      return newMeta;
    });
  }, [currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, unlockedApps, notebookContent, contacts, witnesses, messages, stats, playerName, evidenceMetadata]);

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
            onAppLaunch={() => {}}
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
            setHasAcceptedMission={handleAcceptMission} 
            markMessageAsRead={markMessageAsRead}
            handleCloseMessage={handleBack}
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
      case 'BROWSER':
        return (
          <BrowserScreen 
            currentLevel={currentLevel} 
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
            isBrowsingTable={isBrowsingTable}
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
        return (
          <EvidenceScreen 
            currentLevelId={currentLevelId} 
            currentObjectiveIndex={currentObjectiveIndex}
            setAppState={setAppState} 
            isLevelComplete={isLevelComplete} 
            unlockedApps={unlockedApps} 
            notebookContent={notebookContent} 
            evidenceMetadata={evidenceMetadata}
            onReviewEvidence={onReviewEvidence}
          />
        );
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
        return <TimelineScreen currentLevelId={currentLevelId} setAppState={setAppState} notebookContent={notebookContent} />;
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
              
              if (activeCallContact?.id === 'raka' && callStep === 666) {
                // Raka hung up. Layar Gelap.
                setIsBlackout(true);
                setTimeout(() => {
                  setIsBlackout(false);
                  setIsLevelComplete(true);
                  setAppState('QUEST_COMPLETE');
                }, 3000);
                return;
              }
              
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
                setAppState('WITNESSES');
                saveProgress(currentLevelId, currentObjectiveIndex, unlockedLevelIds, hasAcceptedMission, newApps, notebookContent, contacts, newWitnesses, messages, stats);
                
                setPopup({
                  title: 'NEW APP UNLOCKED',
                  message: 'WITNESS REPORT DATABASE UNLOCKED\n\nAccess the Witnesses database to read statements and follow up on clues.',
                  onClose: () => {
                    setPopup(null);
                    showSupervisorPopup("Bagus! Informasi dari Dina Santoso sangat penting. Sekarang periksa database rumah sakit.");
                  }
                });
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
               showSupervisorPopup("Investigation data has been saved to local memory.");
            }} 
            handleResetGame={() => {
              if (confirm("Reset all investigation progress? This cannot be undone.")) {
                localStorage.removeItem('query_crime_save');
                window.location.reload();
              }
            }} 
            handleChargeBattery={() => {
              setStats(prev => ({ ...prev, battery: 100 }));
              showSupervisorPopup("Battery fully charged. Power is now 100%.");
            }}
            levels={LEVELS}
            currentLevelId={currentLevelId}
            unlockedLevelIds={unlockedLevelIds}
            onJumpToChapter={handleJumpToChapter}
          />
        );
      case 'EMAIL':
        return <EmailScreen setAppState={setAppState} />;
      case 'STATISTICS':
        return <StatisticsScreen stats={stats} isThreatMode={currentLevelId === 11 && isLevelComplete} />;
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

        {isBlackout && (
          <div className="absolute inset-0 bg-black z-[1000]" />
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
