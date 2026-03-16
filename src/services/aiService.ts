import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
// The API key is handled by the platform via process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AIRecommendation {
  affirmation: string;
  meditationId: string;
}

export const getMeditationRecommendation = async (mood: string): Promise<AIRecommendation> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `You are a meditation and mindfulness expert. 
    The user is currently feeling: ${mood}. 
    
    1. Generate a short, 1-2 sentence meditation-style affirmation to help them. 
    2. Recommend one meditation ID from the following list that best matches their mood:
       - "calm_01" (Morning Calm)
       - "focus_01" (Deep Focus)
       - "sleep_01" (Sleep Recovery)
       - "stress_01" (Stress Reset)
       - "calm_02" (Breathing Space)
       - "focus_02" (Creative Flow)
       - "sleep_02" (Night Rain)
       - "stress_02" (Anxiety Release)
    
    Return the response in JSON format:
    {
      "affirmation": "your affirmation here",
      "meditationId": "recommended_id_here"
    }`;

    const response = await genAI.models.generateContent({
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
    // Fallback logic
    const fallbacks: Record<string, AIRecommendation> = {
      'Calm': { affirmation: "Take a deep breath and allow serenity to fill your mind.", meditationId: "calm_01" },
      'Neutral': { affirmation: "Pause for a moment and reconnect with yourself.", meditationId: "calm_02" },
      'Tired': { affirmation: "Let your body rest and your mind unwind.", meditationId: "sleep_01" },
      'Stressed': { affirmation: "Breathe in peace, breathe out tension.", meditationId: "stress_01" }
    };
    return fallbacks[mood] || { affirmation: "Breathe in peace, breathe out tension.", meditationId: "calm_01" };
  }
};
