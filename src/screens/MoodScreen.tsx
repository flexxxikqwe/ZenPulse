import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { MoodSelector } from '../components/MoodSelector';
import { AffirmationBox } from '../components/AffirmationBox';
import { getMeditationRecommendation } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';

interface Props {
  onBack: () => void;
}

export const MoodScreen = ({ onBack }: Props) => {
  const { currentTheme } = useTheme();
  const { setRecommendedMeditationId } = useUserProfile();
  const isDark = currentTheme === 'dark';
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmationText, setAffirmationText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setAffirmationText(null);
  };

  const handleGenerate = async () => {
    if (selectedMood) {
      setIsLoading(true);
      try {
        const { affirmation, meditationId } = await getMeditationRecommendation(selectedMood);
        setAffirmationText(affirmation);
        setRecommendedMeditationId(meditationId);
      } catch (error) {
        console.error("Failed to generate recommendation:", error);
      } finally {
        setIsLoading(false);
      }
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
          <MoodSelector onSelect={handleMoodSelect} selectedMood={selectedMood} />
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

        <div className="mt-auto">
          <AffirmationBox text={affirmationText} />
        </div>
      </div>
    </motion.div>
  );
};
