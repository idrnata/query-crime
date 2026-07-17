import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';

interface ResultScreenProps {
  isBrowsing: boolean;
  activeTable: string;
  errorMessage: string;
  queryResult: any[] | null;
  setIsBrowsing: (val: boolean) => void;
  setAppState: (state: any) => void;
  isObjectiveMet: boolean;
  handleObjectiveComplete: () => void;
  hasNextObjective: boolean;
  isBrowsingTable: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  isBrowsing,
  activeTable,
  errorMessage,
  queryResult,
  setIsBrowsing,
  setAppState,
  isObjectiveMet,
  handleObjectiveComplete,
  hasNextObjective,
  isBrowsingTable
}) => {
  return (
    <div className="flex flex-col h-full">
      {isBrowsing ? (
        <div className="flex flex-col h-full">
           <div className="bg-[#1b2118] text-[#8cb07d] p-2 flex items-center gap-2 text-xs font-bold">
              <Globe size={14} /> <span>POLICE BROWSER - {activeTable || 'System'}</span>
           </div>
           <div className="flex-1 overflow-auto p-4 bg-white text-black font-mono text-[10px] leading-relaxed">
              <div className="mb-4 text-xs font-bold border-b border-black pb-1">DOCUMENT VIEW</div>
              {queryResult && queryResult.map((row, i) => (
                <div key={i} className="mb-6 pb-6 border-b border-black/10">
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(row).map(([key, val]) => (
                        <React.Fragment key={key}>
                          <div className="uppercase font-bold opacity-60">{key}:</div>
                          <div className="font-bold">{String(val)}</div>
                        </React.Fragment>
                      ))}
                   </div>
                </div>
              ))}
           </div>
           <button 
            onClick={() => setIsBrowsing(false)}
            className="m-4 bg-[#1b2118] text-[#8cb07d] py-3 font-bold uppercase text-xs"
          >
            Back to Grid
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="bg-[#1b2118] text-[#8cb07d] p-2 flex items-center justify-between text-xs font-bold">
            <span>QUERY RESULT</span>
            <span className="opacity-60">{queryResult?.length || 0} ROWS RETURNED</span>
          </div>
          
          <div className="flex-1 overflow-auto bg-[#1b2118]/5">
            {errorMessage ? (
              <div className="p-4 text-[#1b2118] font-bold text-xs bg-white/40 border-b-2 border-[#1b2118]">
                {errorMessage}
              </div>
            ) : queryResult && queryResult.length > 0 ? (
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full border-collapse">
                  <thead className="bg-[#1b2118] text-[#8cb07d]">
                    <tr>
                      {Object.keys(queryResult[0]).map(key => (
                        <th key={key} className="px-3 py-2 text-left text-[9px] uppercase font-bold border border-[#8cb07d]/20">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, i) => (
                      <tr key={i} className="border-b border-[#1b2118]/10 hover:bg-[#1b2118]/10 transition-colors">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-[10px] font-bold border border-[#1b2118]/10">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-40 p-8 text-center">
                <Database size={48} className="mb-4" />
                <div className="text-sm font-bold uppercase tracking-widest">No Results found</div>
                <div className="text-[10px] mt-2">The query returned an empty set or failed to match conditions.</div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/30 border-t-2 border-[#1b2118] flex flex-col gap-2">
            {isBrowsingTable && queryResult && queryResult.length > 0 && (
              <button 
                onClick={() => setIsBrowsing(true)}
                className="w-full bg-[#1b2118] text-[#8cb07d] py-3 font-bold uppercase text-xs flex items-center justify-center gap-2"
              >
                <Globe size={16} /> BROWSE DOCUMENT
              </button>
            )}
            
            {!isObjectiveMet && (
              <button 
                onClick={() => setAppState('TERM')}
                className="w-full bg-transparent text-[#1b2118] py-3 font-bold uppercase text-xs border-2 border-[#1b2118] hover:bg-[#1b2118] hover:text-[#8cb07d] transition-colors"
              >
                BACK TO TERMINAL
              </button>
            )}
            
            {isObjectiveMet && (
              <button 
                onClick={() => handleObjectiveComplete()}
                className="w-full bg-[#1b2118] text-[#8cb07d] py-3 font-bold uppercase text-xs flex items-center justify-center gap-2 animate-bounce mt-2 shadow-md hover:bg-[#8cb07d] hover:text-[#1b2118] transition-colors"
              >
                {hasNextObjective ? (
                  <>CONTINUE <ArrowRight size={16} /></>
                ) : (
                  <>CONTINUE <ArrowRight size={16} /></>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { Database } from 'lucide-react';
