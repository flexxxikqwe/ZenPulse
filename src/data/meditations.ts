export interface Meditation {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  audioFile: string;
  premiumRequired: boolean;
}

export const meditations: Meditation[] = [
  { 
    id: "calm_01", 
    title: "Morning Calm", 
    description: "Start your day with a peaceful mind", 
    durationMinutes: 5, 
    category: "Quick Calm", 
    audioFile: "morning_calm.mp3", 
    premiumRequired: false 
  },
  { 
    id: "focus_01", 
    title: "Deep Focus", 
    description: "Clear your mind and concentrate", 
    durationMinutes: 10, 
    category: "Focus", 
    audioFile: "deep_focus.mp3", 
    premiumRequired: true 
  },
  { 
    id: "sleep_01", 
    title: "Sleep Recovery", 
    description: "Drift into a deep and restful sleep", 
    durationMinutes: 15, 
    category: "Sleep", 
    audioFile: "sleep_recovery.mp3", 
    premiumRequired: true 
  },
  { 
    id: "stress_01", 
    title: "Stress Reset", 
    description: "Release tension and find balance", 
    durationMinutes: 8, 
    category: "Stress Relief", 
    audioFile: "stress_reset.mp3", 
    premiumRequired: true 
  },
  { 
    id: "calm_02", 
    title: "Breathing Space", 
    description: "A short break to reconnect with your breath", 
    durationMinutes: 3, 
    category: "Quick Calm", 
    audioFile: "breathing_space.mp3", 
    premiumRequired: false 
  },
  { 
    id: "focus_02", 
    title: "Creative Flow", 
    description: "Unlock your creative potential", 
    durationMinutes: 12, 
    category: "Focus", 
    audioFile: "creative_flow.mp3", 
    premiumRequired: true 
  },
  { 
    id: "sleep_02", 
    title: "Night Rain", 
    description: "Soothing sounds of rain for better sleep", 
    durationMinutes: 20, 
    category: "Sleep", 
    audioFile: "night_rain.mp3", 
    premiumRequired: false 
  },
  { 
    id: "stress_02", 
    title: "Anxiety Release", 
    description: "Calm your nervous system", 
    durationMinutes: 10, 
    category: "Stress Relief", 
    audioFile: "anxiety_release.mp3", 
    premiumRequired: true 
  },
  { 
    id: "calm_03", 
    title: "Mindful Walk", 
    description: "Bring awareness to your movement", 
    durationMinutes: 15, 
    category: "Quick Calm", 
    audioFile: "mindful_walk.mp3", 
    premiumRequired: true 
  },
  { 
    id: "focus_03", 
    title: "Study Session", 
    description: "Perfect background for learning", 
    durationMinutes: 45, 
    category: "Focus", 
    audioFile: "study_session.mp3", 
    premiumRequired: true 
  }
];
