import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface Props {
  text: string | null;
}

export const AffirmationBox = ({ text }: Props) => {
  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div 
          key={text}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">AI Affirmation</span>
          </div>
          <p className="text-emerald-900 text-lg font-medium leading-relaxed italic">
            "{text}"
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
