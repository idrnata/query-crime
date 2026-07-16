import React from 'react';
import { Book } from 'lucide-react';

interface NotebookScreenProps {
  notebookContent: string;
  setNotebookContent: (val: string) => void;
  setAppState: (state: any) => void;
}

export const NotebookScreen: React.FC<NotebookScreenProps> = ({
  notebookContent,
  setNotebookContent,
  setAppState
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Book size={16} /> <span>DETECTIVE NOTEBOOK</span>
      </div>
      
      <div className="flex-1 p-4 bg-transparent flex flex-col">
        <div className="text-[10px] font-bold uppercase opacity-50 mb-2 border-b border-[#1b2118]/30 pb-1">Field Observations</div>
        <textarea
          value={notebookContent}
          onChange={(e) => setNotebookContent(e.target.value)}
          className="flex-1 bg-transparent border-none p-0 text-[16px] font-bold focus:outline-none resize-none leading-relaxed text-[#1b2118] placeholder:text-[#1b2118]/40"
          placeholder="Write down your findings or suspicions here..."
        />
        <div className="mt-4 pt-2 border-t-2 border-dashed border-[#1b2118]/30 text-[8px] font-bold opacity-40 uppercase">
          Confidential - Property of Minor Crime Division
        </div>
      </div>
    </div>
  );
};
