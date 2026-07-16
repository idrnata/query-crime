import React from 'react';
import { Settings, Save, RotateCcw, AlertCircle } from 'lucide-react';

interface SettingsScreenProps {
  stats: any;
  setAppState: (state: any) => void;
  handleSaveGame: () => void;
  handleResetGame: () => void;
  handleChargeBattery: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  stats,
  setAppState,
  handleSaveGame,
  handleResetGame,
  handleChargeBattery
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
          <div className="text-[10px] font-bold uppercase opacity-50">Danger Zone</div>
          <button 
            onClick={handleResetGame}
            className="w-full bg-[#1b2118]/5 border-2 border-[#1b2118] p-4 flex items-center gap-3 font-bold text-[#1b2118] hover:bg-[#1b2118] hover:text-[#8cb07d] transition-all"
          >
             <RotateCcw size={20} />
             <div className="text-left">
                <div className="text-sm">CLEAR ALL DATA</div>
                <div className="text-[8px] opacity-60 uppercase">Reset investigation progress</div>
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
