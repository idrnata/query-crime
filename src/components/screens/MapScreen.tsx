import React from 'react';
import { Map as MapIcon } from 'lucide-react';

interface MapScreenProps {
  setAppState: (state: any) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ setAppState }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <MapIcon size={16} /> <span>TACTICAL MAP VIEW</span>
      </div>
      
      <div className="flex-1 bg-[#1b2118] relative overflow-hidden flex items-center justify-center">
        {/* Simple grid lines to look like a map */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#8cb07d 1px, transparent 1px), linear-gradient(90deg, #8cb07d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#8cb07d 1px, transparent 1px), linear-gradient(90deg, #8cb07d 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
        
        <div className="relative text-center z-10 p-8">
           <div className="w-16 h-16 border-4 border-[#8cb07d] rounded-full mx-auto mb-4 animate-ping absolute left-1/2 -translate-x-1/2" />
           <div className="w-4 h-4 bg-[#8cb07d] rounded-full mx-auto mb-4 relative z-20" />
           <div className="bg-[#8cb07d] text-[#1b2118] px-3 py-1 font-bold text-[10px] uppercase animate-pulse">Target Last Location</div>
           <div className="mt-2 text-[#8cb07d] text-[10px] font-bold uppercase tracking-widest">RS HARAPAN BANGSA AREA</div>
        </div>

        <div className="absolute bottom-4 right-4 bg-[#1b2118] border-2 border-[#8cb07d] p-2 text-[#8cb07d] text-[8px] font-bold uppercase">
           GPS: 6.1751° S, 106.8272° E
        </div>
      </div>
    </div>
  );
};
