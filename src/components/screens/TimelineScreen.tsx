import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TimelineScreenProps {
  currentLevelId: number;
  setAppState: (state: any) => void;
  notebookContent: string;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ currentLevelId, setAppState, notebookContent }) => {
  const allEvents = [
    { time: '8 Years Ago', event: '8 Years Ago', condition: () => currentLevelId >= 6 && notebookContent.includes('Arunika') },
    { time: '8 Years Ago', event: 'Traffic Accident', condition: () => currentLevelId >= 6 && notebookContent.includes('Kecelakaan') },
    { time: '8 Years Ago', event: 'Rizky Survives', condition: () => currentLevelId >= 6 && notebookContent.includes('Rizky') },
    { time: '8 Years Ago', event: 'Driver Missing', condition: () => currentLevelId >= 6 && notebookContent.includes('Sopir') },
    { time: '8 Years Ago', event: 'PT Arunika Logistics menyalurkan dana rutin bulanan ke rekening terhapus (Unknown Account).', condition: () => currentLevelId >= 8 },
    { time: '08:00', event: 'Seseorang memarkir mobil B 1734 QAZ di RS.', condition: () => currentLevelId >= 1 },
    { time: '09:20', event: 'Budi Santoso terdeteksi masuk rumah sakit.', condition: () => currentLevelId >= 2 },
    { time: '09:24', event: 'Rudi Hartono terdeteksi masuk rumah sakit.', condition: () => currentLevelId >= 4 },
    { time: '11:20', event: 'Andi Prasetyo masuk area rumah sakit (Parkir).', condition: () => currentLevelId >= 3 },
    { time: '11:25', event: 'Kamera CAM-03 (Main Gate) mati selama 6 menit.', condition: () => currentLevelId >= 5 && notebookContent.includes('06 minutes') },
    { time: '11:31', event: 'Rizky Hidayat terdeteksi keluar dari lobby.', condition: () => currentLevelId >= 5 && notebookContent.includes('Data mulai banyak') },
    { time: '11:34', event: 'Mobil Andi (B 2841 PT) keluar dari area parkir.', condition: () => currentLevelId >= 4 }
  ];

  const events = allEvents.filter(e => e.condition());

  return (
    <div className="flex flex-col h-full bg-[#1b2118]/5">
      <div className="bg-[#1b2118] text-[#8cb07d] p-3 flex items-center gap-2 text-sm font-bold shrink-0">
        <TrendingUp size={16} /> <span>INVESTIGATION TIMELINE</span>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="relative border-l-4 border-[#1b2118] pl-6 ml-2 flex flex-col gap-8">
          {events.length > 0 ? events.map((ev, idx) => (
            <div key={idx} className="relative animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-[#1b2118] border-2 border-[#8cb07d]" />
              <div className="text-[10px] font-bold text-[#1b2118] opacity-60 mb-1">{ev.time}</div>
              <div className="bg-white/40 border-2 border-[#1b2118] p-3 shadow-[4px_4px_0_0_#1b2118]">
                <div className="text-xs font-bold uppercase leading-tight">{ev.event}</div>
              </div>
            </div>
          )) : (
             <div className="text-center py-20 opacity-30">
                <TrendingUp size={48} className="mx-auto mb-4" />
                <div className="text-sm font-bold">TIMELINE EMPTY</div>
                <div className="text-[10px]">Data will populate as case progresses.</div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
