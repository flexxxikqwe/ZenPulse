import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, X } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onClose: () => void;
}

export const PaywallScreen = ({ onClose }: Props) => {
  const { setSubscribed } = useSubscription();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = () => {
    setSubscribed(true);
    onClose();
  };

  const benefits = [
    "Unlimited meditation sessions",
    "AI generated daily affirmations",
    "Exclusive sleep and focus tracks"
  ];

  // Theme-aware style variables
  const textPrimary = isDark ? 'text-[#F3F4F6]' : 'text-[#111111]';
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const accentColor = isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]';
  const borderColor = isDark ? 'border-white/10' : 'border-black/5';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
    >
      <div className="pt-16 pb-12 px-8 flex flex-col min-h-full max-w-md mx-auto w-full">
        
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 shrink-0 ${
              isDark ? 'bg-[#1A1D24] text-[#9CA3AF]' : 'bg-white text-[#6B7280] shadow-sm border border-black/5'
            }`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[24px] mb-8 border ${
            isDark ? 'bg-[#8B9CFF]/10 border-[#8B9CFF]/20' : 'bg-[#5C6AC4]/10 border-[#5C6AC4]/20'
          }`}>
            <Sparkles size={32} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} />
          </div>
          <h1 className={`text-3xl font-bold mb-3 tracking-tight leading-tight ${textPrimary}`}>ZenPulse Premium</h1>
          <p className={`text-base font-medium ${textSecondary}`}>Unlock your full meditation experience.</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-5 mb-12 px-2">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#A3B18A]/20' : 'bg-[#A3B18A]/20'
              }`}>
                <Check size={12} className="text-[#A3B18A]" strokeWidth={3} />
              </div>
              <span className={`font-medium text-sm ${textPrimary}`}>{benefit}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 mb-12">
          {/* Monthly Plan */}
          <button 
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-6 rounded-[24px] border transition-all text-left flex items-center justify-between ${
              selectedPlan === 'monthly' 
                ? `${accentColor} border-transparent shadow-lg scale-[1.02]` 
                : `${isDark ? 'bg-[#1A1D24]' : 'bg-white'} ${borderColor}`
            }`}
          >
            <div>
              <h3 className={`font-bold text-base mb-0.5 ${selectedPlan === 'monthly' ? 'text-white' : textPrimary}`}>
                Monthly Plan
              </h3>
              <p className={`text-xs font-medium ${selectedPlan === 'monthly' ? 'text-white/80' : textSecondary}`}>
                $6.99 / month
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
              selectedPlan === 'monthly' 
                ? 'bg-white border-white' 
                : borderColor
            }`}>
              {selectedPlan === 'monthly' && <Check size={14} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} strokeWidth={4} />}
            </div>
          </button>

          {/* Yearly Plan */}
          <button 
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full p-6 rounded-[24px] border transition-all text-left relative flex items-center justify-between ${
              selectedPlan === 'yearly' 
                ? `${accentColor} border-transparent shadow-lg scale-[1.02]` 
                : `${isDark ? 'bg-[#1A1D24]' : 'bg-white'} ${borderColor}`
            }`}
          >
            <div className={`absolute -top-3 right-6 px-3 py-1 rounded-full shadow-sm ${
              selectedPlan === 'yearly' ? 'bg-white' : accentColor
            }`}>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                selectedPlan === 'yearly' ? (isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]') : 'text-white'
              }`}>
                Best Value
              </span>
            </div>
            <div>
              <h3 className={`font-bold text-base mb-0.5 ${selectedPlan === 'yearly' ? 'text-white' : textPrimary}`}>
                Yearly Plan
              </h3>
              <p className={`text-xs font-medium ${selectedPlan === 'yearly' ? 'text-white/80' : textSecondary}`}>
                $39.99 / year
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
              selectedPlan === 'yearly' 
                ? 'bg-white border-white' 
                : borderColor
            }`}>
              {selectedPlan === 'yearly' && <Check size={14} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} strokeWidth={4} />}
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-8">
          <button 
            onClick={handleSubscribe}
            className={`${accentColor} text-white font-bold w-full h-[64px] rounded-[24px] transition-all active:scale-[0.98] shadow-lg mb-6 text-base uppercase tracking-widest`}
          >
            Start Free Trial
          </button>
          <p className={`text-center text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 ${textPrimary}`}>
            Cancel anytime. Secure payment.
          </p>
        </div>

      </div>
    </motion.div>
  );
};
