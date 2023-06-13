import * as THREE from 'three';
import {MathUtils} from "three";

export function rotateVertical(scene: THREE.Scene, cubes: THREE.Object3D[], layerIndex: number, angle: number) {
    const degrees = MathUtils.radToDeg(angle);
    // Create a group for the selected cubes
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    for (const cube of cubes) {
        if (cube.position.x === layerIndex) {
            rotationGroup.add(cube);
        }
    }
    console.log(rotationGroup.children.length);
    let counter = 0;
    const i = setInterval(() => {
        counter += 1;
        rotationGroup.rotateX(THREE.MathUtils.degToRad(1));
        if (counter >= degrees) {
            clearInterval(i);
            for (const cube of rotationGroup.children) {
                scene.add(cube);
            }
        }
    }, 0.1);

    /*
    // Rotate the group of cubes
    setTimeout(() => {
        for (const child of rotationGroup.children) {
            const c = rotationGroup.remove(child);
            scene.add(c);
        }
    }, 1);
     */
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