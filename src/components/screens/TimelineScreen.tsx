import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TimelineScreenProps {
  currentLevelId: number;
  setAppState: (state: any) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ currentLevelId, setAppState }) => {
  const events = [
    { time: '8 Years Ago', event: 'Kecelakaan lalu lintas tragis melibatkan PT Arunika Logistics.', level: 6 },
    { time: '8 Years Ago', event: 'Rizky Hidayat selamat, sopir truk menghilang misterius.', level: 6 },
    { time: '8 Years Ago', event: 'PT Arunika Logistics menyalurkan dana rutin bulanan ke rekening terhapus (Unknown Account).', level: 8 },
    { time: '08:00', event: 'Seseorang memarkir mobil B 1734 QAZ di RS.', level: 1 },
    { time: '09:20', event: 'Budi Santoso terdeteksi masuk rumah sakit.', level: 2 },
    { time: '09:24', event: 'Rudi Hartono terdeteksi masuk rumah sakit.', level: 4 },
    { time: '11:20', event: 'Andi Prasetyo masuk area rumah sakit (Parkir).', level: 3 },
    { time: '11:25', event: 'Kamera CAM-03 (Main Gate) mati selama 6 menit.', level: 5 },
    { time: '11:31', event: 'Rizky Hidayat terdeteksi keluar dari lobby.', level: 5 },
    { time: '11:34', event: 'Mobil Andi (B 2841 PT) keluar dari area parkir.', level: 4 }
  ].filter(e => e.level <= currentLevelId);

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
