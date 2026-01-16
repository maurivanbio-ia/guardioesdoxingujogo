# Guardião do Xingu - A Jornada do Biólogo de Campo

## Overview
"Guardião do Xingu" is a 3D educational game simulating Amazonian turtle conservation in the Xingu River, Brazil, based on the real **Projeto Tartarugas do Xingu**. Players act as field biologists, performing scientific tasks within an immersive natural environment. The game educates on scientific protocols, promotes conservation, demonstrates research ethics, values traditional knowledge, and inspires interest in biology, highlighting the impact of conservation actions. The project aims to educate players on scientific protocols and the importance of conservation, mirroring the real-world initiative that has released over 6 million hatchlings since 2011.

## User Preferences
None specified yet.

## System Architecture
The project uses a React 18 + TypeScript frontend with vanilla Three.js for 3D graphics, styled with Tailwind CSS 4 and shadcn/ui. Vite is the build tool, and Wouter handles client-side routing. A simple Express.js server serves static files in production. The game is a Progressive Web App (PWA) with full offline support, asset caching, auto-updates, and installability.

### UI/UX Decisions
The UI/UX prioritizes a clean, modern, and authentic interface with:
- Minimal notification system (max 2 cards simultaneously).
- Optional educational modals and a compact threat HUD.
- Icon-based HUD and contemporary landing/loading screens.
- Authentic visual representations of the Amazonian environment, characters, and wildlife.
- Contextual ecological notification system and a phase-based progression with celebration modals.
- Detailed visual displays for seven scientific tools.
- A mini-map with real-time markers and a full-map option.
- Full mobile responsiveness with touch-optimized controls (virtual joystick, action buttons), adaptive UI, and performance-optimized 3D rendering for mobile.
- Draggable interface controls with glassmorphism, gradients, hover effects, and localStorage persistence.

### Technical Implementations
- **3D Engine:** Direct Three.js for granular control and robust scene architecture.
- **Dynamic Environment:** Accelerated day/night cycle, realistic water (Water2 shader), detailed terrain, dynamic lighting/fog based on a Conservation Index, and a two-phase hydrological cycle (Seca ↔ Chuva) with smooth water level transitions, educational modals, rain particles, and procedural audio.
- **Dynamic Weather System:** Real-time weather simulation connected to the hydrological cycle, offering varied states during the "Chuva" phase with procedural rain particles and dynamic fog.
- **Character & Physics:** WASD controls, physics-based jump, rotation-based third-person camera, and a flashlight.
- **Collectible Tools System:** Manages five scientific instruments with procedural 3D models, animations, proximity detection, and inventory integration.
- **Procedural Turtle System:** Generates anatomically accurate turtles (`Podocnemis expansa`, `P. unifilis`, `P. sextuberculata`) with species-specific traits, individual color variation, and realistic animations. Includes a photorealistic `Podocnemis expansa` model via Meshy AI. **15 turtles** distributed across the beach.
- **Wildlife Systems:**
    - **Vulture AI (Urubus):** 8 realistic vultures with behavioral states (circling, diving, attacking, fleeing) and full interaction options.
    - **Jumping Fish:** 12 procedural fish with realistic physics and varied colors.
    - **Alligators (Jacarés):** 3 predators that swim, hunt turtles, and can be scared away.
