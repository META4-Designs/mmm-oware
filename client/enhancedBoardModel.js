/**
 * Enhanced Oware Board Model
 * 
 * Contains the finalized configuration and creation function for the
 * Oware board base geometry with correct dimensions and cutouts.
 */

// --- Final Board Configuration (1.5cm Margin & Handle Gap) ---
export const BOARD_CONFIG = {
    length: 45.0, width: 13.8, depth: 4, cornerRadius: 2.0, // Final board dimensions
    margin: 1.5, 
    pitRows: 2, pitsPerRow: 6,
    pitRadius: 2.5, // Calculated pit radius (PD=5.0)
    pitDepth: 1.0, // Target depth for concave pits (used later with CSG)
    handleCutoutWidth: 2.5, // Final handle width
    handleCutoutLength: 10.8, // Adjusted handle length for board width
    handleCutoutCornerRadius: 1.25, // Final handle radius (width/2)
    handleDistanceFromEnd: 1.5, // Positioned at margin
    boardColor: 0xf5e8c0, pitColor: 0xd3c8a0,
    handlePitGap: 1.5, // Gap between handle and first pit column
    pitPitGap: 0.8 // Gap between pit columns
};

/**
 * Creates the final Oware board base geometry with handle and pit *holes*.
 * Note: Pits are currently through-holes; CSG will be needed for concave depressions.
 * @param {Object} THREE - Three.js library instance
 * @returns {THREE.Group} Group containing the board mesh
 */
