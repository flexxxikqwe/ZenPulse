import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Sparkles, X } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ToastProvider';
import { analytics } from '../services/analyticsService';

interface Props {
  onClose: () => void;
}

export const PaywallScreen = ({ onClose }: Props) => {
  const { upgradeSubscription, restoreSubscription } = useUserProfile();
  const { currentTheme } = useTheme();
  const { showToast } = useToast();
  const isDark = currentTheme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    analytics.trackEvent({ name: 'paywall_viewed' });
  }, []);

  const handleSubscribe = () => {
    analytics.trackEvent({ 
      name: 'trial_started_mock', 
      properties: { planId: selectedPlan } 
    });
    upgradeSubscription(selectedPlan);
    showToast('Premium Activated! Welcome to ZenPulse.', 'success');
    onClose();
  };

  const handleRestore = () => {
    restoreSubscription();
    showToast('Subscription restored successfully.', 'success');
    onClose();
  };

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    analytics.trackEvent({ 
      name: 'plan_selected', 
      properties: { planId: plan } 
    });
  };

  const benefits = [
    { title: "Unlimited Access", desc: "All 500+ meditation sessions", icon: "Check" },
    { title: "AI Personalization", desc: "Daily affirmations & mood checks", icon: "Sparkles" },
    { title: "Offline Mode", desc: "Download tracks for any time", icon: "Download" },
    { title: "Exclusive Content", desc: "Sleep, focus & stress tracks", icon: "Star" }
  ];

  // Theme-aware style variables
  const textPrimary = isDark ? 'text-[#F3F4F6]' : 'text-[#111111]';
  const textSecondary = isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'; // Improved contrast for light mode (6B7280 -> 4B5563)
  const accentColor = isDark ? 'bg-[#8B9CFF]' : 'bg-[#5C6AC4]';
  const borderColor = isDark ? 'border-white/10' : 'border-black/5';

  return (
    <motion.div 
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-300 ${isDark ? 'bg-[#0F1115]' : 'bg-[#F7F7F8]'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div className="pt-16 pb-12 px-8 flex flex-col min-h-full max-w-md mx-auto w-full">
        
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 shrink-0 ${
              isDark ? 'bg-[#1A1D24] text-[#F3F4F6]' : 'bg-white text-[#111111] shadow-sm border border-black/5'
            }`}
            aria-label="Close paywall"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-[32px] mb-6 border shadow-xl ${
              isDark ? 'bg-[#8B9CFF]/10 border-[#8B9CFF]/20' : 'bg-[#5C6AC4]/10 border-[#5C6AC4]/20'
            }`}
          >
            <Sparkles size={40} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} aria-hidden="true" />
          </motion.div>
          <h1 id="paywall-title" className={`text-3xl font-bold mb-3 tracking-tight leading-tight ${textPrimary}`}>ZenPulse Premium</h1>
          <p className={`text-base font-medium ${isDark ? 'opacity-80' : 'opacity-90'} ${textSecondary}`}>Join 10,000+ users finding their inner peace.</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-4 mb-10">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : i * 0.1 }}
              className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-[#1A1D24] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#8B9CFF]/10 text-[#8B9CFF]' : 'bg-[#5C6AC4]/10 text-[#5C6AC4]'
              }`}>
                <Check size={18} strokeWidth={3} aria-hidden="true" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${textPrimary}`}>{benefit.title}</h4>
                <p className={`text-[11px] font-medium ${isDark ? 'opacity-70' : 'opacity-80'} ${textSecondary}`}>{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 mb-10" role="radiogroup" aria-labelledby="pricing-label">
          <span id="pricing-label" className="sr-only">Choose a subscription plan</span>
          {/* Yearly Plan */}
          <button 
            onClick={() => handleSelectPlan('yearly')}
            aria-checked={selectedPlan === 'yearly'}
            role="radio"
            className={`w-full p-6 rounded-[28px] border transition-all text-left relative flex items-center justify-between ${
              selectedPlan === 'yearly' 
                ? `${accentColor} border-transparent shadow-xl ${shouldReduceMotion ? '' : 'scale-[1.02]'}` 
                : `${isDark ? 'bg-[#1A1D24]' : 'bg-white'} ${borderColor}`
            }`}
          >
            <div className={`absolute -top-3 right-8 px-4 py-1.5 rounded-full shadow-lg ${
              selectedPlan === 'yearly' ? 'bg-white' : accentColor
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                selectedPlan === 'yearly' ? (isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]') : 'text-white'
              }`}>
                Save 50%
              </span>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-0.5 ${selectedPlan === 'yearly' ? 'text-white' : textPrimary}`}>
                Annual Subscription
              </h3>
              <p className={`text-xs font-medium ${selectedPlan === 'yearly' ? 'text-white/80' : textSecondary}`}>
                $39.99 / year ($3.33/mo)
              </p>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedPlan === 'yearly' 
                ? 'bg-white border-white' 
                : borderColor
            }`}>
              {selectedPlan === 'yearly' && <Check size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} strokeWidth={4} />}
            </div>
          </button>

          {/* Monthly Plan */}
          <button 
            onClick={() => handleSelectPlan('monthly')}
            aria-checked={selectedPlan === 'monthly'}
            role="radio"
            className={`w-full p-6 rounded-[28px] border transition-all text-left flex items-center justify-between ${
              selectedPlan === 'monthly' 
                ? `${accentColor} border-transparent shadow-xl ${shouldReduceMotion ? '' : 'scale-[1.02]'}` 
                : `${isDark ? 'bg-[#1A1D24]' : 'bg-white'} ${borderColor}`
            }`}
          >
            <div>
              <h3 className={`font-bold text-lg mb-0.5 ${selectedPlan === 'monthly' ? 'text-white' : textPrimary}`}>
                Monthly Plan
              </h3>
              <p className={`text-xs font-medium ${selectedPlan === 'monthly' ? 'text-white/80' : textSecondary}`}>
                $6.99 / month
              </p>
            </div>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              selectedPlan === 'monthly' 
                ? 'bg-white border-white' 
                : borderColor
            }`}>
              {selectedPlan === 'monthly' && <Check size={16} className={isDark ? 'text-[#8B9CFF]' : 'text-[#5C6AC4]'} strokeWidth={4} />}
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <button 
            onClick={handleSubscribe}
            className={`${accentColor} text-white font-bold w-full h-[68px] rounded-[28px] transition-all active:scale-[0.98] shadow-2xl mb-6 text-base uppercase tracking-widest`}
          >
            Start 7-Day Free Trial
          </button>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              className={`text-[10px] uppercase tracking-[0.2em] font-bold opacity-80 hover:opacity-100 transition-opacity ${textPrimary}`}
              onClick={handleRestore}
            >
              Restore Purchases
            </button>
            
            <p className={`text-center text-[9px] leading-relaxed opacity-60 px-4 ${textSecondary}`}>
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Subscription automatically renews unless cancelled 24 hours before the end of the current period.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
