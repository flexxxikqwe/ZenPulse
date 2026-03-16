import React from 'react';
import { Lock, Clock, Sparkles, User, Settings } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { meditations, Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onOpenPaywall: () => void;
  onOpenMood: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onSelectMeditation: (meditation: Meditation) => void;
}

export const MeditationScreen = ({ onOpenPaywall, onOpenMood, onOpenSettings, onOpenProfile, onSelectMeditation }: Props) => {
  const { isSubscribed } = useSubscription();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <div className={`flex flex-col min-h-screen pb-24 overflow-y-auto no-scrollbar transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}>
      {/* Header Section */}
      <div className="pt-16 px-8 mb-12 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight leading-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>ZenPulse</h1>
          <p className={`text-sm font-medium mt-1 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Breathe in the present moment</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className={`w-10 h-10 rounded-full flex items-center justify-center border active:scale-90 transition-all shadow-sm ${isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'}`}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onOpenProfile}
            className={`w-10 h-10 rounded-full flex items-center justify-center border active:scale-90 transition-all shadow-sm ${isDark ? 'bg-[#1A1D24] text-[#F3F4F6] border-white/5' : 'bg-white text-[#111111] border-black/5'}`}
            aria-label="Profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Daily Affirmation Quick Access */}
      <div className="px-8 mb-10">
        <button
          onClick={onOpenMood}
          className={`w-full p-6 rounded-[28px] border flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm group ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={24} />
          </div>
          <div className="text-left flex-1">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>AI Mood Check</h2>
            <p className={`text-xs font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Personalized guidance for today</p>
          </div>
        </button>
      </div>

      {/* Section Title */}
      <div className="px-8 mb-6 flex items-center justify-between">
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>Today's Sessions</h2>
        <button className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>View All</button>
      </div>

      {/* Meditation Cards */}
      <div className="px-8 space-y-6">
        {meditations.map((item) => {
          const isLocked = item.premiumRequired && !isSubscribed;
          
          return (
            <button
              key={item.id}
              onClick={() => isLocked ? onOpenPaywall() : onSelectMeditation(item)}
              className="w-full group active:scale-[0.98] transition-all text-left"
            >
              <div className="relative w-full h-[180px] rounded-[32px] overflow-hidden shadow-sm mb-3">
                <img 
                  src={`https://picsum.photos/seed/${item.id}/800/600`} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                
                {isLocked && (
                  <div className={`absolute top-4 right-4 backdrop-blur-md p-2 rounded-full shadow-sm ${isDark ? 'bg-[#1A1D24]/90' : 'bg-white/90'}`}>
                    <Lock size={14} className={isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'} />
                  </div>
                )}

                <div className={`absolute bottom-4 left-4 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm ${isDark ? 'bg-[#1A1D24]/90' : 'bg-white/90'}`}>
                  <Clock size={12} className={isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    {item.durationMinutes} min
                  </span>
                </div>
              </div>
              
              <div className="px-2">
                <h3 className={`text-lg font-bold tracking-tight transition-colors ${isDark ? 'text-[#F3F4F6] group-hover:text-[#8B9CFF]' : 'text-[#111111] group-hover:text-[#5C6AC4]'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>Guided Meditation • Mindfulness</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
