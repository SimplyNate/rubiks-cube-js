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
    const initialRotations: THREE.Quaternion[] = [];
    rotationGroup.rotateX(angle);
    for (const cube of selectedCubes) {
        const globalPosition = new THREE.Vector3();
        cube.getWorldPosition(globalPosition);
        initialPositions.push(globalPosition);
        const globalRotation = new THREE.Quaternion();
        cube.getWorldQuaternion(globalRotation);
        initialRotations.push(globalRotation);
    }
    for (let i = 0; i < selectedCubes.length; i++) {
        const cube = selectedCubes[i];
        cubes.add(cube);
        cube.position.set(Math.round(initialPositions[i].x), Math.round(initialPositions[i].y), Math.round(initialPositions[i].z));
        cube.rotation.setFromQuaternion(initialRotations[i]);
    }
    scene.remove(rotationGroup);
}

// Rotate cubes horizontally
export function rotateHorizontal(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number) {
    // Create a group for the selected cubes
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    const selectedCubes: THREE.Object3D[] = [];
    for (let i = cubes.children.length - 1; i >= 0; i--) {
        const cube = cubes.children[i];
        if (cube.position.y === layerIndex) {
            selectedCubes.push(cube);
            rotationGroup.add(cube);
        }
    }
    const initialPositions: THREE.Vector3[] = [];
    const initialRotations: THREE.Quaternion[] = [];
    rotationGroup.rotateY(angle);
    for (const cube of selectedCubes) {
        const globalPosition = new THREE.Vector3();
        cube.getWorldPosition(globalPosition);
        initialPositions.push(globalPosition);
        const globalRotation = new THREE.Quaternion();
        cube.getWorldQuaternion(globalRotation);
        initialRotations.push(globalRotation);
    }
    for (let i = 0; i < selectedCubes.length; i++) {
        const cube = selectedCubes[i];
        cubes.add(cube);
        cube.position.set(Math.round(initialPositions[i].x), Math.round(initialPositions[i].y), Math.round(initialPositions[i].z));
        cube.rotation.setFromQuaternion(initialRotations[i]);
    }
    scene.remove(rotationGroup);
}

// Example usage:
// rotateVertical(1, Math.PI / 2); // Rotate the middle vertical layer 90 degrees
// rotateHorizontal(2, -Math.PI / 2); // Rotate the top horizontal layer -90 degrees