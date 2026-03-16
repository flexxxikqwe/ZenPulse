import React from 'react';
import { Sparkles, Play, Clock, Lock } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';

interface RecommendedMeditationCardProps {
  meditation: Meditation;
  isSubscribed: boolean;
  onPress: (meditation: Meditation) => void;
  onOpenPaywall: () => void;
}

export const RecommendedMeditationCard: React.FC<RecommendedMeditationCardProps> = ({ meditation, isSubscribed, onPress, onOpenPaywall }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isLocked = meditation.premiumRequired && !isSubscribed;

  return (
    <div className={`p-6 rounded-[32px] border mb-10 relative overflow-hidden shadow-sm ${
      isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
    }`}>
      {/* Background Accent */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${
        isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'
      }`} />

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
          <Sparkles size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Recommended</span>
        </div>
        {isLocked && <Lock size={16} className={isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} />}
      </div>

      <div className="mb-6">
        <h2 className={`text-2xl font-bold tracking-tight mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
          {meditation.title}
        </h2>
        <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
          {meditation.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={14} className={isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} />
          <span className={`text-xs font-bold ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation.durationMinutes} minutes
          </span>
        </div>

        <button
          onClick={() => isLocked ? onOpenPaywall() : onPress(meditation)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-all shadow-md ${
            isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
          }`}
        >
          <Play size={16} fill="currentColor" />
          Start Meditation
        </button>
      </div>
    </div>
  );
};
