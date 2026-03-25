# ZenPulse — Premium Wellness & Meditation Platform

**ZenPulse** is a production-grade meditation and mindfulness application built with a focus on exceptional user experience, accessibility, and personalized content delivery. It demonstrates a complete product lifecycle from a personalized onboarding flow to a sophisticated content library and an immersive playback experience.

> **Status:** Beta-ready Demo / Product-grade Portfolio Project. This project is designed to showcase frontend engineering standards, architectural patterns, and product-minded development.

---

## 🚀 Demo Overview
ZenPulse isn't just a list of audio files; it's a cohesive ecosystem:
- **Personalized Onboarding:** Tailors the experience based on user goals (stress, sleep, focus).
- **AI-Driven Discovery:** Mood-based recommendations and goal-oriented content sections.
- **Immersive Playback:** A high-fidelity audio player with real-time progress tracking and ambient visuals.
- **Premium Ecosystem:** A fully implemented (simulated) subscription model with feature gating and paywall flows.
- **User Collection:** A dedicated "Saved" space for personal favorites with contextual search.

---

## 🛠 Tech Stack
- **Core:** React 18 (Hooks, Context API, Suspense)
- **Language:** TypeScript (Strict mode, custom interfaces)
- **Styling:** Tailwind CSS (Utility-first, responsive design, dark mode support)
- **Animations:** Framer Motion (`motion/react`) for layout transitions and micro-interactions
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Analytics:** Custom Service-oriented tracking (pluggable architecture)

---

## 🏗 Architectural Decisions
- **Service-Oriented Architecture (SOA):** Business logic is decoupled from UI components into dedicated services (`meditationService`, `subscriptionService`, `analyticsService`). This ensures testability and easy migration to real backends.
- **Context-Based State Management:** Uses React Context for global states like `UserProfile` and `Theme`, avoiding prop-drilling while maintaining performance through memoization.
- **Atomic Component Design:** UI is built from reusable, accessible primitives (Cards, Rings, Buttons) that adapt to dark/light modes.
- **Controlled Navigation:** A centralized `AppNavigator` manages complex transitions between library, playback, profile, and modal states (Paywall, Mood Check).

---

## 🧠 Key Engineering Challenges Solved

### 1. Personalization & Discovery
Implemented a recommendation engine that combines user goals, preferred durations, and real-time mood input to suggest the most relevant sessions.

### 2. Audio Playback Engine
Developed a custom playback interface that handles state synchronization, progress persistence, and immersive UI transitions without breaking the application flow.

### 3. Premium UX & Feature Gating
Built a systemic subscription logic. Features like "Premium-only" meditations are gated at the service level, providing a seamless "Unlock" flow that integrates with the `PaywallScreen`.

### 4. Accessibility (A11y)
- **Semantic HTML:** Proper use of landmarks and heading hierarchies.
- **Interactive Elements:** Eliminated nested buttons, ensured 44px+ touch targets, and implemented `aria-labels`.
- **Motion Control:** Integrated `useReducedMotion` to respect system-level accessibility preferences.

### 5. Performance Optimization
- **Memoization:** Strategic use of `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders in heavy list views.
- **Asset Handling:** Optimized image loading with `referrerPolicy` and lazy-loading patterns.

### 6. Service Boundaries & Env Hardening
Implemented a robust environment configuration (`env.ts`) and service boundaries that allow the app to run in "Demo Mode" while being ready for real API integration.

---

## 📂 Project Structure
```text
src/
├── components/       # Reusable UI components (Atomic design)
├── context/          # Global state (Theme, User Profile)
├── data/             # Mock data and content definitions
├── navigation/       # AppNavigator and routing logic
├── screens/          # Main view containers (Library, Playback, Profile)
├── services/         # Business logic (Analytics, Subscription, Content)
├── types/            # Global TypeScript definitions
└── lib/              # Utility functions
```

---

## ⚙️ Local Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in required keys (if any).
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

---

## 💎 Why this project?
This project demonstrates more than just coding skills. It shows:
- **Product Thinking:** Understanding how onboarding affects retention.
- **Attention to Detail:** Micro-animations, empty states, and error handling.
- **Scalability:** Code written with the assumption that the team and feature set will grow.
- **Quality Assurance:** Clean linting, strict typing, and architectural consistency.

---
*Developed by a Frontend Engineer focused on building products that matter.*
