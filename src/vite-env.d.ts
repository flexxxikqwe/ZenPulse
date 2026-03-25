/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_APP_URL: string;
  readonly VITE_USE_BACKEND_AI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
