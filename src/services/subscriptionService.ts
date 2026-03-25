import { UserProfile, SubscriptionInfo } from '../types/UserProfile';

export const subscriptionService = {
  /**
   * Centralized check for premium access.
   * In the future, this will check server-side status.
   */
  isPremium: (profile: UserProfile): boolean => {
    // Current logic: check both legacy isPremium and new subscription status
    return profile.isPremium || profile.subscription?.status === 'active' || profile.subscription?.status === 'trial';
  },

  /**
   * Returns a user-friendly label for the current subscription.
   */
  getSubscriptionLabel: (profile: UserProfile): string => {
    const sub = profile.subscription;
    if (sub.status === 'trial') return 'Free Trial';
    if (sub.status === 'active') {
      return sub.currentPlan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium';
    }
    return 'Free Version';
  },

  /**
   * Mock upgrade flow.
   */
  mockUpgrade: (plan: 'monthly' | 'yearly'): SubscriptionInfo => {
    const now = new Date();
    const renewsAt = new Date();
    if (plan === 'yearly') renewsAt.setFullYear(now.getFullYear() + 1);
    else renewsAt.setMonth(now.getMonth() + 1);

    return {
      status: 'active',
      currentPlan: plan,
      billingCycle: plan,
      trialActive: false,
      renewsAt: renewsAt.toISOString(),
      expiresAt: null,
      source: 'mock',
    };
  },

  /**
   * Mock restore flow.
   */
  mockRestore: (): SubscriptionInfo | null => {
    // Simulate finding a previous purchase
    return null; // For now, no previous purchase found in mock
  }
};
