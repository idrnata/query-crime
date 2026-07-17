import React, { useState } from 'react';
import { Lock, History, Eye, Info } from 'lucide-react';
import { EvidenceMetadata } from '../../types';

interface EvidenceScreenProps {
  currentLevelId: number;
  currentObjectiveIndex?: number;
  setAppState: (state: any) => void;
  isLevelComplete?: boolean;
  unlockedApps?: string[];
  notebookContent?: string;
  evidenceMetadata?: Record<string, EvidenceMetadata>;
  onReviewEvidence?: (evidenceId: string) => void;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({ 
  currentLevelId, 
  currentObjectiveIndex = 0,
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
    { level: 6, id: 'corrupted', label: 'Status', value: 'Corrupted Company Record' },
    // Level 7
    { level: 7, id: 'warehouse_loc', label: 'Location', value: 'Arunika Warehouse' },
    { level: 7, id: 'suspicious_route', label: 'Route', value: 'Suspicious 57m Delay' },
    { level: 7, id: 'arunika_fleet', label: 'Activity', value: 'Fleet B 7710 XR detected' },
    { level: 7, id: 'hacked_map', label: 'Warning', value: 'Red Lines / Hacked Map' },
    // Level 8
    { level: 8, id: 'unknown_acc', label: 'Financial', value: 'Unknown Account Found' },
    { level: 8, id: 'hush_money', label: 'Payments', value: '48 Hush Money Transactions' },
    { level: 8, id: 'surveillance', label: 'Threat', value: 'Supervisor Surveillance Photo' },
    { level: 8, id: 'stop_dies', label: 'Warning', value: 'STOP OR HE DIES' },
    // Level 9
    { level: 9, id: 'missing_investigator', label: 'Missing Person', value: 'Missing Investigator (ID 52)' },
    { level: 9, id: 'archived_notebook', label: 'Archived File', value: 'Digital Notebook Polisi' },
    { level: 9, id: 'deleted_record', label: 'Status', value: 'Deleted Criminal Record' },
    { level: 9, id: 'empty_suspects', label: 'Case Result', value: 'Empty Suspect List' },
    // Level 10
    { level: 10, id: 'recovered_email', label: 'Email', value: 'Recovered Email (Raka/52)' },
    { level: 10, id: 'camera_maint', label: 'Schedule', value: 'Camera Maintenance Schedule' },
    { level: 10, id: 'warehouse_blueprint', label: 'Asset', value: 'Warehouse Blueprint' },
    { level: 10, id: 'employee_list_ev', label: 'People', value: 'Arunika Employee List' },
    // Level 11
    { level: 11, id: 'tailing_pattern', label: 'Critical', value: 'Vehicle Tailing Pattern' },
    { level: 11, id: 'hq_visit', label: 'Suspicious', value: 'Police HQ Visit (XR)' },
    { level: 11, id: 'admin_disable', label: 'Sabotage', value: 'Admin Camera Override' }
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
    if (e.level === 7) {
      if (e.id === 'warehouse_loc') return notebookContent.includes('Warehouse');
      if (e.id === 'suspicious_route') return notebookContent.includes('delay');
      return isLevelComplete;
    }
    if (e.level === 8) {
      if (e.id === 'unknown_acc') return notebookContent.includes('Unknown Account');
      return isLevelComplete;
    }
    if (e.level === 9) {
      if (e.id === 'missing_investigator') return notebookContent.includes('ID 52');
      if (e.id === 'archived_notebook') return notebookContent.includes('Notebook Polisi');
      if (e.id === 'deleted_record') return notebookContent.includes('Record person');
      if (e.id === 'empty_suspects') return notebookContent.includes('Tidak ada tersangka');
      return isLevelComplete;
    }
    if (e.level === 10) {
      if (e.id === 'recovered_email') return notebookContent.includes('Email terakhir');
      if (e.id === 'camera_maint') return notebookContent.includes('Maintenance?');
      return isLevelComplete;
    }
    if (e.level === 11) {
      if (e.id === 'tailing_pattern') return notebookContent.includes('mengikuti Budi');
      if (e.id === 'admin_disable') return currentObjectiveIndex >= 4;
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
