import React from 'react';
import { motion } from 'motion/react';

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
  return (
    <div className="flex justify-between gap-4">
      {moods.map((mood) => (
        <motion.button
          key={mood.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.label)}
          className={`flex-1 flex flex-col items-center justify-center gap-4 p-5 rounded-[28px] transition-all border min-h-[120px] ${
            selectedMood === mood.label
              ? 'bg-primary/10 border-primary shadow-sm'
              : 'bg-bg-soft border-white hover:bg-white'
          }`}
        >
          <span className="text-4xl shrink-0">{mood.emoji}</span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] text-center leading-tight ${
            selectedMood === mood.label ? 'text-text-main' : 'text-text-muted/50'
          }`}>
            {mood.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
