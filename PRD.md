# Product Requirements Document: Mansa's Marbles Web Game

**Version:** 1.2
**Date:** 2025-04-11

**Authors:** User, Cascade

## 1. Introduction

This document outlines the requirements for "Mansa's Marbles," a mobile-compatible web game based on the traditional Mancala variant, Oware Nam Nam. The game aims to provide an engaging, visually appealing, and culturally enriching experience for players aged 6 and up, incorporating learning elements related to Mansa Musa and the Mali Empire.

## 2. Goals and Objectives

* **Primary Goal:** Develop a high-quality, engaging 3D web game based on Oware Nam Nam rules that is accessible on desktop and mobile browsers.
* **Secondary Goals:**
    * Provide an educational component through integrated trivia about Mansa Musa.
    * Create a visually stunning and immersive experience inspired by Pixar aesthetics and West African history.
    * Implement user accounts for progress saving and social sign-in.
    * Build a foundation for future feature expansion (new modes, cosmetics, native apps).
    * Target a broad audience starting from age 6+.
    * Foster appreciation for African cultural heritage through gameplay.

## 3. Target Audience

* Children aged 6 years and older.
* Casual gamers interested in puzzle/strategy board games.
* Players interested in African culture and history.
* Families looking for engaging and educational games.
* Educational institutions seeking interactive cultural learning tools.
* Strategy game enthusiasts looking for new challenges.

## 4. Scope

### 4.1. Minimum Viable Product (MVP) Features

The initial launch version (MVP) will include the following core features:

* **Core Gameplay:**
    * Oware Nam Nam rules implementation (based on provided document [cite: 1-55]).
    * Player vs. AI mode.
    * 4 AI difficulty levels (approx. 5yo, 10yo, 20yo, Expert/"Mansa Musa").
    * Secondary scoring system (2/4/8/16 points per house captured based on AI level).
* **User Accounts & Launch:**
    * Engaging splash screen animation on load with brand-aligned visuals and attention-grabbing effects.
    * Sign-in via Google, Facebook, Instagram.
    * Guest Mode (anonymous play, no score saving).
    * Score saving linked to signed-in user ID.
* **Visuals & UI:**
    * 3D graphics with Pixar-inspired (*Monsters Inc.*) art style.
    * Single environment: University of Sankore event hall.
    * Single board design: Polished ivory with gold accents (based on ref image `docs/references/M'Oware Board.png`).
    * Single seed design: Sanded stone marbles with gold flakes.
    * Core gameplay animations (sowing, capture, turn indication, etc.).
    * Responsive UI for desktop/mobile web.
* **Audio:**
    * Afrobeat-inspired background music (soft, rhythmic).
    * Specific SFX for seed movement (hollow pebble), drop (crash), capture (swipe).
* **Learning Integration:**
    * End-of-round Mansa Musa trivia (4 multiple-choice options).
    * Trivia content researched & written based on provided documents [cite: 1-73] (visuals provided by client).
* **Technology:**
    * Web application built with three.js (frontend) and Node.js (backend).

### 4.2. Post-MVP Features (Phased Rollout)

Future updates will introduce:

* **Phase 1:**
    * Local Pass-and-Play gameplay mode.
    * End-of-game Mansa Musa cinematic cut-scenes (scripts based on provided docs [cite: 1-73], production by client).
* **Phase 2:**
    * "Academically Supportive" milestone tracking system (design TBD based on data/feedback).
* **Phase 3 & Beyond:**
    * Monetization: In-App Purchases (cosmetic boards/seeds), potential ad integration, paid ad-free native app versions.
    * Potential online multiplayer mode.
    * Game state saving/resuming.
    * Further enhancements based on user feedback.

## 5. Detailed Requirements

### 5.1. Core Gameplay Mechanics

* **Rules Engine:** Must accurately implement all rules specified in "Oware Nam Nam: Rules, Gameplay, and Strategies" [cite: 1-55], including setup, sowing ('laps' rule [cite: 10-13]), capture conditions [cite: 15-19], turn structure, end-of-round condition (8 seeds [cite: 21]), territory gain [cite: 23-29], and game end condition [cite: 30].
* **Game Flow:**
    * Start Screen: Splash animation -> Sign-in/Guest option -> Main Menu.
    * Main Menu: Select Mode (vs AI for MVP), AI Difficulty, Start Game.
    * Gameplay Screen: Display board, seeds, player scores, active turn indicator. Handle player input (selecting house to sow from). Execute AI moves.
    * End of Round: Calculate captures, display winner, animate territory change, present Mansa Musa trivia.
    * End of Game: Display winner, celebratory animation, return to Main Menu.
