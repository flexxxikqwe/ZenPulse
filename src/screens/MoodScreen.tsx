import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { MoodSelector } from '../components/MoodSelector';
import { AffirmationBox } from '../components/AffirmationBox';
import { sendPromptToLLM } from '../services/aiService';

interface Props {
  onBack: () => void;
}

export const MoodScreen = ({ onBack }: Props) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmationText, setAffirmationText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    // Clear previous affirmation when mood changes
    setAffirmationText(null);
  };

  const handleGenerate = async () => {
    if (selectedMood) {
      setIsLoading(true);
      try {
        const text = await sendPromptToLLM(selectedMood);
        setAffirmationText(text);
      } catch (error) {
        console.error("Failed to generate affirmation:", error);
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
      className="fixed inset-0 z-40 premium-gradient flex flex-col overflow-y-auto no-scrollbar"
    >
      <div className="pt-16 pb-10 px-6 flex flex-col min-h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform shrink-0 backdrop-blur-md"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">Mood Check</h1>
        </div>

        <div className="mb-10">
          <p className="text-white/60 font-medium mb-6 text-base">How are you feeling right now?</p>
          <MoodSelector onSelect={handleMoodSelect} selectedMood={selectedMood} />
        </div>

        <button
          disabled={!selectedMood || isLoading}
          onClick={handleGenerate}
          className={`w-full h-[56px] rounded-[20px] font-bold transition-all flex items-center justify-center gap-2 mb-10
            ${selectedMood && !isLoading
              ? 'bg-primary text-white shadow-xl shadow-primary/20 active:scale-[0.97]' 
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}
          `}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
          <span className="text-lg">{isLoading ? 'Crafting...' : 'Generate Affirmation'}</span>
        </button>

        <div className="mt-auto">
          <AffirmationBox text={affirmationText} />
        </div>
      </div>
    </motion.div>
  );
};
