import React, { useState } from 'react';
import { Lock, History, Eye, Info } from 'lucide-react';
import { EvidenceMetadata } from '../../types';

interface EvidenceScreenProps {
  currentLevelId: number;
  setAppState: (state: any) => void;
  isLevelComplete?: boolean;
  unlockedApps?: string[];
  notebookContent?: string;
  evidenceMetadata?: Record<string, EvidenceMetadata>;
  onReviewEvidence?: (evidenceId: string) => void;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({ 
  currentLevelId, 
  setAppState, 
  isLevelComplete = false, 
  unlockedApps = [], 
  notebookContent = '',
  evidenceMetadata = {},
  onReviewEvidence
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allEvidence = [
    // Level 1
    { id: 'plate_1734', level: 1, label: 'Plate', value: 'B 1734 QAZ' },
    { id: 'vehicle_avanza', level: 1, label: 'Vehicle', value: 'Silver Avanza' },
    // Level 2
    { id: 'patient_rizky', level: 2, label: 'Patient', value: 'Rizky Hidayat' },
    { id: 'hospital_room', level: 2, label: 'Hospital', value: 'Room 402' },
    // Level 3
    { id: 'owner_andi', level: 3, label: 'Owner', value: 'Andi Prasetyo' },
    { id: 'relation_colleague', level: 3, label: 'Relation', value: 'Colleague' },
    // Level 4
    { id: 'gap_8min', level: 4, label: 'Gap', value: '8 Minutes' },
    { id: 'suspect_rudi', level: 4, label: 'Suspect', value: 'Rudi Hartono' },
    // Level 5
    { id: 'cam_offline', level: 5, label: 'Camera Offline', value: 'CAM-03 (Main Gate) Offline' },
    { id: 'missing_footage', level: 5, label: 'Missing Footage', value: '6 Minutes Offline at 11:25-11:31' },
    { id: 'visitor_no_match', level: 5, label: 'Visitor Without Match', value: 'Andi Prasetyo has no CCTV record' },
    { id: 'timeline_updated', level: 5, label: 'Timeline Updated', value: 'Timeline sequence adjusted' },
    // Level 6
    { level: 6, id: 'accident_survivor', label: 'Evidence', value: 'Accident Survivor' },
    { level: 6, id: 'old_accident', label: 'History', value: 'Old Accident' },
    { level: 6, id: 'arunika_assoc', label: 'Company', value: 'PT Arunika Logistics' },
    { level: 6, id: 'missing_driver', label: 'Missing Person', value: 'Missing Driver' },
    { level: 6, id: 'corrupted', label: 'Status', value: 'Corrupted Company Record' }
  ];
  
  const evidenceItems = allEvidence.filter(e => {
    if (e.level < currentLevelId) return true;
    if (e.level > currentLevelId) return false;
    
    // For the current level, check if evidence is actually unlocked yet
    if (e.level === 1) return unlockedApps.includes('EVIDENCE');
    if (e.level === 5) return notebookContent.includes('06 minutes\nNo Footage');
    if (e.level === 6) {
      if (e.id === 'accident_survivor') return notebookContent.includes('Rizky pernah');
      if (e.id === 'old_accident') return notebookContent.includes('Arunika');
      if (e.id === 'arunika_assoc') return notebookContent.includes('Arunika');
      if (e.id === 'missing_driver') return notebookContent.includes('Sopir');
      return isLevelComplete;
    }
    
    // For other levels, evidence unlocks when the level is marked as complete
    return isLevelComplete;
  });

  const selectedItem = evidenceItems.find(e => e.id === selectedId);
  const metadata = selectedId ? evidenceMetadata[selectedId] : null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onReviewEvidence) {
      onReviewEvidence(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1b2118] text-[#8cb07d]">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0 border-b border-[#8cb07d]/20">
        <Lock size={16} /> <span>SECURE EVIDENCE LOCKER</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {evidenceItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => handleSelect(item.id || `item_${idx}`)}
              className={`bg-white/10 border-2 ${selectedId === (item.id || `item_${idx}`) ? 'border-[#8cb07d] bg-[#8cb07d]/20' : 'border-[#8cb07d]/30'} p-3 flex flex-col gap-1 shadow-[4px_4px_0_0_#1b2118] text-left transition-all hover:bg-white/20 animate-in zoom-in-95 duration-300`} 
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-[8px] font-bold uppercase opacity-50">{item.label}</div>
              <div className="text-xs font-bold uppercase break-words">{item.value}</div>
              <div className="mt-2 pt-1 border-t border-[#8cb07d]/10 text-[8px] font-bold opacity-30">LEVEL {item.level} VERIFIED</div>
            </button>
          ))}
        </div>
      </div>

      {/* Metadata Panel */}
      {selectedItem && (
        <div className="bg-[#2a3526] border-t-2 border-[#8cb07d] p-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">{selectedItem.value}</h3>
              <p className="text-[10px] opacity-70">METADATA HISTORY</p>
            </div>
            <div className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded ${metadata?.status === 'Critical Evidence' ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-[#1b2118] border border-[#8cb07d]/30'}`}>
              {metadata?.status || 'Evidence'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 opacity-50">
                <History size={10} />
                <span className="text-[8px] font-bold uppercase">Found</span>
              </div>
              <div className="text-[10px] font-mono">
                {metadata ? `CH ${metadata.foundAt.chapter} - ST ${metadata.foundAt.step}` : 'N/A'}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 opacity-50">
                <Eye size={10} />
                <span className="text-[8px] font-bold uppercase">Reviewed</span>
              </div>
              <div className="text-[10px] font-mono">
                {metadata?.reviewedCount || 0} Times
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 opacity-50">
                <Info size={10} />
                <span className="text-[8px] font-bold uppercase">Status</span>
              </div>
              <div className="text-[10px] font-mono">
                {metadata?.status || 'Evidence'}
              </div>
            </div>
          </div>

          {metadata?.criticalAt && (
            <div className="mt-3 pt-2 border-t border-[#8cb07d]/10 text-[8px] font-bold text-red-400 uppercase flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Elevated to Critical: CH {metadata.criticalAt.chapter} - ST {metadata.criticalAt.step}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
