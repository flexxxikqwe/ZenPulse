import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, Target, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUserProfile } from '../context/UserProfileContext';
import { analytics } from '../services/analyticsService';
import { useEffect } from 'react';

const GOALS = [
  { id: 'stress', label: 'Reduce Stress', icon: Sparkles },
  { id: 'focus', label: 'Improve Focus', icon: Target },
  { id: 'sleep', label: 'Better Sleep', icon: Clock },
];

const DURATIONS = [5, 10, 15, 20];

export const OnboardingScreen = () => {
  const { currentTheme } = useTheme();
  const { completeOnboarding } = useUserProfile();
  const isDark = currentTheme === 'dark';
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [preferredDuration, setPreferredDuration] = useState(10);

  useEffect(() => {
    analytics.trackEvent({ name: 'onboarding_started' });
  }, []);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else {
      analytics.trackEvent({ 
        name: 'onboarding_completed', 
        properties: { goals: selectedGoals, preferredDuration } 
      });
      completeOnboarding(selectedGoals, preferredDuration);
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => {
      const isSelected = prev.includes(id);
      if (!isSelected) {
        analytics.trackEvent({ name: 'goal_selected', properties: { goal: id } });
      }
      return isSelected ? prev.filter(g => g !== id) : [...prev, id];
    });
  };

  const steps = [
    {
      title: "Welcome to ZenPulse",
      subtitle: "Your personal AI meditation guide for a calmer life.",
      content: (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className={`w-32 h-32 rounded-[48px] flex items-center justify-center mb-10 shadow-2xl ${
            isDark ? 'bg-[#1A1D24] text-[#8B9CFF]' : 'bg-white text-[#5C6AC4]'
          }`}>
            <Sparkles size={64} />
          </div>
          <p className={`text-center text-lg font-medium leading-relaxed px-4 ${
            isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
          }`}>
            Discover a personalized path to mindfulness powered by advanced AI.
          </p>
        </div>
      )
    },
    {
      title: "What are your goals?",
      subtitle: "Select what matters most to you right now.",
      content: (
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {GOALS.map(goal => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-6 rounded-[28px] border flex items-center gap-4 transition-all active:scale-[0.98] ${
                selectedGoals.includes(goal.id)
                  ? (isDark ? 'bg-[#8B9CFF]/10 border-[#8B9CFF]' : 'bg-[#5C6AC4]/10 border-[#5C6AC4]')
                  : (isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5')
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                selectedGoals.includes(goal.id)
                  ? (isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]')
                  : (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
              }`}>
                <goal.icon size={24} />
              </div>
              <span className={`text-lg font-bold flex-1 text-left ${
                isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
              }`}>{goal.label}</span>
              {selectedGoals.includes(goal.id) && (
                <CheckCircle2 size={20} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
              )}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Daily Practice",
      subtitle: "How much time can you dedicate daily?",
      content: (
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div className="grid grid-cols-2 gap-4">
            {DURATIONS.map(dur => (
              <button
                key={dur}
                onClick={() => setPreferredDuration(dur)}
                className={`p-8 rounded-[32px] border flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  preferredDuration === dur
                    ? (isDark ? 'bg-[#8B9CFF]/10 border-[#8B9CFF]' : 'bg-[#5C6AC4]/10 border-[#5C6AC4]')
                    : (isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5')
                }`}
              >
                <span className={`text-3xl font-bold ${
                  preferredDuration === dur 
                    ? (isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]')
                    : (isDark ? 'text-[#F3F4F6]' : 'text-[#111111]')
                }`}>{dur}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
                }`}>Minutes</span>
              </button>
            ))}
          </div>
          <p className={`text-center text-sm font-medium italic ${
            isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
          }`}>
            You can adjust your goals anytime in settings.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className={`fixed inset-0 z-[90] flex flex-col transition-colors duration-500 ${
      isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'
    }`}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-8 pt-20 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-12">
              <h1 className={`text-3xl font-bold tracking-tight mb-3 ${
                isDark ? 'text-[#F3F4F6]' : 'text-[#111111]'
              }`}>{steps[step].title}</h1>
              <p className={`text-base font-medium ${
                isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'
              }`}>{steps[step].subtitle}</p>
            </div>

            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step 
                    ? `w-8 ${isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]'}` 
                    : `w-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={step === 1 && selectedGoals.length === 0}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm transition-all active:scale-95 shadow-xl disabled:opacity-50 ${
              isDark ? 'bg-[#8B9CFF] text-black' : 'bg-[#5C6AC4] text-white'
            }`}
          >
            {step === 2 ? 'Get Started' : 'Continue'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
