/**
 * Mansa's Marbles - 3D Renderer
 * 
 * This file sets up the Three.js environment for rendering the game.
 * It implements landscape orientation as the default layout.
 */

// Import Three.js and related modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';

class GameRenderer {
  /**
   * Creates a new game renderer
   * @param {string} canvasId - The ID of the canvas element to render to
   */
  constructor(canvasId = 'game-canvas') {
    // Store canvas ID
    this.canvasId = canvasId;
    
    // Get the canvas element
    this.canvas = document.getElementById(canvasId);
    
    // Initialize Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    
    // Game objects
    this.board = null;
    this.seeds = [];
    
    // Lighting
    this.lights = [];
    
    // Animation
    this.animationFrameId = null;
    this.clock = new THREE.Clock();
    
    // Performance monitoring
    this.stats = null;
    
    // Device detection
    this.isMobile = this.detectMobile();
    
    // Orientation
    this.isLandscape = window.innerWidth > window.innerHeight;
    
    // Initialize the renderer
    this.init();
  }
  
  /**
   * Detects if the device is mobile
   * @returns {boolean} Whether the device is mobile
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  /**
   * Initializes the Three.js environment
   */
  init() {
    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    
    // Create the camera with landscape-oriented perspective
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    
    // Position the camera based on orientation
    this.updateCameraForOrientation();
    
    // Create the renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set up controls
    this.setupControls();
    
    // Set up lighting
    this.setupLighting();
    
    // Set up performance monitoring if not on mobile
    if (!this.isMobile) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle orientation change
    window.addEventListener('orientationchange', this.onOrientationChange.bind(this));
    
    // Check initial orientation
    this.checkOrientation();
  }
  
  /**
   * Sets up camera controls
   */
  setupControls() {
    // Use OrbitControls for desktop
    if (!this.isMobile) {
      this.controls = new OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 15;
      this.controls.maxPolarAngle = Math.PI / 2;
    } else {
      // For mobile, we'll implement custom touch controls later
      // This will be optimized for landscape orientation
    }
  }
  
  /**
   * Sets up scene lighting
   */
  setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
  }
  
  /**
   * Updates the camera position based on the current orientation
   */
  updateCameraForOrientation() {
    if (this.isLandscape) {
      // Landscape orientation - position camera to view the board from an angle
      this.camera.position.set(0, 8, 10);
    } else {
      // Portrait orientation - adjust for a better view in portrait mode
      // (though we'll show the rotation prompt in this case)
      this.camera.position.set(0, 12, 8);
    }
    
    this.camera.lookAt(0, 0, 0);
  }
  
  /**
   * Handles window resize events
   */
  onWindowResize() {
    // Update aspect ratio
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update orientation flag
    this.isLandscape = window.innerWidth > window.innerHeight;
    
    // Update camera position for the new orientation
    this.updateCameraForOrientation();
    
    // Check orientation for the prompt
    this.checkOrientation();
  }
  
  /**
   * Handles orientation change events
   */
  onOrientationChange() {
    // Small delay to ensure dimensions have updated
    setTimeout(() => {
      // Update orientation flag
      this.isLandscape = window.innerWidth > window.innerHeight;
      
      // Update camera position for the new orientation
      this.updateCameraForOrientation();
      
      // Check orientation for the prompt
      this.checkOrientation();
    }, 100);
  }
  
  /**
   * Checks the current orientation and shows/hides the rotation prompt
   */
  checkOrientation() {
    const rotationPrompt = document.getElementById('rotation-prompt');
    const gameContainer = document.getElementById('game-container');
    
    if (this.isMobile) {
      if (!this.isLandscape) {
        // Show rotation prompt on mobile in portrait mode
        rotationPrompt.classList.remove('hidden');
        gameContainer.classList.add('hidden');
      } else {
        // Hide rotation prompt on mobile in landscape mode
        rotationPrompt.classList.add('hidden');
        gameContainer.classList.remove('hidden');
      }
    } else {
      // Always hide rotation prompt on desktop
      rotationPrompt.classList.add('hidden');
      gameContainer.classList.remove('hidden');
    }
  }
  
  /**
   * Creates a basic board model
   * This is a placeholder until we have the actual 3D models
   */
  createBasicBoard() {
    // Create a simple board geometry
    const boardGeometry = new THREE.BoxGeometry(10, 0.5, 5);
    const boardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe6b31e,
      roughness: 0.3,
      metalness: 0.2
    });
    
    this.board = new THREE.Mesh(boardGeometry, boardMaterial);
    this.board.receiveShadow = true;
    this.scene.add(this.board);
    
    // Create house indentations
    this.createHouses();
  }
  
  /**
   * Creates house indentations on the board
   * This is a placeholder until we have the actual 3D models
   */
  createHouses() {
    const houseGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
    const houseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4a56a,
      roughness: 0.5,
      metalness: 0.1
    });
    
    // Create 12 houses (6 for each player)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 6; col++) {
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        
        // Position the houses in a 2x6 grid on the board
        house.position.x = -4.5 + col * 1.8;
        house.position.y = 0.25; // Slightly above the board
        house.position.z = row === 0 ? 1.5 : -1.5;
        
        house.receiveShadow = true;
        this.scene.add(house);
      }
    }
  }
  
  /**
   * Starts the rendering loop
   */
  start() {
    // Create a basic board for testing
    this.createBasicBoard();
    
    // Start the animation loop
    this.animate();
  }
  
  /**
   * Animation loop
   */
  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    // Update controls if they exist
    if (this.controls) {
      this.controls.update();
    }
    
    // Update stats if they exist
    if (this.stats) {
      this.stats.update();
    }
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Stops the rendering loop
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Cleans up resources
   */
  dispose() {
    // Stop the animation loop
    this.stop();
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    window.removeEventListener('orientationchange', this.onOrientationChange.bind(this));
    
    // Dispose of Three.js objects
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Dispose of renderer
    this.renderer.dispose();
    
    // Remove stats if they exist
    if (this.stats && this.stats.dom.parentNode) {
      this.stats.dom.parentNode.removeChild(this.stats.dom);
    }
  }
}

// Export the GameRenderer class
export default GameRenderer;
