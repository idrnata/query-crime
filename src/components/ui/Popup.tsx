import React from 'react';
import { Mail } from 'lucide-react';

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ title, message, onClose }) => {
  return (
    <div className="absolute inset-0 bg-[#1b2118]/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#8cb07d] border-4 border-[#1b2118] w-full max-w-sm flex flex-col shadow-[8px_8px_0_0_#1b2118]">
        <div className="bg-[#1b2118] text-[#8cb07d] p-2 font-bold text-sm uppercase flex items-center gap-2">
           <Mail size={16} /> {title}
        </div>
        <div className="p-4 font-bold text-sm whitespace-pre-wrap leading-relaxed">
           {message}
        </div>
        <button 
          onClick={onClose}
          className="m-4 mt-0 border-2 border-[#1b2118] py-2 font-bold hover:bg-[#1b2118]/10 active:bg-[#1b2118] active:text-[#8cb07d]"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
