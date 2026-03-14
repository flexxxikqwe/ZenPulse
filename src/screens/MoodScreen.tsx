import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { MoodSelector } from '../components/MoodSelector';
import { AffirmationBox } from '../components/AffirmationBox';

interface Props {
  onBack: () => void;
}

export const MoodScreen = ({ onBack }: Props) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [tempAffirmation, setTempAffirmation] = useState<string | null>(null);
  const [affirmationText, setAffirmationText] = useState<string | null>(null);

  const generateAffirmation = (mood: string) => {
    switch (mood) {
      case 'Calm':
        return "Your breath creates space for calm.";
      case 'Neutral':
        return "Pause for a moment and reconnect.";
      case 'Tired':
        return "Allow your body and mind to rest.";
      default:
        return "";
    }
  };

  const handleMoodSelect = (mood: string, affirmation: string) => {
    setSelectedMood(mood);
    setTempAffirmation(affirmation);
    // We don't set affirmationText immediately as per "Then presses button: Generate Affirmation"
  };

  const handleGenerate = () => {
    if (selectedMood) {
      const text = generateAffirmation(selectedMood);
      setAffirmationText(text);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-40 bg-white flex flex-col overflow-y-auto no-scrollbar"
    >
      <div className="pt-14 pb-10 px-5 flex flex-col min-h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">AI Mood of the Day</h1>
        </div>

        <div className="mb-8">
          <p className="text-zinc-500 font-medium mb-6">Choose how you feel today.</p>
          <MoodSelector onSelect={handleMoodSelect} selectedMood={selectedMood} />
        </div>

        <button
          disabled={!selectedMood}
          onClick={handleGenerate}
          className={`w-full h-[52px] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mb-10
            ${selectedMood 
              ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 active:scale-95' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}
          `}
        >
          <Sparkles size={18} />
          <span>Generate Affirmation</span>
        </button>

        <AffirmationBox text={affirmationText} />
      </div>
    </motion.div>
  );
};
