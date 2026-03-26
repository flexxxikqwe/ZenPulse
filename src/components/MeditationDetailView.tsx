import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Play, Clock, BarChart, CheckCircle2, Lock, Sparkles, Bookmark } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from './ToastProvider';
import { subscriptionService } from '../services/subscriptionService';

interface MeditationDetailViewProps {
  meditation: Meditation;
  onBack: () => void;
  onStart: (meditation: Meditation, options: SessionOptions) => void;
  onOpenPaywall: () => void;
}

export interface SessionOptions {
  gentleStart: boolean;
  focusMode: boolean;
}

export const MeditationDetailView = ({ 
  meditation, 
  onBack, 
  onStart, 
  onOpenPaywall 
}: MeditationDetailViewProps) => {
  const { currentTheme } = useTheme();
  const { userProfile, toggleFavorite } = useUserProfile();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const isPremiumUser = subscriptionService.isPremium(userProfile);
  const isLocked = meditation.premiumRequired && !isPremiumUser;
  const isFavorite = (userProfile?.favoriteIds || []).includes(meditation.id);

  const [sessionOptions, setSessionOptions] = React.useState<SessionOptions>({
    gentleStart: true,
    focusMode: true
  });

  const handleToggleFavorite = () => {
    toggleFavorite(meditation.id);
    showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleStartClick = () => {
    if (isLocked) {
      onOpenPaywall();
    } else {
      onStart(meditation, sessionOptions);
    }
  };

  const toggleGentleStart = () => {
    setSessionOptions(prev => ({ ...prev, gentleStart: !prev.gentleStart }));
  };

  const toggleFocusMode = () => {
    setSessionOptions(prev => ({ ...prev, focusMode: !prev.focusMode }));
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${
        isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
      }`}
    >
      {/* Header Image / Placeholder */}
      <div className="relative h-72 w-full overflow-hidden shrink-0">
        <div className={`absolute inset-0 ${
          isDark ? 'bg-gradient-to-b from-[#8B9CFF]/20 to-[#0F1115]' : 'bg-gradient-to-b from-[#5C6AC4]/20 to-[#F7F7F8]'
        }`} />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          aria-label="Back to library"
          className={`absolute top-16 left-8 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all z-10 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
            isDark ? 'bg-black/20 text-white border border-white/10' : 'bg-white/40 text-[#111111] border border-black/5'
          }`}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-16 right-8 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
            isFavorite 
              ? (isDark ? 'bg-white text-[#0F1115]' : 'bg-[#111111] text-white')
              : (isDark ? 'bg-black/10 text-white/60 hover:text-white hover:bg-black/30' : 'bg-white/20 text-[#111111]/60 hover:text-[#111111] hover:bg-white/40')
          }`}
        >
          <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {/* Category Tag */}
        <div className="absolute bottom-8 left-8">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/20 text-[#5C6AC4]'
          }`}>
            {meditation.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-32 -mt-4 relative z-10 flex-1">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation.title}
          </h1>
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              With {meditation.instructor || 'ZenPulse Guide'}
            </p>
            {meditation.premiumRequired && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest`}>
                <Lock size={8} />
                Premium
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mb-10">
          <div className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-1 ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <Clock size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              {meditation.durationMinutes}m
            </span>
          </div>
          <div className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-1 ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <BarChart size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              {meditation.difficulty || 'Beginner'}
            </span>
          </div>
          <div className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-1 ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <Sparkles size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              {meditation.mediaType === 'simulation' ? 'AI Sim' : 'Audio'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
            About this session
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
            {meditation.longDescription || meditation.description}
          </p>
        </div>

        {/* Session Options */}
        {!isLocked && (
          <div className={`mb-10 p-6 rounded-[32px] border border-dashed transition-colors duration-300 ${
            isDark ? 'bg-[#1A1D24]/40 border-white/10' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-center ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
              Session Options
            </h2>
            
            <div className="space-y-6">
              {/* Gentle Start Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    Gentle Start
                  </label>
                  <span className={`text-[8px] font-medium opacity-50 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    30s gradual volume fade-in
                  </span>
                </div>
                <button 
                  onClick={toggleGentleStart}
                  className={`w-10 h-5 rounded-full relative p-1 transition-colors ${
                    sessionOptions.gentleStart 
                      ? (isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]') 
                      : (isDark ? 'bg-white/10' : 'bg-black/10')
                  }`}
                >
                  <motion.div 
                    animate={{ x: sessionOptions.gentleStart ? 20 : 0 }}
                    className="w-3 h-3 rounded-full bg-white" 
                  />
                </button>
              </div>

              {/* Focus Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    Focus Mode
                  </label>
                  <span className={`text-[8px] font-medium opacity-50 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    Silence notifications (reminder)
                  </span>
                </div>
                <button 
                  onClick={toggleFocusMode}
                  className={`w-10 h-5 rounded-full relative p-1 transition-colors ${
                    sessionOptions.focusMode 
                      ? (isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]') 
                      : (isDark ? 'bg-white/10' : 'bg-black/10')
                  }`}
                >
                  <motion.div 
                    animate={{ x: sessionOptions.focusMode ? 20 : 0 }}
                    className="w-3 h-3 rounded-full bg-white" 
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        {meditation.benefits && meditation.benefits.length > 0 && (
          <div className="mb-10">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
              Key Benefits
            </h2>
            <div className="space-y-3">
              {meditation.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className={`text-sm font-medium ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className={`fixed bottom-0 left-0 right-0 p-8 pt-4 pb-10 z-20 max-w-md mx-auto ${
        isDark ? 'bg-gradient-to-t from-[#0F1115] via-[#0F1115] to-transparent' : 'bg-gradient-to-t from-[#F7F7F8] via-[#F7F7F8] to-transparent'
      }`}>
        {!isLocked && (
          <p className={`text-center text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            Ready to start?
          </p>
        )}
        <button
          onClick={handleStartClick}
          className={`w-full h-16 rounded-[24px] flex items-center justify-center gap-3 font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all ${
            isLocked 
              ? 'bg-amber-500 text-white' 
              : (isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white')
          }`}
        >
          {isLocked ? (
            <>
              <Lock size={18} />
              Unlock with Premium
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              Start Session
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
