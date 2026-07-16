import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ReportScreenProps {
  currentLevel: any;
  handleAnswer: (idx: number) => void;
  setAppState: (state: any) => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  currentLevel,
  handleAnswer,
  setAppState
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <AlertCircle size={16} /> <span>FINAL CASE REPORT</span>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white/40 border-4 border-[#1b2118] p-6 shadow-[8px_8px_0_0_#1b2118]">
          <h2 className="text-sm font-bold mb-6 uppercase leading-tight border-b-2 border-[#1b2118] pb-2">
            {currentLevel.report.question}
          </h2>
          
          <div className="flex flex-col gap-3">
            {currentLevel.report.options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 border-2 border-[#1b2118] font-bold text-xs hover:bg-[#1b2118] hover:text-[#8cb07d] active:translate-x-1 transition-all flex items-center justify-between group"
              >
                <span className="uppercase">{opt}</span>
                <CheckCircle size={14} className="opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
