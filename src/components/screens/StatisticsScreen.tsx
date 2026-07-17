import React from 'react';
import { Award, Zap, Trophy, Target, MapPin } from 'lucide-react';
import { PlayerStats } from '../../types';

interface StatisticsScreenProps {
  stats: PlayerStats;
  isThreatMode?: boolean;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ stats, isThreatMode }) => {
  return (
    <div className="flex flex-col h-full bg-black text-[#8cb07d] font-mono p-6">
      <div className="mb-8 border-b border-[#8cb07d]/30 pb-4">
        <h1 className="text-xl font-bold tracking-widest">SYSTEM STATISTICS</h1>
        <p className="text-[10px] opacity-50 uppercase">Investigation Metadata Summary</p>
      </div>

      <div className="flex-1 flex flex-col gap-8 justify-center">
        <div className="flex items-center gap-6 animate-in slide-in-from-left duration-500">
          <Zap size={32} />
          <div>
            <div className="text-[10px] font-bold opacity-50">QUERIES EXECUTED</div>
            <div className="text-3xl font-bold">{isThreatMode ? '742' : stats.queriesRun}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 animate-in slide-in-from-left duration-700">
          <Trophy size={32} />
          <div>
            <div className="text-[10px] font-bold opacity-50">EVIDENCE COLLECTED</div>
            <div className="text-3xl font-bold">{isThreatMode ? '49' : '31'}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 animate-in slide-in-from-left duration-1000">
          <Target size={32} />
          <div>
            <div className="text-[10px] font-bold opacity-50">ANALYSIS ACCURACY</div>
            <div className="text-3xl font-bold">{isThreatMode ? '97%' : `${stats.accuracy}%`}</div>
          </div>
        </div>

        {isThreatMode && (
          <div className="mt-12 p-4 border-2 border-red-600 bg-red-900/20 text-red-500 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={20} />
              <span className="text-xs font-bold">YOUR CURRENT LOCATION</span>
            </div>
            <div className="text-2xl font-bold tracking-widest text-center">KNOWN</div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[#8cb07d]/30 text-[10px] opacity-30 text-center uppercase tracking-widest">
        {isThreatMode ? 'Remote Session Active - Authorized Personnel Only' : 'Internal Use Only'}
      </div>
    </div>
  );
};