* **AI:** Implement 4 distinct difficulty levels with varying strategic capabilities, from random/basic moves (Level 1) to strategic planning (Level 4).
* **Scoring:** Implement the secondary scoring system based on AI level, displayed clearly to the player and saved for signed-in users.

### 5.2. Visuals & User Interface (UI)

* **3D Assets:** Create high-quality 3D models for the board, seeds, table, rug, and environment elements according to the specified art style (Pixar-inspired) and material descriptions (ivory, gold, stone, walnut, zebra hide). Reference image `docs/references/M'Oware Board.png` to guide board design.
* **Environment:** Develop the University of Sankore event hall setting with appropriate lighting (diffuse, natural) and shallow depth-of-field effect.
* **Animations:** Implement all required gameplay animations smoothly and clearly:
    * Seed sowing path with arc trajectory and subtle bounce effects
    * Capture effects with satisfying visual feedback (glow, particle effects)
    * Territory change visuals with color shift and ownership indicators
    * UI transitions with smooth easing functions
    * Victory/defeat animations with appropriate emotional impact
    * Splash screen animation with attention-grabbing visuals and brand elements
* **Layout Orientation:** Implement landscape orientation as the default/native layout for all platforms, particularly considering the horizontal nature of the Oware game board. The UI should be optimized for landscape view on both desktop and mobile devices. For mobile and tablet-sized devices in portrait mode, display an animated visual/iconographic indicator prompting users to rotate their device for the optimal gaming experience.
* **Responsiveness:** Ensure the UI layout and 3D view adapt gracefully to different screen sizes (desktop monitors, tablets, smartphones). Touch controls must be intuitive on mobile with appropriate hit areas (minimum 44x44 pixels).
* **UI Elements:** Design clean and intuitive buttons, menus, score displays, trivia interface, and sign-in prompts consistent with the overall art style. Use clear iconography with text labels where appropriate.

### 5.3. Audio Design

* **Soundtrack:** Compose/source Afrobeat-inspired background music loops that are engaging but not distracting. Use specified instrumentation (drums, berimbau, etc.).
* **Sound Effects:** Create/source distinct, high-quality SFX matching the descriptions (hollow pebble, crash, swipe) for core game actions and UI interactions.

### 5.4. Learning Integration (Mansa Musa Trivia - MVP)

* **Content:** Research and write engaging, age-appropriate trivia questions (with 4 multiple-choice options each) based *only* on the provided documents: "Mansa Musa's Life" [cite: 47-73] and "Mansa Musa's Trade Empire" [cite: 1-46]. Target ~20-30 unique questions for variety in MVP.
* **Presentation:** Implement the UI flow to present one trivia question after each round. Display question, options, handle user selection, provide correct/incorrect feedback. (Illustrations to be provided by client).

### 5.5. User Accounts & Backend

* **Authentication:** Implement secure sign-in flows using OAuth for Google, Facebook, and Instagram. Implement a session management system for logged-in users. Implement Guest Mode access.
* **API:** Develop backend API endpoints for:
    * User registration/login.
    * Saving player scores associated with user ID.
    * (Post-MVP) Saving/loading game state.
    * (Post-MVP) Handling IAP entitlements.
* **Database:** Select and configure a suitable database (e.g., PostgreSQL, MongoDB) to store user account information and scores.
* **Security:** Implement standard security practices for user data handling and authentication, including:
    * HTTPS for all communications
    * JWT for authentication tokens
    * Password hashing (for any direct authentication)
    * Input validation and sanitization
    * Rate limiting to prevent brute force attacks
    * Regular security audits

### 5.6. Technology Stack

* **Frontend:** JavaScript, three.js, HTML5, CSS3.
* **Backend:** Node.js (e.g., Express.js framework).
* **Database:** TBD (e.g., PostgreSQL, MongoDB).
* **Deployment:** Target standard web hosting platforms capable of running Node.js applications.

