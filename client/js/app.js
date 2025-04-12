/**
 * Mansa's Marbles - Main Application
 * 
 * This file initializes the game and manages the overall application flow.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  const app = new MansaMarblesApp();
  app.init();
});

class MansaMarblesApp {
  constructor() {
    // Game components
    this.board = null;
    this.rules = null;
    this.renderer = null;
    
    // UI elements
    this.splashScreen = document.getElementById('splash-screen');
    this.gameContainer = document.getElementById('game-container');
    this.authModal = document.getElementById('auth-modal');
    this.rotationPrompt = document.getElementById('rotation-prompt');
    
    // Loading progress
    this.loadingProgress = document.querySelector('.loading-progress');
    this.loadingText = document.querySelector('.loading-text');
    
    // Authentication buttons
    this.googleSignIn = document.getElementById('google-signin');
    this.facebookSignIn = document.getElementById('facebook-signin');
    this.instagramSignIn = document.getElementById('instagram-signin');
    this.guestMode = document.getElementById('guest-mode');
    
    // Game state
    this.isLoading = true;
    this.isAuthenticated = false;
    this.user = null;
    
    // Bind methods
    this.handleAuthClick = this.handleAuthClick.bind(this);
  }
  
  /**
   * Initializes the application
   */
  init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Start the loading sequence
    this.startLoading();
  }
  
  /**
   * Sets up event listeners
   */
  setupEventListeners() {
    // Auth button click handlers
    this.googleSignIn.addEventListener('click', () => this.handleAuthClick('google'));
    this.facebookSignIn.addEventListener('click', () => this.handleAuthClick('facebook'));
    this.instagramSignIn.addEventListener('click', () => this.handleAuthClick('instagram'));
    this.guestMode.addEventListener('click', () => this.handleAuthClick('guest'));
    
    // Handle orientation change
    window.addEventListener('orientationchange', this.checkOrientation.bind(this));
    window.addEventListener('resize', this.checkOrientation.bind(this));
    
    // Check initial orientation
    this.checkOrientation();
  }
  
  /**
   * Checks the device orientation and shows/hides the rotation prompt
   */
  checkOrientation() {
    // Only show rotation prompt on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isMobile && !isLandscape) {
      // Show rotation prompt on mobile in portrait mode
      this.rotationPrompt.classList.remove('hidden');
      this.gameContainer.classList.add('hidden');
    } else {
      // Hide rotation prompt
      this.rotationPrompt.classList.add('hidden');
      if (!this.isLoading) {
        this.gameContainer.classList.remove('hidden');
      }
    }
  }
  
  /**
   * Starts the loading sequence
   */
  startLoading() {
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        this.finishLoading();
      }
      
      // Update loading bar
      this.loadingProgress.style.width = `${progress}%`;
      this.loadingText.textContent = `Loading... ${Math.floor(progress)}%`;
    }, 200);
    
    // Initialize game components in the background
    this.initializeGameComponents();
  }
  
  /**
   * Initializes the game components
   */
  initializeGameComponents() {
    // Create the game board
    this.board = new OwareBoard();
    
    // Create the rules handler
    this.rules = new OwareRules(this.board);
    
    // Create the renderer (but don't start it yet)
    this.renderer = new GameRenderer('game-canvas');
  }
  
  /**
   * Finishes the loading sequence
   */
  finishLoading() {
    // Short delay for visual effect
    setTimeout(() => {
      // Hide splash screen
      this.splashScreen.classList.add('hidden');
      
      // Show auth modal
      this.authModal.classList.remove('hidden');
      
      // Update loading state
      this.isLoading = false;
    }, 500);
  }
  
  /**
   * Handles authentication button clicks
   * @param {string} provider - The authentication provider ('google', 'facebook', 'instagram', or 'guest')
   */
  handleAuthClick(provider) {
    // Hide auth modal
    this.authModal.classList.add('hidden');
    
    if (provider === 'guest') {
      // Guest mode - no authentication needed
      this.startGame({
        id: 'guest',
        name: 'Guest',
        isGuest: true
      });
    } else {
      // For now, simulate OAuth authentication
      // In a real implementation, we would redirect to the OAuth provider
      this.simulateAuth(provider);
    }
  }
  
  /**
   * Simulates authentication for development purposes
   * @param {string} provider - The authentication provider
   */
  simulateAuth(provider) {
    // Show a loading message
    this.showMessage(`Authenticating with ${provider}...`);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create a mock user based on the provider
      const user = {
        id: `${provider}_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider,
        isGuest: false
      };
      
      // Start the game with the authenticated user
      this.startGame(user);
    }, 1000);
  }
  
  /**
   * Shows a message to the user
   * @param {string} message - The message to show
   */
  showMessage(message) {
    // For now, just log to console
    console.log(message);
    
    // In a real implementation, we would show a UI message
  }
  
  /**
   * Starts the game
   * @param {Object} user - The authenticated user (or guest)
   */
  startGame(user) {
    // Store the user
    this.user = user;
    this.isAuthenticated = !user.isGuest;
    
    // Show game container
    this.gameContainer.classList.remove('hidden');
    
    // Check orientation again
    this.checkOrientation();
    
    // Start the renderer
    this.renderer.start();
    
    // Log welcome message
    console.log(`Welcome, ${user.name}! The game is ready.`);
  }
}
