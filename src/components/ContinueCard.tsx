import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { motion, useReducedMotion } from 'motion/react';
import { analytics } from '../services/analyticsService';

interface ContinueCardProps {
  meditation: Meditation;
  progressPercent: number;
  onPress: (meditation: Meditation) => void;
}

export const ContinueCard = React.memo(({ meditation, progressPercent, onPress }: ContinueCardProps) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      onClick={() => {
        analytics.trackEvent({ 
          name: 'continue_session_clicked', 
          properties: { meditationId: meditation.id } 
        });
        onPress(meditation);
      }}
      aria-label={`Resume ${meditation.title}. ${Math.round(progressPercent || 0)}% completed. Tap to continue.`}
      className={`w-full p-6 rounded-[32px] border flex items-center gap-6 transition-all shadow-sm group mb-10 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
        isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
      }`}
    >
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
        <img 
          src={`https://picsum.photos/seed/${meditation?.id || 'default'}/200/200`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play size={24} className="text-white fill-white" aria-hidden="true" />
          </motion.div>
        </div>
      </div>

      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'
          }`}>Continue Session</span>
        </div>
        <h3 className={`text-xl font-bold tracking-tight leading-tight mb-1 ${
          isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
        }`}>{meditation?.title || 'Untitled Session'}</h3>
        
        {meditation.instructor && (
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
            With {meditation.instructor}
          </p>
        )}
        
        <div className="flex items-center gap-4">
          <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
            isDark ? 'bg-white/5' : 'bg-black/5'
          }`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'}`}
            />
          </div>
          <span className={`text-xs font-bold tabular-nums ${
            isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
          }`}>{Math.round(progressPercent || 0)}%</span>
        </div>
      </div>
    </motion.button>
  );
});
