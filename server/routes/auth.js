/**
 * Authentication Routes
 * 
 * Handles user authentication including:
 * - OAuth (Google, Facebook)
 * - Guest mode
 */

const express = require('express');
const router = express.Router();

// Guest login (no authentication required)
router.post('/guest', (req, res) => {
  // In development mode, just return a success response with a guest token
  const guestToken = 'guest-' + Math.random().toString(36).substring(2, 15);
  
  res.status(200).json({
    success: true,
    token: guestToken,
    user: {
      id: 'guest-' + Date.now(),
      name: 'Guest Player',
      avatar: '/assets/images/default-avatar.png'
    }
  });
});

// Google OAuth routes (placeholders for now)
router.get('/google', (req, res) => {
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
});

router.get('/google/callback', (req, res) => {
  res.status(501).json({ message: 'Google OAuth callback not implemented yet' });
});

// Facebook OAuth routes (placeholders for now)
router.get('/facebook', (req, res) => {
  res.status(501).json({ message: 'Facebook OAuth not implemented yet' });
});

router.get('/facebook/callback', (req, res) => {
  res.status(501).json({ message: 'Facebook OAuth callback not implemented yet' });
});

// Instagram OAuth routes (placeholders for now)
router.get('/instagram', (req, res) => {
  res.status(501).json({ message: 'Instagram OAuth not implemented yet' });
});

router.get('/instagram/callback', (req, res) => {
  res.status(501).json({ message: 'Instagram OAuth callback not implemented yet' });
});

module.exports = router;
