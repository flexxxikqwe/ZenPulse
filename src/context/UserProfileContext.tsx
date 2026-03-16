import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, MeditationProgress } from '../types/UserProfile';
import { loadProfile, saveProfile } from '../utils/storage';

interface UserProfileContextType {
  userProfile: UserProfile;
  recommendedMeditationId: string;
  updateMeditationProgress: (progress: MeditationProgress) => void;
  completeMeditation: (meditationId: string, minutes: number) => void;
  togglePremium: () => void;
  setRecommendedMeditationId: (id: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  username: 'ZenSeeker',
  isPremium: false,
  totalMeditationsCompleted: 0,
  totalMeditationMinutes: 0,
  meditationProgress: [],
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [recommendedMeditationId, setRecommendedMeditationId] = useState<string>("focus_01");

  useEffect(() => {
    const initProfile = async () => {
      const saved = await loadProfile();
      if (saved) {
        setUserProfile(saved);
      }
    };
    initProfile();
  }, []);

  useEffect(() => {
    if (userProfile !== DEFAULT_PROFILE) {
      saveProfile(userProfile);
    }
  }, [userProfile]);

  const updateMeditationProgress = (progress: MeditationProgress) => {
    setUserProfile((prev) => {
      const existingIndex = prev.meditationProgress.findIndex(
        (p) => p.meditationId === progress.meditationId
      );

      let newProgress = [...prev.meditationProgress];
      if (existingIndex >= 0) {
        newProgress[existingIndex] = {
          ...newProgress[existingIndex],
          ...progress,
        };
      } else {
        newProgress.push(progress);
      }

      return {
        ...prev,
        meditationProgress: newProgress,
      };
    });
  };

  const completeMeditation = (meditationId: string, minutes: number) => {
    setUserProfile((prev) => {
      const existingIndex = prev.meditationProgress.findIndex(
        (p) => p.meditationId === meditationId
      );

      let newProgress = [...prev.meditationProgress];
      if (existingIndex >= 0) {
        newProgress[existingIndex] = {
          ...newProgress[existingIndex],
          completed: true,
          progressPercent: 100,
        };
      }

      return {
        ...prev,
        totalMeditationsCompleted: prev.totalMeditationsCompleted + 1,
        totalMeditationMinutes: prev.totalMeditationMinutes + minutes,
        meditationProgress: newProgress,
      };
    });
  };

  const togglePremium = () => {
    setUserProfile((prev) => ({ ...prev, isPremium: !prev.isPremium }));
  };

  return (
    <UserProfileContext.Provider
      value={{ 
        userProfile, 
        recommendedMeditationId, 
        updateMeditationProgress, 
        completeMeditation, 
        togglePremium,
        setRecommendedMeditationId
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
