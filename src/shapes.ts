import * as THREE from 'three';

const cubeSize = 0.97;
const colors = [
    'red',
    'green',
    'orange',
    'blue',
    'yellow',
    'white',
];
const materials = colors.map(c => new THREE.MeshBasicMaterial({ color: c }));

export function createCube(scene: THREE.Scene, x: number, y: number, z: number) {
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMesh = new THREE.Mesh(cubeGeo, materials);
    cubeMesh.position.set(x, y, z);
    scene.add(cubeMesh);
    
    const cylinder = new THREE.CylinderGeometry(0.03, 0.03, 1);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 'black'});
    const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
    cylinderMesh.position.set(x - 1 - 0.5, y - 1 + 0.5, z - 1);
    cylinderMesh.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(cylinderMesh);

    const c2 = new THREE.Mesh(cylinder, cylinderMaterial);
    c2.position.set(x - 1 + 0.5, y - 1 + 0.5, z - 1);
    c2.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(c2);
}
