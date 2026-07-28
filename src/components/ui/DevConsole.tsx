import React, { useState } from 'react';
import { Sliders, X, ChevronRight, Zap, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { AppState, Level } from '../../types';

interface DevConsoleProps {
  currentLevelId: number;
  currentObjectiveIndex: number;
  unlockedLevelIds: number[];
  appState: AppState;
  unlockedApps: string[];
  levels: Level[];
  onJumpToChapter: (chapterId: number) => void;
  onSetObjectiveIndex: (idx: number) => void;
  onSetAppState: (state: AppState) => void;
  onUnlockAllApps: () => void;
  onSetBattery: (amount: number) => void;
}

export const DevConsole: React.FC<DevConsoleProps> = ({
  currentLevelId,
  currentObjectiveIndex,
  unlockedLevelIds,
  appState,
  unlockedApps,
  levels,
  onJumpToChapter,
  onSetObjectiveIndex,
  onSetAppState,
  onUnlockAllApps,
  onSetBattery,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'objectives' | 'actions'>('chapters');

  const currentLevel = levels.find((l) => l.id === currentLevelId);

  // Detect environment to confirm dev access
  const isDev = typeof window !== 'undefined' && (
    window.location.hostname.includes('dev-') || 
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') ||
    window.location.search.includes('dev=true')
  );

  if (!isDev) return null;

  return (
    <div className="flex flex-col h-full bg-[#1b2118] text-[#8cb07d] font-mono p-3 select-text overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#8cb07d]/30 mb-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-[#8cb07d] animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-wider">DEV CONSOLE</span>
        </div>
        <button
          onClick={() => onSetAppState('MENU')}
          className="text-[#8cb07d]/70 hover:text-[#8cb07d] hover:bg-[#8cb07d]/10 px-1.5 py-0.5 border border-[#8cb07d]/30 text-[9px] rounded font-bold transition-colors cursor-pointer"
        >
          CLOSE
        </button>
      </div>

      {/* Live State Banner */}
      <div className="bg-[#8cb07d]/5 border border-[#8cb07d]/20 p-2 rounded text-[10px] mb-3 flex flex-col gap-0.5 shrink-0">
        <div><strong>Chapter ID:</strong> {currentLevelId} - {currentLevel?.title || 'Unknown'}</div>
        <div><strong>Objective Index:</strong> {currentObjectiveIndex} / {currentLevel ? currentLevel.objectives.length - 1 : 0}</div>
        <div><strong>App State:</strong> <span className="bg-[#8cb07d]/20 px-1 py-0.5 rounded font-mono text-[9px] text-[#8cb07d] font-black">{appState}</span></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#8cb07d]/10 mb-3 text-[9px] shrink-0 font-bold">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'chapters' ? 'border-[#8cb07d] text-[#8cb07d]' : 'border-transparent text-[#8cb07d]/40 hover:text-[#8cb07d]'
          }`}
        >
          CHAPTERS
        </button>
        <button
          onClick={() => setActiveTab('objectives')}
          className={`flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'objectives' ? 'border-[#8cb07d] text-[#8cb07d]' : 'border-transparent text-[#8cb07d]/40 hover:text-[#8cb07d]'
          }`}
        >
          OBJECTIVES
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 pb-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'actions' ? 'border-[#8cb07d] text-[#8cb07d]' : 'border-transparent text-[#8cb07d]/40 hover:text-[#8cb07d]'
          }`}
        >
          OVERRIDE
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 text-xs flex flex-col gap-2">
        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div className="flex flex-col gap-1">
            {levels.map((lvl) => {
              const isActive = lvl.id === currentLevelId;
              const chNum = lvl.chapterNumber ?? (lvl.caseId === 'CASE002' ? lvl.id - 12 : lvl.id);
              const chNumFormatted = String(chNum).padStart(2, '0');
              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    onJumpToChapter(lvl.id);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded border transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#8cb07d] text-[#1b2118] font-bold border-[#8cb07d]'
                      : 'bg-[#1b2118] border-[#8cb07d]/20 hover:border-[#8cb07d]/50 text-[#8cb07d]'
                  }`}
                >
                  <span className="truncate">{lvl.title}</span>
                  <ChevronRight size={10} className={isActive ? 'text-[#1b2118]' : 'text-[#8cb07d]/40'} />
                </button>
              );
            })}
          </div>
        )}

        {/* Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="flex flex-col gap-1.5">
            {currentLevel ? (
              currentLevel.objectives.map((obj, idx) => {
                const isCurrent = idx === currentObjectiveIndex;
                return (
                  <button
                    key={obj.id}
                    onClick={() => onSetObjectiveIndex(idx)}
                    className={`w-full text-left p-2 rounded border flex flex-col gap-1 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#8cb07d]/10 border-[#8cb07d] text-[#8cb07d] font-semibold'
                        : 'bg-transparent border-[#8cb07d]/20 hover:border-[#8cb07d]/40 text-[#8cb07d]/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                        isCurrent ? 'bg-[#8cb07d] text-[#1b2118]' : 'bg-[#8cb07d]/10 text-[#8cb07d]/60'
                      }`}>
                        {idx}
                      </span>
                      <span className="font-bold tracking-tight uppercase truncate">{obj.story || obj.goal}</span>
                    </div>
                    <div className="text-[9px] opacity-70 leading-normal pl-5 font-sans">
                      {obj.goal}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-[10px] text-[#8cb07d]/40 text-center py-4">No active level loaded.</div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="flex flex-col gap-3">
            {/* System State Override */}
            <div className="flex flex-col gap-1">
              <div className="text-[8px] text-[#8cb07d]/60 font-bold uppercase tracking-wider mb-1">State Override</div>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                {['HOME', 'MENU', 'INBOX', 'CASE_FILES', 'DB_LIST', 'TERM', 'NOTEBOOK', 'SETTINGS', 'MAP', 'BROWSER', 'EVIDENCE', 'CONTACTS', 'WITNESSES', 'TIMELINE', 'EMAIL', 'STATISTICS', 'RANK'].map((st) => (
                  <button
                    key={st}
                    onClick={() => onSetAppState(st as AppState)}
                    className={`px-1.5 py-1.5 rounded text-left pl-2 border font-mono transition-colors cursor-pointer text-[8px] ${
                      appState === st
                        ? 'bg-[#8cb07d] text-[#1b2118] font-bold border-[#8cb07d]'
                        : 'bg-transparent border-[#8cb07d]/20 hover:bg-[#8cb07d]/10 text-[#8cb07d]/80'
                    }`}
                  >
                    {st === 'RANK' ? 'RANK (Stats App)' : st === 'STATISTICS' ? 'STATISTICS (Cinematic)' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* App Hacks & Powerups */}
            <div className="flex flex-col gap-1 border-t border-[#8cb07d]/20 pt-2">
              <button
                onClick={onUnlockAllApps}
                className="w-full bg-[#8cb07d]/10 hover:bg-[#8cb07d]/20 text-[#8cb07d] border border-[#8cb07d]/40 py-1.5 px-2 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Key size={10} />
                UNLOCK ALL APPS
              </button>

              <button
                onClick={() => onSetBattery(100)}
                className="w-full bg-[#8cb07d]/10 hover:bg-[#8cb07d]/20 text-[#8cb07d] border border-[#8cb07d]/40 py-1.5 px-2 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Zap size={10} />
                REFILL BATTERY
              </button>
            </div>

            {/* Dev Reset */}
            <div className="border-t border-[#8cb07d]/20 pt-2">
              <button
                onClick={() => {
                  if (confirm("Developer reset: Are you sure you want to completely wipe progress?")) {
                    localStorage.removeItem('query_crime_save');
                    window.location.reload();
                  }
                }}
                className="w-full bg-red-950/20 border border-red-500/30 hover:border-red-500/60 text-red-400 py-1.5 rounded text-[9px] font-bold flex items-center justify-center gap-1 uppercase transition-colors cursor-pointer"
              >
                <RefreshCw size={9} />
                RESET ALL
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer info */}
      <div className="text-[8px] text-[#8cb07d]/30 border-t border-[#8cb07d]/10 pt-2 text-center tracking-wider shrink-0 uppercase">
        Sandbox Dev Environment Active
      </div>
    </div>
  );
};
