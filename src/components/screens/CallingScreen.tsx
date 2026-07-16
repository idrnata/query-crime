import React from 'react';
import { Mic, PhoneOff } from 'lucide-react';

interface CallingScreenProps {
  callStatus: string;
  activeCallContact: any;
  callStep: number;
  handleHangUp: () => void;
}

export const CallingScreen: React.FC<CallingScreenProps> = ({
  callStatus,
  activeCallContact,
  callStep,
  handleHangUp
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118] text-[#8cb07d] p-8 items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full border-4 border-[#8cb07d] flex items-center justify-center mb-8 relative">
        <Mic size={48} className={callStatus === 'ACTIVE' ? 'animate-pulse text-[#8cb07d]' : 'animate-bounce'} />
        {callStatus === 'ACTIVE' && (
           <div className="absolute -inset-2 border-2 border-[#8cb07d] rounded-full animate-ping opacity-20" />
        )}
      </div>
      
      <div className="text-xl font-bold uppercase mb-2 tracking-tighter">{activeCallContact?.name || 'UNKNOWN'}</div>
      <div className="text-[10px] font-bold opacity-60 uppercase mb-8 tracking-widest">{callStatus}...</div>
      
      {callStatus === 'ACTIVE' && (
        <div className="bg-[#8cb07d]/10 border-2 border-[#8cb07d] p-6 w-full max-w-xs animate-in zoom-in-95 duration-500">
           <div className="text-xs font-bold leading-relaxed italic">
              {(() => {
                if (!activeCallContact) return "...";
                if (activeCallContact.id === 'raka') {
                  const scripts = [
                    "Detektif, apa ada perkembangan? Kami menunggu laporanmu.",
                    "Andi Prasetyo belum ditemukan. Cek terus database.",
                    "Fokus pada log parkir. Di sana kuncinya."
                  ];
                  return scripts[callStep % scripts.length];
                }
                if (activeCallContact.id === 'budi') {
                  return "Nomor yang Anda tuju sedang tidak aktif atau berada di luar jangkauan.";
                }
                return "Halo? Siapa ini? Saya sibuk.";
              })()}
           </div>
        </div>
      )}
      
      <button 
        onClick={handleHangUp}
        className="mt-12 bg-[#8cb07d] text-[#1b2118] p-4 rounded-full hover:bg-white hover:text-[#1b2118] active:scale-90 transition-all"
      >
        <PhoneOff size={24} />
      </button>
    </div>
  );
};