## 6. Monetization Strategy (Future)

* The initial MVP will be free to play.
* Future versions will explore:
    * **Cosmetic IAPs:** Selling unique board and seed designs.
    * **Advertising:** Potential integration of non-intrusive ads in the free version.
    * **Paid Ad-Free Version:** Offering paid versions ($2.99 iOS / $1.99 Android estimate) upon native app deployment.
* The architecture should allow for adding these features later (e.g., storing cosmetic ownership, toggling ads).

## 7. Release Criteria (MVP)

* All MVP features listed in Section 4.1 are implemented and functional.
* Gameplay is stable and accurately reflects Oware Nam Nam rules [cite: 1-55].
* AI opponents function correctly at all 4 difficulty levels.
* Sign-in via Google, Facebook, Instagram, and Guest Mode works reliably.
* Score saving for signed-in users is functional.
* Visuals and audio meet the specified quality standards.
* Mansa Musa trivia is implemented and functional.
* The game performs adequately on target desktop and mobile web browsers.
* Major bugs and usability issues identified during testing are resolved.

## 8. Open Issues / Future Considerations

* Detailed design of the "Academically Supportive" milestone tracking system (Post-MVP).
* Specific AI algorithms and tuning for different difficulty levels.
* Selection of specific database technology.
* Detailed planning for native app deployment strategy.
* Specific ad network integration details (if pursued).
* Payment provider integration for IAPs.

## 9. User Experience (UX) Design

### 9.1. User Personas

* **Aisha (7 years old):** A curious elementary school student who enjoys colorful games. Limited reading ability but quick to learn through visual cues. Plays on her parent's tablet.
* **Marcus (12 years old):** A middle school student interested in strategy games and history. Plays on his smartphone and family computer.
* **Professor Williams (45 years old):** An educator looking for culturally relevant teaching tools. Primarily uses desktop computers.
* **The Thompson Family:** Parents with two children (ages 8 and 10) who enjoy educational family game nights on their shared tablet.

### 9.2. User Journeys

#### First-Time User Journey
1. User discovers game through app store/web search/recommendation
2. Views engaging splash screen with brand-aligned animation and visual effects
3. Chooses sign-in method or guest mode
4. Encounters tutorial prompt (accept/decline)
5. If accepted, completes interactive tutorial explaining rules
6. Selects AI difficulty (with clear descriptions for each level)
7. Plays first game with helpful tooltips
8. Encounters first trivia question
9. Views results screen with score and progress
10. Prompted to play again or return to menu

#### Returning User Journey
1. User opens game
2. Automatically signed in (if previously authenticated)
3. Views personalized welcome back message with previous score
4. Selects game mode and difficulty
5. Plays game with familiar mechanics
6. Encounters new trivia questions
7. Views updated progress and achievements

### 9.3. Accessibility Considerations

* **Visual Accessibility:**
  * High contrast mode option
  * Colorblind-friendly design (distinct patterns in addition to colors)
  * Adjustable text size
  * Screen reader compatibility

* **Cognitive Accessibility:**
  * Clear, consistent UI patterns
  * Optional simplified instructions
  * Adjustable game speed
  * Reduced animation option

* **Motor Accessibility:**
  * Large touch targets (minimum 44x44 pixels)
  * Alternative input methods (keyboard navigation)
  * Adjustable timing requirements

* **Auditory Accessibility:**
  * Visual cues for all audio feedback
  * Closed captions for any voiced content
  * Independent volume controls for music and SFX

### 9.4. Usability Testing Plan

* **Pre-Alpha Testing:**
  * Paper prototyping with 5-7 users across age ranges
  * Basic UI flow validation

* **Alpha Testing:**
  * Internal playability testing
  * Core mechanics validation

* **Beta Testing:**
  * Closed beta with 20-30 users from target demographics
  * Usability questionnaires and observation sessions
  * A/B testing of critical UI elements

* **Post-Release:**
  * Analytics implementation to track user behavior
  * Feedback mechanisms within the app
  * Regular usability reviews based on user data

## 10. Development Milestones

### 10.1. Pre-Production Phase (2 weeks)

