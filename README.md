# ZenPulse — Product-Oriented AI Meditation Platform

**ZenPulse** is a high-fidelity, product-driven meditation application designed to demonstrate modern frontend engineering standards, exceptional UX/UI patterns, and a deep understanding of the product lifecycle. It transitions from a personalized onboarding flow to an immersive, audio-first meditation experience, showcasing how technical decisions directly support user retention and engagement.

> **Current Status:** **Beta-ready Demo**. This project is a feature-complete prototype designed for portfolio demonstration, focusing on architectural integrity, accessibility, and product-minded development.

---

## 🚀 Product Overview
ZenPulse solves the "choice paralysis" common in wellness apps by providing a guided, personalized journey:
- **Personalized Onboarding:** Tailors the content library based on user-defined goals (Stress Relief, Better Sleep, Deep Focus) and daily time commitment.
- **AI-Powered Mood Check:** Uses Gemini AI to analyze user input and recommend the most relevant meditation session for their current emotional state.
- **Audio-First Experience:** An immersive playback engine with real-time progress tracking, ambient visuals, and seamless looping for nature sounds.
- **Habit Formation:** Integrated streak tracking and daily goal visualization to encourage consistent user practice (Habit Loop).
- **Premium Ecosystem:** A simulated subscription model with feature gating, trial flows, and a dedicated "Manage Subscription" control center for demo purposes.

---

## 🛠 Tech Stack
- **Core:** React 19 (Hooks, Context API, Suspense)
- **Language:** TypeScript (Strict mode, custom interfaces, type-safe service layer)
- **Styling:** Tailwind CSS 4 (Utility-first, responsive design, dark mode)
- **Animations:** `motion/react` (Framer Motion) for layout transitions and micro-interactions
- **Icons:** Lucide React
- **Build Tool:** Vite
- **AI Integration:** `@google/genai` (Gemini 3 Flash) for mood-based recommendations
- **Persistence:** LocalStorage-based state persistence for profile and favorites

---

## 🏗 Engineering & Architectural Decisions

### 1. State-Based Navigation & Flow Control
Instead of traditional URL-based routing (which can be overkill for a single-purpose mobile-web app), ZenPulse uses a robust **State-Based Navigation** pattern. This allows for seamless transitions between onboarding, library, and playback states while maintaining a lightweight footprint.

### 2. Service-Oriented Architecture (SOA)
Business logic is decoupled from UI components into dedicated, type-safe services (`meditationService`, `subscriptionService`, `analyticsService`). This ensures the app is **ready for backend integration**—mock data can be swapped for real API calls with zero changes to the UI layer.

### 3. Audio-First Beta Architecture
The playback engine is built to handle high-fidelity audio with a focus on stability. It includes:
- **CORS-Hardening:** Explicit `crossOrigin` handling for hosted assets.
- **Seamless Looping:** Native implementation for nature sounds (Rain, Forest) to ensure an uninterrupted experience.
- **Error Boundaries:** Graceful handling of network issues or missing assets.

### 4. Hosted Asset Catalog
To ensure reliability in deployment without bloating the repository, ZenPulse uses a **Hosted Asset Strategy**. Audio files are served from a stable storage (Vercel Blob), providing a production-like experience for the end-user while keeping the codebase clean.

---

## 📂 Project Structure
```text
src/
├── components/       # Atomic UI components (Buttons, Cards, Modals)
├── context/          # Global state (UserProfileContext, ThemeContext)
├── data/             # Content definitions and curated audio mapping
├── navigation/       # AppNavigator and navigation state logic
├── screens/          # Main view containers (Onboarding, Library, Playback)
├── services/         # Business logic (AI, Analytics, Subscription)
├── types/            # Global TypeScript interfaces and enums
└── utils/            # Shared helpers and formatting logic
```

---

## ⚙️ Local Development

### 1. Installation
```bash
npm install
```

### 2. Running the App
```bash
npm run dev
```

### 3. Environment Setup
Create a `.env` file in the root directory (refer to `.env.example`):
- `VITE_GEMINI_API_KEY`: Your Gemini API key (required for Mood Check).
- `VITE_APP_URL`: The local or hosted URL of the app.
- `VITE_USE_BACKEND_AI`: Set to `false` for client-side AI (default for demo).

> **Note on AI Security:** In this beta version, the AI key is used client-side for demonstration purposes. A production-ready version would proxy these calls through a secure backend.

---

## 🎵 Audio Assets Note
ZenPulse uses a **curated beta catalog** of high-quality audio. 
- **Storage:** Assets are hosted on Vercel Blob Storage for high availability.
- **Mapping:** Each meditation is strictly mapped to a specific audio asset (Sleep, Calm, Focus, Nature) to ensure product-content alignment.
- **Local Fallback:** The system is designed to easily switch to local assets in `public/audio/` if needed.

---

## 🚧 Known Limitations & Roadmap
- **Mock Authentication:** Current version uses a simulated auth state. Roadmap includes Firebase/Supabase integration.
- **Client-Side AI:** AI calls are currently direct from the client; production requires a backend proxy.
- **Billing:** Subscription flows are simulated for UX demonstration; no real payments are processed.
- **Content Scale:** The catalog is a curated "Beta" set. Future iterations will include a dynamic CMS integration.

---

## 💎 Why This Project Matters
ZenPulse is designed to show a **Strong Junior / Junior+** level of expertise by demonstrating:
- **Product Mindset:** Understanding how onboarding, personalization, and habit loops drive user value.
- **UX Iteration:** Polished transitions, micro-animations, and a focus on "feel" (using Framer Motion).
- **Engineering Standards:** Clean, documented code with strict TypeScript usage and clear service boundaries.
- **Accessibility & Performance:** 44px+ touch targets, semantic HTML, and strategic memoization for smooth performance on mobile devices.
- **Evolution:** The project shows a clear path from an MVP toward a beta-quality application, proving the ability to harden a product for real-world use.

---
*Built with a focus on product integrity and frontend excellence.*
