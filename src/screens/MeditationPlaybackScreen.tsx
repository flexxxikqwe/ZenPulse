import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw, Loader2, AlertCircle, CheckCircle2, SkipBack, SkipForward, BellOff, X } from 'lucide-react';
import { SessionCompleteModal } from '../components/SessionCompleteModal';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useToast } from '../components/ToastProvider';
import { analytics } from '../services/analyticsService';

interface Props {
  meditation: Meditation;
  options?: {
    gentleStart: boolean;
    focusMode: boolean;
  };
  onBack: () => void;
}

type PlaybackStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'error' | 'completed';

export const MeditationPlaybackScreen = ({ meditation, options, onBack }: Props) => {
  const { currentTheme } = useTheme();
  const { userProfile, updateMeditationProgress, completeMeditation } = useUserProfile();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCompletedRef = useRef(false);
  const hasFadedInRef = useRef(false);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState(() => {
    const existing = (userProfile?.meditationProgress || []).find(p => p.meditationId === meditation.id);
    return existing ? (existing.lastPositionSeconds || 0) : 0;
  });
  const [duration, setDuration] = useState(meditation.durationMinutes * 60);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFocusReminder, setShowFocusReminder] = useState(false);

  const isAudio = meditation.mediaType === 'audio' && !!meditation.mediaUrl;
  const progress = (currentTime / duration) * 100;

  // Focus Mode Reminder
  useEffect(() => {
    if (options?.focusMode) {
      const timer = setTimeout(() => {
        setShowFocusReminder(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [options?.focusMode]);

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
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    audio.src = meditation.mediaUrl;
    audioRef.current = audio;
    audio.preload = 'auto'; // Use auto for better stability

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      // Restore position safely - only once on mount
      const existing = (userProfile?.meditationProgress || []).find(p => p.meditationId === meditation.id);
      if (existing && existing.lastPositionSeconds && audio.currentTime === 0) {
        const safePosition = Math.min(existing.lastPositionSeconds, audio.duration - 1);
        audio.currentTime = Math.max(0, safePosition);
        setCurrentTime(audio.currentTime);
      }
      setStatus('ready');
    };

    const onCanPlay = () => {
      if (status === 'loading') setStatus('ready');
    };

    const onError = (e: any) => {
      console.error('Audio error:', e);
      setStatus('error');
    };
    
    const onTimeUpdate = () => {
      if (audio.duration && !isCompletedRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onEnded = () => {
      handleComplete();
    };

    const onPlay = () => setStatus('playing');
    const onPause = () => {
      if (!isCompletedRef.current) setStatus('paused');
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, [meditation.id, meditation.mediaUrl, isAudio, handleComplete]);

  // Gentle Start Implementation
  useEffect(() => {
    if (options?.gentleStart && status === 'playing' && audioRef.current && !hasFadedInRef.current) {
      const audio = audioRef.current;
      
      // Only fade in if we are at the very beginning
      if (audio.currentTime > 5) {
        audio.volume = 1;
        hasFadedInRef.current = true;
        return;
      }

      audio.volume = 0;
      let fadeInterval = setInterval(() => {
        if (audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + 0.05);
        } else {
          hasFadedInRef.current = true;
          clearInterval(fadeInterval);
        }
      }, 1500); // 30s total fade
      
      return () => clearInterval(fadeInterval);
    } else if (audioRef.current && status === 'playing') {
      // Ensure volume is up if we resumed or skipped past fade window
      audioRef.current.volume = 1;
    }
  }, [status, options?.gentleStart]);

  // Sync Play/Pause state with Audio element - Simplified to avoid loops
  const handleTogglePlay = () => {
    if (status === 'loading' || status === 'error') return;
    
    if (status === 'completed') {
      handleReset();
      // Use requestAnimationFrame to ensure state has settled
      requestAnimationFrame(() => {
        if (isAudio && audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error('Playback failed after reset:', err);
            setStatus('error');
          });
        } else {
          setStatus('playing');
        }
      });
      return;
    }

    if (isAudio && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => setStatus('error'));
      } else {
        audioRef.current.pause();
      }
    } else {
      setStatus(prev => prev === 'playing' ? 'paused' : 'playing');
    }

    if (status !== 'playing') {
      analytics.trackEvent({ 
        name: 'meditation_started', 
        properties: { meditationId: meditation.id, meditationTitle: meditation.title } 
      });
    }
  };

  // Simulation Progress Logic - More stable
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      if (!isAudio && status === 'playing' && !isCompletedRef.current) {
        const deltaTime = now - lastTime;
        lastTime = now;

        setCurrentTime((prev) => {
          const totalSeconds = meditation.durationMinutes * 60;
          const increment = (deltaTime / 1000);
          const next = prev + increment;
          
          if (next >= totalSeconds) {
            handleComplete();
            return totalSeconds;
          }
          return next;
        });
        frameId = requestAnimationFrame(tick);
      }
    };

    if (!isAudio && status === 'playing') {
      frameId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frameId);
  }, [status, isAudio, handleComplete, meditation.durationMinutes]);

  // Breathing Animation Logic - Synced with playback time
  useEffect(() => {
    const cycleTime = 12000; // 12s cycle: 4s inhale, 4s hold, 4s exhale
    const ms = currentTime * 1000;
    const phase = ms % cycleTime;

    if (phase < 4000) setBreathState('Inhale');
    else if (phase < 8000) setBreathState('Hold');
    else setBreathState('Exhale');
  }, [currentTime]);

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
        updateMeditationProgress({
          meditationId: meditation.id,
          meditationTitle: meditation.title || 'Untitled Session',
          progressPercent: Math.round(progress),
          lastPositionSeconds: Math.round(currentTime),
          completed: false, // Handled by handleComplete
        });
        
        lastSyncedProgress.current = progress;
        lastSyncedTime.current = now;
      }
    }
  }, [progress, currentTime, status, meditation.id, meditation.title, updateMeditationProgress]);

  const handleReset = () => {
    if (isAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isCompletedRef.current = false;
    hasFadedInRef.current = false;
    setCurrentTime(0);
    setStatus('ready');
  };

  const handleSkip = (seconds: number) => {
    if (isAudio && audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
      setCurrentTime(audioRef.current.currentTime);
    } else if (!isAudio) {
      setCurrentTime(prev => Math.max(0, Math.min(meditation.durationMinutes * 60, prev + seconds)));
    }
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
      className={`fixed inset-0 z-40 flex flex-col transition-colors duration-1000 overflow-hidden ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      {/* Immersive Background Gradient */}
      <motion.div 
        animate={{ 
          opacity: isPlaying ? [0.05, 0.15, 0.05] : 0.05,
          scale: isPlaying ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 pointer-events-none z-[1] ${
          isDark 
            ? 'bg-gradient-to-tr from-[#8B9CFF]/20 via-transparent to-[#8B9CFF]/10' 
            : 'bg-gradient-to-tr from-[#5C6AC4]/10 via-transparent to-[#5C6AC4]/5'
        }`}
      />

      <SessionCompleteModal 
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          onBack();
        }}
        meditationTitle={meditation.title}
        durationMinutes={sessionDuration}
      />

      {/* Focus Mode Subtle Reminder */}
      <AnimatePresence>
        {showFocusReminder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 right-6 z-50"
          >
            <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg backdrop-blur-md ${
              isDark ? 'bg-[#1A1D24]/90 border-white/10' : 'bg-white/90 border-black/5'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'
                }`}>
                  <BellOff size={16} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
                    Focus Mode Active
                  </p>
                  <p className={`text-[9px] font-medium opacity-60 ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    Silence notifications for a better experience
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowFocusReminder(false)}
                className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              >
                <X size={14} className="opacity-40" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-16 pb-10 px-6 flex flex-col h-full max-w-md mx-auto w-full relative z-[2]">
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
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            {meditation.title}
          </h1>
          {meditation.instructor && (
            <p className={`text-xs font-black uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`}>
              With {meditation.instructor}
            </p>
          )}
          <div className="flex items-center justify-center gap-3">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#9CA3AF] opacity-80' : 'text-[#4B5563] opacity-90'}`}>
              {meditation.durationMinutes} min Session
            </p>
            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
            <button 
              onClick={handleReset}
              className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 transition-colors ${isDark ? 'text-[#9CA3AF] hover:text-[#8B9CFF]' : 'text-[#4B5563] hover:text-[#5C6AC4]'}`}
            >
              <RotateCcw size={10} />
              Restart
            </button>
          </div>
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
          {/* Time Remaining */}
          <div className="flex justify-between items-center mb-4 px-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, '0')}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
              -{Math.floor(Math.max(0, duration - currentTime) / 60)}:
              {String(Math.floor(Math.max(0, duration - currentTime) % 60)).padStart(2, '0')}
            </span>
          </div>

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

          <div className="flex items-center justify-center gap-8">
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
                  onClick={() => handleSkip(-15)}
                  disabled={status === 'loading'}
                  aria-label="Skip back 15 seconds"
                  className={`transition-colors active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${isDark ? 'text-[#9CA3AF] hover:text-[#F3F4F6]' : 'text-[#4B5563] hover:text-[#111111]'}`}
                >
                  <SkipBack size={24} />
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

                <button 
                  onClick={() => handleSkip(15)}
                  disabled={status === 'loading'}
                  aria-label="Skip forward 15 seconds"
                  className={`transition-colors active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${isDark ? 'text-[#9CA3AF] hover:text-[#F3F4F6]' : 'text-[#4B5563] hover:text-[#111111]'}`}
                >
                  <SkipForward size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
