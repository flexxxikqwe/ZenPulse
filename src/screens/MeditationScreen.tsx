import React from 'react';
import { Lock, Clock, Sparkles } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { meditations } from '../data/meditations';

interface Props {
  onOpenPaywall: () => void;
  onOpenMood: () => void;
}

export const MeditationScreen = ({ onOpenPaywall, onOpenMood }: Props) => {
  const { isSubscribed } = useSubscription();

  return (
    <div className="flex flex-col min-h-screen premium-gradient pb-24 overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <div className="pt-16 px-6 mb-10 flex items-center justify-between">
        <div className="flex-1 pr-4">
          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">ZenPulse</h1>
          <p className="text-white/60 text-base font-medium">Find your inner peace</p>
        </div>
        <button 
          onClick={onOpenMood}
          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/10 shadow-lg active:scale-90 transition-all shrink-0 backdrop-blur-md"
          aria-label="Open Mood"
        >
          <Sparkles size={24} />
        </button>
      </div>

      {/* Section Title */}
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Today's Sessions</h2>
      </div>

      {/* Meditation Cards */}
      <div className="px-6 space-y-4 mb-12">
        {meditations.map((item) => {
          const isLocked = item.locked && !isSubscribed;
          
          return (
            <button
              key={item.id}
              onClick={() => isLocked ? onOpenPaywall() : console.log('Playing:', item.title)}
              className={`relative w-full h-[140px] rounded-[18px] overflow-hidden shadow-xl transition-all active:scale-[0.97] text-left group
                ${isLocked ? 'opacity-80' : ''}
              `}
            >
              {/* Background Image */}
              <img 
                src={`https://picsum.photos/seed/${item.title}/800/400`} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                      <Clock size={14} strokeWidth={2.5} />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20">
                      <Lock size={18} className="text-white/80" fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI Mood Section */}
      <div className="px-6">
        <button
          onClick={onOpenMood}
          className="w-full p-6 rounded-[24px] glass-card text-white flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Sparkles size={28} />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold tracking-tight">AI Mood Check</h2>
              <p className="text-white/50 text-sm font-medium">Personalized affirmations</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Sparkles size={18} className="text-primary/50" />
          </div>
        </button>
      </div>
    </div>
  );
};
