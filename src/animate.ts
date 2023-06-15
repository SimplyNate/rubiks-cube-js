import * as THREE from 'three';

export function rotateVertical(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number) {
    // Create a group for the selected cubes
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    const selectedCubes: THREE.Object3D[] = [];
    for (let i = cubes.children.length - 1; i >= 0; i--) {
        const cube = cubes.children[i];
        if (cube.position.x === layerIndex) {
            selectedCubes.push(cube);
            rotationGroup.add(cube);
        }
    }
    const initialPositions: THREE.Vector3[] = [];
    const initialRotations: THREE.Euler[] = [];
    rotationGroup.rotateX(angle);
    for (const cube of selectedCubes) {
        initialPositions.push(cube.position.clone());
        initialRotations.push(cube.rotation.clone());
    }
    for (let i = 0; i < selectedCubes.length; i++) {
        const cube = selectedCubes[i];
        cubes.add(cube);
        cube.position.set(initialPositions[i].x, initialPositions[i].y, initialPositions[i].z);
        cube.rotation.set(initialRotations[i]);
    }
    scene.remove(rotationGroup);
}

// Rotate cubes horizontally
export function rotateHorizontal(cubes: THREE.Object3D[], layerIndex: number, angle: number) {
    // Create a group for the selected cubes
    const rotationGroup = new THREE.Group();
    for (const cube of cubes) {
        console.log(cube.position.y);
        if (cube.position.y === layerIndex) {
            rotationGroup.add(cube);
        }
    }
    console.log(rotationGroup.children.length);

    // Rotate the group of cubes
    rotationGroup.rotateY(angle);
    /*
    setTimeout(() => {
        for (const child of rotationGroup.children) {
            cube.add(child);
        }
        cube.remove(rotationGroup);
    }, 1);
     */
}

// Example usage:
// rotateVertical(1, Math.PI / 2); // Rotate the middle vertical layer 90 degrees
// rotateHorizontal(2, -Math.PI / 2); // Rotate the top horizontal layer -90 degrees