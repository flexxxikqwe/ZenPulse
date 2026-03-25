import { GoogleGenAI } from "@google/genai";
import { ENV, isAIReady } from "../config/env";

export interface AIRecommendation {
  affirmation: string;
  meditationId: string;
}

export interface AIService {
  getMeditationRecommendation(mood: string, userGoals: string[], preferredDuration: number): Promise<AIRecommendation>;
}

/**
 * Implementation that calls Gemini directly from the client.
 * WARNING: This is for beta/dev only. Client-side keys are NOT production-safe.
 */
class GeminiClientAIService implements AIService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
  }

  async getMeditationRecommendation(mood: string, userGoals: string[] = [], preferredDuration: number = 10): Promise<AIRecommendation> {
    try {
      if (!ENV.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing for client-side call.");
      }

      const model = "gemini-3-flash-preview";
      const goalsText = userGoals.length > 0 ? `Their wellness goals are: ${userGoals.join(", ")}.` : "";
      const prompt = `You are a meditation and mindfulness expert. 
      The user is currently feeling: ${mood}. ${goalsText}
      They prefer meditations around ${preferredDuration} minutes long.
      
      1. Generate a short, 1-2 sentence meditation-style affirmation to help them. 
      2. Recommend one meditation ID from the following list that best matches their mood, goals, and preferred duration:
         - "calm_01" (Morning Calm, 5 min, tags: stress, focus)
         - "focus_01" (Deep Focus, 10 min, tags: focus)
         - "sleep_01" (Sleep Recovery, 15 min, tags: sleep)
         - "stress_01" (Stress Reset, 8 min, tags: stress)
         - "calm_02" (Breathing Space, 3 min, tags: stress)
         - "focus_02" (Creative Flow, 12 min, tags: focus)
         - "sleep_02" (Night Rain, 20 min, tags: sleep)
         - "stress_02" (Anxiety Release, 10 min, tags: stress)
      
      Return the response in JSON format:
      {
        "affirmation": "your affirmation here",
        "meditationId": "recommended_id_here"
      }`;

      const response = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        affirmation: result.affirmation || "Take a deep breath and find your inner peace.",
        meditationId: result.meditationId || "calm_01"
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return getFallback(mood);
    }
  }
}

/**
 * Implementation that calls a backend proxy.
 * This is the production-safe approach.
 */
class ProxyAIService implements AIService {
  async getMeditationRecommendation(mood: string, userGoals: string[], preferredDuration: number): Promise<AIRecommendation> {
    try {
      const response = await fetch(`${ENV.APP_URL}/api/ai/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, userGoals, preferredDuration }),
      });

      if (!response.ok) throw new Error("Backend proxy error");
      return await response.json();
    } catch (error) {
      console.error("Error calling AI proxy:", error);
      return getFallback(mood);
    }
  }
}

const getFallback = (mood: string): AIRecommendation => {
  const fallbacks: Record<string, AIRecommendation> = {
    'Calm': { affirmation: "Take a deep breath and allow serenity to fill your mind.", meditationId: "calm_01" },
    'Neutral': { affirmation: "Pause for a moment and reconnect with yourself.", meditationId: "calm_02" },
    'Tired': { affirmation: "Let your body rest and your mind unwind.", meditationId: "sleep_01" },
    'Stressed': { affirmation: "Breathe in peace, breathe out tension.", meditationId: "stress_01" }
  };
  return fallbacks[mood] || { affirmation: "Breathe in peace, breathe out tension.", meditationId: "calm_01" };
};

/**
 * Main AI Service factory.
 * Switches between direct client calls (beta/dev) and backend proxy (prod).
 */
class AIServiceManager implements AIService {
  private service: AIService;

  constructor() {
    if (ENV.USE_BACKEND_AI) {
      this.service = new ProxyAIService();
    } else {
      this.service = new GeminiClientAIService();
    }
  }

  async getMeditationRecommendation(mood: string, userGoals: string[], preferredDuration: number): Promise<AIRecommendation> {
    if (!isAIReady()) {
      return getFallback(mood);
    }
    return this.service.getMeditationRecommendation(mood, userGoals, preferredDuration);
  }
}

export const aiService: AIService = new AIServiceManager();

// Legacy export for compatibility
export const getMeditationRecommendation = (mood: string, userGoals: string[], preferredDuration: number) => 
  aiService.getMeditationRecommendation(mood, userGoals, preferredDuration);
