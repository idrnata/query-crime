import React, { useState } from 'react';
import { Mic, PhoneOff, MessageSquare } from 'lucide-react';

interface CallingScreenProps {
  callStatus: string;
  activeCallContact: any;
  callStep: number;
  handleHangUp: () => void;
}

const DINA_DIALOGUE = [
  {
    text: "Halo? Siapa ini? Ada yang bisa saya bantu?",
    choices: [
      {
        text: "Halo Dina, saya Detektif kepolisian. Saya ingin bertanya tentang Budi Santoso.",
        nextStep: 1
      },
      {
        text: "Ini dari tim investigasi kepolisian. Kami sedang melacak keberadaan Budi Santoso.",
        nextStep: 1
      }
    ]
  },
  {
    text: "Oh, kakak saya Budi! Iya betul, saya Dina adiknya. Ada apa ya, Pak? Dia sudah tiga hari tidak pulang ke rumah dan teleponnya sama sekali tidak aktif. Saya khawatir sekali...",
    choices: [
      {
        text: "Kami menemukan mobilnya ditinggalkan di sebuah area parkir. Kapan terakhir kali Anda berkomunikasi dengannya?",
        nextStep: 2
      },
      {
        text: "Kami mendatangi rumahnya dan pintunya tidak dikunci. Di mana dia berada terakhir kali?",
        nextStep: 2
      }
    ]
  },
  {
    text: "Tiga hari yang lalu, sebelum dia pergi, dia bilang ingin menjenguk teman lamanya yang sedang dirawat di RS Harapan Bangsa. Katanya teman lama, tapi dia tidak sebut namanya.",
    choices: [
      {
        text: "RS Harapan Bangsa? Baiklah, kami akan segera melacak ke sana. Siapa nama teman lamanya?",
        nextStep: 3
      },
      {
        text: "Terima kasih banyak atas petunjuk ini, Dina. Kami akan memeriksa catatan rumah sakit tersebut.",
        nextStep: 3
      }
    ]
  },
  {
    text: "Dia tidak menyebutkan namanya, hanya bilang teman lamanya sedang dirawat di sana. Tolong temukan kakak saya ya, Pak... Dia orang baik.",
    choices: [
      {
        text: "Pasti. Tetap tenang Dina, kami akan memberi tahu jika ada perkembangan terbaru. [TUTUP TELEPON]",
        nextStep: -1
      }
    ]
  }
];

const RAKA_ENDING_DIALOGUE = [
  {
    text: "Saya rasa kita tidak lagi menyelidiki orang hilang.",
    choices: [
      {
        text: "Maksud Anda?",
        nextStep: 1
      }
    ]
  },
  {
    text: "Kita sedang menyelidiki seseorang yang bisa menghapus sejarah.",
    choices: [
      {
        text: "...",
        nextStep: -1
      }
    ]
  }
];

const RAKA_CH12_DIALOGUE = [
  {
    text: "...Ini aku. Maaf baru bisa kontak lagi sekarang.",
    choices: [
      { text: "Kamu di mana? Kamu baik-baik saja?", nextStep: 1 },
      { text: "Aku menemukan siapa yang membuka akses untuk mobil Arunika di HQ.", nextStep: 1 }
    ]
  },
  {
    text: "Aku aman. Untuk sekarang. Badge B-118... Yusuf, staf administrasi. Dia bukan dalangnya — dia cuma disuruh, atau dibayar, atau diancam. Aku belum tahu yang mana.",
    choices: [
      { text: "Jadi siapa yang sebenarnya mengendalikan semua ini?", nextStep: 2 },
      { text: "Apa yang harus kita lakukan sekarang?", nextStep: 2 }
    ]
  },
  {
    text: "Aku tidak tahu. Belum. Tapi kamu baru saja membuktikan sesuatu yang penting: kamu bisa menemukan orang yang tidak ingin ditemukan. Itu bukan kemampuan yang kupunya delapan tahun lalu. Istirahatlah dulu. Kasus ini belum selesai — tapi untuk malam ini, cukup.",
    choices: [
      { text: "...Baik, Pak.", nextStep: -1 }
    ]
  }
];

