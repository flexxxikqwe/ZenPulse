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
  onSelect: (mood: string, affirmation: string) => void;
  selectedMood: string | null;
}

export const MoodSelector = ({ onSelect, selectedMood }: Props) => {
  return (
    <div className="flex justify-between gap-4">
      {moods.map((mood) => (
        <motion.button
          key={mood.label}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.label, mood.affirmation)}
          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border ${
            selectedMood === mood.label
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100'
          }`}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-tight">{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
