import React from 'react';
import { Award, Zap, Trophy, Book } from 'lucide-react';
import { PlayerStats } from '../../types';

interface RankScreenProps {
  stats: PlayerStats;
  setAppState: (state: any) => void;
}

export const RankScreen: React.FC<RankScreenProps> = ({ stats, setAppState }) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5 font-sans">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Award size={16} /> <span>SERVICE RECORD & PROGRESS</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-left">
        <div className="bg-[#1b2118] text-[#8cb07d] p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#1b2118]/20">
          <Award size={48} className="mb-2" />
          <div className="text-[10px] font-mono tracking-widest opacity-60 uppercase mb-1">POLICE INVESTIGATION LOG</div>
          <div className="text-lg font-bold tracking-tighter uppercase text-[#a4c297]">ACTIVE DEPLOYMENT</div>
          <div className="mt-3 text-xs opacity-80 max-w-xs leading-relaxed">
            All system logs, database interactions, and retrieved case files are synchronized under the Department of Digital Investigations network.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Zap size={20} className="shrink-0 text-[#1b2118]" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Queries Executed</div>
                <div className="text-sm font-bold">{stats.queriesRun}</div>
             </div>
          </div>
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Trophy size={20} className="shrink-0 text-[#1b2118]" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Chapters Solved</div>
                <div className="text-sm font-bold">{stats.casesCompleted}</div>
             </div>
          </div>
          <div className="bg-white/40 border-2 border-[#1b2118] p-3 flex items-center gap-3">
             <Book size={20} className="shrink-0 text-[#1b2118]" />
             <div>
                <div className="text-[8px] font-bold opacity-50 uppercase">Assistance / Hints</div>
                <div className="text-sm font-bold">{stats.hintsUsed}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
