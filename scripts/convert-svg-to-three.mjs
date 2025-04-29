/**
 * Improved SVG to Three.js Geometry Converter
 * 
 * This script loads an SVG file, converts it to a Three.js geometry,
 * and exports it in a format that can be directly loaded by Three.js.
 * 
 * Usage: node scripts/convert-svg-to-three.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from 'xmldom';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Make DOMParser available to SVGLoader
global.DOMParser = DOMParser;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SVG_PATH = path.resolve(__dirname, '../docs/references/mm-oware-board-V1.svg');
const OUTPUT_PATH = path.resolve(__dirname, '../client/public/js/boardGeometry.js');

// Board physical dimensions (in centimeters)
const BOARD_LENGTH_CM = 40;
const BOARD_THICKNESS_CM = 4;

/**
 * Convert SVG to mesh data and export as a JS module
 */
async function convertSVGtoThreeJS() {
  try {
    console.log(`Loading SVG from ${SVG_PATH}...`);
    const svgContent = fs.readFileSync(SVG_PATH, 'utf8');
    
    console.log('Parsing SVG data...');
    const loader = new SVGLoader();
    const svgData = loader.parse(svgContent);
    
    console.log('Creating Three.js shapes...');
    const shapes = [];
    svgData.paths.forEach((path) => {
      const pathShapes = path.toShapes(true);
      shapes.push(...pathShapes);
    });
    
    if (shapes.length === 0) {
      throw new Error('No valid shapes found in the SVG');
    }
    
    console.log(`Found ${shapes.length} shapes in the SVG`);
    
    // Create the extruded geometry
    console.log('Creating extruded geometry...');
    const extrudeSettings = {
      depth: BOARD_THICKNESS_CM,
      bevelEnabled: false
    };
    
    const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    
    // Scale to real-world dimensions
    console.log('Scaling geometry...');
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const currentLength = bbox.max.x - bbox.min.x;
    const scale = BOARD_LENGTH_CM / currentLength;
    geometry.scale(scale, scale, 1); // Scale X and Y, not Z (thickness)
    
    // Get position attributes
    const positions = Array.from(geometry.getAttribute('position').array);
    const indices = Array.from(geometry.getIndex().array);
    const normals = Array.from(geometry.getAttribute('normal').array);
    const uvs = geometry.getAttribute('uv') ? Array.from(geometry.getAttribute('uv').array) : [];
    
    // Calculate centered bounds
    geometry.computeBoundingBox();
    const bounds = {
      min: {
        x: geometry.boundingBox.min.x,
        y: geometry.boundingBox.min.y,
        z: geometry.boundingBox.min.z
      },
      max: {
        x: geometry.boundingBox.max.x,
        y: geometry.boundingBox.max.y,
        z: geometry.boundingBox.max.z
      }
    };
    
    // Create a module that exports the geometry data
    const jsContent = `/**
 * Oware Board Geometry
 * Generated from ${path.basename(SVG_PATH)} on ${new Date().toISOString()}
 * Physical dimensions: ${BOARD_LENGTH_CM}cm x ${BOARD_THICKNESS_CM}cm
 */

export const boardGeometryData = {
  type: 'ExtrudeGeometry',
  uuid: '${geometry.uuid}',
  positions: ${JSON.stringify(positions)},
  indices: ${JSON.stringify(indices)},
  normals: ${JSON.stringify(normals)},
  uvs: ${JSON.stringify(uvs)},
  bounds: ${JSON.stringify(bounds)},
  parameters: {
    shapes: [], // Shapes are already processed into positions and indices
    options: ${JSON.stringify(extrudeSettings)}
  }
};

/**
 * Creates a Three.js BufferGeometry from the exported data
 * @param {Object} THREE - Three.js library
 * @returns {THREE.BufferGeometry}
 */
export function createBoardGeometry(THREE) {
  const geometry = new THREE.BufferGeometry();
  
  // Set attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(boardGeometryData.positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(boardGeometryData.normals, 3));
  if (boardGeometryData.uvs.length > 0) {
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(boardGeometryData.uvs, 2));
  }
  geometry.setIndex(boardGeometryData.indices);
  
  // Compute bounding box
  geometry.computeBoundingBox();
  
  return geometry;
}
`;
    
    // Write output file
    fs.writeFileSync(OUTPUT_PATH, jsContent);
    console.log(`Successfully exported board geometry to ${OUTPUT_PATH}`);
    
  } catch (error) {
    console.error('Error converting SVG to Three.js:', error);
    process.exit(1);
  }
}

// Run the conversion
convertSVGtoThreeJS();
