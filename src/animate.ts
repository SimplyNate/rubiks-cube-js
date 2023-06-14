import * as THREE from 'three';
import {MathUtils} from "three";

export function rotateVertical(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number) {
    const degrees = MathUtils.radToDeg(angle);
    // Create a group for the selected cubes
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    for (let i = cubes.children.length - 1; i >= 0; i--) {
        const cube = cubes.children[i];
        if (cube.position.x === layerIndex) {
            rotationGroup.add(cube);
        }
    }
    let counter = 0;
    const i = setInterval(() => {
        counter += 1;
        rotationGroup.rotateX(THREE.MathUtils.degToRad(1));
        if (counter >= degrees) {
            clearInterval(i);
            for (let i = rotationGroup.children.length - 1; i >= 0; i--) {
                cubes.add(rotationGroup.children[i]);
            }
            scene.remove(rotationGroup);
        }
    }, 0.1);
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