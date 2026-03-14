import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MeditationScreen } from '../screens/MeditationScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { MoodScreen } from '../screens/MoodScreen';

export const AppNavigator = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showMood, setShowMood] = useState(false);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 shadow-2xl relative overflow-hidden">
      <MeditationScreen 
        onOpenPaywall={() => setShowPaywall(true)} 
        onOpenMood={() => setShowMood(true)}
      />
      
      <AnimatePresence>
        {showPaywall && (
          <PaywallScreen onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMood && (
          <MoodScreen onBack={() => setShowMood(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
