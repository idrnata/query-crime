import React from 'react';
import { Mail, Trash2, Paperclip, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface EmailScreenProps {
  setAppState: (state: any) => void;
}

export const EmailScreen: React.FC<EmailScreenProps> = ({ setAppState }) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118] text-[#8cb07d] font-mono p-4">
      <div className="flex items-center justify-between border-b border-[#8cb07d]/30 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Mail size={18} />
          <span className="text-sm font-bold tracking-tighter uppercase">Police Mail Archive</span>
        </div>
        <div className="flex gap-4 text-[10px] font-bold opacity-60">
          <span>SECURE_NODE: 811</span>
          <span className="text-red-500 animate-pulse">RAKA_OFFLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={() => setAppState('TERM')}
          className="flex items-center gap-2 bg-[#8cb07d]/10 p-3 border border-[#8cb07d]/30 hover:bg-[#8cb07d]/20 transition-colors group text-left"
        >
          <Mail size={16} className="group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-[10px] uppercase opacity-60">Archive</div>
            <div className="text-xs font-bold uppercase">Inbox</div>
          </div>
        </button>
        <button 
          onClick={() => setAppState('TERM')}
          className="flex items-center gap-2 bg-[#8cb07d]/10 p-3 border border-[#8cb07d]/30 hover:bg-[#8cb07d]/20 transition-colors group text-left"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-[10px] uppercase opacity-60">Recovered</div>
            <div className="text-xs font-bold uppercase">Deleted</div>
          </div>
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-auto custom-scrollbar">
        <div className="bg-[#8cb07d]/5 border border-[#8cb07d]/20 p-3 relative overflow-hidden">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold bg-[#8cb07d] text-[#1b2118] px-1">URGENT</span>
            <span className="text-[9px] opacity-40">2018-08-14 14:00</span>
          </div>
          <div className="text-xs font-bold mb-1 truncate text-[#e5e7eb]">Jika sesuatu terjadi pada saya...</div>
          <div className="text-[10px] opacity-60 line-clamp-2">Jangan percaya pada sistem ini. Seseorang di dalam membantu Arunika. [DATA_CORRUPTED]</div>
          <div className="mt-2 flex items-center gap-1 text-[9px] text-red-400 font-bold">
            <Trash2 size={10} />
            RECOVERED_FROM_DELETED
          </div>
        </div>

        <div className="bg-[#8cb07d]/5 border border-[#8cb07d]/10 p-3 opacity-60">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold opacity-40">ARCHIVE</span>
            <span className="text-[9px] opacity-40">2018-08-14 11:45</span>
          </div>
          <div className="text-xs font-bold mb-1 truncate">Re: Re: Arunika CCTV</div>
          <div className="text-[10px] opacity-60 line-clamp-1">Saya yakin seseorang menghapusnya dari server pusat...</div>
        </div>

        <div className="bg-[#8cb07d]/5 border border-[#8cb07d]/10 p-3 opacity-40">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold opacity-40">ARCHIVE</span>
            <span className="text-[9px] opacity-40">2018-08-14 09:00</span>
          </div>
          <div className="text-xs font-bold mb-1 truncate">Inquiry: Arunika CCTV</div>
          <div className="text-[10px] opacity-60 line-clamp-1">Saya membutuhkan seluruh CCTV di gerbang utama...</div>
          <div className="mt-2 flex items-center gap-1 text-[9px] text-[#8cb07d] font-bold">
            <Paperclip size={10} />
            warehouse_plan.pdf
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-[#8cb07d]/5 border border-[#8cb07d]/30 text-[10px] leading-relaxed">
        <div className="flex items-center gap-2 mb-2 text-[#8cb07d]">
          <Search size={12} />
          <span className="font-bold">SYSTEM NOTE:</span>
        </div>
        "Ikuti datanya. Gunakan <span className="text-white">WITH</span> untuk merekonstruksi thread yang terfragmentasi. Database Email ini sangat berantakan."
      </div>
      
      <button 
        onClick={() => setAppState('MENU')}
        className="mt-4 py-2 border border-[#8cb07d]/30 text-xs font-bold uppercase hover:bg-[#8cb07d]/10"
      >
        BACK TO HUB
      </button>
    </div>
  );
};
