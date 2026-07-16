import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorScreenProps {
  setAppState: (state: any) => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ setAppState }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#1b2118] text-[#8cb07d]">
      <AlertCircle size={64} className="mb-6 animate-pulse" />
      <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">System Error</h2>
      <p className="text-xs font-bold opacity-80 mb-8 uppercase tracking-widest">Unauthorized access or data corruption detected.</p>
      <button 
        onClick={() => setAppState('BOOT')}
        className="w-full bg-[#8cb07d] text-[#1b2118] py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-[#1b2118] transition-colors"
      >
        REBOOT SYSTEM <RotateCcw size={20} />
      </button>
    </div>
  );
};
