import React from 'react';
import { Signal, Battery } from 'lucide-react';
import { PlayerStats } from '../../types';

interface StatusBarProps {
  currentTime: Date;
  formatTime: (date: Date) => string;
  battery: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ currentTime, formatTime, battery }) => {
  return (
    <div className="w-full flex justify-between items-center px-3 py-1.5 text-xs font-bold border-b-2 border-[#1b2118] shrink-0 bg-[#8cb07d] z-20 shadow-sm">
      <div className="flex items-center gap-2">
        <Signal size={14} />
        <span className="font-bold">E</span>
      </div>
      <div className="flex items-center gap-2">
        <span>{formatTime(currentTime)}</span>
        <div className="flex items-center gap-0.5">
          <span className="text-[9px] mr-0.5">{battery}%</span>
          <Battery 
            size={16} 
            className={battery <= 25 ? 'text-red-700 animate-pulse' : ''} 
          />
        </div>
      </div>
    </div>
  );
};
