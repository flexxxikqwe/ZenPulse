export interface MeditationProgress {
  meditationId: string;
  meditationTitle: string;
  progressPercent: number;
  lastPositionSeconds: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  isPremium: boolean;
  totalMeditationsCompleted: number;
  totalMeditationMinutes: number;
  meditationProgress: MeditationProgress[];
}
