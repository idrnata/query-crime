import React from 'react';
import { Users } from 'lucide-react';

interface NameInputProps {
  nameInput: string;
  setNameInput: (val: string) => void;
  onSubmit: () => void;
}

export const NameInput: React.FC<NameInputProps> = ({ nameInput, setNameInput, onSubmit }) => {
  return (
    <div className="absolute inset-0 bg-[#1b2118]/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#8cb07d] border-4 border-[#1b2118] w-full max-w-sm flex flex-col shadow-[8px_8px_0_0_#1b2118]">
        <div className="bg-[#1b2118] text-[#8cb07d] p-2 font-bold text-sm uppercase flex items-center gap-2">
           <Users size={16} /> ENTER IDENTITY
        </div>
        <div className="p-4 flex flex-col gap-4">
           <div className="text-xs font-bold uppercase opacity-60">IDENTIFICATION REQUIRED TO PROCEED</div>
           <input 
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value.toUpperCase())}
              placeholder="YOUR NAME..."
              className="bg-transparent border-2 border-[#1b2118] p-3 text-[16px] font-bold focus:outline-none placeholder:opacity-30"
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
           />
        </div>
        <button 
          onClick={onSubmit}
          className="m-4 mt-0 bg-[#1b2118] text-[#8cb07d] py-3 font-bold hover:bg-[#1b2118]/90 active:scale-95 transition-transform"
        >
          CONFIRM IDENTITY
        </button>
      </div>
    </div>
  );
};
