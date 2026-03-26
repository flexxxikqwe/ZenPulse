import { Meditation } from '../data/meditations';
import { ENV } from '../config/env';

export type AnalyticsEvent =
  | { name: 'app_opened' }
  | { name: 'onboarding_started' }
  | { name: 'onboarding_completed'; properties: { goals: string[]; preferredDuration: number } }
  | { name: 'goal_selected'; properties: { goal: string } }
  | { name: 'library_viewed' }
  | { name: 'meditation_opened'; properties: { meditationId: string; meditationTitle: string } }
  | { name: 'meditation_started'; properties: { meditationId: string; meditationTitle: string } }
  | { name: 'meditation_completed'; properties: { meditationId: string; meditationTitle: string; durationMinutes: number } }
  | { name: 'paywall_viewed' }
  | { name: 'plan_selected'; properties: { planId: 'monthly' | 'yearly' } }
  | { name: 'trial_started_mock'; properties: { planId: 'monthly' | 'yearly' } }
  | { name: 'premium_locked_clicked'; properties: { meditationId: string } }
  | { name: 'continue_session_clicked'; properties: { meditationId: string } }
  | { name: 'recommended_clicked'; properties: { meditationId: string; reason: string } }
  | { name: 'mood_check_started' }
  | { name: 'mood_check_completed'; properties: { mood: string; recommendedId: string } }
  | { name: 'mood_check_failed'; properties: { error: string } }
  | { name: 'filter_toggled'; properties: { filterType: string; value: string } }
  | { name: 'filters_cleared' }
  | { name: 'library_mode_switched'; properties: { mode: 'explore' | 'saved' } }
  | { name: 'search_performed'; properties: { query: string } };

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public trackEvent(event: AnalyticsEvent) {
    // Mock implementation: log to console in development
    if (ENV.IS_DEV) {
      console.log(`[Analytics] Event: ${event.name}`, 'properties' in event ? event.properties : '');
    }

    // Future integration points:
    // posthog.capture(event.name, 'properties' in event ? event.properties : {});
    // firebase.analytics().logEvent(event.name, 'properties' in event ? event.properties : {});
  }

  public identify(userId: string, traits?: Record<string, any>) {
    if (ENV.IS_DEV) {
      console.log(`[Analytics] Identify User: ${userId}`, traits);
    }
    // posthog.identify(userId, traits);
  }
}

export const analytics = AnalyticsService.getInstance();
