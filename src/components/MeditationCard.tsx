import React from 'react';
import { Lock, Clock, Bookmark } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from './ToastProvider';
import { motion, useReducedMotion } from 'motion/react';
import { analytics } from '../services/analyticsService';

interface MeditationCardProps {
  meditation: Meditation;
  isSubscribed: boolean;
  onPress: (meditation: Meditation) => void;
  onOpenPaywall: () => void;
}

export const MeditationCard = React.memo(({ meditation, isSubscribed, onPress, onOpenPaywall }: MeditationCardProps) => {
  if (!meditation) return null;
  const { currentTheme } = useTheme();
  const { userProfile, toggleFavorite } = useUserProfile();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const isLocked = meditation.premiumRequired && !isSubscribed;
  const shouldReduceMotion = useReducedMotion();
  const isFavorite = (userProfile?.favoriteIds || []).includes(meditation.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(meditation.id);
    showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className="w-full group text-left mb-8 rounded-[32px] relative"
    >
      {/* Main Action Button */}
      <button
        onClick={() => onPress(meditation)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPress(meditation);
          }
        }}
        aria-label={`${isLocked ? 'Premium: ' : ''}${meditation.title}. ${meditation.durationMinutes} minutes. ${isLocked ? 'Tap to unlock' : 'Tap to play'}`}
        className="w-full text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-[32px] outline-none cursor-pointer"
      >
        <div className="relative w-full h-[180px] rounded-[32px] overflow-hidden shadow-sm mb-4">
          <motion.img 
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={`https://picsum.photos/seed/${meditation?.id || 'default'}/800/600`} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isLocked ? 'grayscale-[0.4] opacity-80' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className={`absolute bottom-5 left-5 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-lg border border-white/10 ${isDark ? 'bg-[#1A1D24]/80' : 'bg-white/80'}`}>
            <Clock size={12} className={isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} aria-hidden="true" />
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              {meditation?.durationMinutes || 10} min
            </span>
          </div>
        </div>
        
        <div className="px-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-[#F3F4F6] group-hover:text-[#8B9CFF]' : 'text-[#111111] group-hover:text-[#5C6AC4]'}`}>
              {meditation?.title || 'Untitled Session'}
            </h3>
            {meditation.difficulty && (
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF] opacity-60' : 'text-[#4B5563] opacity-80'}`}>
                {meditation.difficulty}
              </span>
            )}
          </div>
          
          {meditation.instructor && (
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
              With {meditation.instructor}
            </p>
          )}

          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-[#9CA3AF] opacity-70' : 'text-[#4B5563] opacity-90'}`}>
            {meditation?.description || 'Find your peace with this guided session.'}
          </p>
        </div>
      </button>

      {/* Top Actions Bar - Moved outside main button to avoid nested buttons */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-2">
          {meditation.isNew && (
            <div className="px-3 py-1 rounded-lg bg-primary text-white pointer-events-auto">
              <span className="text-[10px] font-black uppercase tracking-widest">New</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isFavorite 
                ? (isDark ? 'bg-white text-[#0F1115]' : 'bg-[#111111] text-white')
                : (isDark ? 'bg-black/10 text-white/60 hover:text-white hover:bg-black/30' : 'bg-white/20 text-[#111111]/60 hover:text-[#111111] hover:bg-white/40')
            }`}
          >
            <Bookmark size={14} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
          </button>
          
          {isLocked && (
            <div className="flex flex-col items-end gap-2">
              <div className={`p-2 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'}`}>
                <Lock size={12} className={isDark ? 'text-white/70' : 'text-[#111111]/70'} aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Button removed from here as it's now in the Top Actions Bar */}
    </motion.div>
  );
});
