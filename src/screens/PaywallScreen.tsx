import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, X } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface Props {
  onClose: () => void;
}

export const PaywallScreen = ({ onClose }: Props) => {
  const { setSubscribed } = useSubscription();
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 premium-gradient flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* SafeAreaView Simulation */}
      <div className="pt-16 pb-12 px-6 flex flex-col min-h-full max-w-md mx-auto w-full">
        
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors active:scale-90 shrink-0 backdrop-blur-md border border-white/10"
            aria-label="Close"
          >
            <X size={28} />
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-primary/20 mb-8 border border-primary/20 shadow-2xl shadow-primary/20">
            <Sparkles size={40} className="text-primary" />
          </div>
          <h1 className="text-[32px] font-bold text-white mb-4 tracking-tight leading-tight">ZenPulse Premium</h1>
          <p className="text-white/60 text-lg font-medium">Unlock your full meditation experience.</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-6 mb-12 px-2">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary/20">
                <Check size={14} className="text-secondary" strokeWidth={3} />
              </div>
              <span className="text-white/90 font-medium text-base">{benefit}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 mb-12">
          {/* Monthly Plan */}
          <button 
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-6 rounded-[20px] border-2 transition-all text-left flex items-center justify-between ${
              selectedPlan === 'monthly' 
                ? 'border-primary bg-primary/10 shadow-xl shadow-primary/10' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Monthly Plan</h3>
              <p className="text-white/50 text-sm font-medium">$6.99 / month</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'monthly' ? 'border-primary' : 'border-white/20'
            }`}>
              {selectedPlan === 'monthly' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
          </button>

          {/* Yearly Plan */}
          <button 
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full p-6 rounded-[20px] border-2 transition-all text-left relative flex items-center justify-between ${
              selectedPlan === 'yearly' 
                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="absolute -top-3 right-8 bg-secondary px-4 py-1.5 rounded-full shadow-lg shadow-secondary/20">
              <span className="text-[11px] font-black text-white uppercase tracking-wider">Best Value</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Yearly Plan</h3>
              <p className="text-white/50 text-sm font-medium">$39.99 / year</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'yearly' ? 'border-primary' : 'border-white/20'
            }`}>
              {selectedPlan === 'yearly' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-8">
          <button 
            onClick={handleSubscribe}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-[56px] rounded-[20px] transition-all active:scale-[0.98] shadow-2xl shadow-primary/30 mb-6 text-lg"
          >
            Start Free Trial
          </button>
          <p className="text-center text-white/30 text-[11px] uppercase tracking-[0.15em] font-bold">
            Cancel anytime. Secure payment.
          </p>
        </div>

      </div>
    </motion.div>
  );
};
