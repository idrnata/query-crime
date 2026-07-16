import React from 'react';
import { Mail, ArrowRight, X, User, Calendar, ShieldAlert } from 'lucide-react';

interface InboxScreenProps {
  messages: any[];
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
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
    <div className="flex flex-col h-full bg-[#1b2118]/5 select-none relative">
      {/* Header */}
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center justify-between text-sm font-bold shrink-0">
        <div className="flex items-center gap-2">
          <Mail size={16} className="animate-pulse text-[#8cb07d]" />
          <span>POLICE SECURE MAIL TERMINAL</span>
        </div>
        <div className="text-[9px] tracking-widest font-mono opacity-80 uppercase">
          SECURE LOG
        </div>
      </div>

      {/* Message List (Full width and spacious) */}
      <div className="flex-1 overflow-y-auto p-4 bg-white/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between border-b border-[#1b2118]/20 pb-2 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1b2118]/60 flex items-center gap-2">
              <span>Inbox ({messages.length} messages)</span>
            </h2>
            <div className="text-[10px] font-mono text-[#1b2118]/50">
              User: DET. PRAS
            </div>
          </div>

          {messages.length > 0 ? (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
                className={`w-full text-left p-4 border-2 rounded transition-all duration-150 flex items-center gap-4 bg-white/75 hover:bg-white/95 shadow-sm hover:translate-y-[-1px] hover:shadow-md
                  ${!msg.read ? 'border-[#8cb07d]/60 border-l-[6px]' : 'border-[#1b2118]/20'}
                `}
              >
                <div className="bg-[#1b2118] text-[#8cb07d] p-2 rounded-full shrink-0">
                  <Mail size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-black uppercase text-gray-900 tracking-tight">
                      {msg.sender}
                    </span>
                    {!msg.read && (
                      <span className="text-[8px] font-black tracking-wider bg-[#8cb07d]/20 text-[#1b2118] px-1.5 py-0.5 rounded border border-[#8cb07d]">
                        NEW
                      </span>
                    )}
                    <span className="text-[9px] ml-auto font-mono text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="text-xs font-black text-gray-800 uppercase truncate">
                    {msg.subject}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate mt-1">
                    {msg.body}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
              <Mail size={48} className="text-[#1b2118] mb-4" />
              <div className="text-xs font-bold uppercase">Inbox is Empty</div>
            </div>
          )}
        </div>
      </div>

      {/* Spacious Message Popup / Modal */}
      {selectedMessage && (
        <div 
          className="absolute inset-0 bg-[#1b2118]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedMessageId(null)}
        >
          <div 
            className="bg-[#fcfdfa] border-3 border-[#1b2118] w-full max-w-2xl rounded shadow-2xl flex flex-col max-h-[90%] overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1b2118] text-[#8cb07d] px-4 py-3 flex items-center justify-between border-b border-[#1b2118]">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                <span className="text-xs font-black tracking-wider uppercase font-mono">MESSAGE LOG PREVIEW</span>
              </div>
              <button 
                onClick={() => setSelectedMessageId(null)}
                className="text-[#8cb07d] hover:text-white p-1 rounded-sm transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Email Metadata */}
            <div className="bg-[#1b2118]/5 px-5 py-4 border-b border-[#1b2118]/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <User size={13} className="text-[#1b2118]/60" />
                <span className="uppercase text-[10px] opacity-60">FROM:</span>
                <span className="text-gray-900 font-extrabold uppercase">{selectedMessage.sender}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <User size={13} className="text-[#1b2118]/60" />
                <span className="uppercase text-[10px] opacity-60">TO:</span>
                <span className="text-gray-900 font-extrabold">DET. PRAS // SECURE WORKSTATION</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <Calendar size={13} className="text-[#1b2118]/60" />
                <span className="uppercase text-[10px] opacity-60">DATE:</span>
                <span className="text-gray-900 font-mono font-extrabold">{selectedMessage.timestamp}</span>
              </div>
              <div className="pt-2">
                <h3 className="text-sm font-black text-gray-900 uppercase border-t border-[#1b2118]/10 pt-2">
                  {selectedMessage.subject}
                </h3>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="text-xs font-bold text-gray-800 leading-relaxed whitespace-pre-wrap select-text">
                {selectedMessage.body}
              </div>
            </div>

            {/* Modal Footer / Action Button */}
            <div className="p-4 bg-[#1b2118]/5 border-t border-[#1b2118]/20 flex gap-2 shrink-0">
              {selectedMessage.id === `initial_${currentLevel.id}` && !hasAcceptedMission ? (
                <button 
                  onClick={() => {
                    setHasAcceptedMission(true);
                    setSelectedMessageId(null);
                    setAppState('MENU');
                  }}
                  className="w-full bg-[#1b2118] text-[#8cb07d] py-3.5 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#252c21] transition-all"
                >
                  TERIMA MISI INI <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedMessageId(null)}
                  className="w-full bg-[#1b2118] text-[#8cb07d] py-3 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#252c21] transition-all"
                >
                  KEMBALI KE INBOX
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
