import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, MeditationProgress, SubscriptionInfo } from '../types/UserProfile';
import { profileService } from '../services/profileService';
import { subscriptionService } from '../services/subscriptionService';

interface UserProfileContextType {
  userProfile: UserProfile;
  isLoaded: boolean;
  recommendedMeditationId: string;
  updateMeditationProgress: (progress: MeditationProgress) => void;
  completeMeditation: (meditationId: string, minutes: number) => void;
  togglePremium: () => void;
  upgradeSubscription: (plan: 'monthly' | 'yearly') => void;
  setSubscriptionNone: () => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  changeSubscriptionPlan: (plan: 'monthly' | 'yearly') => void;
  restoreSubscription: () => void;
  setRecommendedMeditationId: (id: string) => void;
  completeOnboarding: (goals: string[], preferredDuration: number) => void;
  updateDailyGoal: (minutes: number) => void;
  toggleFavorite: (meditationId: string) => void;
  updateProfileInfo: (username: string, email: string) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  username: 'ZenSeeker',
  email: 'seeker@zenpulse.app',
  authProvider: 'none',
  profileVersion: 2,
  subscription: {
    status: 'none',
    currentPlan: 'none',
    billingCycle: 'none',
    trialActive: false,
    autoRenew: false,
    renewsAt: null,
    expiresAt: null,
    source: 'mock',
  },
  isPremium: false,
  totalMeditationsCompleted: 0,
  totalMeditationMinutes: 0,
  meditationProgress: [],
  hasCompletedOnboarding: false,
  goals: [],
  preferredDuration: 10,
  dailyGoalMinutes: 10,
  currentStreak: 0,
  lastMeditationDate: null,
  totalMinutesToday: 0,
  lastUpdateDate: new Date().toISOString().split('T')[0],
  favoriteIds: [],
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recommendedMeditationId, setRecommendedMeditationId] = useState<string>("focus_01");

  useEffect(() => {
    const initProfile = async () => {
      try {
        const saved = await profileService.getProfile();
        if (saved) {
          // Migration logic for older profiles (v1 to v2)
          const migratedProfile: UserProfile = {
            ...DEFAULT_PROFILE,
            ...saved,
            meditationProgress: saved.meditationProgress || [],
            goals: saved.goals || [],
            favoriteIds: saved.favoriteIds || [],
            // If it was premium in v1, make it active in v2
            subscription: saved.subscription || (saved.isPremium ? {
              status: 'active',
              currentPlan: 'yearly',
              billingCycle: 'yearly',
              trialActive: false,
              autoRenew: true,
              renewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              expiresAt: null,
              source: 'mock',
            } : DEFAULT_PROFILE.subscription),
            profileVersion: 2,
          };
          setUserProfile(migratedProfile);
        }
      } catch (error) {
        console.error("Failed to initialize profile:", error);
        setUserProfile(DEFAULT_PROFILE);
      } finally {
        // Artificial delay for splash feel
        setTimeout(() => setIsLoaded(true), 1500);
      }
    };
    initProfile();
  }, []);

  useEffect(() => {
    if (isLoaded && userProfile !== DEFAULT_PROFILE) {
      profileService.saveProfile(userProfile);
    }
  }, [userProfile, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const today = new Date().toISOString().split('T')[0];
      if (userProfile.lastUpdateDate !== today) {
        setUserProfile(prev => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          let newStreak = prev.currentStreak;
          // If last meditation was not yesterday and not today, streak is broken
          if (prev.lastMeditationDate !== yesterdayStr && prev.lastMeditationDate !== today) {
            newStreak = 0;
          }

          return {
            ...prev,
            totalMinutesToday: 0,
            lastUpdateDate: today,
            currentStreak: newStreak
          };
        });
      }
    }
  }, [isLoaded, userProfile.lastUpdateDate, userProfile.lastMeditationDate]);

  const updateMeditationProgress = useCallback((progress: MeditationProgress) => {
    setUserProfile((prev) => {
      const existingIndex = prev.meditationProgress.findIndex(
        (p) => p.meditationId === progress.meditationId
      );

      let newProgress = [...prev.meditationProgress];
      if (existingIndex >= 0) {
        // Only update if something actually changed to avoid unnecessary state updates
        const existing = newProgress[existingIndex];
        if (existing.progressPercent === progress.progressPercent && 
            existing.lastPositionSeconds === progress.lastPositionSeconds &&
            existing.completed === progress.completed) {
          return prev;
        }

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
  }, []);

  const completeMeditation = useCallback((meditationId: string, minutes: number) => {
    setUserProfile((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.currentStreak;
      if (prev.lastMeditationDate !== today) {
        if (prev.lastMeditationDate === yesterdayStr || prev.lastMeditationDate === null) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

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
        totalMinutesToday: prev.totalMinutesToday + minutes,
        currentStreak: newStreak,
        lastMeditationDate: today,
        lastUpdateDate: today,
        meditationProgress: newProgress,
      };
    });
  }, []);

  const togglePremium = useCallback(() => {
    setUserProfile((prev) => {
      const nextIsPremium = !subscriptionService.isPremium(prev);
      return { 
        ...prev, 
        isPremium: nextIsPremium,
        subscription: nextIsPremium ? subscriptionService.mockUpgrade('yearly') : subscriptionService.mockSetNone()
      };
    });
  }, []);

  const upgradeSubscription = useCallback((plan: 'monthly' | 'yearly') => {
    const newSub = subscriptionService.mockUpgrade(plan);
    setUserProfile(prev => ({
      ...prev,
      isPremium: true,
      subscription: newSub
    }));
  }, []);

  const setSubscriptionNone = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      isPremium: false,
      subscription: subscriptionService.mockSetNone()
    }));
  }, []);

  const cancelSubscription = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      subscription: subscriptionService.mockCancel(prev.subscription)
    }));
  }, []);

  const reactivateSubscription = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      subscription: subscriptionService.mockReactivate(prev.subscription)
    }));
  }, []);

  const changeSubscriptionPlan = useCallback((plan: 'monthly' | 'yearly') => {
    setUserProfile(prev => ({
      ...prev,
      subscription: subscriptionService.mockChangePlan(prev.subscription, plan)
    }));
  }, []);

  const restoreSubscription = useCallback(() => {
    const restored = subscriptionService.mockRestore();
    if (restored) {
      setUserProfile(prev => ({
        ...prev,
        isPremium: true,
        subscription: restored
      }));
    }
  }, []);

  const completeOnboarding = useCallback((goals: string[], preferredDuration: number) => {
    setUserProfile(prev => ({
      ...prev,
      goals,
      preferredDuration,
      dailyGoalMinutes: preferredDuration, // Set daily goal to preferred duration initially
      hasCompletedOnboarding: true,
    }));
  }, []);

  const updateDailyGoal = useCallback((minutes: number) => {
    setUserProfile(prev => ({
      ...prev,
      dailyGoalMinutes: minutes
    }));
  }, []);

  const toggleFavorite = useCallback((meditationId: string) => {
    setUserProfile(prev => {
      const isFavorite = (prev.favoriteIds || []).includes(meditationId);
      const newFavorites = isFavorite
        ? prev.favoriteIds.filter(id => id !== meditationId)
        : [...(prev.favoriteIds || []), meditationId];
      
      return {
        ...prev,
        favoriteIds: newFavorites
      };
    });
  }, []);

  const updateProfileInfo = useCallback((username: string, email: string) => {
    setUserProfile(prev => ({
      ...prev,
      username,
      email
    }));
  }, []);

  const resetProfile = useCallback(async () => {
    await profileService.resetProfile();
    setUserProfile(DEFAULT_PROFILE);
  }, []);

  const contextValue = useMemo(() => ({ 
    userProfile, 
    isLoaded,
    recommendedMeditationId, 
    updateMeditationProgress, 
    completeMeditation, 
    togglePremium,
    upgradeSubscription,
    setSubscriptionNone,
    cancelSubscription,
    reactivateSubscription,
    changeSubscriptionPlan,
    restoreSubscription,
    setRecommendedMeditationId,
    completeOnboarding,
    updateDailyGoal,
    toggleFavorite,
    updateProfileInfo,
    resetProfile
  }), [
    userProfile, 
    isLoaded, 
    recommendedMeditationId, 
    updateMeditationProgress, 
    completeMeditation, 
    togglePremium,
    upgradeSubscription,
    setSubscriptionNone,
    cancelSubscription,
    reactivateSubscription,
    changeSubscriptionPlan,
    restoreSubscription,
    completeOnboarding,
    updateDailyGoal,
    toggleFavorite,
    updateProfileInfo,
    resetProfile
  ]);

  return (
    <UserProfileContext.Provider value={contextValue}>
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
