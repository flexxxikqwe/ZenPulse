# ZenPulse — AI-Powered Mindfulness & Meditation Platform

**ZenPulse** is a product-oriented meditation application built with a focus on exceptional user experience, accessibility, and personalized content delivery. It demonstrates a complete product lifecycle—from a personalized onboarding flow to a sophisticated content library and an immersive playback experience.

> **Status:** Beta-ready Demo / Product-grade Portfolio Project. This project is designed to showcase frontend engineering standards, architectural patterns, and product-minded development.

---

## 🚀 Product Overview
ZenPulse isn't just a list of audio files; it's a cohesive ecosystem designed to solve the "choice paralysis" in wellness apps:
- **Personalized Onboarding:** Tailors the experience based on user goals (stress, sleep, focus) and daily time commitment.
- **AI Mood Check:** A dedicated flow that uses AI to recommend sessions based on the user's current emotional state.
- **Explore & Saved Collections:** A dual-mode library ("Explore" for discovery, "Saved" for personal favorites) with contextual search and filtering.
- **Immersive Playback:** A high-fidelity audio player with real-time progress tracking, ambient visuals, and session completion rewards.
- **Habit Loop:** Integrated streak tracking and daily goal visualization to encourage consistent practice.
- **Premium Ecosystem:** A fully implemented (simulated) subscription model with feature gating, trial flows, and a dedicated "Manage Subscription" demo control center.

---

## 🛠 Tech Stack & Tools
- **Core:** React 19 (Hooks, Context API, Suspense)
- **Language:** TypeScript (Strict mode, custom interfaces, type-safe services)
- **Styling:** Tailwind CSS 4 (Utility-first, responsive design, dark mode support)
- **Animations:** motion/react (Framer Motion) for layout transitions and micro-interactions
- **Icons:** Lucide React
- **Build Tool:** Vite
- **AI Integration:** @google/genai (Gemini Flash 3) for mood-based recommendations
- **Analytics:** Custom Service-oriented tracking (pluggable architecture)

---

## 🏗 Architectural Decisions

### 1. Service-Oriented Architecture (SOA)
Business logic is decoupled from UI components into dedicated, type-safe services (`meditationService`, `subscriptionService`, `analyticsService`). This ensures:
- **Testability:** Logic can be tested independently of the UI.
- **Scalability:** Easy migration from mock data to real REST/GraphQL APIs.
- **Maintainability:** Clear separation of concerns.

### 2. Context-Based State Management
Uses React Context for global states like `UserProfile` and `Theme`. This avoids prop-drilling while maintaining performance through strategic memoization and granular updates.

### 3. Atomic Component Design
The UI is built from reusable, accessible primitives (Cards, Rings, Buttons, Modals) that adapt to dark/light modes and respect user preferences.

### 4. Centralized Navigation
A robust `AppNavigator` manages complex transitions between the library, playback, profile, and modal states (Paywall, Mood Check, Settings), ensuring a consistent user flow.

---

## 🧠 Engineering Highlights

### 1. Accessibility (A11y) First
- **Semantic HTML:** Proper use of landmarks, ARIA roles, and heading hierarchies.
- **Interactive Elements:** 44px+ touch targets, keyboard navigation support, and descriptive `aria-labels`.
- **Motion Control:** Integrated `useReducedMotion` to respect system-level accessibility preferences.

### 2. Performance Optimization
- **Memoization:** Strategic use of `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders in heavy list views.
- **Asset Handling:** Optimized image loading with `referrerPolicy` and lazy-loading patterns.

### 3. Premium UX & Feature Gating
Built a systemic subscription logic. Features like "Premium-only" meditations are gated at the service level, providing a seamless "Unlock" flow that integrates with the `PaywallScreen`.

### 4. Service Boundaries & Env Hardening
Implemented a robust environment configuration and service boundaries that allow the app to run in "Demo Mode" while being ready for production deployment.

---

## 📂 Project Structure
```text
src/
├── components/       # Reusable UI components (Atomic design)
├── context/          # Global state (Theme, User Profile)
├── data/             # Content definitions and mock data
├── navigation/       # AppNavigator and routing logic
├── screens/          # Main view containers (Library, Playback, Profile)
├── services/         # Business logic (Analytics, Subscription, Content)
├── types/            # Global TypeScript definitions
└── utils/            # Utility functions and helpers
```

---

## ⚙️ Local Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Copy `.env.example` to `.env` and add your `GEMINI_API_KEY`.
4. **Run development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🚧 Beta Limitations & Roadmap
- **Persistence:** Current version uses `localStorage` for profile data. Roadmap includes Firebase/Supabase integration.
- **Audio:** Uses placeholder audio streams. Real-world implementation would require a CDN/HLS integration.
- **Social:** "Share" features are currently UI-only.
- **Localization:** Currently English-only. i18next integration is planned.

---

## 💎 Why this project shows my level?
This project demonstrates more than just coding skills. It shows:
- **Product Thinking:** Understanding how onboarding and personalization affect user retention.
- **Attention to Detail:** Micro-animations, empty states, and robust error handling.
- **Engineering Standards:** Clean linting, strict typing, and architectural consistency.
- **UX Maturity:** Implementing a complex subscription/paywall flow that feels native and non-intrusive.

---
*Developed with focus on building high-quality, product-ready frontend applications.*
