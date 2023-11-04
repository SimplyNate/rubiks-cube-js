import * as THREE from 'three';

const iterations = 30;

export function select(cubes: THREE.Group, layerIndex: number, axis: 'x' | 'y' | 'z'): THREE.Object3D[] {
    const selectedCubes:THREE.Object3D[] = [];
    for (let i = cubes.children.length - 1; i >= 0; i--) {
        const cube = cubes.children[i];
        if (cube.position[axis] === layerIndex) {
            selectedCubes.push(cube);
        }
    }
    return selectedCubes;
}

function selectCubes(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, axis: 'x' | 'y' | 'z'): { rotationGroup: THREE.Group, selectedCubes: THREE.Object3D[] } {
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    const selectedCubes: THREE.Object3D[] = [];
    for (let i = cubes.children.length - 1; i >= 0; i--) {
        const cube = cubes.children[i];
        if (cube.position[axis] === layerIndex) {
            selectedCubes.push(cube);
            rotationGroup.add(cube);
        }
    }
    return { rotationGroup, selectedCubes }
}

function deselectCubes(scene: THREE.Scene, cubes: THREE.Group, selectedCubes: THREE.Object3D[], rotationGroup: THREE.Group) {
    for (let i = 0; i < selectedCubes.length; i++) {
        const cube = selectedCubes[i];
        const globalPosition = new THREE.Vector3();
        cube.getWorldPosition(globalPosition);
        const globalRotation = new THREE.Quaternion();
        cube.getWorldQuaternion(globalRotation);
        cubes.add(cube);
        cube.position.set(Math.round(globalPosition.x), Math.round(globalPosition.y), Math.round(globalPosition.z));
        cube.rotation.setFromQuaternion(globalRotation);
    }
    scene.remove(rotationGroup);
}

async function performAnimation(rotationGroup: THREE.Group, axis: 'X' | 'Y' | 'Z', angle: number, animate: boolean): Promise<void> {
    return new Promise((resolve) => {
        if (animate) {
            const increment = angle / iterations;
            let counter = 0;
            const interval = setInterval(() => {
                if (counter < iterations) {
                    rotationGroup[`rotate${axis}`](increment);
                    counter += 1;
                }
                else {
                    clearInterval(interval);
                    resolve();
                }
            }, 1);
        }
        else {
            rotationGroup[`rotate${axis}`](angle);
            resolve();
        }
    });
}

export async function rotateVertical(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number, animate: boolean) {
    const { rotationGroup, selectedCubes } = selectCubes(scene, cubes, layerIndex, 'x');
    await performAnimation(rotationGroup, 'X', angle, animate);
    deselectCubes(scene, cubes, selectedCubes, rotationGroup);
}

export async function rotateHorizontal(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number, animate: boolean) {
    const { rotationGroup, selectedCubes } = selectCubes(scene, cubes, layerIndex, 'y');
    await performAnimation(rotationGroup, 'Y', angle, animate);
    deselectCubes(scene, cubes, selectedCubes, rotationGroup);
}

export async function rotateZ(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number, animate: boolean) {
    const { rotationGroup, selectedCubes } = selectCubes(scene, cubes, layerIndex, 'z');
    await performAnimation(rotationGroup, 'Z', angle, animate);
    deselectCubes(scene, cubes, selectedCubes, rotationGroup);
}
