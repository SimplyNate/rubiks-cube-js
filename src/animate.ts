import * as THREE from 'three';

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

export function rotateVertical(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number) {
    const { rotationGroup, selectedCubes } = selectCubes(scene, cubes, layerIndex, 'x');
    rotationGroup.rotateX(angle);
    deselectCubes(scene, cubes, selectedCubes, rotationGroup);
}

export function rotateHorizontal(scene: THREE.Scene, cubes: THREE.Group, layerIndex: number, angle: number) {
    const { rotationGroup, selectedCubes } = selectCubes(scene, cubes, layerIndex, 'y');
    rotationGroup.rotateY(angle);
    deselectCubes(scene, cubes, selectedCubes, rotationGroup);
}
