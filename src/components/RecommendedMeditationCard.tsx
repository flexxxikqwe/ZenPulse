import React from 'react';
import { Sparkles, Play, Clock, Lock, Bookmark } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from './ToastProvider';
import { motion, useReducedMotion } from 'motion/react';
import { analytics } from '../services/analyticsService';

interface RecommendedMeditationCardProps {
  meditation: Meditation;
  isSubscribed: boolean;
  onPress: (meditation: Meditation) => void;
  onOpenPaywall: () => void;
  recommendationReason?: string;
}

export const RecommendedMeditationCard = React.memo(({ 
  meditation, 
  isSubscribed, 
  onPress, 
  onOpenPaywall,
  recommendationReason = "AI Recommended"
}: RecommendedMeditationCardProps) => {
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
      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
      className={`p-8 rounded-[40px] border mb-12 relative overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
      }`}
    >
      {/* Main Action Button (Covers the card) */}
      <button
        onClick={() => {
          analytics.trackEvent({ 
            name: 'recommended_clicked', 
            properties: { meditationId: meditation.id, reason: recommendationReason } 
          });
          onPress(meditation);
        }}
        aria-label={`${isLocked ? 'Unlock Premium: ' : 'Start Session: '}${meditation.title}`}
        className="absolute inset-0 z-0 w-full h-full rounded-[40px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
      />

      {/* Animated Background Accent */}
      {!shouldReduceMotion && (
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
            isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'
          }`} 
        />
      )}

      <div className="flex items-start justify-between mb-8 relative z-10 pointer-events-none">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 ${
            isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/20 text-[#5C6AC4]'
          }`}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={16} aria-hidden="true" />
          </motion.div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{recommendationReason}</span>
        </motion.div>
        <div className="flex items-center gap-3 pointer-events-auto">
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
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'}`}>
              <Lock size={12} className={isDark ? 'text-white/70' : 'text-[#111111]/70'} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          {meditation.instructor && (
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
              With {meditation.instructor}
            </span>
          )}
          {meditation.difficulty && (
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#F3F4F6] opacity-60' : 'text-[#111111] opacity-80'}`}>
              • {meditation.difficulty}
            </span>
          )}
        </div>
        <h2 className={`text-4xl font-bold tracking-tight mb-4 leading-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
          {meditation?.title || 'Untitled Session'}
        </h2>
        <p className={`text-lg font-medium leading-relaxed mb-6 ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
          {meditation?.description || 'Find your peace with this guided session.'}
        </p>

        {meditation.benefits && meditation.benefits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meditation.benefits.map((benefit, i) => (
              <span key={i} className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                isDark ? 'border-white/10 text-[#9CA3AF]' : 'border-black/10 text-[#4B5563]'
              }`}>
                {benefit}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
            <Clock size={16} className={isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} aria-hidden="true" />
          </div>
          <span className={`text-base font-bold ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation?.durationMinutes || 10} min
          </span>
        </div>

        <div
          className={`flex items-center gap-3 px-10 py-5 rounded-full font-bold text-base transition-all shadow-xl ${
            isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
          }`}
        >
          <Play size={20} fill="currentColor" aria-hidden="true" />
          {isLocked ? 'Unlock Premium' : 'Start Now'}
        </div>
      </div>
    </motion.div>
  );
});
