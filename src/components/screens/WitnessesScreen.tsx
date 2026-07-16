import React from 'react';
import { Mic, Phone, MessageSquare, Volume2, Shield } from 'lucide-react';

interface WitnessesScreenProps {
  witnesses: any[];
  handleCall: (witness: any) => void;
  setAppState: (state: any) => void;
}

export const WitnessesScreen: React.FC<WitnessesScreenProps> = ({
  witnesses,
  handleCall,
  setAppState
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5 select-none">
      {/* Header */}
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center justify-between text-sm font-bold shrink-0">
        <div className="flex items-center gap-2">
          <Mic size={16} className="animate-pulse text-[#8cb07d]" />
          <span>WITNESS TESTIMONIES</span>
        </div>
        <div className="text-[9px] tracking-widest font-mono opacity-80 uppercase">
          SECURE AUDIT
        </div>
      </div>
      
      {/* List / Grid of Witness Testimonies */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {witnesses.length > 0 ? witnesses.map((witness, idx) => (
          <div 
            key={idx}
            className="bg-white/40 border-2 border-[#1b2118] rounded p-4 shadow-sm relative overflow-hidden"
          >
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 p-1 bg-[#1b2118] text-[#8cb07d] text-[8px] font-mono tracking-widest uppercase">
              RECORDED
            </div>

            {/* Witness Info */}
            <div className="flex items-start gap-3 mb-3 border-b border-[#1b2118]/10 pb-3">
              <div className="bg-[#1b2118] text-[#8cb07d] p-2 rounded-full">
                <Shield size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  {witness.name}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-mono font-bold">
                  {witness.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={10} /> {witness.phone}
                    </span>
                  )}
                  <span className="bg-[#1b2118]/10 text-[#1b2118] px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide">
                    STATUS: SECURED
                  </span>
                </div>
              </div>
            </div>

            {/* Transcript Area */}
            <div className="bg-white/60 border border-[#1b2118]/20 rounded p-3 relative">
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#8cb07d] mb-1.5">
                <Volume2 size={12} className="animate-pulse" />
                <span>TRANSCRIPT LOG // IMPORTANT CLUE:</span>
              </div>
              <p className="text-xs font-bold text-gray-800 leading-relaxed pl-1 border-l-2 border-[#8cb07d]">
                "{witness.statement || witness.clue || 'Keterangan saksi belum tercatat atau kosong.'}"
              </p>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] opacity-30 p-8 text-center">
             <Mic size={48} className="mb-4 text-[#1b2118]" />
             <div className="text-sm font-bold uppercase text-[#1b2118]">No Witnesses Interrogated</div>
             <div className="text-[10px] mt-2 leading-relaxed max-w-xs mx-auto">
               You haven't interviewed any witnesses yet. Identify targets through the database, then call them to record their statements.
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
