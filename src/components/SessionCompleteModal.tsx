import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, Share2, ArrowRight, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { ProgressRing } from './ProgressRing';

interface SessionCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  meditationTitle: string;
  durationMinutes: number;
}

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  isOpen,
  onClose,
  meditationTitle,
  durationMinutes
}) => {
  const { currentTheme } = useTheme();
  const { userProfile } = useUserProfile();
  const isDark = currentTheme === 'dark';

  const progress = Math.min(userProfile.totalMinutesToday / userProfile.dailyGoalMinutes, 1);
  const isGoalMet = userProfile.totalMinutesToday >= userProfile.dailyGoalMinutes;

  const motivationalMessages = [
    "You're doing great! Keep it up.",
    "A moment of peace well deserved.",
    "Your mind thanks you for this break.",
    "Consistency is the key to clarity.",
    "You're becoming more centered every day."
  ];

  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-sm rounded-[40px] p-8 overflow-hidden relative shadow-2xl ${
              isDark ? 'bg-[#1A1D24] text-white' : 'bg-white text-black'
            }`}
          >
            {/* Background Sparkles */}
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sparkles size={120} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/20 text-[#5C6AC4]'
                }`}
              >
                <CheckCircle2 size={40} />
              </motion.div>

              <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
              <p className={`text-sm mb-8 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                "{meditationTitle}" • {durationMinutes} min
              </p>

              <div className="flex justify-center gap-8 mb-10 w-full">
                <div className="flex flex-col items-center">
                  <ProgressRing progress={progress} size={80} strokeWidth={6}>
                    <span className="text-lg font-bold">{Math.round(progress * 100)}%</span>
                  </ProgressRing>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60">Daily Goal</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 ${
                    isDark ? 'border-[#8B9CFF]/30 bg-[#8B9CFF]/10' : 'border-[#5C6AC4]/30 bg-[#5C6AC4]/10'
                  }`}>
                    <Trophy size={24} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
                    <span className="text-xl font-bold mt-1">{userProfile.currentStreak}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60">Day Streak</span>
                </div>
              </div>

              <div className={`p-6 rounded-3xl mb-8 w-full ${
                isDark ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <p className="text-sm italic font-medium leading-relaxed">
                  "{message}"
                </p>
              </div>

              {isGoalMet && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isDark ? 'bg-[#8B9CFF]/20 text-[#8B9CFF]' : 'bg-[#5C6AC4]/20 text-[#5C6AC4]'
                  }`}
                >
                  <Sparkles size={14} />
                  Daily Goal Reached!
                </motion.div>
              )}

              <div className="flex gap-4 w-full">
                <button
                  onClick={onClose}
                  className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  Done
                  <ArrowRight size={18} />
                </button>
                <button
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                    isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                  }`}
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
