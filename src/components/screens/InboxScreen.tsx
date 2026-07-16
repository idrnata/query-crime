import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface InboxScreenProps {
  messages: any[];
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string) => void;
  setAppState: (state: any) => void;
  currentLevel: any;
  hasAcceptedMission: boolean;
  setHasAcceptedMission: (val: boolean) => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({
  messages,
  selectedMessageId,
  setSelectedMessageId,
  setAppState,
  currentLevel,
  hasAcceptedMission,
  setHasAcceptedMission
}) => {
  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Message List */}
        <div className="w-full md:w-1/3 border-r-2 border-[#1b2118] overflow-y-auto bg-white/20">
          <div className="p-2 text-[10px] font-bold border-b-2 border-[#1b2118] bg-[#1b2118] text-[#8cb07d]">INBOX</div>
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessageId(msg.id)}
              className={`w-full text-left p-3 border-b border-[#1b2118]/10 hover:bg-white/40 transition-colors
                ${selectedMessageId === msg.id ? 'bg-[#1b2118] text-[#8cb07d]' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <Mail size={12} />
                {!msg.read && <span className="text-[8px] font-black tracking-wider bg-[#1b2118] text-[#8cb07d] px-1 py-0.5 rounded-sm">NEW</span>}
                <span className="text-[10px] font-bold uppercase truncate">{msg.sender}</span>
                <span className="text-[8px] ml-auto opacity-60">{msg.timestamp}</span>
              </div>
              <div className="text-[10px] font-bold truncate">{msg.subject}</div>
            </button>
          ))}
        </div>
        
        {/* Message Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-white/40">
          {selectedMessage ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col gap-1 border-b-2 border-[#1b2118] pb-4 mb-4">
                <div className="text-[10px] uppercase font-bold opacity-60">From: {selectedMessage.sender}</div>
                <div className="text-[10px] uppercase font-bold opacity-60">To: DET. PRAS</div>
                <h2 className="text-sm font-bold mt-2 uppercase">{selectedMessage.subject}</h2>
              </div>
              <div className="text-xs font-bold leading-relaxed whitespace-pre-wrap">
                {selectedMessage.body}
              </div>
              
              {selectedMessage.id === `initial_${currentLevel.id}` && !hasAcceptedMission && (
                <button 
                  onClick={() => {
                    setHasAcceptedMission(true);
                    setAppState('MENU');
                  }}
                  className="mt-8 w-full bg-[#1b2118] text-[#8cb07d] py-3 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  ACCEPT MISSION <ArrowRight size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <Mail size={48} />
              <div className="text-[10px] font-bold uppercase mt-4">Select a message to read</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
