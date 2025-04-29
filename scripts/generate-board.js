/**
 * Node.js Script to Pre-compute Oware Board Model
 *
 * Generates the final Oware board geometry with concave pits using CSG
 * and exports it as a GLTF file for efficient loading in the client.
 */

import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'; // Use namespace import

// Import the configuration
import { FINAL_BOARD_CONFIG } from '../client/enhancedBoardModel.js';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function adapted from enhancedBoardModel.js
function generateFinalOwareBoardMesh(cfg) {
    // Define these early so they are in scope for handles and pits
    const halfBoardLength = cfg.length / 2; // Along Y axis
    const halfBoardWidth = cfg.width / 2;   // Along X axis

    console.log("Generating board shape w/ handle holes...");
    
    function createBoardShape(cfg) {
        const roundedRect = new THREE.Shape();
        const x = -cfg.width / 2, y = -cfg.length / 2;
        const width = cfg.width, height = cfg.length;
        const radius = cfg.cornerRadius;

        roundedRect.moveTo(x, y + radius);
        roundedRect.lineTo(x, y + height - radius);
        roundedRect.quadraticCurveTo(x, y + height, x + radius, y + height);
        roundedRect.lineTo(x + width - radius, y + height);
        roundedRect.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        roundedRect.lineTo(x + width, y + radius);
        roundedRect.quadraticCurveTo(x + width, y, x + width - radius, y);
        roundedRect.lineTo(x + radius, y);
        roundedRect.quadraticCurveTo(x, y, x, y + radius);
        return roundedRect;
    }

    const boardShape = createBoardShape(cfg);

    const handleHoles = [];
    const handleHalfLength = cfg.handleCutoutLength / 2; // cm
    const handleHalfWidth = cfg.handleCutoutWidth / 2;   // cm
    const handleR = cfg.handleCutoutCornerRadius;       // cm
    const handleDistanceFromEnd_cm = cfg.handleDistanceFromEnd / 10; // Convert 15mm to 1.5cm
    
    // Handle 1 (Positive Y Side / Length End)
    const handlePath1 = new THREE.Path();
    // Center handle cutout along X-axis (width). Position Y based on board length, distance from end, and handle *width*.
    const handleCenterY1 = halfBoardLength - handleDistanceFromEnd_cm - handleHalfWidth;
    // Draw path: X uses +/- handleHalfLength, Y uses handleCenterY1 +/- handleHalfWidth
    handlePath1.moveTo(-handleHalfLength + handleR, handleCenterY1 - handleHalfWidth); // Start near bottom-left corner of handle shape
    handlePath1.lineTo(+handleHalfLength - handleR, handleCenterY1 - handleHalfWidth); // Line to bottom-right
    handlePath1.quadraticCurveTo(+handleHalfLength, handleCenterY1 - handleHalfWidth, +handleHalfLength, handleCenterY1 - handleHalfWidth + handleR); // Bottom-right curve
    handlePath1.lineTo(+handleHalfLength, handleCenterY1 + handleHalfWidth - handleR); // Line to top-right
    handlePath1.quadraticCurveTo(+handleHalfLength, handleCenterY1 + handleHalfWidth, +handleHalfLength - handleR, handleCenterY1 + handleHalfWidth); // Top-right curve
    handlePath1.lineTo(-handleHalfLength + handleR, handleCenterY1 + handleHalfWidth); // Line to top-left
    handlePath1.quadraticCurveTo(-handleHalfLength, handleCenterY1 + handleHalfWidth, -handleHalfLength, handleCenterY1 + handleHalfWidth - handleR); // Top-left curve
    handlePath1.lineTo(-handleHalfLength, handleCenterY1 - handleHalfWidth + handleR); // Line back towards bottom-left
    handlePath1.quadraticCurveTo(-handleHalfLength, handleCenterY1 - handleHalfWidth, -handleHalfLength + handleR, handleCenterY1 - handleHalfWidth); // Bottom-left curve
    handleHoles.push(handlePath1);
    
    // Handle 2 (Negative Y Side / Length End)
    const handlePath2 = new THREE.Path();
    // Center handle cutout along X-axis (width). Position Y based on board length, distance from end, and handle *width*.
    const handleCenterY2 = -halfBoardLength + handleDistanceFromEnd_cm + handleHalfWidth;
    // Draw path: X uses +/- handleHalfLength, Y uses handleCenterY2 +/- handleHalfWidth
    handlePath2.moveTo(-handleHalfLength + handleR, handleCenterY2 - handleHalfWidth);
    handlePath2.lineTo(+handleHalfLength - handleR, handleCenterY2 - handleHalfWidth);
    handlePath2.quadraticCurveTo(+handleHalfLength, handleCenterY2 - handleHalfWidth, +handleHalfLength, handleCenterY2 - handleHalfWidth + handleR);
    handlePath2.lineTo(+handleHalfLength, handleCenterY2 + handleHalfWidth - handleR);
    handlePath2.quadraticCurveTo(+handleHalfLength, handleCenterY2 + handleHalfWidth, +handleHalfLength - handleR, handleCenterY2 + handleHalfWidth);
    handlePath2.lineTo(-handleHalfLength + handleR, handleCenterY2 + handleHalfWidth);
    handlePath2.quadraticCurveTo(-handleHalfLength, handleCenterY2 + handleHalfWidth, -handleHalfLength, handleCenterY2 + handleHalfWidth - handleR);
    handlePath2.lineTo(-handleHalfLength, handleCenterY2 - handleHalfWidth + handleR);
    handlePath2.quadraticCurveTo(-handleHalfLength, handleCenterY2 - handleHalfWidth, -handleHalfLength + handleR, handleCenterY2 - handleHalfWidth);
    handleHoles.push(handlePath2);
    
    boardShape.holes.push(...handleHoles);
    console.log("Added handle holes to board shape.");
    
    const pitPositions = [];
    const pitRadius = cfg.pitRadius; // cm
    const pitDiameter = pitRadius * 2; // cm
    // Pits are spaced along the LENGTH (Y-axis)
    const pitSpacingY = pitDiameter + cfg.pitPitGap; // cm
    // Rows are positioned along the WIDTH (X-axis)
    const rowX1 = -halfBoardWidth + cfg.margin + pitRadius;
    const rowX2 = halfBoardWidth - cfg.margin - pitRadius; // Corrected calculation
    const rowXs = [rowX1, rowX2];
 
    // Center the block of pits along the LENGTH (Y-axis)
    const boardLength = halfBoardLength * 2;
    const endClearanceY = cfg.margin + cfg.handleCutoutLength + cfg.handlePitGap;
    const totalPitSpanY = (cfg.pitsPerRow * pitDiameter) + ((cfg.pitsPerRow - 1) * cfg.pitPitGap);
    const availableSpanY = boardLength - (2 * endClearanceY);
    const startOffsetY = (availableSpanY - totalPitSpanY) / 2;

    // Calculate the Y coordinate for the center of the *first* pit in a row
    const firstPitCenterY = -halfBoardLength + endClearanceY + startOffsetY + pitRadius;
    console.log(`Row X positions: ${rowXs.map(x => x.toFixed(2)).join(', ')}`);
    console.log(`Calculated total pit span Y (cm): ${totalPitSpanY.toFixed(2)}`);
    console.log(`Calculated available span Y: ${availableSpanY.toFixed(2)}`);
    console.log(`First pit center Y: ${firstPitCenterY.toFixed(2)}, Pit Spacing Y (cm): ${pitSpacingY.toFixed(2)}`);
 
    for (let i = 0; i < cfg.pitRows; i++) { // Iterate through rows (X positions)
        for (let j = 0; j < cfg.pitsPerRow; j++) { // Iterate through pits in row (Y positions)
            pitPositions.push({ x: rowXs[i], y: firstPitCenterY + j * pitSpacingY });
        }
    }
    
    const extrudeSettings = {
        steps: 1, depth: cfg.depth, bevelEnabled: true, 
        bevelThickness: 0.1, bevelSize: 0.1, bevelOffset: 0, bevelSegments: 3 
    };
    let boardGeo = new THREE.ExtrudeGeometry(boardShape, extrudeSettings);

    console.log("Index immediately after extrusion (before merge):", boardGeo.index); // <-- Check index here
    boardGeo = BufferGeometryUtils.mergeVertices(boardGeo); // Force indexing
    console.log("Index immediately after mergeVertices:", boardGeo.index); // <-- Check index here

    // --- CSG Pit Subtraction ---
    console.log("Performing CSG pit subtractions...");
    let boardMeshCSG = new THREE.Mesh(boardGeo); // Start with the extruded board
    const pitGeo = new THREE.SphereGeometry(pitRadius, 16, 16); // Use cm radius
    pitPositions.forEach((pos, index) => {
        const pitMesh = new THREE.Mesh(pitGeo);
        // Position pit center AT the top surface (Z = cfg.depth in XY plane)
        pitMesh.position.set(pos.x, pos.y, cfg.depth);
        pitMesh.updateMatrixWorld(true); // IMPORTANT for CSG
        boardMeshCSG = CSG.subtract(boardMeshCSG, pitMesh);
        console.log(`Subtracted pit ${index + 1}/${pitPositions.length}`);
    });

    // Update boardGeo with the result of CSG operations
    boardGeo = boardMeshCSG.geometry;
    boardGeo.computeVertexNormals(); // Recalculate normals after CSG
    console.log("CSG pit subtraction complete.");
    // --------------------------

    // 1. Apply Final Rotation
    boardGeo.rotateX(-Math.PI / 2);
    console.log("Applied final geometry rotation.");

    // 2. Apply Final Centering
    boardGeo.computeBoundingBox(); // Needed after rotation
    const centerOffset = new THREE.Vector3();
    boardGeo.boundingBox.getCenter(centerOffset);
    boardGeo.translate(-centerOffset.x, -centerOffset.y, -centerOffset.z);
    console.log("Applied final geometry centering with offset:", centerOffset);

    // Create a mesh just for the export function (material doesn't matter here)
    const boardMesh = new THREE.Mesh(boardGeo, new THREE.MeshBasicMaterial());

    // Mesh position/rotation should be identity as transforms are baked
    boardMesh.position.set(0,0,0);
    boardMesh.rotation.set(0,0,0);
    boardMesh.updateMatrixWorld(true);

    // We return the final MESH, not a group
    return boardMesh; 
}

