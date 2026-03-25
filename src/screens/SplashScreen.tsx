import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export const SplashScreen = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${
      isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
    }`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl ${
          isDark ? 'bg-[#1A1D24] text-[#8B9CFF]' : 'bg-white text-[#5C6AC4]'
        }`}>
          <div className="w-12 h-12 rounded-full border-4 border-current border-t-transparent animate-spin opacity-20 absolute" />
          <span className="text-4xl font-bold tracking-tighter">Z</span>
        </div>
        <h1 className={`text-2xl font-bold tracking-[0.2em] uppercase ${
          isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
        }`}>ZenPulse</h1>
        <p className={`mt-2 text-xs font-bold uppercase tracking-[0.3em] opacity-40 ${
          isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
        }`}>Mindfulness AI</p>
      </motion.div>
    </div>
  );
};
