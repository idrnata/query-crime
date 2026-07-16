import React from 'react';
import { Mic, ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Mic size={16} /> <span>WITNESS TESTIMONIES</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {witnesses.length > 0 ? witnesses.map((witness, idx) => (
          <button
            key={idx}
            onClick={() => handleCall(witness)}
            className="w-full text-left p-4 border-b-2 border-[#1b2118]/10 hover:bg-white/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold uppercase">{witness.name}</div>
              <div className="text-[10px] opacity-60 uppercase font-bold">Witness Statement Available</div>
            </div>
            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )) : (
          <div className="flex flex-col items-center justify-center h-full opacity-30 p-8 text-center">
             <Mic size={48} className="mb-4" />
             <div className="text-sm font-bold uppercase">No Witnesses Found</div>
             <div className="text-[10px] mt-2 leading-relaxed">Continue your investigation to identify and interview key witnesses.</div>
          </div>
        )}
      </div>
    </div>
  );
};
