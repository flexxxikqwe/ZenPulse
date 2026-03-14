import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
// The API key is handled by the platform via process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const sendPromptToLLM = async (mood: string): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `You are a meditation and mindfulness expert. 
    The user is currently feeling: ${mood}. 
    Generate a short, 1-2 sentence meditation-style affirmation to help them. 
    The tone should be calm, supportive, and poetic. 
    Do not use any introductory text, just return the affirmation itself.`;

    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Take a deep breath and find your inner peace.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback affirmations if API fails
    switch (mood) {
      case 'Calm':
        return "Take a deep breath and allow serenity to fill your mind.";
      case 'Neutral':
        return "Pause for a moment and reconnect with yourself.";
      case 'Tired':
        return "Let your body rest and your mind unwind.";
      default:
        return "Breathe in peace, breathe out tension.";
    }
  }
};
