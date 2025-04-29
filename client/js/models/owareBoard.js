/**
 * Oware Board Model
 * Implementation based on refined measurements and design from reference materials
 */

// Board dimensions and configuration
export const BOARD_CONFIG = {
    // Main board dimensions
    length: 40, // cm
    width: 14.4, // cm (Refined from reference)
    depth: 4, // cm
    cornerRadius: 1.4, // cm (Refined)

    // Pit configuration
    pitRows: 2,
    pitsPerRow: 6,
    pitRadiusX: 2.3, // cm (Radius along board length)
    pitRadiusZ: 2.8, // cm (Radius along board width)
    pitDepth: 1.5, // cm - How deep the concave part goes

    // Handle dimensions
    handleCutoutWidth: 1.86, // cm (Dimension across board's short axis)
    handleCutoutLength: 8.8, // cm (Dimension along board's short axis)
    handleCutoutCornerRadius: 0.9, // cm
    handleDistanceFromEnd: 1.5, // cm (Distance from board end to start of handle cutout)

    // Colors
    boardColor: 0xfffff0, // Ivory color
    pitColor: 0xcccccc, // Slightly darker for pit interiors
    marbleColors: [
        0xF5DEB3, // Wheat
        0x8B4513, // SaddleBrown
        0x556B2F, // DarkOliveGreen
        0x800000  // Maroon
    ]
};

/**
 * Creates a complete Oware board with pits and handle cutouts
 * @param {Object} THREE - Three.js library
 * @returns {THREE.Group} The complete board model
 */
export function createOwareBoard(THREE) {
    const config = BOARD_CONFIG;
    const group = new THREE.Group();

    // Calculate helper values
    const halfBoardLength = config.length / 2;
    const halfBoardWidth = config.width / 2;
    
    // Calculate horizontal spacing between pit centers
    const totalPitAreaLength = config.length - 2 * config.handleDistanceFromEnd - 
        2 * config.handleCutoutWidth - 2 * config.cornerRadius;
    const pitSpacingX = totalPitAreaLength / (config.pitsPerRow - 1);
    const firstPitX = -halfBoardLength + config.cornerRadius + config.handleDistanceFromEnd + 
        config.handleCutoutWidth + config.pitRadiusX + 
        (totalPitAreaLength - (config.pitsPerRow-1) * pitSpacingX) / 2;

    // Calculate vertical spacing between pit centers
    const pitSpacingZ = config.width / (config.pitRows + 1);

    // Materials
    const boardMaterial = new THREE.MeshStandardMaterial({
        color: config.boardColor,
        roughness: 0.7,
        metalness: 0.1
    });
    
    const pitMaterial = new THREE.MeshStandardMaterial({
        color: config.pitColor,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.BackSide // Render the inside of the spheres
    });

    // --- Main Board Shape with Holes ---
    const boardShape = new THREE.Shape();
    const hw = halfBoardLength;
    const hh = halfBoardWidth;
    const r = config.cornerRadius;

    // Define the outer rounded rectangle path
    boardShape.moveTo(-hw + r, -hh);
    boardShape.lineTo(hw - r, -hh);
    boardShape.quadraticCurveTo(hw, -hh, hw, -hh + r);
    boardShape.lineTo(hw, hh - r);
    boardShape.quadraticCurveTo(hw, hh, hw - r, hh);
    boardShape.lineTo(-hw + r, hh);
    boardShape.quadraticCurveTo(-hw, hh, -hw, hh - r);
    boardShape.lineTo(-hw, -hh + r);
    boardShape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

    // --- Define Handle Holes ---
    const handleHoles = [];
    const handleHalfLength = config.handleCutoutLength / 2;
    const handleHalfWidth = config.handleCutoutWidth / 2;
    const handleR = config.handleCutoutCornerRadius;

    // Handle 1 (Positive X side)
    const handlePath1 = new THREE.Path();
    const handleCenterX1 = hw - config.handleDistanceFromEnd - handleHalfWidth;
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

    // Handle 2 (Negative X side)
    const handlePath2 = new THREE.Path();
    const handleCenterX2 = -hw + config.handleDistanceFromEnd + handleHalfWidth;
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

    boardShape.holes.push(...handleHoles);

    // --- Define Pit Holes ---
    const pitHoles = [];
    for (let i = 0; i < config.pitRows; i++) {
        for (let j = 0; j < config.pitsPerRow; j++) {
            const pitPath = new THREE.Path();
            // Calculate center position for this pit
            const posX = firstPitX + j * pitSpacingX;
            const posZ = -halfBoardWidth + pitSpacingZ * (i + 1);

            // Create an elliptical path
            pitPath.ellipse(posX, posZ, config.pitRadiusX, config.pitRadiusZ, 0, Math.PI * 2, false, 0);
            pitHoles.push(pitPath);
        }
    }
    boardShape.holes.push(...pitHoles);

    // --- Extrude the Board Shape ---
    const extrudeSettings = {
        steps: 1,
        depth: config.depth,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 3
    };
    
    const boardGeometry = new THREE.ExtrudeGeometry(boardShape, extrudeSettings);
    boardGeometry.center(); // Center the geometry for easier positioning
    
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat on XZ plane
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    group.add(boardMesh);

    // --- Create Concave Pits ---
    const pits = [];
    for (let i = 0; i < config.pitRows; i++) {
        for (let j = 0; j < config.pitsPerRow; j++) {
            // Use a hemisphere geometry and scale it to be elliptical
            const pitGeom = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const pitMesh = new THREE.Mesh(pitGeom, pitMaterial);

            // Scale to match elliptical radii
            pitMesh.scale.set(config.pitRadiusX, config.pitDepth, config.pitRadiusZ);

            // Calculate center position for this pit
            const posX = firstPitX + j * pitSpacingX;
            const posZ = -halfBoardWidth + pitSpacingZ * (i + 1);
            const posY = config.depth / 2 - config.pitDepth + 0.1; // Position just below surface

            pitMesh.position.set(posX, posY, posZ);
            pitMesh.rotation.x = Math.PI; // Flip hemisphere upside down

            pitMesh.receiveShadow = true;
            
            // Store pit data for game logic
            pitMesh.userData = {
                type: 'pit',
                row: i,
                column: j,
                index: i * config.pitsPerRow + j,
                seeds: []
            };
            
            pits.push(pitMesh);
            group.add(pitMesh);
        }
    }

    // Position group so board sits on the ground plane
    group.position.y = config.depth / 2;
    
    return {
        group,
        pits,
        config: {
            ...config,
            pitSpacingX,
            pitSpacingZ,
            firstPitX
        }
    };
}

