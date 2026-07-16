import React from 'react';
import { Database, ArrowRight, Terminal, Lock } from 'lucide-react';

interface DBListScreenProps {
  currentLevel: any;
  currentLevelId: number;
  setActiveTable: (table: string) => void;
  setAppState: (state: any) => void;
  handleBrowseTable: (table: string) => void;
  hasAcceptedMission: boolean;
  showSupervisorPopup: (msg: string) => void;
  currentObjectiveIndex: number;
}

export const DBListScreen: React.FC<DBListScreenProps> = ({
  currentLevel,
  currentLevelId,
  setActiveTable,
  setAppState,
  handleBrowseTable,
  hasAcceptedMission,
  showSupervisorPopup,
  currentObjectiveIndex
}) => {
  const tableNames = ['Vehicles', 'Owners', 'Parking Logs', 'Citizens', 'Visitors', 'Patients', 'Hospital Parking', 'Cameras', 'Footage', 'Articles', 'Companies'];

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-bold flex items-center justify-between border-b-2 border-[#1b2118] p-2 shrink-0 bg-[#1b2118] text-[#8cb07d]">
         <span>POLICE DATABASE</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              if (!hasAcceptedMission) {
                showSupervisorPopup('Please accept the mission from the Inbox first.');
                return;
              }
              setAppState('TERM');
              setActiveTable('ALL');
            }}
            className="border-2 border-[#1b2118] p-4 text-left text-sm font-bold bg-[#1b2118] text-[#8cb07d] flex justify-between items-center shadow-[4px_4px_0px_0px_#1b2118]"
          >
            <div className="flex items-center gap-2">
              <Terminal size={18} />
              <span>SQL TERMINAL</span>
            </div>
            <ArrowRight size={18} />
          </button>

          <div className="h-4"></div>

          {tableNames.map(t => {
            const isLocked = (t === 'Citizens' && currentLevelId < 2) || 
                             ((t === 'Visitors' || t === 'Patients') && currentLevelId < 2) ||
                             (t === 'Hospital Parking' && currentLevelId < 3) ||
                             ((t === 'Cameras' || t === 'Footage') && currentLevelId < 5) ||
                             (t === 'Articles' && currentLevelId < 6) ||
                             (t === 'Companies' && (currentLevelId < 6 || currentObjectiveIndex < 3));
            
            const tableName = t.toLowerCase().replace(/\s+/g, '_');
            const exists = currentLevel.database[tableName] !== undefined;
            if (!exists && !isLocked) return null;

            return isLocked ? (
              <div key={t} className="border-2 border-[#1b2118]/30 p-4 text-left text-sm font-bold opacity-40 flex justify-between items-center">
                <span>{t}</span> <Lock size={16} />
              </div>
            ) : (
              <button 
                key={t}
                onClick={() => {
                  if (!hasAcceptedMission) {
                    showSupervisorPopup('Please accept the mission from the Inbox first.');
                    return;
                  }
                  setActiveTable(tableName);
                  handleBrowseTable(tableName);
                }} 
                className="border-2 border-[#1b2118] p-4 text-left text-sm font-bold active:bg-[#1b2118] active:text-[#8cb07d] flex justify-between items-center bg-[#1b2118]/5 hover:bg-[#1b2118]/10"
              >
                <span>{t}</span>
                <ArrowRight size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
