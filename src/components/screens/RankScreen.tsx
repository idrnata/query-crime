import React from 'react';
import { Award, Zap, Trophy, Target } from 'lucide-react';
import { PlayerStats } from '../../types';

interface RankScreenProps {
  stats: PlayerStats;
  setAppState: (state: any) => void;
}

export const RankScreen: React.FC<RankScreenProps> = ({ stats, setAppState }) => {
  const getRank = (xp: number) => {
    if (xp >= 4000) return 'CHIEF DIGITAL INVESTIGATOR';
    if (xp >= 3000) return 'LEAD INVESTIGATOR';
    if (xp >= 2000) return 'CHIEF DETECTIVE';
    if (xp >= 1000) return 'SENIOR INVESTIGATOR';
    if (xp >= 500) return 'INVESTIGATOR';
    if (xp >= 200) return 'DETECTIVE';
    return 'JUNIOR DETECTIVE';
  };

  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Award size={16} /> <span>SERVICE RECORD & STATISTICS</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div className="bg-[#1b2118] text-[#8cb07d] p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#1b2118]/20">
          <Award size={48} className="mb-2" />
          <div className="text-[10px] font-bold opacity-60 uppercase mb-1">Current Classification</div>
          <div className="text-xl font-bold tracking-tighter uppercase">{getRank(stats.xp)}</div>
          <div className="mt-4 w-full bg-[#8cb07d]/20 h-2 rounded-full overflow-hidden border border-[#8cb07d]/40">
             <div className="bg-[#8cb07d] h-full" style={{ width: `${Math.min(100, (stats.xp / 3000) * 100)}%` }} />
          </div>
          <div className="mt-2 text-[10px] font-bold uppercase">{stats.xp} / 3000 XP</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Zap size={20} className="shrink-0" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Queries</div>
                <div className="text-sm font-bold">{stats.queriesRun}</div>
             </div>
          </div>
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Target size={20} className="shrink-0" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Accuracy</div>
                <div className="text-sm font-bold">{stats.accuracy}%</div>
             </div>
          </div>
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Trophy size={20} className="shrink-0" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Solved</div>
                <div className="text-sm font-bold">{stats.casesCompleted}</div>
             </div>
          </div>
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Book size={20} className="shrink-0" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Hints</div>
                <div className="text-sm font-bold">{stats.hintsUsed}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Book } from 'lucide-react';
