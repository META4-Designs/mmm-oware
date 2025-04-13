/**
 * Game State Routes
 * 
 * Handles game state operations including:
 * - Saving/loading game state
 * - Player progress
 * - Game statistics
 */

const express = require('express');
const router = express.Router();

// In-memory storage for development (will be replaced with MongoDB in production)
const gameStates = {};
const playerStats = {};

// Get game state
router.get('/state/:id', (req, res) => {
  const { id } = req.params;
  
  if (gameStates[id]) {
    res.status(200).json({
      success: true,
      data: gameStates[id]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Game state not found'
    });
  }
});

// Save game state
router.post('/state', (req, res) => {
  const { userId, gameState } = req.body;
  
  if (!userId || !gameState) {
    return res.status(400).json({
      success: false,
      message: 'User ID and game state are required'
    });
  }
  
  const gameId = `game-${Date.now()}`;
  gameStates[gameId] = {
    id: gameId,
    userId,
    state: gameState,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    data: {
      id: gameId
    }
  });
});

// Get player statistics
router.get('/stats/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (playerStats[userId]) {
    res.status(200).json({
      success: true,
      data: playerStats[userId]
    });
  } else {
    // Return default stats if none exist
    res.status(200).json({
      success: true,
      data: {
        userId,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        currentLevel: 'I',
        pointsPerGame: 0,
        highScore: 0
      }
    });
  }
});

// Update player statistics
router.post('/stats', (req, res) => {
  const { userId, stats } = req.body;
  
  if (!userId || !stats) {
    return res.status(400).json({
      success: false,
      message: 'User ID and stats are required'
    });
  }
  
  // Create or update player stats
  playerStats[userId] = {
    ...playerStats[userId] || {},
    ...stats,
    updatedAt: new Date()
  };
  
  res.status(200).json({
    success: true,
    data: playerStats[userId]
  });
});

module.exports = router;
