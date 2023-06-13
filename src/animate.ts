import * as THREE from 'three';

function rotateVertical(array: THREE.Object3D[]) {
    /*
        Rotate the squares across a circle 90 degrees
    */

}

function rotateHorizontal(array: THREE.Object3D[]) {}

/* AI Assistant generative output.
const cubeSize = 1;
const gap = 0.02; // Gap between the cubes
const fullSize = cubeSize + gap;
const halfSize = fullSize * 3 / 2 - cubeSize / 2;

// Create a cube of cubes (3x3x3)
function createRubiksCube() {
  // Create a group to store all cubes
  const rubiksCube = new THREE.Group();

  for (let x = -halfSize; x <= halfSize; x += fullSize) {
    for (let y = -halfSize; y <= halfSize; y += fullSize) {
      for (let z = -halfSize; z <= halfSize; z += fullSize) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        rubiksCube.add(cube);
      }
    }
  }

  return rubiksCube;
}

const rubiksCube = createRubiksCube();
scene.add(rubiksCube);

// Rotate cubes vertically
function rotateVertical(layerIndex, angle) {
  const layerY = halfSize - layerIndex * fullSize;

  // Create a group for the selected cubes
  const rotationGroup = new THREE.Group();
  rubiksCube.add(rotationGroup);

  // Move selected cubes to the rotation group
  rubiksCube.children.forEach(cube => {
    if (Math.abs(cube.position.y - layerY) < 0.1) {
      rotationGroup.add(cube);
    }
  });

  // Rotate the group of cubes
  rotationGroup.rotation.x += angle;

  // When the rotation is complete, remove the rotation group and re-add the cubes to the Rubik's Cube group
  setTimeout(() => {
	delay: 100;
    rotationGroup.children.forEach(cube => {
      rubiksCube.add(cube);
    });

    rubiksCube.remove(rotationGroup);
  });
}

// Rotate cubes horizontally
function rotateHorizontal(layerIndex, angle) {
  const layerX = halfSize - layerIndex * fullSize;

  // Create a group for the selected cubes
  const rotationGroup = new THREE.Group();
  rubiksCube.add(rotationGroup);

  // Move selected cubes to the rotation group
  rubiksCube.children.forEach(cube => {
    if (Math.abs(cube.position.x - layerX) < 0.1) {
      rotationGroup.add(cube);
    }
  });

  // Rotate the group of cubes
  rotationGroup.rotation.y += angle;

  // When the rotation is complete, remove the rotation group and re-add the cubes to the Rubik's Cube group
  setTimeout(() => {
	delay: 100;
    rotationGroup.children.forEach(cube => {
      rubiksCube.add(cube);
    });

    rubiksCube.remove(rotationGroup);
  });
}

// Example usage:
rotateVertical(1, Math.PI / 2); // Rotate the middle vertical layer 90 degrees
rotateHorizontal(2, -Math.PI / 2); // Rotate the top horizontal layer -90 degrees
*/