* **Week 1:**
  * Finalize PRD and technical specifications
  * Create detailed art style guide
  * Set up development environment and version control
  * Research and select technology stack components

* **Week 2:**
  * Create low-fidelity wireframes for all screens
  * Develop game rules prototype (text-based/2D)
  * Begin asset list creation
  * Set up project management and tracking tools

### 10.2. Production Phase (12 weeks)

* **Weeks 3-4: Core Game Logic**
  * Implement Oware Nam Nam rules engine
  * Create basic game state management
  * Develop turn-based system
  * Implement win condition detection
  * Unit test core game mechanics

* **Weeks 5-7: 3D Environment & Assets**
  * Create 3D models for board, seeds, and environment
  * Implement materials and textures
  * Set up lighting and camera systems
  * Develop basic animations

* **Weeks 8-9: User Interface**
  * Implement responsive UI framework
  * Create all UI screens and components
  * Develop menu systems and navigation
  * Integrate UI with game logic

* **Weeks 10-11: AI Implementation**
  * Develop AI algorithms for all difficulty levels
  * Implement AI decision-making processes
  * Test and balance AI difficulty

* **Weeks 12-13: Backend & User Accounts**
  * Set up server infrastructure
  * Implement authentication systems
  * Create database schema and API endpoints
  * Develop score saving and retrieval functionality

* **Week 14: Educational Content**
  * Research and write trivia questions
  * Implement trivia presentation system
  * Integrate educational content with gameplay

### 10.3. Testing & Refinement Phase (4 weeks)

* **Week 15: Alpha Testing**
  * Internal testing of all features
  * Bug identification and prioritization
  * Performance optimization

* **Weeks 16-17: Beta Testing**
  * Closed beta with selected users
  * Gather and analyze feedback
  * Implement critical fixes and improvements

* **Week 18: Final Polish**
  * Address remaining issues
  * Final performance optimization
  * Prepare for deployment

### 10.4. Deployment Phase (2 weeks)

* **Week 19: Pre-Launch**
  * Final QA testing
  * Server infrastructure scaling
  * Deployment preparation

* **Week 20: Launch**
  * Public release
  * Monitor performance and user feedback
  * Address any critical issues

### 10.5. Post-Launch Support

* **Weeks 21-24:**
  * Monitor analytics and user feedback
  * Release patches for any discovered issues
  * Begin planning for Phase 1 features

## 11. Technical Architecture

### 11.1. Frontend Architecture

* **Core Technologies:**
  * JavaScript/TypeScript
  * Three.js for 3D rendering
  * React for UI components
  * WebGL for hardware acceleration

* **Key Components:**
  * Game Engine: Manages game state, rules, and logic
  * Renderer: Handles 3D visualization and animations
  * UI Manager: Controls interface elements and user interaction
  * Asset Manager: Handles loading and caching of resources
  * Input Controller: Processes user input across devices

### 11.2. Backend Architecture

* **Core Technologies:**
  * Node.js with Express
  * MongoDB for data storage
  * Firebase Authentication (alternative option)

* **Key Components:**
  * Authentication Service: Manages user identity and sessions
  * User Profile Service: Handles user data and preferences
  * Score Service: Manages game results and leaderboards
  * Analytics Service: Tracks usage patterns and metrics

### 11.3. Deployment Strategy

* **Web Hosting:**
  * Frontend: CDN-backed static hosting (e.g., Netlify, Vercel)
  * Backend: Containerized deployment (e.g., Docker on AWS, Google Cloud)

* **Scaling Considerations:**
  * Horizontal scaling for backend services
  * Database sharding strategy for future growth
  * CDN for static assets and game resources

### 11.4. Testing Strategy

* **Unit Testing:**
  * Jest for JavaScript/TypeScript components
  * Comprehensive test coverage for game rules engine

* **Integration Testing:**
  * API endpoint testing
  * Authentication flow validation

* **Performance Testing:**
  * FPS benchmarking across device types
  * Load testing for backend services
  * Memory usage optimization

* **Compatibility Testing:**
  * Browser matrix testing (Chrome, Firefox, Safari, Edge)
  * Device testing (desktop, tablet, mobile)
  * OS testing (Windows, macOS, iOS, Android)