- **Data Management:** System for collecting biometric data with XP rewards.
- **Dialogue System:** Scientific dialogues and NPC interactions across six chapters with auto-advancing, text-based conversations, and enhanced contextual fisherman dialogues.
- **Proximity Detection:** System with callbacks for zones around key game elements.
- **Event System:** Custom events for various gameplay actions, triggering achievements and statistics tracking.
- **Random Events System:** 7 contextual events (e.g., turtle arrivals, vulture threats, storms, oil spills) with phase-based probability triggers, duration timers, and educational notifications, ensuring no overlap.
- **Phase Blocking:** Game interactions are locked by phase to ensure progressive learning.
- **Audio System:** Enhanced audio management with procedural Web Audio API for 10+ sound effects, seasonal ambient sounds, XP gain sounds, celebratory music, and landing page narration. Granular audio controls with localStorage persistence and smooth transitions.
- **Contextual Card System:** 27 educational cards (text-only) integrated into specific gameplay actions, including species-specific temperature information for sex determination.
- **Achievement System:** Tracks 15 achievements with real-time tracking, diverse action validation, animated notifications, and integration with gameplay events.
- **Educational Mini-Games:** 3 interactive quiz systems (Temperature Master, Species Expert, Turtle Anatomy) accessible via keyboard shortcut, featuring multiple-choice questions, XP rewards, and detailed explanations.
- **Nest Interaction System:** `NestToolsDialog` modal for using a Thermometer, Ruler, and Field Notebook. Nests display 3-6 semi-transparent eggs. **25 nests** strategically distributed across the beach in 5 regions.
- **Educational Points System:** Comprehensive scoring system tracking positive and negative actions with real-time visual feedback and an action log.
- **Environmental Impact System:** Six interactive anthropogenic impacts (e.g., Beach Trash, Oil Spill) with educational information, contributing to XP.
- **Field Report System:** Scientific summary modal displaying nest observations, temperature records, action counts, total points, and performance percentage.
- **Guardian Certificate System:** Professional certification awarded after completing all 6 phases, featuring player name input, generation date, total points, species protection emblems, official partner logos, mobile-responsive layout, and PNG download functionality.
- **Enhanced Map System:** Tactical navigation system with 3 view modes, 5 toggleable layers, zoom functionality, grid overlay, river visualization, real-time player tracking, and comprehensive legend.

### Feature Specifications
- **Three Turtle Species:** *Podocnemis expansa*, *P. unifilis*, and *P. sextuberculata*.
- **Ethical Choices:** Actions influence scientific reputation.
- **TopBar HUD:** Displays Conservation Index (ICX), Nests Marked, Turtles Saved, Turtles Measured, Total XP, Phase Progress, and Achievements.
- **Dynamic Conservation Index (ICX):** Calculated based on in-game actions, influencing environmental visuals.
- **Interactive UI Components:** For equipment, data readers, and dialogues.
- **Detailed NPCs:** 5 researchers/ribeirinhos with 3D models and educational text dialogues (2x faster typing speed). NPCs provide unique dialogues covering the project overview, biology details, local perspectives, biometric data collection, and indigenous knowledge. First-time interaction rewards +0.5 XP per NPC.
- **Interactive 3D Research House and Amazonian Canoe:** With educational text dialogues.
- **Unique Turtle Interaction:** Turtles can only be measured once.
- **Streamlined Onboarding:** WelcomeModal with EcoBrasil branding and educational text messages.
- **6-Phase Educational Progression:** Structured learning with milestones based on real Projeto Tartarugas do Xingu methodology, balanced XP values, and a final certificate. Phases include:
    1. **Chegada ao Campo (50 XP):** Collect 5 scientific tools.
    2. **Integração com a Equipe (100 XP):** Interact with 5 researchers/locals.
    3. **Protocolos Científicos (100 XP):** Mark nests and collect data.
    4. **Ações de Conservação (140 XP):** Resolve 6 environmental impacts.
    5. **Pesquisa Biométrica (160 XP):** Measure turtles and document findings.
    6. **Guardião do Xingu (100 XP):** Final monitoring and certificate reception.
- **Field Guide Encyclopedia:** Complete scientific database for 3 species, progressively unlocked, with detailed profiles and a keyboard shortcut.

## External Dependencies
- **React 18**: Frontend UI library.
- **TypeScript**: Statically typed superset of JavaScript.
- **Three.js**: JavaScript 3D library.
- **@react-three/drei**: React Three Fiber utilities.
- **Tailwind CSS 4**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Vite**: Frontend build tool.
- **Wouter**: Routing library for React.
- **Express.js**: Backend web framework (static file serving).
- **pnpm**: Package manager.
- **Lucide React**: Icon library.
- **ElevenLabs SDK**: Text-to-speech API.
- **Howler.js**: Audio playback library.
- **Framer Motion**: Animation library.
- **Meshy AI API**: Text-to-3D model generation.
- **html2canvas**: HTML to canvas rendering.