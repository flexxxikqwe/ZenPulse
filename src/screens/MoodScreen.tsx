import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Loader2, Play } from 'lucide-react';
import { MoodSelector } from '../components/MoodSelector';
import { AffirmationBox } from '../components/AffirmationBox';
import { Meditation } from '../data/meditations';
import { meditationService } from '../services/meditationService';
import { getMeditationRecommendation } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { analytics } from '../services/analyticsService';

interface Props {
  onBack: () => void;
  onSelectMeditation: (meditation: Meditation) => void;
}

export const MoodScreen = ({ onBack, onSelectMeditation }: Props) => {
  const { currentTheme } = useTheme();
  const { userProfile, setRecommendedMeditationId } = useUserProfile();
  const isDark = currentTheme === 'dark';
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmationText, setAffirmationText] = useState<string | null>(null);
  const [recommendedMeditation, setRecommendedMeditation] = useState<Meditation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [allMeditations, setAllMeditations] = useState<Meditation[]>([]);

  useEffect(() => {
    analytics.trackEvent({ name: 'mood_check_started' });
    
    const fetchMeditations = async () => {
      try {
        setIsInitialLoading(true);
        const data = await meditationService.getMeditations();
        setAllMeditations(data || []);
      } catch (error) {
        console.error("Failed to fetch meditations:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchMeditations();
  }, []);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setAffirmationText(null);
    setRecommendedMeditation(null);
  };

  const handleGenerate = async () => {
    if (selectedMood) {
      setIsLoading(true);
      try {
        const { affirmation, meditationId } = await getMeditationRecommendation(
          selectedMood, 
          userProfile.goals, 
          userProfile.preferredDuration
        );
        setAffirmationText(affirmation);
        setRecommendedMeditationId(meditationId);
        
        const meditation = allMeditations.find(m => m.id === meditationId);
        if (meditation) {
          setRecommendedMeditation(meditation);
        }

        analytics.trackEvent({ 
          name: 'mood_check_completed', 
          properties: { mood: selectedMood, recommendedId: meditationId } 
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to generate recommendation';
        console.error("Failed to generate recommendation:", error);
        analytics.trackEvent({ 
          name: 'mood_check_failed', 
          properties: { error: errorMsg } 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartSession = () => {
    if (recommendedMeditation) {
      onSelectMeditation(recommendedMeditation);
      onBack();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed inset-0 z-40 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <div className="pt-16 pb-10 px-8 flex flex-col min-h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={onBack}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
            }`}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={`text-2xl font-bold tracking-tight leading-tight ${isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'}`}>
            Mood Check
          </h1>
        </div>

        <div className="mb-12">
          <p className={`font-medium mb-8 text-sm uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            How are you feeling?
          </p>
          {isInitialLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 size={24} className={`animate-spin ${isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'}`} />
            </div>
          ) : (
            <MoodSelector onSelect={handleMoodSelect} selectedMood={selectedMood} />
          )}
        </div>

        <button
          disabled={!selectedMood || isLoading}
          onClick={handleGenerate}
          className={`w-full h-[64px] rounded-[24px] font-bold transition-all flex items-center justify-center gap-3 mb-12
            ${selectedMood && !isLoading
              ? (isDark ? 'bg-[#8B9CFF] text-black shadow-lg active:scale-[0.98]' : 'bg-[#5C6AC4] text-white shadow-lg active:scale-[0.98]')
              : (isDark ? 'bg-[#1A1D24] text-[#9CA3AF]/30 cursor-not-allowed border border-white/5' : 'bg-white text-[#6B7280]/30 cursor-not-allowed border border-black/5')}
          `}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
          <span className="text-base uppercase tracking-widest">{isLoading ? 'Crafting...' : 'Get Recommendation'}</span>
        </button>

        <div className="mt-auto space-y-6">
          <AffirmationBox text={affirmationText} />
          
          {recommendedMeditation && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleStartSession}
              className={`w-full h-[64px] rounded-[24px] font-bold transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]
                ${isDark ? 'bg-white text-black' : 'bg-black text-white'}
              `}
            >
              <Play size={20} fill="currentColor" />
              <span className="text-base uppercase tracking-widest">Start Session</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
