/**
 * Centralized environment configuration for ZenPulse.
 * This helper abstracts the access to environment variables,
 * ensuring Vite compatibility and providing safe fallbacks.
 */

// We use import.meta.env for Vite-safe access.
// These are defined at build time in vite.config.ts or loaded from .env files.
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export const ENV = {
  // Environment flags
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,

  // API Keys & URLs
  // WARNING: VITE_GEMINI_API_KEY is for beta/dev only. 
  // Client-side keys are NOT production-safe.
  // Production MUST use a backend proxy.
  GEMINI_API_KEY: VITE_GEMINI_API_KEY || '',
  APP_URL: VITE_APP_URL || 'http://localhost:5173',

  // Feature Flags
  // Set VITE_USE_BACKEND_AI=true in .env to switch to proxy mode
  USE_BACKEND_AI: import.meta.env.VITE_USE_BACKEND_AI === 'true',
  ENABLE_ANALYTICS: import.meta.env.PROD,
};

// Development warnings to help with configuration
if (ENV.IS_DEV) {
  if (!ENV.GEMINI_API_KEY) {
    console.warn(
      '[ZenPulse Config] GEMINI_API_KEY is missing. ' +
      'AI recommendations will use local fallback mode. ' +
      'Configure it in the AI Studio Secrets panel.'
    );
  }
  
  if (!ENV.APP_URL) {
    console.info('[ZenPulse Config] APP_URL is not set. Using local defaults.');
  }
}

/**
 * Helper to check if AI features are ready to use.
 * Returns true if we have a client key OR if we are using a backend proxy.
 */
export const isAIReady = (): boolean => {
  return !!ENV.GEMINI_API_KEY || ENV.USE_BACKEND_AI;
};
