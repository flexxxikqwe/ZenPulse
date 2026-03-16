import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: Props) => {
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <div className="pt-16 pb-10 px-8 flex flex-col h-full max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-bg-soft dark:bg-dark-bg-soft flex items-center justify-center text-text-main dark:text-dark-text-main active:scale-90 transition-transform shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text-main dark:text-dark-text-main tracking-tight leading-tight">Settings</h1>
        </div>

        {/* Settings List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-[28px] bg-bg-soft dark:bg-dark-bg-soft border border-border-subtle dark:border-dark-border-subtle shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="text-base font-bold text-text-main dark:text-dark-text-main">Dark Mode</h3>
                <p className="text-xs text-text-muted dark:text-dark-text-muted font-medium">Adjust the app appearance</p>
              </div>
            </div>
            
            {/* Custom Toggle Switch */}
            <button 
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full transition-colors relative ${isDark ? 'bg-accent dark:bg-dark-accent' : 'bg-bg-soft border border-border-subtle'}`}
            >
              <motion.div 
                animate={{ x: isDark ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full absolute top-1 ${isDark ? 'bg-white' : 'bg-text-muted/20'}`}
              />
            </button>
          </div>
        </div>

        <div className="mt-auto pb-8 text-center">
          <p className="text-[10px] font-bold text-text-muted dark:text-dark-text-muted uppercase tracking-[0.2em]">ZenPulse v1.0.0</p>
        </div>
      </div>
    </motion.div>
  );
};