export const CallingScreen: React.FC<CallingScreenProps> = ({
  callStatus,
  activeCallContact,
  callStep,
  handleHangUp
}) => {
  const [dinaStep, setDinaStep] = useState(0);
  const [rakaStep, setRakaStep] = useState(0);
  const [ch12Step, setCh12Step] = useState(0);

  const isDina = activeCallContact?.id === 'dina';
  const isRakaEnding = activeCallContact?.id === 'raka' && callStep === 666; // Use special code for ending Ch6
  const isRakaCh12 = activeCallContact?.id === 'raka' && callStep === 1212; // Special code for Ch12

  const handleChoiceSelect = (nextStep: number) => {
    if (nextStep === -1) {
      handleHangUp();
    } else {
      if (isDina) setDinaStep(nextStep);
      if (isRakaEnding) setRakaStep(nextStep);
      if (isRakaCh12) setCh12Step(nextStep);
    }
  };

  const currentDialogueList = isDina ? DINA_DIALOGUE : isRakaEnding ? RAKA_ENDING_DIALOGUE : isRakaCh12 ? RAKA_CH12_DIALOGUE : null;
  const currentDialogueStep = isDina ? dinaStep : isRakaEnding ? rakaStep : isRakaCh12 ? ch12Step : 0;

  return (
    <div className="flex flex-col h-full bg-[#1b2118] text-[#8cb07d] p-6 items-center justify-between text-center overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md my-auto">
        <div className="w-20 h-20 rounded-full border-4 border-[#8cb07d] flex items-center justify-center mb-6 relative shrink-0">
          <Mic size={36} className={callStatus === 'ACTIVE' ? 'animate-pulse text-[#8cb07d]' : 'animate-bounce'} />
          {callStatus === 'ACTIVE' && (
             <div className="absolute -inset-2 border-2 border-[#8cb07d] rounded-full animate-ping opacity-20" />
          )}
        </div>
        
        <div className="text-lg font-bold uppercase mb-1 tracking-tighter shrink-0">{activeCallContact?.name || 'UNKNOWN'}</div>
        <div className="text-[9px] font-bold opacity-60 uppercase mb-6 tracking-widest shrink-0">{callStatus}...</div>
        
        {callStatus === 'ACTIVE' && (
          <div className="w-full flex flex-col gap-4">
            {/* Dialogue Bubble */}
            <div className="bg-[#8cb07d]/10 border-2 border-[#8cb07d] p-5 w-full rounded-lg text-left animate-in zoom-in-95 duration-300">
               <div className="text-xs font-semibold leading-relaxed italic text-[#8cb07d]">
                   {(() => {
                    if (!activeCallContact) return "...";
                    if (isDina) {
                      return DINA_DIALOGUE[dinaStep]?.text || "...";
                    }
                    if (isRakaEnding) {
                      return RAKA_ENDING_DIALOGUE[rakaStep]?.text || "...";
                    }
                    if (isRakaCh12) {
                      return RAKA_CH12_DIALOGUE[ch12Step]?.text || "...";
                    }
                    if (activeCallContact.id === 'raka') {
                      const scripts = [
                        "Detektif, apa ada perkembangan? Kami menunggu laporanmu.",
                        "Andi Prasetyo belum ditemukan. Cek terus database.",
                        "Fokus pada log parkir. Di sana kuncinya."
                      ];
                      return scripts[callStep % scripts.length];
                    }
                    if (activeCallContact.id === 'budi') {
                      return "Nomor yang Anda tuju sedang tidak aktif atau berada di luar jangkauan.";
                    }
                    return "Halo? Siapa ini? Saya sibuk.";
                  })()}
               </div>
            </div>

            {/* Conversation Choices / Dialogue Options */}
            {(currentDialogueList && currentDialogueList[currentDialogueStep]) && (
              <div className="flex flex-col gap-2 mt-2 w-full text-left animate-in fade-in-50 duration-500">
                <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1 flex items-center gap-1.5 px-1">
                  <MessageSquare size={10} /> SELECT DIALOGUE:
                </div>
                {currentDialogueList[currentDialogueStep].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceSelect(choice.nextStep)}
                    className="w-full text-left p-3 bg-[#1b2118] border border-[#8cb07d]/40 rounded hover:bg-[#8cb07d]/10 hover:border-[#8cb07d] transition-all text-xs font-bold text-[#8cb07d] active:scale-[0.98]"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <button 
        onClick={handleHangUp}
        className="mt-6 bg-[#8cb07d] text-[#1b2118] p-3.5 rounded-full hover:bg-white hover:text-[#1b2118] active:scale-90 transition-all shrink-0 shadow-lg"
      >
        <PhoneOff size={20} />
      </button>
    </div>

  );
};