function extractGeometryData(mesh, baseFilename) {
    const geometry = mesh.geometry;
    if (!geometry) { console.error("Mesh has no geometry!"); return; }
    geometry.computeVertexNormals(); // Ensure normals exist

    const posAttr = geometry.attributes.position;
    const normAttr = geometry.attributes.normal;
    const indexAttr = geometry.index; // Get the index attribute object

    if (posAttr) {
        const positions = posAttr.array;
        // Ensure correct Buffer creation using byteOffset and byteLength
        fs.writeFileSync(`${baseFilename}_position.bin`, Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength));
        console.log(`✅ Exported position data (${positions.byteLength} bytes)`);
    } else {
        console.error("❌ Geometry missing position attribute!");
    }

    if (normAttr) {
        const normals = normAttr.array;
        fs.writeFileSync(`${baseFilename}_normal.bin`, Buffer.from(normals.buffer, normals.byteOffset, normals.byteLength));
        console.log(`✅ Exported normal data (${normals.byteLength} bytes)`);
    } else {
        console.error("❌ Geometry missing normal attribute!");
    }

    console.log("Checking geometry.index before export:", indexAttr); // Log the index attribute itself
    if (indexAttr) {
        const indices = indexAttr.array;
        if (indices && indices.byteLength > 0) {
            const indexType = indices instanceof Uint16Array ? 'Uint16Array' : 'Uint32Array';
            fs.writeFileSync(`${baseFilename}_index.bin`, Buffer.from(indices.buffer, indices.byteOffset, indices.byteLength));
            console.log(`✅ Exported index data (${indices.byteLength} bytes, type: ${indexType})`);
        } else {
             console.warn("⚠️ Geometry index attribute exists, but its array is null or empty.");
        }
    }

    console.log(`   (Export path base: ${baseFilename})`);
}

// --- Main Execution ---
async function main() {
    console.log("Generating Oware board model...");
    const finalBoardMesh = generateFinalOwareBoardMesh(FINAL_BOARD_CONFIG); // Pass the imported config
    console.log("Extracting geometry data...");

    extractGeometryData(finalBoardMesh, path.join(__dirname, '../client/assets/oware_board'));
}

main().catch(err => {
    console.error("Script execution failed:", err);
    process.exit(1);
});
