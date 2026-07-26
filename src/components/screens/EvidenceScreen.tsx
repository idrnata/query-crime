import React, { useState } from 'react';
import { Lock, History, Eye, Info } from 'lucide-react';
import { EvidenceMetadata } from '../../types';
import { getVisibleEvidence } from '../../constants/evidenceRegistry';

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

  const evidenceItems = getVisibleEvidence({
    currentLevelId,
    currentObjectiveIndex,
    isLevelComplete,
    unlockedApps,
    notebookContent,
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
