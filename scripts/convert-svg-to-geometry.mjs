// Script to convert SVG board outline to Three.js geometry (ESM version)
// Usage: node scripts/convert-svg-to-geometry.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from 'xmldom';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

global.DOMParser = DOMParser;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SVG_PATH = path.resolve(__dirname, '../docs/references/mm-oware-board-V1.svg');
const OUTPUT_PATH = path.resolve(__dirname, '../client/js/boardGeometry.json');

// Board physical dimensions (in centimeters)
const BOARD_LENGTH_CM = 40;
const BOARD_THICKNESS_CM = 4;

// Helper: Load SVG file
function loadSVG(svgPath) {
  return fs.readFileSync(svgPath, 'utf8');
}

// Helper: Parse SVG and convert to geometry
function svgToGeometry(svgString) {
  const loader = new SVGLoader();
  const svgData = loader.parse(svgString);
  // Merge all paths into a single shape
  const shapes = [];
  svgData.paths.forEach(path => {
    path.toShapes(true).forEach(shape => {
      shapes.push(shape);
    });
  });
  // Extrude the shape(s)
  const extrudeSettings = {
    depth: BOARD_THICKNESS_CM, // thickness in cm
    bevelEnabled: false
  };
  const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
  return geometry;
}

// Helper: Scale geometry to desired length
function scaleGeometry(geometry, targetLengthCm) {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  const currentLength = bbox.max.x - bbox.min.x;
  const scale = targetLengthCm / currentLength;
  geometry.scale(scale, scale, 1); // scale x and y, not z (thickness already set)
}

// Main
function main() {
  const svgString = loadSVG(SVG_PATH);
  const geometry = svgToGeometry(svgString);
  scaleGeometry(geometry, BOARD_LENGTH_CM);
  // Export geometry as JSON
  const geoJson = geometry.toJSON();
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(geoJson, null, 2));
  console.log(`Board geometry exported to ${OUTPUT_PATH}`);
}

main();
