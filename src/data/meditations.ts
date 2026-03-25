export type MediaType = 'simulation' | 'audio' | 'youtube';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Meditation {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  audioFile: string;
  premiumRequired: boolean;
  tags: string[];
  mediaType: MediaType;
  mediaUrl?: string;
  // New metadata
  instructor?: string;
  difficulty?: Difficulty;
  benefits?: string[];
  coverImage?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  longDescription?: string;
  contentSource?: string;
}

export const meditations: Meditation[] = [
  { 
    id: "calm_01", 
    title: "Morning Calm", 
    description: "Start your day with a peaceful mind", 
    durationMinutes: 5, 
    category: "Quick Calm", 
    audioFile: "morning_calm.mp3", 
    premiumRequired: false,
    tags: ["stress", "focus"],
    mediaType: "simulation",
    instructor: "Sarah Jenkins",
    difficulty: "Beginner",
    benefits: ["Energy Boost", "Mental Clarity", "Positive Intent"],
    isFeatured: true,
    isNew: false,
    longDescription: "A gentle morning meditation designed to awaken your senses and set a positive intention for the day ahead. This session uses focused breathwork and light visualization to clear mental fog and cultivate a state of vibrant awareness, making it perfect for those who want to start their morning with purpose."
  },
  { 
    id: "focus_01", 
    title: "Deep Focus", 
    description: "Clear your mind and concentrate", 
    durationMinutes: 10, 
    category: "Focus", 
    audioFile: "deep_focus.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "simulation",
    instructor: "Dr. Michael Chen",
    difficulty: "Intermediate",
    benefits: ["Deep Concentration", "Flow State", "Reduced Distraction"],
    isFeatured: false,
    isNew: false,
    longDescription: "Using advanced mindfulness techniques, this session helps you eliminate external and internal distractions to enter a state of deep flow. Ideal for work, study, or any creative endeavor that requires your full presence and mental edge."
  },
  { 
    id: "sleep_01", 
    title: "Sleep Recovery", 
    description: "Drift into a deep and restful sleep", 
    durationMinutes: 15, 
    category: "Sleep", 
    audioFile: "sleep_recovery.mp3", 
    premiumRequired: true,
    tags: ["sleep"],
    mediaType: "simulation",
    instructor: "Elena Rossi",
    difficulty: "Beginner",
    benefits: ["Restorative Sleep", "Physical Relaxation", "Quiet Mind"],
    isFeatured: true,
    isNew: true,
    longDescription: "A soothing body scan meditation that systematically releases tension from every muscle group, preparing your body and mind for a restorative night's sleep. Let go of the day's stress and drift into a peaceful slumber."
  },
  { 
    id: "stress_01", 
    title: "Stress Reset", 
    description: "Release tension and find balance", 
    durationMinutes: 8, 
    category: "Stress Relief", 
    audioFile: "stress_reset.mp3", 
    premiumRequired: true,
    tags: ["stress"],
    mediaType: "simulation",
    instructor: "Marcus Thorne",
    difficulty: "Beginner",
    benefits: ["Emotional Balance", "Nervous System Calm", "Grounding"],
    isFeatured: false,
    isNew: false,
    longDescription: "When life feels overwhelming, this quick reset helps you ground yourself and find your center again. Through controlled breathing and grounding visualizations, you'll lower your cortisol levels and regain emotional stability."
  },
  { 
    id: "calm_02", 
    title: "Breathing Space", 
    description: "A short break to reconnect with your breath", 
    durationMinutes: 3, 
    category: "Quick Calm", 
    audioFile: "breathing_space.mp3", 
    premiumRequired: false,
    tags: ["stress"],
    mediaType: "simulation",
    instructor: "Sarah Jenkins",
    difficulty: "Beginner",
    benefits: ["Instant Calm", "Present Moment Awareness", "Stress Interruption"],
    isFeatured: false,
    isNew: true,
    longDescription: "A 3-minute emergency meditation for when you need to step back from a stressful situation. This 'breathing space' acts as a circuit breaker for stress, allowing you to respond rather than react."
  },
  { 
    id: "focus_02", 
    title: "Creative Flow", 
    description: "Unlock your creative potential", 
    durationMinutes: 12, 
    category: "Focus", 
    audioFile: "creative_flow.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "simulation",
    instructor: "David Wu",
    difficulty: "Intermediate",
    benefits: ["Creative Insight", "Open Awareness", "Mental Flexibility"],
    isFeatured: false,
    isNew: false,
    longDescription: "This session uses open-monitoring meditation to help you access deeper creative insights and overcome mental blocks. By widening your field of awareness, you'll find new connections and fresh perspectives."
  },
  { 
    id: "sleep_02", 
    title: "Night Rain", 
    description: "Soothing sounds of rain for better sleep", 
    durationMinutes: 20, 
    category: "Sleep", 
    audioFile: "night_rain.mp3", 
    premiumRequired: false,
    tags: ["sleep"],
    mediaType: "simulation",
    instructor: "Ambient Nature",
    difficulty: "Beginner",
    benefits: ["Deep Rest", "Sound Masking", "Natural Rhythm"],
    isFeatured: false,
    isNew: false,
    longDescription: "Immerse yourself in the gentle patter of night rain. This simulation combines high-fidelity audio with rhythmic visuals to lull you into a deep sleep, masking disruptive environmental noises."
  },
  { 
    id: "stress_02", 
    title: "Anxiety Release", 
    description: "Calm your nervous system", 
    durationMinutes: 10, 
    category: "Stress Relief", 
    audioFile: "anxiety_release.mp3", 
    premiumRequired: true,
    tags: ["stress"],
    mediaType: "simulation",
    instructor: "Dr. Michael Chen",
    difficulty: "Advanced",
    benefits: ["Acute Anxiety Relief", "Vagus Nerve Activation", "Inner Peace"],
    isFeatured: true,
    isNew: false,
    longDescription: "A specialized session focusing on the vagus nerve and nervous system regulation. This advanced practice uses specific breathing patterns to signal safety to your brain and calm acute anxiety symptoms."
  },
  { 
    id: "calm_03", 
    title: "Mindful Walk", 
    description: "Bring awareness to your movement", 
    durationMinutes: 15, 
    category: "Quick Calm", 
    audioFile: "mindful_walk.mp3", 
    premiumRequired: true,
    tags: ["stress", "focus"],
    mediaType: "simulation",
    instructor: "Elena Rossi",
    difficulty: "Beginner",
    benefits: ["Active Presence", "Mind-Body Connection", "Stress Reduction"],
    isFeatured: false,
    isNew: false,
    longDescription: "Turn your daily walk into a powerful mindfulness practice. Learn to synchronize your breath with your steps and find peace in every movement, connecting deeply with your physical sensations and surroundings."
  },
  { 
    id: "focus_03", 
    title: "Study Session", 
    description: "Perfect background for learning", 
    durationMinutes: 45, 
    category: "Focus", 
    audioFile: "study_session.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "simulation",
    instructor: "ZenPulse AI",
    difficulty: "Beginner",
    benefits: ["Sustained Attention", "Learning Efficiency", "Mental Endurance"],
    isFeatured: false,
    isNew: false,
    longDescription: "A long-form session designed to be played in the background while you study or work on complex tasks. It uses subtle audio cues to help maintain sustained attention and prevent mental fatigue."
  },
  {
    id: "nature_01",
    title: "Forest Stream",
    description: "Immerse yourself in nature's sounds",
    durationMinutes: 10,
    category: "Nature",
    audioFile: "forest_stream.mp3",
    premiumRequired: false,
    tags: ["stress", "calm"],
    mediaType: "audio",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    instructor: "Nature Itself",
    difficulty: "Beginner",
    benefits: ["Grounding", "Natural Peace", "Stress Dissolution"],
    isFeatured: false,
    isNew: true,
    longDescription: "High-quality field recordings of a mountain stream. Perfect for grounding and finding a moment of peace in a busy day. Let the rhythmic sound of flowing water wash away your worries."
  }
];