export function createFinalBoardModel(THREE) {
    const cfg = BOARD_CONFIG; // Use the config from this module
    const boardGroup = new THREE.Group();
    const halfBoardLength = cfg.length / 2;
    const halfBoardWidth = cfg.width / 2;
    
    // Materials
    const boardMaterial = new THREE.MeshStandardMaterial({ color: cfg.boardColor, roughness: 0.7 });
    
    //console.log("Creating board shape w/ refined handle & pit holes...");
    
    // --- Main Board Shape (Handles and Pits as Holes) ---
    const boardShape = new THREE.Shape();
    const hw = halfBoardLength; const hh = halfBoardWidth; const r = cfg.cornerRadius;
    boardShape.moveTo(-hw + r, -hh); // Bottom left corner start
    boardShape.lineTo( hw - r, -hh); // Bottom edge
    boardShape.quadraticCurveTo( hw, -hh, hw, -hh + r); // Bottom right corner
    boardShape.lineTo( hw,  hh - r); // Right edge
    boardShape.quadraticCurveTo( hw,  hh, hw - r,  hh); // Top right corner
    boardShape.lineTo(-hw + r,  hh); // Top edge
    boardShape.quadraticCurveTo(-hw,  hh,-hw,  hh - r); // Top left corner
    boardShape.lineTo(-hw, -hh + r); // Left edge
    boardShape.quadraticCurveTo(-hw, -hh,-hw + r, -hh); // Back to start (bottom left corner)
    
    // Handles
    const handleHoles = [];
    const handleHalfLength = cfg.handleCutoutLength / 2; // 10.8 / 2 = 5.4
    const handleHalfWidth = cfg.handleCutoutWidth / 2;   // 2.5 / 2 = 1.25
    const handleR = cfg.handleCutoutCornerRadius;       // 1.25
    
    // Handle 1 (Right Side)
    const handlePath1 = new THREE.Path();
    const handleCenterX1 = hw - cfg.handleDistanceFromEnd - handleHalfWidth; // 22.5 - 1.5 - 1.25 = 19.75
    handlePath1.moveTo(handleCenterX1 - handleHalfWidth + handleR, -handleHalfLength);
    handlePath1.lineTo(handleCenterX1 + handleHalfWidth - handleR, -handleHalfLength);
    handlePath1.quadraticCurveTo(handleCenterX1 + handleHalfWidth, -handleHalfLength, handleCenterX1 + handleHalfWidth, -handleHalfLength + handleR);
    handlePath1.lineTo(handleCenterX1 + handleHalfWidth, handleHalfLength - handleR);
    handlePath1.quadraticCurveTo(handleCenterX1 + handleHalfWidth, handleHalfLength, handleCenterX1 + handleHalfWidth - handleR, handleHalfLength);
    handlePath1.lineTo(handleCenterX1 - handleHalfWidth + handleR, handleHalfLength);
    handlePath1.quadraticCurveTo(handleCenterX1 - handleHalfWidth, handleHalfLength, handleCenterX1 - handleHalfWidth, handleHalfLength - handleR);
    handlePath1.lineTo(handleCenterX1 - handleHalfWidth, -handleHalfLength + handleR);
    handlePath1.quadraticCurveTo(handleCenterX1 - handleHalfWidth, -handleHalfLength, handleCenterX1 - handleHalfWidth + handleR, -handleHalfLength);
    handleHoles.push(handlePath1);
    
    // Handle 2 (Left Side)
    const handlePath2 = new THREE.Path();
    const handleCenterX2 = -hw + cfg.handleDistanceFromEnd + handleHalfWidth; // -22.5 + 1.5 + 1.25 = -19.75
    handlePath2.moveTo(handleCenterX2 - handleHalfWidth + handleR, -handleHalfLength);
    handlePath2.lineTo(handleCenterX2 + handleHalfWidth - handleR, -handleHalfLength);
    handlePath2.quadraticCurveTo(handleCenterX2 + handleHalfWidth, -handleHalfLength, handleCenterX2 + handleHalfWidth, -handleHalfLength + handleR);
    handlePath2.lineTo(handleCenterX2 + handleHalfWidth, handleHalfLength - handleR);
    handlePath2.quadraticCurveTo(handleCenterX2 + handleHalfWidth, handleHalfLength, handleCenterX2 + handleHalfWidth - handleR, handleHalfLength);
    handlePath2.lineTo(handleCenterX2 - handleHalfWidth + handleR, handleHalfLength);
    handlePath2.quadraticCurveTo(handleCenterX2 - handleHalfWidth, handleHalfLength, handleCenterX2 - handleHalfWidth, handleHalfLength - handleR);
    handlePath2.lineTo(handleCenterX2 - handleHalfWidth, -handleHalfLength + handleR);
    handlePath2.quadraticCurveTo(handleCenterX2 - handleHalfWidth, -handleHalfLength, handleCenterX2 - handleHalfWidth + handleR, -handleHalfLength);
    handleHoles.push(handlePath2);
    
    // --- Calculate Pit Positions --- 
    const pitPositions = [];
    const pitRadius = cfg.pitRadius;
    const pitDiameter = pitRadius * 2;
    const pitSpacingX = pitDiameter + cfg.pitPitGap; // 5.0 + 0.8 = 5.8
    
    // Z positions for rows
    const rowZ1 = -halfBoardWidth + cfg.margin + pitRadius; // -6.9 + 1.5 + 2.5 = -2.9
    const rowZ2 = halfBoardWidth - cfg.margin - pitRadius;  //  6.9 - 1.5 - 2.5 =  2.9
    const rowZs = [rowZ1, rowZ2];
    
    // Starting X position
    const firstPitX = -halfBoardLength + cfg.margin + cfg.handleCutoutWidth + cfg.handlePitGap + pitRadius; // -22.5 + 1.5 + 2.5 + 1.5 + 2.5 = -14.5
    //console.log(`First pit X: ${firstPitX.toFixed(2)}, Pit Spacing: ${pitSpacingX.toFixed(2)}`);

    for (let i = 0; i < cfg.pitRows; i++) {
        for (let j = 0; j < cfg.pitsPerRow; j++) {
            const posX = firstPitX + j * pitSpacingX;
            const posZ = rowZs[i];
            pitPositions.push({ x: posX, z: posZ });
        }
    }
    
    // Create Pit Holes
    const pitHoles = [];
    for (let i = 0; i < pitPositions.length; i++) {
        const pos = pitPositions[i];
        const pitPath = new THREE.Path();
        pitPath.absarc(pos.x, pos.z, cfg.pitRadius, 0, Math.PI * 2, false);
        pitHoles.push(pitPath);
    }
    
    boardShape.holes.push(...handleHoles, ...pitHoles);
    //console.log(`Added ${handleHoles.length} handle holes and ${pitHoles.length} pit holes.`);
    
    // Extrude the board shape (with all holes)
    const extrudeSettings = {
        steps: 1, depth: cfg.depth, bevelEnabled: true,
        bevelThickness: 0.1, bevelSize: 0.1, bevelOffset: 0, bevelSegments: 3
    };
    const boardGeometry = new THREE.ExtrudeGeometry(boardShape, extrudeSettings);
    
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    // Center the geometry manually 
    boardGeometry.computeBoundingBox();
    const center = new THREE.Vector3();
    boardGeometry.boundingBox.getCenter(center);
    boardMesh.position.sub(center);
    boardMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    boardGroup.add(boardMesh);
    
    // Position board group correctly
    boardGroup.position.y = 0; // Position bottom of board near y=0
    
    //console.log("Board setup complete.");
    return boardGroup;
}
