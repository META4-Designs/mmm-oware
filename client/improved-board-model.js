/**
 * Improved Oware Board Model
 * 
 * This model incorporates:
 * - Precise board shape with rounded corners based on reference PNG
 * - Proper placement of pits and handles on the top face
 * - Board positioned flat on the ground with pits facing up by default
 * - Accurate dimensions (40cm length × 20cm width × 4cm thickness)
 */

export const BOARD_DIMENSIONS = {
  length: 40,           // Length in cm (X axis)
  width: 20,            // Width in cm (Z axis)
  thickness: 4,         // Height/thickness in cm (Y axis)
  pitRadius: 2.5,       // Radius of each pit
  pitDepth: 1.75,       // Depth of each pit
  cornerRadius: 1.5,    // Radius of board corners
  handleWidth: 6,       // Width of handle cutouts
  handleDepth: 3,       // Depth of handle cutouts
  handleRadius: 1.5,    // Radius of handle cutout corners
  pitSpacingX: 5.75,    // Distance between pit centers along X axis
  pitSpacingZ: 8,       // Distance between the two rows of pits (Z axis)
  pitOffsetX: 0,        // X offset of the entire pit grid from center
  pitOffsetZ: 0         // Z offset of the entire pit grid from center
};

/**
 * Creates the complete Oware board with all features
 * @param {Object} THREE - Three.js library
 * @returns {THREE.Group} The complete board model
 */
export function createBoardModel(THREE) {
  // Create a group to hold all board components
  const boardGroup = new THREE.Group();
  
  // Create the board base
  const boardBase = createBoardBase(THREE);
  boardGroup.add(boardBase);
  
  // Create and add pits to the top face
  const pits = createPits(THREE);
  boardGroup.add(pits);
  
  // Position the board flat on the ground by default
  // (no positioning needed as we're building it correctly oriented)
  
  return boardGroup;
}

/**
 * Creates the base board with rounded corners and handle cutouts
 * @param {Object} THREE - Three.js library
 * @returns {THREE.Mesh} The board base mesh
 */
