import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface Mood {
  emoji: string;
  label: string;
  affirmation: string;
}

const moods: Mood[] = [
  { emoji: '🙂', label: 'Calm', affirmation: 'Your breath brings gentle balance today.' },
  { emoji: '😐', label: 'Neutral', affirmation: 'Take a quiet pause and reconnect.' },
  { emoji: '😴', label: 'Tired', affirmation: 'Allow your mind to slow down and rest.' },
];

interface Props {
  onSelect: (mood: string) => void;
  selectedMood: string | null;
}

export const MoodSelector = ({ onSelect, selectedMood }: Props) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  return (
    <div 
      className="flex justify-between gap-4"
      role="radiogroup"
      aria-label="Select your current mood"
    >
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.label;
        const accentColor = isDark ? '#8B9CFF' : '#5C6AC4';
        
        return (
          <motion.button
            key={mood.label}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => onSelect(mood.label)}
            role="radio"
            aria-checked={isSelected}
            aria-label={mood.label}
            className={`flex-1 flex flex-col items-center justify-center gap-4 p-5 rounded-[28px] transition-all border min-h-[120px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
              isSelected
                ? `border-transparent shadow-md scale-[1.02]`
                : isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'
            }`}
            style={{
              backgroundColor: isSelected ? `${accentColor}20` : undefined,
              borderColor: isSelected ? accentColor : undefined,
            }}
          >
            <span className="text-4xl shrink-0" aria-hidden="true">{mood.emoji}</span>
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] text-center leading-tight ${
              isSelected 
                ? isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'
                : isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
            }`}>
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
