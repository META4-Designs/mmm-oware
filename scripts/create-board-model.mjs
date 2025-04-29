/**
 * Simple Board Model Creator
 * 
 * Instead of trying to convert a complex SVG, let's create a basic 3D model
 * of the Oware board directly with Three.js geometry primitives.
 * 
 * Usage: node scripts/create-board-model.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../client/public/js/boardModel.js');

// Board physical dimensions (in centimeters)
const BOARD_LENGTH_CM = 40;
const BOARD_WIDTH_CM = 20; 
const BOARD_THICKNESS_CM = 4;
const PIT_RADIUS_CM = 3;
const PIT_DEPTH_CM = 2;

/**
 * Create a simplified board model directly with Three.js primitives
 */
function createBoardModel() {
  try {
    console.log('Creating board base geometry...');
    
    // Function to create the board model module
    const jsContent = `/**
 * Oware Board Model
 * Generated on ${new Date().toISOString()}
 * Physical dimensions: ${BOARD_LENGTH_CM}cm × ${BOARD_WIDTH_CM}cm × ${BOARD_THICKNESS_CM}cm
 */

export const BOARD_DIMENSIONS = {
  length: ${BOARD_LENGTH_CM},
  width: ${BOARD_WIDTH_CM},
  thickness: ${BOARD_THICKNESS_CM},
  pitRadius: ${PIT_RADIUS_CM},
  pitDepth: ${PIT_DEPTH_CM}
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
`;
    
    // Write output file
    fs.writeFileSync(OUTPUT_PATH, jsContent);
    console.log(`Successfully generated board model module at ${OUTPUT_PATH}`);
    
  } catch (error) {
    console.error('Error creating board model:', error);
    process.exit(1);
  }
}

// Run the board model creation
createBoardModel();
