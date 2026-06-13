# 🎬 BollywoodVerse AI — Premium Cinematic Intelligence Hub

BollywoodVerse AI is a bespoke, production-ready, full-stack web application designed for film enthusiasts, historians, box office analysts, and content creators. It combines advanced server-side AI processing (utilizing the Google Gemini API), immersive aesthetic structures (using a cinematic gold-and-black palette), and high-fidelity interactive data visualizations (with Recharts) to establish the ultimate Bollywood entertainment platform.

The platform is designed to feel like an integrated blend of Netflix, IMDb, Spotify Recommendations, ChatGPT, and Letterboxd—all packaged inside an offline-resilient, beautifully animated viewport.

---

## 🌟 Key Functional Modules

1. **BollyGPT Companion Chat**: An energetic agent fluent in Hindi-English dialogue and famous quotes. Supports a bilingual browser speech-synthesis engine for dynamic audio readout and voice dictation.
2. **Success Predictor Sandbox**: A theatrical model where producers adjust budget, castes weight, director credentials, and marketing channels. Sends metrics to server-side AI to preview commercial viability gauges.
3. **Actor Career Analytics**: Explores star profile bios, awards, filmographies, and activity heatmaps. Features an AI audit form allowing users to type *any* Bollywood actor to construct active growth trends.
4. **Box Office Financial Analytics**: Translates worldwide blockbusters, decade net collection trends, and actor collection shares with interactive Recharts bar charts and currency toggles (INR vs USD).
5. **Mood-Based Cine Discovery**: Analyzes human emotional frequency (e.g. Happy, Motivated, Romantic, Thriller) to load matched film lists complete with taglines.
6. **AI Personalized Recommendations**: Lets users checkboxes movies they enjoyed to analyze recommended films, directors, and actors with detailed explanations.
7. **Interactive Film Timeline**: A decade-by-decade timeline detailing historical milestones, breakthrough blocks, and legendary actors from 1950 to 2026.
8. **Gamified Quiz Arena & Profile XP Tracker**: Multiple choice quizzes across diverse categories. Users earn points, level-up rankings, unlock dynamic trophies, and save titles in a persistent user profile.
9. **Administrative Moderation Console**: Monitors public critique listings and simulates new user allocations or censors written reviews.

---

## 🎨 Design Identity: Premium Bollywood Luxury

The visual environment balances theatrical lighting with deep contrast:
- **Canvas Base**: Deep charcoal base (`#0d0d0d`) with glassmorphic panels.
- **Accents**: Polished warm gold (`#ca982e` to `#debf60`) representing luxury awards, and rich crimson headers representing velvet runway theaters.
- **Micro-interactions**: Linear light-sweeps, subtle marquee scales, and fading entry transitions managed by CSS and standard motion.
- **Typography pairings**: Elegant sans headings paired with monospace numbers for high-density dashboard layouts.

---

## ⚙️ Full-Stack Technology Archetype

- **Frontend Core**: React 19, TypeScript, Tailwind CSS v4, and Recharts.
- **Backend Hub**: Node.js Express server acting as a secure gateway for API calls.
- **AI Integration**: Server-side Google Gemini SDK (`@google/genai`) for secure, lazy-initialized contextual processing.
- **Data Collections**: Precompiled in `src/data/bollyData.ts` with hundreds of movie records, timeline logs, and game items, coupled with persistent JSON file stores for active audits.

---

## 🚀 Execution & Setup Guide

### 1. Declare Secrets
Define your Google Gemini connection token in a `.env` file relative to the root directory (never check secrets directly into repository versions):
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### 2. Install Workspace Packages
Resolve standard workspace build and linting engines:
```bash
npm install
```

### 3. Initiate Dev Server
Boot up the full-stack system on standard container forward port `3000`:
```bash
npm run dev
```

### 4. Build Bundler
Compile the server CJS assets and Vite frontend static trees for production deployments:
```bash
npm run build
```
The output is securely bundled inside `dist/` where standard environment runtimes execute:
```bash
npm start
```
