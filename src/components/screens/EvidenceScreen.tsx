import React from 'react';
import { Lock } from 'lucide-react';

interface EvidenceScreenProps {
  currentLevelId: number;
  setAppState: (state: any) => void;
  isLevelComplete?: boolean;
  unlockedApps?: string[];
  notebookContent?: string;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({ currentLevelId, setAppState, isLevelComplete = false, unlockedApps = [], notebookContent = '' }) => {
  const allEvidence = [
    // Level 1
    { level: 1, label: 'Plate', value: 'B 1734 QAZ' },
    { level: 1, label: 'Vehicle', value: 'Silver Avanza' },
    // Level 2
    { level: 2, label: 'Patient', value: 'Rizky Hidayat' },
    { level: 2, label: 'Hospital', value: 'Room 402' },
    // Level 3
    { level: 3, label: 'Owner', value: 'Andi Prasetyo' },
    { level: 3, label: 'Relation', value: 'Colleague' },
    // Level 4
    { level: 4, label: 'Gap', value: '8 Minutes' },
    { level: 4, label: 'Suspect', value: 'Rudi Hartono' },
    // Level 5
    { level: 5, label: 'Camera Offline', value: 'CAM-03 (Main Gate) Offline' },
    { level: 5, label: 'Missing Footage', value: '6 Minutes Offline at 11:25-11:31' },
    { level: 5, label: 'Visitor Without Match', value: 'Andi Prasetyo has no CCTV record' },
    { level: 5, label: 'Timeline Updated', value: 'Timeline sequence adjusted' },
    // Level 6
    { level: 6, label: 'Old Accident', value: '8 Years Ago Traffic' },
    { level: 6, label: 'PT Arunika Logistics', value: 'Associated with Accident' },
    { level: 6, label: 'Missing Driver', value: 'Sopir Truk Menghilang' },
    { level: 6, label: 'Corrupted Company Record', value: 'Owner Data Deleted' }
  ];
  
  const evidenceItems = allEvidence.filter(e => {
    if (e.level < currentLevelId) return true;
    if (e.level > currentLevelId) return false;
    
    // For the current level, check if evidence is actually unlocked yet
    if (e.level === 1) return unlockedApps.includes('EVIDENCE');
    if (e.level === 5) return notebookContent.includes('06 minutes\nNo Footage');
    if (e.level === 6) return notebookContent.includes('Seseorang menghapus sebagian data perusahaan.');
    
    // For other levels, evidence unlocks when the level is marked as complete
    return isLevelComplete;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Lock size={16} /> <span>SECURE EVIDENCE LOCKER</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-[#1b2118]/5">
        <div className="grid grid-cols-2 gap-3">
          {evidenceItems.map((item, idx) => (
            <div key={idx} className="bg-white/40 border-2 border-[#1b2118] p-3 flex flex-col gap-1 shadow-[4px_4px_0_0_#1b2118] animate-in zoom-in-95 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="text-[8px] font-bold uppercase opacity-50">{item.label}</div>
              <div className="text-xs font-bold uppercase break-words">{item.value}</div>
              <div className="mt-2 pt-1 border-t border-[#1b2118]/10 text-[8px] font-bold opacity-30">LEVEL {item.level} VERIFIED</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
