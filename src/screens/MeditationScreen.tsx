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
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* SafeAreaView Simulation */}
      <div className="pt-14 px-5 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Today's Meditation</h1>
          <p className="text-zinc-500 text-lg font-medium">Choose a session.</p>
        </div>
        <button 
          onClick={onOpenMood}
          className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm active:scale-95 transition-all"
        >
          <Sparkles size={24} />
        </button>
      </div>

      {/* FlatList Simulation */}
      <div className="px-5 space-y-4 mb-12">
        {meditations.map((item) => {
          const isLocked = item.locked && !isSubscribed;
          
          return (
            <button
              key={item.id}
              onClick={() => isLocked ? onOpenPaywall() : console.log('Playing:', item.title)}
              className={`relative w-full h-[140px] rounded-3xl overflow-hidden shadow-lg transition-all active:scale-95 text-left group
                ${isLocked ? 'grayscale opacity-60' : ''}
              `}
            >
              {/* Background Image */}
              <img 
                src={`https://picsum.photos/seed/${item.title}/800/400`} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/90 text-sm font-semibold uppercase tracking-wider">
                      <Clock size={14} strokeWidth={2.5} />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                  
                  {isLocked && (
                    <div className="bg-white/20 backdrop-blur-xl p-2.5 rounded-full border border-white/20">
                      <Lock size={20} className="text-white" fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI Mood of the Day Section - Refactored to Button */}
      <div className="px-5 pb-10">
        <button
          onClick={onOpenMood}
          className="w-full p-6 rounded-3xl bg-zinc-900 text-white flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Sparkles size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold tracking-tight">AI Mood of the Day</h2>
              <p className="text-zinc-400 text-sm font-medium">Choose how you feel today.</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Sparkles size={18} className="text-white/50" />
          </div>
        </button>
      </div>
    </div>
  );
};
