import React, { useState, useEffect } from 'react';
import { Map as MapIcon, ShieldAlert, Navigation, HelpCircle, Loader2 } from 'lucide-react';

interface MapScreenProps {
  currentLevelId: number;
  currentObjectiveIndex: number;
  isHackedMap: boolean;
  setAppState: (state: any) => void;
  onRebootDevice: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
  currentLevelId, 
  currentObjectiveIndex, 
  isHackedMap, 
  setAppState,
  onRebootDevice 
}) => {
  const [glitchText, setGlitchText] = useState('');
  const [showRebootConsole, setShowRebootConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Hacking sequence logic
  useEffect(() => {
    if (isHackedMap) {
      // Step 1: Draw red lines, shake screen, blink text
      let textTimer = setTimeout(() => {
        setGlitchText('YOU ARE LOOKING AT THE WRONG DESTINATION');
      }, 800);

      // Step 2: Trigger reboot console
      let consoleTimer = setTimeout(() => {
        setShowRebootConsole(true);
        addLog('CRITICAL_BREACH: REMOTE CORE EXECUTABLE INJECTED');
        addLog('SYS_OVERRIDE: PORT 3000 SECURITY RULES BYPASSED');
        addLog('IP_TRACE: SOURCE_LOCATION_UNKNOWN');
        addLog('SYS_CORRUPTION: CLEARING CACHE');
        addLog('SYS_FAIL: FORCE_REBOOT_INITIATED');
      }, 3500);

      // Step 3: Trigger device reboot in App.tsx
      let rebootTimer = setTimeout(() => {
        onRebootDevice();
      }, 6500);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(consoleTimer);
        clearTimeout(rebootTimer);
      };
    }
  }, [isHackedMap]);

  const addLog = (text: string) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${text}`]);
  };

  // If we are in Chapter 7, we render the GPS tracking map
  const isChapter7 = currentLevelId === 7;

  // Render rebooting screen
  if (showRebootConsole) {
    return (
      <div className="flex flex-col h-full bg-black text-red-500 font-mono p-4 text-xs select-none">
        <div className="flex items-center gap-2 text-red-500 font-bold border-b border-red-900 pb-2 mb-2 animate-pulse">
          <ShieldAlert size={16} /> <span>DEVICE BREACH / FORCE SHUTDOWN</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {consoleLogs.map((log, index) => (
            <div key={index} className="tracking-wider">{log}</div>
          ))}
          <div className="pt-4 flex items-center gap-2 text-red-600 animate-pulse font-bold">
            <Loader2 className="animate-spin" size={14} />
            <span>REBOOTING POLICE TERMINAL ENGINE...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full select-none ${isHackedMap ? 'animate-shake bg-red-950/20' : ''}`}>
      {/* Header */}
      <div className={`p-3 flex items-center justify-between text-sm font-bold shrink-0 transition-colors duration-300
        ${isHackedMap ? 'bg-red-950 text-red-500 border-b border-red-500' : 'bg-[#1b2118] text-[#8cb07d]'}`}>
        <div className="flex items-center gap-2">
          <MapIcon size={16} className={isHackedMap ? 'animate-spin' : ''} />
          <span>{isHackedMap ? 'CRITICAL SYSTEM TAMPER' : 'TACTICAL MAP VIEW'}</span>
        </div>
        <div className="text-[10px] tracking-widest font-mono opacity-80">
          {isHackedMap ? 'BREACHED' : 'GPS ONLINE'}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-[#151a13] relative overflow-hidden flex flex-col items-center justify-center">
        {/* Simple grid lines to look like a map */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#8cb07d 1px, transparent 1px), linear-gradient(90deg, #8cb07d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#8cb07d 1px, transparent 1px), linear-gradient(90deg, #8cb07d 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

        {isChapter7 ? (
          <div className="absolute inset-0 w-full h-full p-4 flex flex-col justify-between">
            {/* Top Stats Banner */}
            <div className="bg-[#1b2118]/80 border border-[#8cb07d]/30 p-2 rounded text-[#8cb07d] text-[10px] font-mono flex justify-between z-10 backdrop-blur-sm">
              <div>DEVICE LOGS: ACTIVE</div>
              <div>PLATE TARGET: B 2841 PT</div>
            </div>

            {/* Custom SVG Drawing the Map Elements */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <svg className="w-full h-full min-h-[300px]" viewBox="0 0 500 450">
                {/* SVG grid coordinates */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#8cb07d" />
                  </marker>
                  <marker id="arrow-red" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                  </marker>
                </defs>

                {/* Normal route connections - Only visible if objective 3 (index >= 3) completed */}
                {currentObjectiveIndex >= 3 && !isHackedMap && (
                  <>
                    {/* Hospital -> SPBU */}
                    <line x1="120" y1="130" x2="380" y2="230" stroke="#8cb07d" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                    {/* SPBU -> Warehouse */}
                    <line x1="380" y1="230" x2="200" y2="350" stroke="#8cb07d" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                  </>
                )}

                {/* Corporate Vehicle Route - Only visible if objective 4 (index >= 4) completed */}
                {currentObjectiveIndex >= 4 && !isHackedMap && (
                  <>
                    {/* HQ -> Warehouse */}
                    <line x1="250" y1="50" x2="200" y2="350" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="215" y="190" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace" transform="rotate(-77 215 190)">
                      B 7710 XR Route
                    </text>
                  </>
                )}

                {/* Hacking Overlay Red Path */}
                {isHackedMap && (
                  <>
                    {/* Direct Hospital -> Warehouse -> Out of bounds ??? */}
                    <line x1="120" y1="130" x2="200" y2="350" stroke="#ef4444" strokeWidth="4" className="animate-pulse" markerEnd="url(#arrow-red)" />
                    <line x1="200" y1="350" x2="350" y2="420" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 5" className="animate-pulse" />
                    
                    <circle cx="350" cy="420" r="10" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
                    <circle cx="350" cy="420" r="4" fill="#ef4444" />
                    <text x="370" y="424" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace" className="animate-pulse">
                      ???
                    </text>
                  </>
                )}

                {/* Locations markers */}
                {/* 1. Hospital (id: 21) */}
                <g transform="translate(120, 130)">
                  <circle r="16" fill="#1b2118" stroke={isHackedMap ? '#ef4444' : '#8cb07d'} strokeWidth="2" />
                  <circle r="4" fill={isHackedMap ? '#ef4444' : '#8cb07d'} />
                  <text y="-22" textAnchor="middle" fill={isHackedMap ? '#ef4444' : '#8cb07d'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Hospital [ID: 21]
                  </text>
                  {currentObjectiveIndex >= 3 && (
                    <text y="24" textAnchor="middle" fill="#8cb07d" fontSize="8" fontFamily="monospace" opacity="0.8">
                      Start: 09:13
                    </text>
                  )}
                </g>

                {/* 2. Fuel Station (id: 71) */}
                <g transform="translate(380, 230)">
                  <circle r="16" fill="#1b2118" stroke={isHackedMap ? '#ef4444' : '#8cb07d'} strokeWidth="2" />
                  <circle r="4" fill={isHackedMap ? '#ef4444' : '#8cb07d'} />
                  <text y="-22" textAnchor="middle" fill={isHackedMap ? '#ef4444' : '#8cb07d'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Fuel Station [ID: 71]
                  </text>
                  {currentObjectiveIndex >= 3 && !isHackedMap && (
                    <g>
                      <rect x="-45" y="18" width="90" height="14" fill="#f59e0b" rx="2" />
                      <text y="28" textAnchor="middle" fill="#1b2118" fontSize="8" fontWeight="bold" fontFamily="monospace">
                        STOP: 57 MINUTES
                      </text>
                    </g>
                  )}
                </g>

                {/* 3. Arunika Warehouse (id: 56) */}
                <g transform="translate(200, 350)">
                  <circle r="18" fill="#1b2118" stroke={isHackedMap ? '#ef4444' : '#10b981'} strokeWidth="2" className="animate-pulse" />
                  <rect x="-6" y="-6" width="12" height="12" fill={isHackedMap ? '#ef4444' : '#10b981'} />
                  <text y="-25" textAnchor="middle" fill={isHackedMap ? '#ef4444' : '#10b981'} fontSize="12" fontWeight="bold" fontFamily="monospace">
                    Warehouse [ID: 56]
                  </text>
                  {currentObjectiveIndex >= 3 && (
                    <text y="28" textAnchor="middle" fill={isHackedMap ? '#ef4444' : '#10b981'} fontSize="8" fontFamily="monospace" opacity="0.9">
                      Arrived: 11:07
                    </text>
                  )}
                </g>

                {/* 4. Police HQ (id: 34) */}
                <g transform="translate(250, 50)">
                  <circle r="12" fill="#1b2118" stroke="#8cb07d" strokeWidth="1.5" />
                  <circle r="3" fill="#8cb07d" />
                  <text y="-18" textAnchor="middle" fill="#8cb07d" fontSize="10" fontFamily="monospace">
                    Police HQ [ID: 34]
                  </text>
                </g>
              </svg>
            </div>

            {/* Bottom Coordinates & Objective Helper */}
            <div className="bg-[#1b2118]/95 border border-[#8cb07d]/40 p-2.5 rounded text-[#8cb07d] text-[10px] font-mono leading-relaxed mt-auto z-10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 font-bold mb-0.5 text-xs">
                <Navigation size={12} className="animate-pulse" />
                <span>GPS STATUS REPORT:</span>
              </div>
              {currentObjectiveIndex === 0 && (
                <div>• Cari ID lokasi dari Arunika Warehouse terlebih dahulu melalui Database Locations.</div>
              )}
              {currentObjectiveIndex === 1 && (
                <div>• ID Gudang ditemukan: 56. Sekarang cari kendaraan paling terakhir yang mengunjungi gudang di routes.</div>
              )}
              {currentObjectiveIndex === 2 && (
                <div>• Kendaraan teridentifikasi: B 2841 PT (Mobil Andi). Lacak semua data perjalanan mobil itu di routes.</div>
              )}
              {currentObjectiveIndex === 3 && (
                <div>• Menampilkan rute perjalanan Andi. Mengapa berhenti di SPBU 57 menit? Sangat mencurigakan. Cari kendaraan lain yang juga mengunjungi gudang ini.</div>
              )}
              {currentObjectiveIndex >= 4 && !isHackedMap && (
                <div className="text-amber-400 font-bold animate-pulse">• Semua data rute berhasil disusun! Tekan BACK di bagian bawah untuk menyusun laporan penyelidikan.</div>
              )}
              {isHackedMap && (
                <div className="text-red-500 font-bold animate-glitch">• WARNING: EXTERNAL OVERRIDE DETECTED. DEVICE INTEGRITY COMPROMISED!</div>
              )}
            </div>
          </div>
        ) : (
          /* Fallback view for older levels (just in case they open it, though it unlocks in level 7) */
          <div className="relative text-center z-10 p-8">
            <div className="w-16 h-16 border-4 border-[#8cb07d] rounded-full mx-auto mb-4 animate-ping absolute left-1/2 -translate-x-1/2" />
            <div className="w-4 h-4 bg-[#8cb07d] rounded-full mx-auto mb-4 relative z-20" />
            <div className="bg-[#8cb07d] text-[#1b2118] px-3 py-1 font-bold text-[10px] uppercase animate-pulse">Target Last Location</div>
            <div className="mt-2 text-[#8cb07d] text-[10px] font-bold uppercase tracking-widest">RS HARAPAN BANGSA AREA</div>
          </div>
        )}

        {/* Hacking Glitch Text Overlay */}
        {isHackedMap && glitchText && (
          <div className="absolute inset-0 bg-red-950/85 z-40 flex items-center justify-center p-6 text-center">
            <div className="font-mono text-lg md:text-xl font-black text-red-500 tracking-tight leading-snug animate-glitch drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)]">
              {glitchText}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-[#1b2118] border-2 border-[#8cb07d] p-1.5 text-[#8cb07d] text-[8px] font-bold uppercase font-mono z-20">
          GPS: 6.1751° S, 106.8272° E
        </div>
      </div>
    </div>
  );
};
