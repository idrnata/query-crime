import React from 'react';
import { AppState } from '../../types';
import { Sliders } from 'lucide-react';

interface MenuScreenProps {
  unlockedApps: string[];
  blinkingApps: string[];
  ALL_APPS: any[];
  clearBlink: (id: string) => void;
  setAppState: (state: AppState) => void;
  onAppLaunch?: (id: string) => void;
  hasUnreadInbox?: boolean;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ 
  unlockedApps, 
  blinkingApps, 
  ALL_APPS, 
  clearBlink, 
  setAppState,
  onAppLaunch,
  hasUnreadInbox
}) => {
  const isDev = typeof window !== 'undefined' && (
    window.location.hostname.includes('dev-') || 
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') ||
    window.location.search.includes('dev=true')
  );

  const displayApps = [
    ...unlockedApps.map(id => ALL_APPS.find(a => a.id === id)).filter((a): a is any => !!a),
    ...ALL_APPS.filter(app => !unlockedApps.includes(app.id))
  ];

  if (isDev) {
    displayApps.push({
      id: 'DEV_CONSOLE',
      label: 'Dev Console',
      icon: Sliders
    });
  }

  return (
    <div className="flex flex-col h-full p-2 overflow-y-auto hide-scrollbar">
      <div className="text-base font-bold text-center border-b-2 border-[#1b2118] pb-2 mb-4 uppercase">Main Menu</div>
      <div className="grid grid-cols-3 gap-3 p-2">
        {displayApps.map((app) => {
          const Icon = app.icon;
          const isDevApp = app.id === 'DEV_CONSOLE';
          const isUnlocked = isDevApp ? true : unlockedApps.includes(app.id);
          const isBlinking = isDevApp 
            ? false 
            : (app.id === 'INBOX' ? (hasUnreadInbox ?? blinkingApps.includes(app.id)) : blinkingApps.includes(app.id));
          
          return (
            <button 
              key={app.id} 
              disabled={!isUnlocked}
              onClick={() => {
                if (!isDevApp) clearBlink(app.id);
                if (onAppLaunch && !isDevApp) onAppLaunch(app.id);
                setAppState(app.id as AppState);
              }}
              className={`flex flex-col items-center justify-center p-3 gap-2 rounded border-2 transition-all cursor-pointer
                ${isUnlocked 
                  ? 'border-transparent active:border-[#1b2118] active:bg-[#1b2118] active:text-[#8cb07d]' 
                  : 'border-transparent opacity-30 cursor-not-allowed'}
                ${isBlinking && isUnlocked ? 'animate-pulse bg-[#1b2118]/20' : ''}
                ${isDevApp ? 'bg-[#1b2118]/10 text-amber-700 active:text-amber-400 active:bg-[#1b2118]' : ''}
              `}
            >
              <div className="relative">
                <Icon size={32} />
                {isBlinking && isUnlocked && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-[#1b2118] animate-ping" />
                )}
              </div>
              <span className="text-[10px] leading-tight text-center font-bold uppercase">
                {isUnlocked ? app.label : 'LOCKED'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
