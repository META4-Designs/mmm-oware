/**
 * Corrected Oware Board Model
 * 
 * Fixed issues:
 * 1. Resolved handle-pit collision
 * 2. Made pits circular instead of elliptical
 * 3. Adjusted pit depth
 */

// Board dimensions and configuration
export const BOARD_CONFIG = {
    // Main board dimensions
    length: 40, // cm
    width: 14.4, // cm
    depth: 4, // cm
    cornerRadius: 1.4, // cm

    // Pit configuration
    pitRows: 2,
    pitsPerRow: 6,
    pitRadius: 2.0, // cm (CIRCULAR pits with consistent radius)
    pitDepth: 1.0, // cm - Reduced depth

    // Handle dimensions
    handleCutoutWidth: 1.86, // cm (Dimension across board's short axis)
    handleCutoutLength: 8.8, // cm (Dimension along board's short axis)
    handleCutoutCornerRadius: 0.9, // cm
    handleDistanceFromEnd: 3.0, // cm (INCREASED to avoid collision with pits)

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
 * @returns {Object} Object containing the board group, pits array, and config
 */
export function createOwareBoard(THREE) {
    const config = BOARD_CONFIG;
    const group = new THREE.Group();

    // Calculate helper values
    const halfBoardLength = config.length / 2;
    const halfBoardWidth = config.width / 2;
    
    // Calculate pit spacing
    const rowSpacing = config.width / (config.pitRows + 1);
    
    // Calculate positions to ensure no collisions with handles
    // We'll distribute pits evenly, leaving space for the handles
    const safeAreaStart = -halfBoardLength + config.handleDistanceFromEnd + config.handleCutoutWidth + config.pitRadius;
    const safeAreaEnd = halfBoardLength - config.handleDistanceFromEnd - config.handleCutoutWidth - config.pitRadius;
    const safeAreaLength = safeAreaEnd - safeAreaStart;
    
    // Calculate spacing between pit centers
    const pitSpacingX = safeAreaLength / (config.pitsPerRow - 1);
    
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
    const pitPositions = [];
    
    for (let i = 0; i < config.pitRows; i++) {
        for (let j = 0; j < config.pitsPerRow; j++) {
            const pitPath = new THREE.Path();
            
            // Calculate center position for this pit
            const posX = safeAreaStart + j * pitSpacingX;
            const posZ = -halfBoardWidth + rowSpacing * (i + 1);
            
            // Create circular path (not elliptical)
            pitPath.absarc(posX, posZ, config.pitRadius, 0, Math.PI * 2, false);
            
            pitHoles.push(pitPath);
            pitPositions.push({ x: posX, z: posZ });
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
    boardGeometry.center(); // Center the geometry
    
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat on XZ plane
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    group.add(boardMesh);

    // --- Create Concave Pits ---
    const pits = [];
    
    for (let i = 0; i < pitPositions.length; i++) {
        const rowIndex = Math.floor(i / config.pitsPerRow);
        const colIndex = i % config.pitsPerRow;
        const position = pitPositions[i];
        
        // Use a hemisphere geometry (circular, not elliptical)
        const pitGeom = new THREE.SphereGeometry(
            config.pitRadius, // Consistent radius for circular pits
            32, // Width segments
            16, // Height segments
            0, // Phi start
            Math.PI * 2, // Phi length
            0, // Theta start
            Math.PI / 2 // Theta length (hemisphere)
        );
        
        const pitMesh = new THREE.Mesh(pitGeom, pitMaterial);
        
        // Adjust the depth but keep the radius consistent
        pitMesh.scale.set(1, config.pitDepth / config.pitRadius, 1);
        
        // Position pit inside the hole
        pitMesh.position.set(
            position.x, 
            config.depth / 2 - config.pitDepth + 0.1, // Slight offset to avoid z-fighting
            position.z
        );
        
        // Flip hemisphere to face upward
        pitMesh.rotation.x = Math.PI;
        
        pitMesh.receiveShadow = true;
        
        // Store pit data for game logic
        pitMesh.userData = {
            type: 'pit',
            row: rowIndex,
            column: colIndex,
            index: i,
            seeds: []
        };
        
        pits.push(pitMesh);
        group.add(pitMesh);
    }

    // Position group so board sits on the ground plane
    group.position.y = config.depth / 2;
    
    return {
        group,
        pits,
        config: {
            ...config,
            pitPositions
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
    const radius = config.pitRadius * 0.65; // Scale based on pit size
    
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
 * @param {number} seedsPerPit - Number of seeds per pit (default 4)
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
            const radius = Math.random() * config.pitRadius * 0.5;
            const height = i * (seed.geometry.parameters.radius * 0.6); // Stack a bit closer
            
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
