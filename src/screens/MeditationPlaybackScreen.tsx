import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Meditation } from '../data/meditations';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';

interface Props {
  meditation: Meditation;
  onBack: () => void;
}

export const MeditationPlaybackScreen = ({ meditation, onBack }: Props) => {
  const { currentTheme } = useTheme();
  const { userProfile, updateMeditationProgress, completeMeditation } = useUserProfile();
  const isDark = currentTheme === 'dark';
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(() => {
    const existing = userProfile.meditationProgress.find(p => p.meditationId === meditation.id);
    return existing ? existing.progressPercent : 0;
  });
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 0.5 : 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  useEffect(() => {
    if (progress > 0) {
      updateMeditationProgress({
        meditationId: meditation.id,
        meditationTitle: meditation.title,
        progressPercent: Math.round(progress),
        lastPositionSeconds: Math.round((progress / 100) * meditation.durationMinutes * 60),
        completed: progress >= 100,
      });

      if (progress >= 100) {
        completeMeditation(meditation.id, meditation.durationMinutes);
        setIsPlaying(false);
      }
    }
  }, [progress]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed inset-0 z-40 flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <div className="pt-16 pb-10 px-6 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-bg-soft dark:bg-dark-bg-soft flex items-center justify-center text-text-main dark:text-dark-text-main active:scale-90 transition-transform"
            aria-label="Go back to selection"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">Now Playing</span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Meditation Info */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-text-main dark:text-dark-text-main mb-2 tracking-tight">{meditation.title}</h1>
          <p className="text-text-muted dark:text-dark-text-muted font-medium">{meditation.durationMinutes} min Session</p>
        </div>

        {/* Breathing Guidance Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center mb-16">
          <motion.div 
            animate={{ 
              scale: breathState === 'Inhale' ? 1.2 : breathState === 'Exhale' ? 0.8 : 1,
              opacity: breathState === 'Hold' ? 0.8 : 1
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative"
          >
            <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping" />
            <span className="text-xl font-bold text-primary dark:text-dark-accent tracking-tight">{breathState}</span>
          </motion.div>
          <p className="mt-8 text-text-muted dark:text-dark-text-muted font-medium italic text-sm">Focus on your breath</p>
        </div>

        {/* Controls */}
        <div className="px-4">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-bg-soft dark:bg-dark-bg-soft rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="h-full bg-primary dark:bg-dark-accent"
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-10">
            <button 
              onClick={() => setProgress(0)}
              className="text-text-muted dark:text-dark-text-muted hover:text-text-main dark:hover:text-dark-text-main transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-accent dark:bg-dark-accent flex items-center justify-center text-white shadow-xl active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            <div className="w-6" /> {/* Spacer for symmetry */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
