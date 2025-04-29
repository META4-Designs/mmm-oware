/**
 * Oware Board Model
 * Physical dimensions: 40cm × 20cm × 4cm
 */

export const BOARD_DIMENSIONS = {
  length: 40,
  width: 20,
  thickness: 4,
  pitRadius: 3,
  pitDepth: 2
};

/**
 * Creates a complete Oware board with pits
 * @param {Object} THREE - Three.js library
 * @returns {THREE.Group} Group containing the board and pits
 */
export function createBoardModel(THREE) {
  // Create a group to hold all parts of the board
  const boardGroup = new THREE.Group();
  
  // Create the base board
  const boardGeometry = new THREE.BoxGeometry(
    BOARD_DIMENSIONS.length, 
    BOARD_DIMENSIONS.thickness, 
    BOARD_DIMENSIONS.width
  );
  
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6b31e,
    roughness: 0.5,
    metalness: 0.2
  });
  
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.castShadow = true;
  board.receiveShadow = true;
  boardGroup.add(board);
  
  // Create pits (6 pits × 2 rows)
  const pitMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a56a,
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Position values for placing pits
  const pitSpacing = BOARD_DIMENSIONS.length / 7; // Space pits evenly
  const rowOffset = BOARD_DIMENSIONS.width / 4;   // Distance from center for each row
  
  // Create 12 pits (6 per row)
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const pitGeometry = new THREE.CylinderGeometry(
        BOARD_DIMENSIONS.pitRadius,     // top radius
        BOARD_DIMENSIONS.pitRadius,     // bottom radius
        BOARD_DIMENSIONS.pitDepth,      // height
        32                              // radial segments
      );
      
      const pit = new THREE.Mesh(pitGeometry, pitMaterial);
      
      // Position pit
      pit.position.x = -BOARD_DIMENSIONS.length/2 + pitSpacing * (col + 1);
      pit.position.y = BOARD_DIMENSIONS.thickness/2 - BOARD_DIMENSIONS.pitDepth/2;
      pit.position.z = (row === 0 ? -rowOffset : rowOffset);
      
      // Rotate cylinder to face up
      pit.rotation.x = Math.PI / 2;
      
      pit.castShadow = true;
      pit.receiveShadow = true;
      
      // Store row and column for game logic
      pit.userData = {
        row: row,
        col: col,
        index: row * 6 + col
      };
      
      boardGroup.add(pit);
    }
  }
  
  // Center the board on its bottom face
  boardGroup.position.y = BOARD_DIMENSIONS.thickness / 2;
  
  return boardGroup;
}
