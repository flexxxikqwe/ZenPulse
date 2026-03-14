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
      className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* SafeAreaView Simulation */}
      <div className="pt-12 pb-8 px-5 flex flex-col min-h-full max-w-md mx-auto w-full">
        
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#8B5CF6]/20 mb-6">
            <Sparkles size={32} className="text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">ZenPulse Premium</h1>
          <p className="text-[#CBD5F5] text-lg font-medium">Unlock your full meditation experience.</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-6 mb-12">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                <Check size={14} className="text-[#22C55E]" />
              </div>
              <span className="text-white font-medium">{benefit}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 mb-12">
          {/* Monthly Plan */}
          <button 
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
              selectedPlan === 'monthly' 
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div>
              <h3 className="text-white font-bold text-lg">Monthly Plan</h3>
              <p className="text-[#CBD5F5] text-sm">$6.99 / month</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'monthly' ? 'border-[#8B5CF6]' : 'border-white/20'
            }`}>
              {selectedPlan === 'monthly' && <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />}
            </div>
          </button>

          {/* Yearly Plan */}
          <button 
            onClick={() => setSelectedPlan('yearly')}
            className={`w-full p-4 rounded-2xl border-2 transition-all text-left relative flex items-center justify-between ${
              selectedPlan === 'yearly' 
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="absolute -top-3 right-6 bg-[#22C55E] px-3 py-1 rounded-full shadow-lg">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Best Value</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Yearly Plan</h3>
              <p className="text-[#CBD5F5] text-sm">$39.99 / year</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'yearly' ? 'border-[#8B5CF6]' : 'border-white/20'
            }`}>
              {selectedPlan === 'yearly' && <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />}
            </div>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <button 
            onClick={handleSubscribe}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold h-[52px] rounded-2xl transition-all active:scale-95 shadow-xl shadow-[#8B5CF6]/20 mb-6"
          >
            Start Free Trial
          </button>
          <p className="text-center text-[#CBD5F5]/50 text-[10px] uppercase tracking-widest font-bold">
            Cancel anytime. Secure payment.
          </p>
        </div>

      </div>
    </motion.div>
  );
};
