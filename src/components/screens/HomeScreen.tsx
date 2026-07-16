import React from 'react';

interface HomeScreenProps {
  playerName: string;
  formatDate: (date: Date) => string;
  currentTime: Date;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ playerName, formatDate, currentTime }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 relative">
      <h1 className="text-5xl font-bold mb-2 tracking-tighter text-center leading-none">QUERY</h1>
      <h1 className="text-5xl font-bold mb-2 tracking-tighter text-center leading-none">CRIME</h1>
      {playerName && (
        <div className="mt-4 bg-[#1b2118] text-[#8cb07d] px-3 py-1 font-bold text-xs animate-in fade-in slide-in-from-bottom-2 duration-500 uppercase tracking-widest">
          DET. {playerName}
        </div>
      )}
      <p className="text-xs mt-6 border-t-2 border-[#1b2118] pt-2">Police OS v1.0</p>
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-70 font-bold">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};
