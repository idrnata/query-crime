import React from 'react';
import { Terminal, CornerDownLeft, Delete } from 'lucide-react';

interface TerminalScreenProps {
  activeTable: string;
  currentObjective: any;
  queryString: string;
  setQueryString: React.Dispatch<React.SetStateAction<string>>;
  handleRunQuery: () => void;
  handleDeleteWord: () => void;
  currentLevelId: number;
  unlockedLevelIds: number[];
  currentLevel: any;
}

export const TerminalScreen: React.FC<TerminalScreenProps> = ({
  activeTable,
  currentObjective,
  queryString,
  setQueryString,
  handleRunQuery,
  handleDeleteWord,
  currentLevelId,
  unlockedLevelIds,
  currentLevel
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-bold flex items-center justify-between border-b-2 border-[#1b2118] p-2 shrink-0 bg-[#1b2118] text-[#8cb07d]">
         <span>SQL TERMINAL</span>
      </div>
      
      <div className="bg-[#1b2118] text-[#8cb07d] px-4 py-2 text-xs font-bold shrink-0 border-b border-[#1b2118]">
         Connection: SECURE // Table: {activeTable || 'ALL'}
      </div>
      
      <div className="bg-[#1b2118]/10 text-[#1b2118] p-3 text-[10px] font-bold border-b-2 border-[#1b2118] shrink-0">
        <div className="opacity-70 uppercase mb-1">Current Objective:</div>
        <div className="uppercase">{currentObjective.story || currentObjective.goal}</div>
      </div>

      <div className="flex-1 flex flex-col p-4 bg-[#1b2118]/5">
        <div className="mb-2 flex items-center gap-2 font-bold text-xs">
          <Terminal size={14} /> <span>Query Input:</span>
        </div>
        <textarea
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          className="w-full h-32 bg-transparent border-2 border-[#1b2118] p-3 text-[16px] font-bold focus:outline-none focus:bg-[#7a996d] resize-none"
          placeholder="SELECT * FROM..."
        />
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleRunQuery}
            className="flex-[2] bg-[#1b2118] text-[#8cb07d] font-bold py-3 flex items-center justify-center active:bg-transparent active:text-[#1b2118] border-2 border-[#1b2118] transition-colors"
            title="Execute Query (Enter)"
          >
            <CornerDownLeft size={20} />
          </button>
          <button 
            onClick={handleDeleteWord}
            className="flex-1 bg-transparent text-[#1b2118] font-bold py-3 flex items-center justify-center active:bg-[#1b2118] active:text-[#8cb07d] border-2 border-[#1b2118] transition-colors"
            title="Delete Word (Backspace)"
          >
            <Delete size={20} />
          </button>
        </div>

        <div className="mt-6 text-xs font-bold mb-2 opacity-70">Shorthands:</div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-wrap gap-2 content-start pb-4">
          {(() => {
            const baseKeywords = ['SELECT', '*', 'FROM', 'WHERE', '=', '>', '<', 'AND', 'OR', 'IS', 'NULL', 'ORDER', 'BY', 'ASC', 'DESC', ',', '.'];
            if (currentLevelId > 1 || unlockedLevelIds.includes(2)) {
              baseKeywords.push('JOIN', 'ON');
            }
            if (currentLevelId >= 4) {
              baseKeywords.push('BETWEEN');
            }
            if (currentLevelId >= 5) {
              baseKeywords.push('LEFT', 'JOIN');
            }
            if (currentLevelId >= 6) {
              baseKeywords.push('LIKE', '%');
            }
            if (currentLevelId >= 7) {
              baseKeywords.push('LIMIT');
            }
            if (currentLevelId >= 8) {
              baseKeywords.push('GROUP', 'HAVING', 'COUNT');
            }
            if (currentLevelId >= 10) {
              baseKeywords.push('WITH', 'AS');
            }
            if (currentLevelId >= 11) {
              baseKeywords.push('OVER', 'ROW_NUMBER', 'LEAD', 'LAG');
            }
            
            const tables = Object.keys(currentLevel.database);
            const columns = new Set<string>();
            tables.forEach(t => {
              if (currentLevel.database[t] && currentLevel.database[t].length > 0) {
                Object.keys(currentLevel.database[t][0]).forEach(c => columns.add(c));
              }
            });

            const values = currentObjective.availableTokens.filter(t => t.startsWith("'") || t.startsWith('"') || !isNaN(Number(t)));
            const allShorthands = Array.from(new Set([...baseKeywords, ...tables, ...Array.from(columns), ...values]));

            return allShorthands.map((token, idx) => (
              <button
                key={idx}
                onClick={() => setQueryString(prev => (prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + token))}
                className="border border-[#1b2118] px-2 py-1 active:bg-[#1b2118] active:text-[#8cb07d] text-xs font-bold bg-[#8cb07d]"
              >
                {token}
              </button>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};