function createBoardBase(THREE) {
  // Create board outline shape with rounded corners
  const boardShape = new THREE.Shape();
  const d = BOARD_DIMENSIONS;
  const r = d.cornerRadius;
  
  // Start at top left corner
  boardShape.moveTo(-d.length/2 + r, -d.width/2);
  boardShape.lineTo(d.length/2 - r, -d.width/2);
  boardShape.quadraticCurveTo(d.length/2, -d.width/2, d.length/2, -d.width/2 + r);
  boardShape.lineTo(d.length/2, d.width/2 - r);
  boardShape.quadraticCurveTo(d.length/2, d.width/2, d.length/2 - r, d.width/2);
  boardShape.lineTo(-d.length/2 + r, d.width/2);
  boardShape.quadraticCurveTo(-d.length/2, d.width/2, -d.length/2, d.width/2 - r);
  boardShape.lineTo(-d.length/2, -d.width/2 + r);
  boardShape.quadraticCurveTo(-d.length/2, -d.width/2, -d.length/2 + r, -d.width/2);
  
  // Create cutouts for handles (must be done as separate holes in the shape)
  // Left handle
  const leftHandleHole = new THREE.Path();
  const leftHandleX = -d.length/2 + d.handleDepth + d.handleRadius;
  const leftHandleZ = 0;
  
  leftHandleHole.moveTo(leftHandleX - d.handleDepth + d.handleRadius, leftHandleZ - d.handleWidth/2);
  leftHandleHole.quadraticCurveTo(
    leftHandleX - d.handleDepth, leftHandleZ - d.handleWidth/2,
    leftHandleX - d.handleDepth, leftHandleZ - d.handleWidth/2 + d.handleRadius
  );
  leftHandleHole.lineTo(leftHandleX - d.handleDepth, leftHandleZ + d.handleWidth/2 - d.handleRadius);
  leftHandleHole.quadraticCurveTo(
    leftHandleX - d.handleDepth, leftHandleZ + d.handleWidth/2,
    leftHandleX - d.handleDepth + d.handleRadius, leftHandleZ + d.handleWidth/2
  );
  leftHandleHole.lineTo(leftHandleX + d.handleDepth - d.handleRadius, leftHandleZ + d.handleWidth/2);
  leftHandleHole.quadraticCurveTo(
    leftHandleX + d.handleDepth, leftHandleZ + d.handleWidth/2,
    leftHandleX + d.handleDepth, leftHandleZ + d.handleWidth/2 - d.handleRadius
  );
  leftHandleHole.lineTo(leftHandleX + d.handleDepth, leftHandleZ - d.handleWidth/2 + d.handleRadius);
  leftHandleHole.quadraticCurveTo(
    leftHandleX + d.handleDepth, leftHandleZ - d.handleWidth/2,
    leftHandleX + d.handleDepth - d.handleRadius, leftHandleZ - d.handleWidth/2
  );
  leftHandleHole.lineTo(leftHandleX - d.handleDepth + d.handleRadius, leftHandleZ - d.handleWidth/2);
  
  // Right handle
  const rightHandleHole = new THREE.Path();
  const rightHandleX = d.length/2 - d.handleDepth - d.handleRadius;
  const rightHandleZ = 0;
  
  rightHandleHole.moveTo(rightHandleX - d.handleDepth + d.handleRadius, rightHandleZ - d.handleWidth/2);
  rightHandleHole.quadraticCurveTo(
    rightHandleX - d.handleDepth, rightHandleZ - d.handleWidth/2,
    rightHandleX - d.handleDepth, rightHandleZ - d.handleWidth/2 + d.handleRadius
  );
  rightHandleHole.lineTo(rightHandleX - d.handleDepth, rightHandleZ + d.handleWidth/2 - d.handleRadius);
  rightHandleHole.quadraticCurveTo(
    rightHandleX - d.handleDepth, rightHandleZ + d.handleWidth/2,
    rightHandleX - d.handleDepth + d.handleRadius, rightHandleZ + d.handleWidth/2
  );
  rightHandleHole.lineTo(rightHandleX + d.handleDepth - d.handleRadius, rightHandleZ + d.handleWidth/2);
  rightHandleHole.quadraticCurveTo(
    rightHandleX + d.handleDepth, rightHandleZ + d.handleWidth/2,
    rightHandleX + d.handleDepth, rightHandleZ + d.handleWidth/2 - d.handleRadius
  );
  rightHandleHole.lineTo(rightHandleX + d.handleDepth, rightHandleZ - d.handleWidth/2 + d.handleRadius);
  rightHandleHole.quadraticCurveTo(
    rightHandleX + d.handleDepth, rightHandleZ - d.handleWidth/2,
    rightHandleX + d.handleDepth - d.handleRadius, rightHandleZ - d.handleWidth/2
  );
  rightHandleHole.lineTo(rightHandleX - d.handleDepth + d.handleRadius, rightHandleZ - d.handleWidth/2);
  
  // Add holes to the shape
  boardShape.holes.push(leftHandleHole);
  boardShape.holes.push(rightHandleHole);
  
  // Extrude the shape to create the 3D board
  const extrudeSettings = {
    depth: d.thickness,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelSegments: 3
  };
  
  const boardGeometry = new THREE.ExtrudeGeometry(boardShape, extrudeSettings);
  
  // Rotate to lay flat with top face up (X-Z plane, Y up)
  boardGeometry.rotateX(Math.PI / 2);
  
  // Create material
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6b31e,  // Warm wood color
    roughness: 0.5,
    metalness: 0.2
  });
  
  // Create mesh and enable shadows
  const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
  boardMesh.castShadow = true;
  boardMesh.receiveShadow = true;
  
  return boardMesh;
}

/**
 * Creates the pits group with all 12 pits properly positioned
 * @param {Object} THREE - Three.js library
 * @returns {THREE.Group} Group containing all pits
 */
