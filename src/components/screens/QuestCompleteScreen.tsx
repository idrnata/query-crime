import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

interface QuestCompleteScreenProps {
  currentLevel: any;
  handleNextLevel: () => void;
}

export const QuestCompleteScreen: React.FC<QuestCompleteScreenProps> = ({
  currentLevel,
  handleNextLevel
}) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#1b2118] text-[#8cb07d]">
      <div className="w-20 h-20 border-4 border-[#8cb07d] flex items-center justify-center mb-6 animate-bounce">
        <Award size={48} />
      </div>
      <h2 className="text-2xl font-bold mb-4 tracking-tighter uppercase">Quest Complete</h2>
      <div className="w-full bg-[#8cb07d]/20 p-6 border-2 border-[#8cb07d] mb-8 animate-in zoom-in-95 duration-500">
        <div className="text-xs font-bold leading-relaxed whitespace-pre-wrap uppercase">
          {currentLevel.report.conclusion}
        </div>
      </div>
      <button 
        onClick={handleNextLevel}
        className="w-full bg-[#8cb07d] text-[#1b2118] py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors"
      >
        NEXT CHAPTER <ArrowRight size={20} />
      </button>
    </div>
  );
};
