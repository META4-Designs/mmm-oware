# Mansa's Marbles - Project Setup Guide

This document outlines the development environment setup, technology stack, and project structure for the Mansa's Marbles game.

## Development Environment

### Required Software
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Git (already set up with username: META4-Designs, email: 4Dpaanii@gmail.com)
- MongoDB (v6.0+ recommended)
- Code Editor (VS Code recommended with extensions for JavaScript, Three.js, and MongoDB)

### Installation Instructions
1. **Node.js & npm**: Download and install from [nodejs.org](https://nodejs.org/)
2. **MongoDB**: 
   - Option 1: Install locally using [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - Option 2: Use MongoDB Atlas cloud service (recommended for team collaboration)

## Technology Stack

### Frontend
- **Three.js** for 3D rendering
  - Confirmed as the primary 3D library
  - Will need to research specific plugins for:
    - Controls (OrbitControls for desktop, touch controls for mobile)
    - Loaders (GLTFLoader for 3D models)
    - Post-processing effects (if needed)
- **HTML5/CSS3** for UI structure and styling
- **Vanilla JavaScript** or a lightweight framework for UI components

### Backend
- **Express.js** as the Node.js framework
  - Confirmed for handling API requests, authentication, and game state
  - Will implement RESTful API design
  - Will use middleware for authentication, validation, and error handling
- **MongoDB** as the database
  - Confirmed for storing user data, scores, and trivia questions
  - Will use Mongoose as the ODM for schema definition and validation

### Authentication
- OAuth integration for:
  - Google
  - Facebook
  - Instagram
- JWT for session management

## Project Structure

```
mansa-marbles/
├── client/                  # Frontend code
│   ├── assets/              # Static assets
│   │   ├── models/          # 3D models
│   │   ├── textures/        # Textures
│   │   ├── sounds/          # Audio files
│   │   └── images/          # Images
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   │   ├── components/      # Reusable UI components
│   │   ├── core/            # Core game logic
│   │   │   ├── board.js     # Game board representation
│   │   │   ├── rules.js     # Game rules implementation
│   │   │   └── ai.js        # AI opponent logic
│   │   ├── rendering/       # Three.js rendering code
│   │   ├── utils/           # Utility functions
│   │   └── app.js           # Main application entry point
│   └── index.html           # Main HTML file
├── server/                  # Backend code
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── server.js            # Main server entry point
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   └── references/          # Reference materials
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
└── README.md                # Project overview
```

## Initial Dependencies

### Frontend Dependencies
- three.js (latest stable)
- stats.js (for performance monitoring)

### Backend Dependencies
- express
- mongoose
- jsonwebtoken
- passport (for OAuth)
- passport-google-oauth20
- passport-facebook
- passport-instagram
- bcrypt
- cors
- helmet (for security headers)
- dotenv (for environment variables)

### Development Dependencies
- nodemon (for auto-restarting server)
- eslint (for code linting)
- prettier (for code formatting)
- jest (for testing)

## Next Steps

1. Install Node.js and npm
2. Set up the project directory structure
3. Initialize the project with package.json
4. Install initial dependencies
5. Create basic Express server setup
6. Set up MongoDB connection
7. Implement basic game board state representation
