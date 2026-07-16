import React from 'react';
import { AppState } from '../../types';

interface MenuScreenProps {
  unlockedApps: string[];
  blinkingApps: string[];
  ALL_APPS: any[];
  clearBlink: (id: string) => void;
  setAppState: (state: AppState) => void;
  onAppLaunch?: (id: string) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ 
  unlockedApps, 
  blinkingApps, 
  ALL_APPS, 
  clearBlink, 
  setAppState,
  onAppLaunch
}) => {
  return (
    <div className="flex flex-col h-full p-2 overflow-y-auto hide-scrollbar">
      <div className="text-base font-bold text-center border-b-2 border-[#1b2118] pb-2 mb-4 uppercase">Main Menu</div>
      <div className="grid grid-cols-3 gap-3 p-2">
        {[
          ...unlockedApps.map(id => ALL_APPS.find(a => a.id === id)).filter((a): a is any => !!a),
          ...ALL_APPS.filter(app => !unlockedApps.includes(app.id))
        ].map((app) => {
          const Icon = app.icon;
          const isUnlocked = unlockedApps.includes(app.id);
          const isBlinking = blinkingApps.includes(app.id);
          
          return (
            <button 
              key={app.id} 
              disabled={!isUnlocked}
              onClick={() => {
                clearBlink(app.id);
                if (onAppLaunch) onAppLaunch(app.id);
                setAppState(app.id as AppState);
              }}
              className={`flex flex-col items-center justify-center p-3 gap-2 rounded border-2 transition-all
                ${isUnlocked 
                  ? 'border-transparent active:border-[#1b2118] active:bg-[#1b2118] active:text-[#8cb07d]' 
                  : 'border-transparent opacity-30 cursor-not-allowed'}
                ${isBlinking && isUnlocked ? 'animate-pulse bg-[#1b2118]/20' : ''}
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
