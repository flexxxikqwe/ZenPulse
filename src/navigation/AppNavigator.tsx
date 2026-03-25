import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { MeditationLibraryScreen } from '../screens/MeditationLibraryScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { MoodScreen } from '../screens/MoodScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MeditationPlaybackScreen } from '../screens/MeditationPlaybackScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { MeditationDetailView } from '../components/MeditationDetailView';
import { Meditation } from '../data/meditations';
import { meditationService } from '../services/meditationService';
import { useUserProfile } from '../context/UserProfileContext';

export const AppNavigator = () => {
  const { userProfile, isLoaded } = useUserProfile();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [libraryViewMode, setLibraryViewMode] = useState<'browse' | 'saved'>('browse');
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [detailedMeditation, setDetailedMeditation] = useState<Meditation | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [allMeditations, setAllMeditations] = useState<Meditation[]>([]);

  useEffect(() => {
    const fetchMeditations = async () => {
      const data = await meditationService.getMeditations();
      setAllMeditations(data);
    };
    fetchMeditations();
  }, []);

  useEffect(() => {
    if (isLoaded && !userProfile.hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isLoaded, userProfile.hasCompletedOnboarding]);

  const handleResumeMeditation = useCallback((meditationId: string) => {
    const meditation = allMeditations.find(m => m.id === meditationId);
    if (meditation) {
      setDetailedMeditation(meditation);
      setShowProfile(false);
    }
  }, [allMeditations]);

  const handleOpenPaywall = useCallback(() => setShowPaywall(true), []);
  const handleClosePaywall = useCallback(() => setShowPaywall(false), []);
  const handleOpenMood = useCallback(() => setShowMood(true), []);
  const handleCloseMood = useCallback(() => setShowMood(false), []);
  const handleOpenSettings = useCallback(() => setShowSettings(true), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);
  const handleOpenProfile = useCallback(() => setShowProfile(true), []);
  const handleCloseProfile = useCallback(() => setShowProfile(false), []);
  const handleViewFavorites = useCallback(() => {
    setLibraryViewMode('saved');
    setShowProfile(false);
  }, []);
  const handleSelectMeditation = useCallback((meditation: Meditation) => setDetailedMeditation(meditation), []);
  const handleStartSession = useCallback((meditation: Meditation) => {
    setDetailedMeditation(null);
    setSelectedMeditation(meditation);
  }, []);
  const handleCloseDetail = useCallback(() => setDetailedMeditation(null), []);
  const handleClosePlayback = useCallback(() => setSelectedMeditation(null), []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-main dark:bg-dark-bg-main shadow-2xl relative overflow-hidden font-sans transition-colors duration-300">
      <AnimatePresence>
        {!isLoaded && <SplashScreen key="splash" />}
      </AnimatePresence>

      {isLoaded && (
        <>
          <AnimatePresence>
            {showOnboarding && <OnboardingScreen key="onboarding" />}
          </AnimatePresence>

          <MeditationLibraryScreen 
            onOpenPaywall={handleOpenPaywall} 
            onOpenMood={handleOpenMood}
            onOpenSettings={handleOpenSettings}
            onOpenProfile={handleOpenProfile}
            onSelectMeditation={handleSelectMeditation}
            viewMode={libraryViewMode}
            onViewModeChange={setLibraryViewMode}
          />
          
          <AnimatePresence>
            {detailedMeditation && (
              <MeditationDetailView 
                meditation={detailedMeditation}
                onBack={handleCloseDetail}
                onStart={handleStartSession}
                onOpenPaywall={handleOpenPaywall}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedMeditation && (
              <MeditationPlaybackScreen 
                meditation={selectedMeditation} 
                onBack={handleClosePlayback} 
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPaywall && (
              <PaywallScreen onClose={handleClosePaywall} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showMood && (
              <MoodScreen 
                onBack={handleCloseMood} 
                onSelectMeditation={handleSelectMeditation}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSettings && (
              <SettingsScreen onBack={handleCloseSettings} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showProfile && (
              <ProfileScreen 
                onBack={handleCloseProfile} 
                onResumeMeditation={handleResumeMeditation}
                onOpenPaywall={handleOpenPaywall}
                onOpenSettings={handleOpenSettings}
                onViewFavorites={handleViewFavorites}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
