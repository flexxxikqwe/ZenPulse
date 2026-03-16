import React from 'react';
import { Lock, Clock } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';

interface MeditationCardProps {
  meditation: Meditation;
  isSubscribed: boolean;
  onPress: (meditation: Meditation) => void;
  onOpenPaywall: () => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({ meditation, isSubscribed, onPress, onOpenPaywall }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isLocked = meditation.premiumRequired && !isSubscribed;

  return (
    <button
      onClick={() => isLocked ? onOpenPaywall() : onPress(meditation)}
      className="w-full group active:scale-[0.98] transition-all text-left mb-6"
    >
      <div className="relative w-full h-[160px] rounded-[28px] overflow-hidden shadow-sm mb-3">
        <img 
          src={`https://picsum.photos/seed/${meditation.id}/800/600`} 
          alt={meditation.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        
        {isLocked && (
          <div className={`absolute top-4 right-4 backdrop-blur-md p-2 rounded-full shadow-sm ${isDark ? 'bg-[#1A1D24]/90' : 'bg-white/90'}`}>
            <Lock size={14} className={isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'} />
          </div>
        )}

        <div className={`absolute bottom-4 left-4 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm ${isDark ? 'bg-[#1A1D24]/90' : 'bg-white/90'}`}>
          <Clock size={12} className={isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation.durationMinutes} min
          </span>
        </div>
      </div>
      
      <div className="px-2">
        <h3 className={`text-lg font-bold tracking-tight transition-colors ${isDark ? 'text-[#F3F4F6] group-hover:text-[#8B9CFF]' : 'text-[#111111] group-hover:text-[#5C6AC4]'}`}>
          {meditation.title}
        </h3>
        <p className={`text-xs font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
          {meditation.description}
        </p>
      </div>
    </button>
  );
};
