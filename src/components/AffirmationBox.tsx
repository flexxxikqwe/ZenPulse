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
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className="bg-bg-soft p-8 rounded-[32px] border border-white shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <span className="text-[10px] font-bold text-text-main uppercase tracking-[0.2em]">Daily Insight</span>
          </div>
          <p className="text-text-main text-lg font-medium leading-relaxed italic relative z-10">
            "{text}"
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