/**
 * Creates a marble/seed mesh
 * @param {Object} THREE - Three.js library
 * @param {number} type - Marble type/color (0-3)
 * @returns {THREE.Mesh} The marble mesh
 */
export function createMarble(THREE, type = 0) {
    const config = BOARD_CONFIG;
    const radius = Math.min(config.pitRadiusX, config.pitRadiusZ) * 0.65;
    
    const marbleMaterial = new THREE.MeshStandardMaterial({
        color: config.marbleColors[type % config.marbleColors.length],
        roughness: 0.3,
        metalness: 0.7
    });
    
    const marbleGeometry = new THREE.SphereGeometry(radius, 24, 24);
    const marble = new THREE.Mesh(marbleGeometry, marbleMaterial);
    
    marble.castShadow = true;
    marble.receiveShadow = true;
    
    // Store data for game logic
    marble.userData = {
        type: 'seed',
        seedType: type
    };
    
    return marble;
}

/**
 * Places marbles in the board's pits
 * @param {Object} THREE - Three.js library
 * @param {Object} board - The board object returned by createOwareBoard
 * @param {number} seedsPerPit - Number of seeds per pit
 */
export function setupMarbles(THREE, board, seedsPerPit = 4) {
    const config = board.config;
    
    board.pits.forEach((pit, pitIndex) => {
        const seeds = [];
        const pitCenter = new THREE.Vector3();
        pit.getWorldPosition(pitCenter);
        
        for (let i = 0; i < seedsPerPit; i++) {
            const seedType = Math.floor(Math.random() * 4);
            const seed = createMarble(THREE, seedType);
            
            // Random position within pit
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.min(config.pitRadiusX, config.pitRadiusZ) * 0.5;
            const height = i * (seed.geometry.parameters.radius * 0.7);
            
            // Position seed at calculated point
            seed.position.set(
                pitCenter.x + radius * Math.cos(angle),
                pitCenter.y - config.pitDepth * 0.5 + height + seed.geometry.parameters.radius,
                pitCenter.z + radius * Math.sin(angle)
            );
            
            // Random rotation
            seed.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Store reference to which pit this seed belongs
            seed.userData.pitIndex = pitIndex;
            seed.userData.seedIndex = i;
            
            // Add to scene and track in data structures
            board.group.add(seed);
            seeds.push(seed);
            pit.userData.seeds.push(seed);
        }
    });
}
