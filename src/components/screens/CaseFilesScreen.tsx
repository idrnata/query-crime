import React from 'react';
import { Folder } from 'lucide-react';

interface CaseFilesScreenProps {
  currentLevel: any;
  currentObjectiveIndex: number;
  setAppState: (state: any) => void;
}

export const CaseFilesScreen: React.FC<CaseFilesScreenProps> = ({
  currentLevel,
  currentObjectiveIndex,
  setAppState
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-bold flex items-center justify-between border-b-2 border-[#1b2118] p-2 shrink-0 bg-[#1b2118] text-[#8cb07d]">
         <span>CASE FILES</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
        <div className="font-bold mb-1 text-lg leading-tight uppercase">{currentLevel.title}</div>
        <div className="text-xs mb-4 border-b border-[#1b2118]/30 pb-2 flex gap-2">
           <span className="opacity-60 uppercase">Status:</span>
           <span className="bg-[#1b2118] text-[#8cb07d] px-1 font-bold uppercase">ACTIVE</span>
        </div>
        
        <div className="mb-6">
          <div className="font-bold border-b border-[#1b2118]/50 mb-2 uppercase text-xs opacity-60">Case Summary</div>
          <div className="whitespace-pre-wrap text-sm leading-tight font-bold">
            {currentLevel.files.content}
          </div>
        </div>

        <div className="mb-6">
          <div className="font-bold border-b border-[#1b2118]/50 mb-2 uppercase text-xs opacity-60">Objectives</div>
          <div className="flex flex-col gap-3">
            {currentLevel.objectives
              .filter((_: any, idx: number) => idx <= currentObjectiveIndex)
              .map((obj: any, idx: number) => {
                const isCompleted = idx < currentObjectiveIndex;
                return (
                  <div key={obj.id} className={`flex items-start gap-3 ${isCompleted ? 'opacity-40' : ''}`}>
                    <div className="mt-0.5 w-4 h-4 border-2 border-[#1b2118] flex items-center justify-center shrink-0">
                      {isCompleted && <div className="w-2 h-2 bg-[#1b2118]" />}
                    </div>
                    <span className={`leading-tight font-bold text-sm uppercase ${isCompleted ? 'line-through' : ''}`}>
                      {obj.story || obj.goal}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