function createPits(THREE) {
  const d = BOARD_DIMENSIONS;
  const pitsGroup = new THREE.Group();
  
  // Create material for pits
  const pitMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a56a,  // Slightly darker than the board
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Create a hemisphere for the pit shape
  const pitGeometry = new THREE.SphereGeometry(
    d.pitRadius,      // Radius
    32,               // Width segments
    16,               // Height segments
    0,                // Phi start
    Math.PI * 2,      // Phi length
    0,                // Theta start
    Math.PI / 2       // Theta length (half sphere)
  );
  
  // Starting point for first pit row
  const startX = -d.length/2 + 3*d.pitRadius;
  const rowSpacing = d.pitSpacingZ;
  
  // Create 2 rows with 6 pits each
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const pit = new THREE.Mesh(pitGeometry, pitMaterial);
      
      // Position the pit
      pit.position.x = startX + col * d.pitSpacingX + d.pitOffsetX;
      pit.position.y = d.thickness - d.pitDepth/2; // Top of board minus half pit depth
      pit.position.z = (row === 0 ? -rowSpacing/2 : rowSpacing/2) + d.pitOffsetZ;
      
      // Rotate to face upward
      pit.rotation.x = -Math.PI / 2;
      
      // Enable shadows
      pit.castShadow = true;
      pit.receiveShadow = true;
      
      // Store metadata
      pit.userData = {
        type: 'pit',
        row: row,
        col: col,
        index: row * 6 + col
      };
      
      pitsGroup.add(pit);
    }
  }
  
  return pitsGroup;
}

/**
 * Creates a marble/seed for the game
 * @param {Object} THREE - Three.js library
 * @param {number} type - Marble type (0-3)
 * @returns {THREE.Mesh} The marble mesh
 */
export function createMarble(THREE, type = 0) {
  const d = BOARD_DIMENSIONS;
  const marbleRadius = d.pitRadius * 0.7;
  
  // Different marble colors based on type (can be adjusted)
  const marbleColors = [
    0xF5DEB3, // Wheat
    0x8B4513, // SaddleBrown
    0x556B2F, // DarkOliveGreen
    0x800000  // Maroon
  ];
  
  // Create marble material
  const marbleMaterial = new THREE.MeshStandardMaterial({
    color: marbleColors[type % marbleColors.length],
    roughness: 0.3,
    metalness: 0.7
  });
  
  // Create marble geometry
  const marbleGeometry = new THREE.SphereGeometry(marbleRadius, 24, 24);
  
  // Create marble mesh
  const marble = new THREE.Mesh(marbleGeometry, marbleMaterial);
  marble.castShadow = true;
  marble.receiveShadow = true;
  
  return marble;
}

/**
 * Places marbles in the pits based on starting game state
 * @param {Object} THREE - Three.js library
 * @param {THREE.Group} boardGroup - The board group
 * @param {number} seedsPerPit - Number of seeds per pit at start
 */
export function setupMarbles(THREE, boardGroup, seedsPerPit = 4) {
  const d = BOARD_DIMENSIONS;
  
  // Find all pits in the board
  const pits = [];
  boardGroup.traverse(child => {
    if (child.userData && child.userData.type === 'pit') {
      pits[child.userData.index] = child;
    }
  });
  
  // Add seeds to each pit
  pits.forEach((pit, pitIndex) => {
    if (!pit) return;
    
    // Get pit position
    const pitPos = new THREE.Vector3();
    pit.getWorldPosition(pitPos);
    
    // Place seeds in this pit
    for (let i = 0; i < seedsPerPit; i++) {
      // Random seed type
      const seedType = Math.floor(Math.random() * 4);
      const seed = createMarble(THREE, seedType);
      
      // Distribute seeds in the pit with some randomness
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * d.pitRadius * 0.6;
      const height = i * (seed.geometry.parameters.radius * 0.7); // Stack height
      
      // Position seed in pit
      seed.position.set(
        pitPos.x + radius * Math.cos(angle),
        pitPos.y - d.pitDepth/2 + height + seed.geometry.parameters.radius,
        pitPos.z + radius * Math.sin(angle)
      );
      
      // Random rotation
      seed.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Add metadata
      seed.userData = {
        type: 'seed',
        pitIndex: pitIndex,
        seedIndex: i
      };
      
      // Add to board group
      boardGroup.add(seed);
    }
  });
}
