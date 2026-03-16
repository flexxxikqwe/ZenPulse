import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  text: string | null;
}

export const AffirmationBox = ({ text }: Props) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div 
          key={text}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          className={`p-8 rounded-[32px] border shadow-sm relative overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          {/* Background Accent */}
          <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-10 ${
            isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'
          }`} />

          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-[#8B9CFF]/10' : 'bg-[#5C6AC4]/10'
            }`}>
              <Sparkles size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
              isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
            }`}>Daily Insight</span>
          </div>
          <p className={`text-lg font-medium leading-relaxed italic relative z-10 ${
            isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
          }`}>
            "{text}"
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
