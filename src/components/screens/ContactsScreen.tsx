import React from 'react';
import { Users, ArrowRight } from 'lucide-react';

interface ContactsScreenProps {
  contacts: any[];
  handleCall: (contact: any) => void;
  setAppState: (state: any) => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({
  contacts,
  handleCall,
  setAppState
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Users size={16} /> <span>CENTRAL CONTACTS</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact, idx) => (
          <button
            key={idx}
            onClick={() => handleCall(contact)}
            className="w-full text-left p-4 border-b-2 border-[#1b2118]/10 hover:bg-white/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold uppercase">{contact.name}</div>
              <div className="text-[10px] opacity-60 uppercase font-bold">{contact.role}</div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-bold text-[#1b2118]">CONNECT</span>
               <ArrowRight size={14} className="text-[#1b2118]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
