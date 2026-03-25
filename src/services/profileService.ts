import { UserProfile, MeditationProgress, SubscriptionInfo } from '../types/UserProfile';
import { loadProfile, saveProfile } from '../utils/storage';

export interface ProfileService {
  getProfile(): Promise<UserProfile | null>;
  saveProfile(profile: UserProfile): Promise<void>;
  syncProfile(profile: UserProfile): Promise<UserProfile>;
  resetProfile(): Promise<void>;
}

class LocalProfileService implements ProfileService {
  async getProfile(): Promise<UserProfile | null> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(loadProfile()), 100);
    });
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        saveProfile(profile);
        resolve();
      }, 100);
    });
  }

  async syncProfile(profile: UserProfile): Promise<UserProfile> {
    // In a real backend, this would merge local and server state
    await this.saveProfile(profile);
    return profile;
  }

  async resetProfile(): Promise<void> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // We can't easily call saveProfile(DEFAULT_PROFILE) here without circular dependency 
        // or importing DEFAULT_PROFILE. For now, we'll just clear it.
        localStorage.removeItem('zenpulse_user_profile');
        resolve();
      }, 100);
    });
  }
}

export const profileService: ProfileService = new LocalProfileService();
