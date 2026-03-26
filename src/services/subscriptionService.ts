import { UserProfile, SubscriptionInfo } from '../types/UserProfile';

export const subscriptionService = {
  /**
   * Centralized check for premium access.
   * In the future, this will check server-side status.
   */
  isPremium: (profile: UserProfile): boolean => {
    // Stricter check: only active or trial status counts as premium
    return profile.subscription?.status === 'active' || profile.subscription?.status === 'trial';
  },

  /**
   * Returns a user-friendly label for the current subscription.
   */
  getSubscriptionLabel: (profile: UserProfile): string => {
    const sub = profile.subscription;
    if (!sub || sub.status === 'none') return 'Free Version';
    if (sub.status === 'trial') return 'Free Trial';
    if (sub.status === 'active') {
      return sub.currentPlan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium';
    }
    if (sub.status === 'expired') return 'Expired';
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
      autoRenew: true,
      renewsAt: renewsAt.toISOString(),
      expiresAt: null,
      source: 'mock',
    };
  },

  /**
   * Mock downgrade to none.
   */
  mockSetNone: (): SubscriptionInfo => {
    return {
      status: 'none',
      currentPlan: 'none',
      billingCycle: 'none',
      trialActive: false,
      autoRenew: false,
      renewsAt: null,
      expiresAt: null,
      source: 'mock',
    };
  },

  /**
   * Mock cancel flow.
   */
  mockCancel: (currentSub: SubscriptionInfo): SubscriptionInfo => {
    return {
      ...currentSub,
      autoRenew: false,
      renewsAt: null,
      expiresAt: currentSub.renewsAt, // Expires at the end of the current period
    };
  },

  /**
   * Mock reactivate flow.
   */
  mockReactivate: (currentSub: SubscriptionInfo): SubscriptionInfo => {
    return {
      ...currentSub,
      autoRenew: true,
      renewsAt: currentSub.expiresAt,
      expiresAt: null,
    };
  },

  /**
   * Mock toggle auto-renew.
   */
  mockToggleAutoRenew: (currentSub: SubscriptionInfo): SubscriptionInfo => {
    if (currentSub.autoRenew) {
      return subscriptionService.mockCancel(currentSub);
    } else {
      return subscriptionService.mockReactivate(currentSub);
    }
  },

  /**
   * Mock change plan.
   */
  mockChangePlan: (currentSub: SubscriptionInfo, newPlan: 'monthly' | 'yearly'): SubscriptionInfo => {
    const now = new Date();
    const renewsAt = new Date();
    if (newPlan === 'yearly') renewsAt.setFullYear(now.getFullYear() + 1);
    else renewsAt.setMonth(now.getMonth() + 1);

    return {
      ...currentSub,
      currentPlan: newPlan,
      billingCycle: newPlan,
      renewsAt: renewsAt.toISOString(),
      expiresAt: null,
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
