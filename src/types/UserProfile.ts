export interface MeditationProgress {
  meditationId: string;
  meditationTitle: string;
  progressPercent: number;
  lastPositionSeconds: number;
  completed: boolean;
}

export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'none';
export type SubscriptionPlan = 'monthly' | 'yearly' | 'none';
export type AuthProvider = 'google' | 'apple' | 'email' | 'none';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  currentPlan: SubscriptionPlan;
  billingCycle: SubscriptionPlan;
  trialActive: boolean;
  renewsAt: string | null;
  expiresAt: string | null;
  source: 'mock' | 'server';
}

export interface UserProfile {
  // Account Info
  id: string;
  username: string;
  email: string;
  authProvider: AuthProvider;
  profileVersion: number;

  // Subscription Info
  subscription: SubscriptionInfo;
  isPremium: boolean; // Keep for backward compatibility and quick checks

  // Progress & Preferences
  totalMeditationsCompleted: number;
  totalMeditationMinutes: number;
  meditationProgress: MeditationProgress[];
  hasCompletedOnboarding: boolean;
  goals: string[];
  preferredDuration: number;

  // Habit Loop
  dailyGoalMinutes: number;
  currentStreak: number;
  lastMeditationDate: string | null;
  totalMinutesToday: number;
  lastUpdateDate: string | null;
  favoriteIds: string[];
}
