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
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* Floating Toggle Button */}
      <button
        id="dev-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-[9999] bg-amber-600 hover:bg-amber-500 text-black border-2 border-amber-400 font-sans font-bold text-xs px-3 py-2 rounded shadow-2xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        title="Developer Console"
      >
        <Sliders size={14} />
        <span>DEV TOOLS</span>
      </button>

      {/* Main Console Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-zinc-950 border-l border-amber-500/30 z-[10000] text-amber-500 font-sans p-4 shadow-2xl flex flex-col justify-between text-left h-full">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500 animate-pulse" />
                <span className="font-bold text-sm tracking-wider uppercase">DEV CORE CONSOLE</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-500/60 hover:text-amber-500 p-1 hover:bg-amber-500/10 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live State Banner */}
            <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded text-xs mb-4 flex flex-col gap-1">
              <div><strong className="text-amber-400">Chapter ID:</strong> {currentLevelId} - {currentLevel?.title || 'Unknown'}</div>
              <div><strong className="text-amber-400">Objective Index:</strong> {currentObjectiveIndex} / {currentLevel ? currentLevel.objectives.length - 1 : 0}</div>
              <div><strong className="text-amber-400">App State:</strong> <span className="bg-amber-500/20 px-1 py-0.5 rounded font-mono text-[10px] text-amber-300">{appState}</span></div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-amber-500/10 mb-4 text-xs">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 pb-2 font-semibold text-center border-b-2 transition-colors ${
                  activeTab === 'chapters' ? 'border-amber-500 text-amber-400' : 'border-transparent text-amber-500/50 hover:text-amber-500'
                }`}
              >
                Chapters
              </button>
              <button
                onClick={() => setActiveTab('objectives')}
                className={`flex-1 pb-2 font-semibold text-center border-b-2 transition-colors ${
                  activeTab === 'objectives' ? 'border-amber-500 text-amber-400' : 'border-transparent text-amber-500/50 hover:text-amber-500'
                }`}
              >
                Objectives
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 pb-2 font-semibold text-center border-b-2 transition-colors ${
                  activeTab === 'actions' ? 'border-amber-500 text-amber-400' : 'border-transparent text-amber-500/50 hover:text-amber-500'
                }`}
              >
                Quick Actions
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-1">
              {/* Chapters Tab */}
              {activeTab === 'chapters' && (
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest mb-1">Jump directly to Chapter:</div>
                  {levels.map((lvl) => {
                    const isActive = lvl.id === currentLevelId;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          onJumpToChapter(lvl.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between border transition-all ${
                          isActive
                            ? 'bg-amber-600 text-black font-bold border-amber-400'
                            : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/40 text-amber-500/90'
                        }`}
                      >
                        <span className="truncate">Ch {lvl.id}: {lvl.title}</span>
                        <ChevronRight size={12} className={isActive ? 'text-black' : 'text-amber-500/40'} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Objectives Tab */}
              {activeTab === 'objectives' && (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest mb-1">Select Active Step:</div>
                  {currentLevel ? (
                    currentLevel.objectives.map((obj, idx) => {
                      const isCurrent = idx === currentObjectiveIndex;
                      return (
                        <button
                          key={obj.id}
                          onClick={() => onSetObjectiveIndex(idx)}
                          className={`w-full text-left p-2.5 rounded text-xs border flex flex-col gap-1 transition-all ${
                            isCurrent
                              ? 'bg-amber-950/40 border-amber-500 text-amber-400 font-semibold shadow-inner'
                              : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/30 text-amber-500/75'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              isCurrent ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {idx}
                            </span>
                            <span className="font-bold tracking-tight uppercase truncate">{obj.story || obj.goal}</span>
                          </div>
                          <div className="text-[10px] opacity-70 leading-normal pl-5">
                            {obj.goal}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-xs text-amber-500/40 text-center py-4">No active level loaded.</div>
                  )}
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === 'actions' && (
                <div className="flex flex-col gap-3">
                  {/* System State Override */}
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">Override Viewport State</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      {['HOME', 'MENU', 'INBOX', 'CASE_FILES', 'DB_LIST', 'TERM', 'NOTEBOOK', 'SETTINGS', 'MAP', 'BROWSER', 'EVIDENCE', 'CONTACTS', 'WITNESSES'].map((st) => (
                        <button
                          key={st}
                          onClick={() => onSetAppState(st as AppState)}
                          className={`px-1.5 py-1 rounded text-center border font-mono transition-colors ${
                            appState === st
                              ? 'bg-amber-600 text-black font-bold border-amber-400'
                              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-amber-500/80'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* App Hacks & Powerups */}
                  <div className="flex flex-col gap-1.5 border-t border-amber-500/10 pt-3">
                    <div className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">Power Utilities</div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={onUnlockAllApps}
                        className="w-full bg-amber-950/30 hover:bg-amber-950/60 text-amber-400 border border-amber-500/40 py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                      >
                        <Key size={12} />
                        UNLOCK ALL APPS & SCREENS
                      </button>

                      <div className="w-full">
                        <button
                          onClick={() => onSetBattery(100)}
                          className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Zap size={11} />
                          100% BATTERY
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dev Reset */}
                  <div className="border-t border-amber-500/10 pt-3 flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        if (confirm("Developer reset: Are you sure you want to completely wipe progress?")) {
                          localStorage.removeItem('query_crime_save');
                          window.location.reload();
                        }
                      }}
                      className="w-full bg-red-950/20 border border-red-500/30 hover:border-red-500/60 text-red-400 py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1 uppercase transition-colors"
                    >
                      <RefreshCw size={11} />
                      WIPE PROGRESS & RELOAD
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer branding */}
          <div className="text-[9px] text-amber-500/30 border-t border-amber-500/10 pt-3 text-center tracking-wider">
            SANDBOX ENVIRONMENT DETECTED // AUTHORIZED ONLY
          </div>
        </div>
      )}
    </>
  );
};
