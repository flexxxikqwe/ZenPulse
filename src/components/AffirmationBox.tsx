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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="glass-card p-8 rounded-[28px] relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">AI Insight</span>
          </div>
          <p className="text-white text-xl font-medium leading-relaxed italic relative z-10">
            "{text}"
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
