import React from 'react';
import { Globe } from 'lucide-react';

interface BrowserScreenProps {
  currentLevel: any;
  setAppState: (state: any) => void;
}

export const BrowserScreen: React.FC<BrowserScreenProps> = ({ currentLevel, setAppState }) => {
  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <Globe size={16} /> <span>POLICE BROWSER</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-[#1b2118]">
        <div className="border-b-2 border-[#1b2118]/30 pb-2 mb-4 flex items-center justify-between">
           <div className="text-[10px] font-bold uppercase">SECURE CONNECTION: ACTIVE</div>
           <div className="text-[10px] font-bold uppercase opacity-40">MCD-77-PRAS-PROXY</div>
        </div>
        
        {currentLevel.id === 6 ? (
          <div className="font-mono text-[#1b2118] leading-relaxed select-none animate-in fade-in duration-500">
            <div className="border-2 border-[#1b2118] p-4 bg-[#1b2118]/5 mb-6 shadow-[4px_4px_0_0_#1b2118]">
              <div className="font-bold text-center text-sm mb-1 uppercase">DIGITAL ARCHIVE - NATIONAL INDEX SYSTEM</div>
              <div className="text-[9px] text-center opacity-60 uppercase font-bold">ARSIP DIGITAL NASIONAL KEPOLISIAN RI</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase flex items-center gap-2">
                  <span>▶</span> ARTICLES (News Article Index)
                </div>
                <div className="text-[10px] pl-4 opacity-70">
                  Status: ONLINE | Connected to primary database.
                  <br />
                  Query table: <code className="bg-[#1b2118]/10 px-1 font-bold">articles</code> (Columns: <code className="bg-[#1b2118]/10 px-1">id</code>, <code className="bg-[#1b2118]/10 px-1">title</code>, <code className="bg-[#1b2118]/10 px-1">content</code>, <code className="bg-[#1b2118]/10 px-1">publish_date</code>)
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase flex items-center gap-2">
                  <span>▶</span> PUBLIC RECORDS (National Public Archives)
                </div>
                <div className="text-[10px] pl-4 opacity-40">
                  Status: SECURED BY LAW-77 | Restricted access.
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase flex items-center gap-2">
                  <span>▶</span> NEWS (Press Release Archives)
                </div>
                <div className="text-[10px] pl-4 opacity-40">
                  Status: SECURED BY LAW-77 | Restricted access.
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase flex items-center gap-2">
                  <span>▶</span> ANNOUNCEMENTS (Official Announcement Archives)
                </div>
                <div className="text-[10px] pl-4 opacity-40">
                  Status: SECURED BY LAW-77 | Restricted access.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-dashed border-[#1b2118]/20 text-[10px] italic opacity-80 uppercase font-bold text-center">
              "All news has been indexed to the Police Database. Use the SQL Terminal in the Police Database menu to perform detailed searches."
            </div>
          </div>
        ) : currentLevel.web ? Object.entries(currentLevel.web).map(([url, content]: [string, any], idx) => (
          <div key={idx} className="mb-8 animate-in fade-in duration-700">
             <div className="bg-gray-100 p-2 text-[10px] font-bold border-l-4 border-black mb-2">{url}</div>
             <div className="text-xs leading-relaxed whitespace-pre-wrap font-mono">{content}</div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <Globe size={48} className="mb-4" />
             <div className="text-sm font-bold">NO WEB ASSETS FOUND</div>
             <div className="text-[10px]">Case files do not include external web references.</div>
          </div>
        )}
      </div>
    </div>
  );
};
