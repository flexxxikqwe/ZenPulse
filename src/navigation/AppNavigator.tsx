import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MeditationLibraryScreen } from '../screens/MeditationLibraryScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { MoodScreen } from '../screens/MoodScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MeditationPlaybackScreen } from '../screens/MeditationPlaybackScreen';
import { Meditation, meditations } from '../data/meditations';

export const AppNavigator = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);

  const handleResumeMeditation = (meditationId: string) => {
    const meditation = meditations.find(m => m.id === meditationId);
    if (meditation) {
      setSelectedMeditation(meditation);
      setShowProfile(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-main dark:bg-dark-bg-main shadow-2xl relative overflow-hidden font-sans transition-colors duration-300">
      <MeditationLibraryScreen 
        onOpenPaywall={() => setShowPaywall(true)} 
        onOpenMood={() => setShowMood(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setShowProfile(true)}
        onSelectMeditation={(meditation) => setSelectedMeditation(meditation)}
      />
      
      <AnimatePresence>
        {selectedMeditation && (
          <MeditationPlaybackScreen 
            meditation={selectedMeditation} 
            onBack={() => setSelectedMeditation(null)} 
          />
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {showSettings && (
          <SettingsScreen onBack={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <ProfileScreen 
            onBack={() => setShowProfile(false)} 
            onResumeMeditation={handleResumeMeditation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
