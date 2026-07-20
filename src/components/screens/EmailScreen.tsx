import React from 'react';
import { Mail, Trash2, Paperclip, MailOpen } from 'lucide-react';

interface EmailScreenProps {
  setAppState: (state: any) => void;
  onBrowseTable: (tableName: string) => void;
}

export const EmailScreen: React.FC<EmailScreenProps> = ({ setAppState, onBrowseTable }) => {
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

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button 
          onClick={() => onBrowseTable('emails')}
          className="flex items-center gap-2 bg-[#8cb07d]/10 p-3 border border-[#8cb07d]/30 hover:bg-[#8cb07d]/20 transition-colors group text-left"
        >
          <Mail size={16} className="group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-[10px] uppercase opacity-60">Archive</div>
            <div className="text-xs font-bold uppercase">Inbox</div>
          </div>
        </button>
        <button 
          onClick={() => onBrowseTable('deleted')}
          className="flex items-center gap-2 bg-[#8cb07d]/10 p-3 border border-[#8cb07d]/30 hover:bg-[#8cb07d]/20 transition-colors group text-left"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-[10px] uppercase opacity-60">Recovered</div>
            <div className="text-xs font-bold uppercase">Deleted</div>
          </div>
        </button>
        <button 
          onClick={() => onBrowseTable('attachments')}
          className="flex items-center gap-2 bg-[#8cb07d]/10 p-3 border border-[#8cb07d]/30 hover:bg-[#8cb07d]/20 transition-colors group text-left"
        >
          <Paperclip size={16} className="group-hover:scale-110 transition-transform" />
          <div>
            <div className="text-[10px] uppercase opacity-60">Files</div>
            <div className="text-xs font-bold uppercase">Attachments</div>
          </div>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border border-[#8cb07d]/10 bg-[#8cb07d]/2 p-8 text-center rounded-sm">
        <MailOpen size={36} className="opacity-40 mb-3" />
        <p className="text-xs opacity-60 max-w-xs leading-relaxed uppercase">
          Select an archive category above to browse raw database records directly.
        </p>
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
