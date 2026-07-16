import React from 'react';

export const BootScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-3xl font-bold animate-pulse tracking-tighter">POLICE MOBILE</div>
      <div className="text-3xl font-bold animate-pulse tracking-tighter mb-4">TERMINAL</div>
      <div className="text-base">Version 1.0</div>
      <div className="text-xs mt-6 opacity-80">Loading...</div>
    </div>
  );
};
