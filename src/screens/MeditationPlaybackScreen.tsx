import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SessionCompleteModal } from '../components/SessionCompleteModal';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from '../components/ToastProvider';
import { analytics } from '../services/analyticsService';

interface Props {
  meditation: Meditation;
  onBack: () => void;
}

type PlaybackStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error' | 'completed';

export const MeditationPlaybackScreen = ({ meditation, onBack }: Props) => {
  const { currentTheme } = useTheme();
  const { userProfile, updateMeditationProgress, completeMeditation } = useUserProfile();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCompletedRef = useRef(false);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [progress, setProgress] = useState(() => {
    const existing = (userProfile?.meditationProgress || []).find(p => p.meditationId === meditation.id);
    return existing ? (existing.progressPercent || 0) : 0;
  });
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const isAudio = meditation.mediaType === 'audio' && !!meditation.mediaUrl;

  useEffect(() => {
    analytics.trackEvent({ 
      name: 'meditation_opened', 
      properties: { meditationId: meditation.id, meditationTitle: meditation.title } 
    });
  }, [meditation.id, meditation.title]);

  // Helper to handle completion safely
  const handleComplete = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    
    const duration = isAudio && audioRef.current?.duration 
      ? Math.round(audioRef.current.duration / 60) 
      : meditation.durationMinutes;

    completeMeditation(meditation.id, duration);
    // showToast('Meditation completed. You feel more centered.', 'success'); // Replaced by modal
    analytics.trackEvent({ 
      name: 'meditation_completed', 
      properties: { 
        meditationId: meditation.id, 
        meditationTitle: meditation.title, 
        durationMinutes: duration 
      } 
    });
    setStatus('completed');
    setShowCompleteModal(true);
  }, [meditation.id, meditation.durationMinutes, isAudio, completeMeditation]);

  // Initialize audio lifecycle
  useEffect(() => {
    if (!isAudio) {
      setStatus('ready');
      return;
    }

    setStatus('loading');
    const audio = new Audio(meditation.mediaUrl);
    audioRef.current = audio;
    audio.preload = 'metadata';

    const onLoadedMetadata = () => {
      // Restore position safely
      const existing = (userProfile?.meditationProgress || []).find(p => p.meditationId === meditation.id);
      if (existing && existing.lastPositionSeconds) {
        const safePosition = Math.min(existing.lastPositionSeconds, audio.duration - 1);
        audio.currentTime = Math.max(0, safePosition);
      }
      setStatus('ready');
    };

    const onError = () => setStatus('error');
    
    const onTimeUpdate = () => {
      if (audio.duration && !isCompletedRef.current) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const onEnded = () => {
      handleComplete();
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [meditation.id, meditation.mediaUrl, isAudio, userProfile.meditationProgress, handleComplete]);

  // Sync Play/Pause state with Audio element
  useEffect(() => {
    if (!isAudio || !audioRef.current || status === 'error' || status === 'completed') return;

    if (status === 'playing') {
      audioRef.current.play().catch(() => setStatus('error'));
    } else if (status === 'paused' || status === 'ready') {
      audioRef.current.pause();
    }
  }, [status, isAudio]);

  // Simulation Progress Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isAudio && status === 'playing' && !isCompletedRef.current) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.1; // Slower, more precise increment
          if (next >= 100) {
            handleComplete();
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, isAudio, handleComplete]);

  // Breathing Animation Logic
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathState((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(breathInterval);
  }, []);

  const lastSyncedProgress = useRef<number>(0);
  const lastSyncedTime = useRef<number>(0);

  // Periodic Progress Sync with Profile (Throttled)
  useEffect(() => {
    if (progress > 0 && !isCompletedRef.current && status === 'playing') {
      const now = Date.now();
      const progressDiff = Math.abs(progress - lastSyncedProgress.current);
      const timeDiff = now - lastSyncedTime.current;

      // Sync if progress changed by > 2% or every 10 seconds
      if (progressDiff > 2 || timeDiff > 10000) {
        const duration = isAudio && audioRef.current?.duration 
          ? audioRef.current.duration / 60 
          : (meditation.durationMinutes || 10);

        updateMeditationProgress({
          meditationId: meditation.id,
          meditationTitle: meditation.title || 'Untitled Session',
          progressPercent: Math.round(progress),
          lastPositionSeconds: isAudio && audioRef.current 
            ? Math.round(audioRef.current.currentTime) 
            : Math.round(((progress || 0) / 100) * (duration || 10) * 60),
          completed: false, // Handled by handleComplete
        });
        
        lastSyncedProgress.current = progress;
        lastSyncedTime.current = now;
      }
    }
  }, [progress, status, meditation.id, meditation.title, meditation.durationMinutes, isAudio, updateMeditationProgress]);

  const handleReset = () => {
    if (isAudio && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    isCompletedRef.current = false;
    setProgress(0);
    setStatus('ready');
  };

  const handleTogglePlay = () => {
    if (status === 'loading' || status === 'error') return;
    if (status === 'completed') {
      handleReset();
      setStatus('playing');
      analytics.trackEvent({ 
        name: 'meditation_started', 
        properties: { meditationId: meditation.id, meditationTitle: meditation.title } 
      });
      return;
    }
    const nextStatus = status === 'playing' ? 'paused' : 'playing';
    if (nextStatus === 'playing') {
      analytics.trackEvent({ 
        name: 'meditation_started', 
        properties: { meditationId: meditation.id, meditationTitle: meditation.title } 
      });
    }
    setStatus(nextStatus);
  };

  const isPlaying = status === 'playing';

  const sessionDuration = isAudio && audioRef.current?.duration 
    ? Math.round(audioRef.current.duration / 60) 
    : meditation.durationMinutes;

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      className={`fixed inset-0 z-40 flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <SessionCompleteModal 
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          onBack();
        }}
        meditationTitle={meditation.title}
        durationMinutes={sessionDuration}
      />
      <div className="pt-16 pb-10 px-6 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            aria-label="Go back to selection"
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
            {status === 'completed' ? 'Session Finished' : isAudio ? 'Audio Session' : 'Mindful Simulation'}
          </span>
          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Meditation Info */}
        <div className="text-center mb-16">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation.title}
          </h1>
          {meditation.instructor && (
            <p className={`text-xs font-black uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
              With {meditation.instructor}
            </p>
          )}
          <p className={`text-sm font-bold ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
            {meditation.durationMinutes} min Session
          </p>
        </div>

        {/* Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center mb-16">
          <motion.div 
            animate={shouldReduceMotion ? {} : { 
              scale: status === 'completed' ? 1 : (breathState === 'Inhale' ? 1.2 : breathState === 'Exhale' ? 0.8 : 1),
              opacity: breathState === 'Hold' ? 0.8 : 1
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={`w-56 h-56 rounded-full flex items-center justify-center border relative ${
              isDark ? 'bg-[#8B9CFF]/5 border-[#8B9CFF]/20' : 'bg-[#5C6AC4]/5 border-[#5C6AC4]/20'
            }`}
          >
            <div className={`absolute inset-0 rounded-full border animate-ping opacity-20 ${
              isDark ? 'border-[#8B9CFF]' : 'border-[#5C6AC4]'
            }`} aria-hidden="true" />
            
            {status === 'loading' ? (
              <Loader2 size={48} className={`animate-spin ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`} aria-hidden="true" />
            ) : status === 'error' ? (
              <div className="flex flex-col items-center gap-2">
                <AlertCircle size={48} className="text-red-500" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase text-red-500">Audio Error</span>
              </div>
            ) : status === 'completed' ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 size={48} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} aria-hidden="true" />
                <span className={`text-[10px] font-black uppercase ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>Finished</span>
              </div>
            ) : (
              <span className={`text-2xl font-bold tracking-tighter ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
                {breathState}
              </span>
            )}
          </motion.div>
          <p className={`mt-10 text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
            {status === 'error' ? 'Please try again later' : status === 'completed' ? 'Great job!' : 'Focus on your breath'}
          </p>
        </div>

        {/* Controls */}
        <div className="px-4">
          {/* Progress Bar */}
          <div 
            className={`w-full h-1.5 rounded-full mb-10 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Meditation progress"
          >
            <motion.div 
              className={`h-full ${isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'}`}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-center gap-12">
            {status === 'completed' ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onBack}
                className={`flex-1 h-[68px] rounded-[28px] font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all ${
                  isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
                }`}
              >
                Finish Session
              </motion.button>
            ) : (
              <>
                <button 
                  onClick={handleReset}
                  aria-label="Restart meditation"
                  className={`transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${isDark ? 'text-[#9CA3AF] hover:text-[#F3F4F6]' : 'text-[#4B5563] hover:text-[#111111]'}`}
                >
                  <RotateCcw size={24} />
                </button>
                
                <button 
                  onClick={handleTogglePlay}
                  disabled={status === 'loading'}
                  aria-label={isPlaying ? "Pause meditation" : "Play meditation"}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
                    isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
                  }`}
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <div className="w-6" aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
