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

const ASSET_BASE_URL = "https://5ybaoh0byfbwa23f.public.blob.vercel-storage.com";

export const meditations: Meditation[] = [
  { 
    id: "calm_01", 
    title: "Morning Calm", 
    description: "Start your day with a peaceful mind", 
    durationMinutes: 3, 
    category: "Quick Calm", 
    audioFile: "calm-relief.mp3", 
    premiumRequired: false,
    tags: ["stress", "focus"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/calm-relief.mp3`,
    instructor: "Sarah Jenkins",
    difficulty: "Beginner",
    benefits: ["Energy Boost", "Mental Clarity", "Positive Intent"],
    isFeatured: true,
    isNew: false,
    longDescription: "A gentle morning meditation designed to awaken your senses and set a positive intention for the day ahead. This session uses focused breathwork to clear mental fog and cultivate a state of vibrant awareness."
  },
  { 
    id: "focus_01", 
    title: "Deep Focus", 
    description: "Clear your mind and concentrate", 
    durationMinutes: 4, 
    category: "Focus", 
    audioFile: "focus-steady.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/focus-steady.mp3`,
    instructor: "Dr. Michael Chen",
    difficulty: "Intermediate",
    benefits: ["Deep Concentration", "Flow State", "Reduced Distraction"],
    isFeatured: false,
    isNew: false,
    longDescription: "Using advanced mindfulness techniques, this session helps you eliminate external and internal distractions to enter a state of deep flow. Perfect for intense work or study sessions."
  },
  { 
    id: "sleep_01", 
    title: "Sleep Recovery", 
    description: "Drift into a deep and restful sleep", 
    durationMinutes: 10, 
    category: "Sleep", 
    audioFile: "sleep-deep-rest.mp3", 
    premiumRequired: true,
    tags: ["sleep"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/sleep-deep-rest.mp3`,
    instructor: "Elena Rossi",
    difficulty: "Beginner",
    benefits: ["Restorative Sleep", "Physical Relaxation", "Quiet Mind"],
    isFeatured: true,
    isNew: true,
    longDescription: "A soothing body scan meditation that systematically releases tension from every muscle group. The deep, slow ambient soundscape prepares your body and mind for a restorative night's sleep."
  },
  { 
    id: "stress_01", 
    title: "Stress Reset", 
    description: "Release tension and find balance", 
    durationMinutes: 5, 
    category: "Stress Relief", 
    audioFile: "calm-relief.mp3", 
    premiumRequired: true,
    tags: ["stress"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/calm-relief.mp3`,
    instructor: "Marcus Thorne",
    difficulty: "Beginner",
    benefits: ["Emotional Balance", "Nervous System Calm", "Grounding"],
    isFeatured: false,
    isNew: false,
    longDescription: "When life feels overwhelming, this quick reset helps you ground yourself and find your center again through controlled breathing and soothing acoustic melodies."
  },
  { 
    id: "calm_02", 
    title: "Breathing Space", 
    description: "A short break to reconnect with your breath", 
    durationMinutes: 5, 
    category: "Quick Calm", 
    audioFile: "calm-relief.mp3", 
    premiumRequired: false,
    tags: ["stress"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/calm-relief.mp3`,
    instructor: "Sarah Jenkins",
    difficulty: "Beginner",
    benefits: ["Instant Calm", "Present Moment Awareness", "Stress Interruption"],
    isFeatured: false,
    isNew: true,
    longDescription: "A 5-minute emergency meditation for when you need to step back from a stressful situation. This session acts as a circuit breaker for stress, allowing you to regain composure."
  },
  { 
    id: "focus_02", 
    title: "Creative Flow", 
    description: "Unlock your creative potential", 
    durationMinutes: 4, 
    category: "Focus", 
    audioFile: "focus-steady.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/focus-steady.mp3`,
    instructor: "David Wu",
    difficulty: "Intermediate",
    benefits: ["Creative Insight", "Open Awareness", "Mental Flexibility"],
    isFeatured: false,
    isNew: false,
    longDescription: "This session uses a neutral ambient background to help you access deeper creative insights and overcome mental blocks by widening your field of awareness."
  },
  { 
    id: "sleep_02", 
    title: "Rainy Sleep Prep", 
    description: "Soothing rain loop for deep rest", 
    durationMinutes: 5, 
    category: "Sleep", 
    audioFile: "rain-ambience.mp3", 
    premiumRequired: false,
    tags: ["sleep"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/rain-ambience.mp3`,
    instructor: "Ambient Nature",
    difficulty: "Beginner",
    benefits: ["Deep Rest", "Sound Masking", "Natural Rhythm"],
    isFeatured: false,
    isNew: false,
    longDescription: "Immerse yourself in the gentle, seamless loop of night rain. This session uses high-fidelity field recordings to create a consistent sound shield for a restorative night's sleep."
  },
  { 
    id: "stress_02", 
    title: "Anxiety Release", 
    description: "Deeply ground your nervous system", 
    durationMinutes: 10, 
    category: "Stress Relief", 
    audioFile: "sleep-deep-rest.mp3", 
    premiumRequired: true,
    tags: ["stress"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/sleep-deep-rest.mp3`,
    instructor: "Dr. Michael Chen",
    difficulty: "Advanced",
    benefits: ["Acute Anxiety Relief", "Vagus Nerve Activation", "Inner Peace"],
    isFeatured: true,
    isNew: false,
    longDescription: "A specialized grounding session focusing on nervous system regulation. The deep, grounding ambient soundscape signals safety to your brain and helps dissolve acute anxiety symptoms."
  },
  { 
    id: "calm_03", 
    title: "Mindful Walk", 
    description: "Bring awareness to your movement", 
    durationMinutes: 3, 
    category: "Quick Calm", 
    audioFile: "calm-relief.mp3", 
    premiumRequired: true,
    tags: ["stress", "focus"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/calm-relief.mp3`,
    instructor: "Elena Rossi",
    difficulty: "Beginner",
    benefits: ["Active Presence", "Mind-Body Connection", "Stress Reduction"],
    isFeatured: false,
    isNew: false,
    longDescription: "Turn your daily walk into a powerful mindfulness practice. Learn to synchronize your breath with your steps and find peace in every movement with an uplifting background."
  },
  { 
    id: "focus_03", 
    title: "Focus Sprint", 
    description: "Quick 4-minute concentration burst", 
    durationMinutes: 4, 
    category: "Focus", 
    audioFile: "focus-steady.mp3", 
    premiumRequired: true,
    tags: ["focus"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/focus-steady.mp3`,
    instructor: "ZenPulse AI",
    difficulty: "Beginner",
    benefits: ["Sustained Attention", "Learning Efficiency", "Mental Endurance"],
    isFeatured: false,
    isNew: false,
    longDescription: "A high-intensity 4-minute focus sprint. Perfect for clearing mental fog between tasks or starting a new deep-work block with a steady, neutral background."
  },
  {
    id: "nature_01",
    title: "Forest Stream",
    description: "Immerse yourself in nature's sounds",
    durationMinutes: 3,
    category: "Nature",
    audioFile: "forest-ambience.mp3",
    premiumRequired: false,
    tags: ["stress", "calm"],
    mediaType: "audio",
    mediaUrl: `${ASSET_BASE_URL}/forest-ambience.mp3`,
    instructor: "Nature Itself",
    difficulty: "Beginner",
    benefits: ["Grounding", "Natural Peace", "Stress Dissolution"],
    isFeatured: false,
    isNew: true,
    longDescription: "High-quality field recordings of a mountain forest. Perfect for grounding and finding a moment of peace in a busy day through realistic nature ambience."
  }
];
