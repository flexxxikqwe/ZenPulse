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
    <div className="flex justify-between gap-3 sm:gap-4">
      {moods.map((mood) => (
        <motion.button
          key={mood.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.label)}
          className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-[20px] transition-all border min-h-[110px] ${
            selectedMood === mood.label
              ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <span className="text-3xl sm:text-4xl shrink-0 drop-shadow-lg">{mood.emoji}</span>
          <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest text-center leading-tight ${
            selectedMood === mood.label ? 'text-primary' : 'text-white/40'
          }`}>
            {mood.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
