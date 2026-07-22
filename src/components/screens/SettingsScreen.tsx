import React from 'react';
import { Settings, Save, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';

interface SettingsScreenProps {
  stats: any;
  setAppState: (state: any) => void;
  handleSaveGame: () => void;
  handleResetGame: () => void;
  handleChargeBattery: () => void;
  levels: any[];
  currentLevelId: number;
  unlockedLevelIds: number[];
  onJumpToChapter: (chapterId: number) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  stats,
  setAppState,
  handleSaveGame,
  handleResetGame,
  handleChargeBattery,
  levels,
  currentLevelId,
  unlockedLevelIds,
  onJumpToChapter
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Settings size={16} /> <span>SYSTEM CONFIGURATION</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold uppercase opacity-50">Power Management</div>
          <button 
            onClick={handleChargeBattery}
            className="w-full bg-white/40 border-2 border-[#1b2118] p-4 flex items-center gap-3 font-bold hover:bg-[#1b2118] hover:text-[#8cb07d] transition-all group"
          >
             <div className="bg-[#1b2118] p-1.5 text-[#8cb07d] group-hover:bg-[#8cb07d] group-hover:text-[#1b2118]">
               <Settings size={20} />
             </div>
             <div className="text-left">
                <div className="text-sm">CHARGE BATTERY</div>
                <div className="text-[8px] opacity-60 uppercase">Restore device power to 100%</div>
             </div>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold uppercase opacity-50">Local Storage</div>
          <button 
            onClick={handleSaveGame}
            className="w-full bg-white/40 border-2 border-[#1b2118] p-4 flex items-center gap-3 font-bold hover:bg-[#1b2118] hover:text-[#8cb07d] transition-all group"
          >
             <Save size={20} className="group-hover:animate-bounce" />
             <div className="text-left">
                <div className="text-sm">MANUAL SAVE</div>
                <div className="text-[8px] opacity-60 uppercase">Store progress in browser</div>
             </div>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold uppercase opacity-50">Reset / Replay Chapter</div>
          <div className="bg-white/30 border-2 border-[#1b2118] p-3 flex flex-col gap-2">
            <div className="text-[10px] opacity-80 mb-1 font-sans">
              Select an unlocked chapter below to restart it from the beginning.
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {levels.map((lvl) => {
                const isUnlocked = unlockedLevelIds.includes(lvl.id);
                const isCurrent = lvl.id === currentLevelId;
                
                return (
                  <button
                    key={lvl.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (confirm(`Are you sure you want to restart CH ${lvl.id}: ${lvl.title}? Progress for this chapter will be reset.`)) {
                        onJumpToChapter(lvl.id);
                      }
                    }}
                    className={`text-left p-2 border text-xs font-bold transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#1b2118] text-[#8cb07d] border-[#1b2118]'
                        : isUnlocked
                        ? 'bg-white/50 hover:bg-[#1b2118] hover:text-[#8cb07d] text-[#1b2118] border-[#1b2118]'
                        : 'bg-[#1b2118]/5 text-[#1b2118]/30 border-[#1b2118]/20 cursor-not-allowed'
                    }`}
                  >
                    <div className="truncate pr-2">
                      CH {lvl.id}: {lvl.title}
                    </div>
                    <div className="shrink-0">
                      {isCurrent ? (
                        <span className="text-[8px] bg-[#8cb07d] text-[#1b2118] px-1 py-0.5 rounded font-mono uppercase font-black">Active</span>
                      ) : isUnlocked ? (
                        <span className="text-[8px] border border-[#1b2118] px-1 py-0.5 rounded font-mono uppercase opacity-75 flex items-center gap-1">
                          <RefreshCw size={8} /> REPLAY
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono uppercase opacity-40">Locked</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold uppercase opacity-50">Danger Zone</div>
          <button 
            onClick={handleResetGame}
            className="w-full bg-[#1b2118]/5 border-2 border-[#1b2118] p-4 flex items-center gap-3 font-bold text-[#1b2118] hover:bg-[#1b2118] hover:text-[#8cb07d] transition-all"
          >
             <RotateCcw size={20} />
             <div className="text-left">
                <div className="text-sm">FORMAT DATA</div>
                <div className="text-[8px] opacity-60 uppercase">Format device & reset all progress</div>
             </div>
          </button>
        </div>

        <div className="mt-auto bg-[#1b2118] text-[#8cb07d] p-4 border-l-4 border-[#8cb07d]">
           <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} />
              <div className="text-xs font-bold uppercase">Device Security</div>
           </div>
           <div className="text-[10px] leading-relaxed opacity-80 italic">
              "This terminal is property of the Minor Crime Division. Unauthorized access is strictly prohibited and subject to legal action."
           </div>
        </div>
      </div>
    </div>
  );
};
