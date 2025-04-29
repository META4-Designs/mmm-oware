/**
 * Final Oware Board Model
 * 
 * Defines the final dimensions and creation logic for the Oware board,
 * based on iterative refinement to match reference images with specific margins and gaps.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- Final Board Configuration (Derived from layout-15mm-margin-preview.html) ---
export const FINAL_BOARD_CONFIG = {
    length: 45.0, width: 13.8, depth: 4.0, cornerRadius: 2.0, // Reverted length and width per user request
    margin: 1.5, 
    pitRows: 2, pitsPerRow: 6,
    pitRadius: 2.5, 
    pitDepth: 1.75, // Desired depth of the concave pit
    handleCutoutWidth: 2.5,
    handleCutoutLength: 10.8,
    handleCutoutCornerRadius: 1.25,
    handleDistanceFromEnd: 15, // mm from the edge of the board to the start of the handle cutout
    boardColor: 0xf5e8c0, // Example color
    handlePitGap: 1.5, // Gap between handle and first pit column
    pitPitGap: 0.8 // Gap between pit columns
};

/**
 * Loads the pre-computed Oware board model from a GLB file.
 * Applies material and shadow properties.
 * 
 * @param {object} cfg - The board configuration (used for material).
 * @returns {Promise<THREE.Mesh>} - A promise that resolves with the loaded board mesh.
 */
export async function loadFinalOwareBoard(cfg) {
    const loader = new GLTFLoader();
    const glbPath = './assets/oware_board_final.glb'; // Relative path from HTML/client root

    console.log(`Loading board model from: ${glbPath}`);

    return new Promise((resolve, reject) => {
        loader.load(
            glbPath,
            (gltf) => {
                console.log("GLB loaded successfully.", gltf);
                
                // Find the mesh within the loaded scene
                let boardMesh = null;
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        // Assuming the first mesh found is the board
                        boardMesh = child;
                        // Stop traversal if you only expect one mesh
                        // return; 
                    }
                });

                if (!boardMesh) {
                    console.error("Could not find a mesh in the loaded GLB file.");
                    return reject(new Error("No mesh found in GLB"));
                }

                console.log("Board mesh found:", boardMesh);

                // Apply desired material
                const boardMaterial = new THREE.MeshStandardMaterial({
                    color: cfg.boardColor,
                    metalness: 0.2,
                    roughness: 0.8,
                });
                boardMesh.material = boardMaterial;

                // Enable shadows
                boardMesh.castShadow = true;
                boardMesh.receiveShadow = true;

                // Optional: Reset position/rotation if needed (exporter might handle this)
                // boardMesh.position.set(0, 0, 0);
                // boardMesh.rotation.set(0, 0, 0);

                resolve(boardMesh); // Resolve the promise with the mesh
            },
            (xhr) => {
                // Progress callback (optional)
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                // Error callback
                console.error('Error loading GLB model:', error);
                reject(error);
            }
        );
    });
}
