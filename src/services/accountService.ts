import { UserProfile, AuthProvider } from '../types/UserProfile';

export const accountService = {
  /**
   * Mock account deletion.
   */
  mockDeleteAccount: (profile: UserProfile): void => {
    console.log(`Mock: Account deletion initiated for user: ${profile.id} (${profile.email})`);
    // In a real app, this would call a cloud function or backend API
  },

  /**
   * Mock progress reset.
   */
  mockResetProgress: (profile: UserProfile): void => {
    console.log(`Mock: Progress reset initiated for user: ${profile.id}`);
    // In a real app, this would clear cloud-synced progress
  },

  /**
   * Returns a user-friendly label for the current auth provider.
   */
  getAuthProviderLabel: (provider: AuthProvider): string => {
    switch (provider) {
      case 'google': return 'Google';
      case 'apple': return 'Apple';
      case 'email': return 'Email';
      default: return 'Guest';
    }
  }
};
