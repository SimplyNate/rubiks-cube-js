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
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
    cylinderMesh.position.set(x  - 0.5, y - 0.5, z);
    cylinderMesh.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(cylinderMesh);

    const c2 = new THREE.Mesh(cylinder, cylinderMaterial);
    c2.position.set(x + 0.5, y - 0.5, z);
    c2.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(c2);

    const c3 = new THREE.Mesh(cylinder, cylinderMaterial);
    c3.position.set(x - 0.5, y + 0.5, z);
    c3.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(c3);

    const c4 = new THREE.Mesh(cylinder, cylinderMaterial);
    c4.position.set(x + 0.5, y + 0.5, z);
    c4.rotateX(THREE.MathUtils.degToRad(90));
    scene.add(c4);

    const c5 = new THREE.Mesh(cylinder, cylinderMaterial);
    c5.position.set(x, y + 0.5, z + 0.5);
    c5.rotateZ(THREE.MathUtils.degToRad(90));
    scene.add(c5);

    const c6 = new THREE.Mesh(cylinder, cylinderMaterial);
    c6.position.set(x, y + 0.5, z - 0.5);
    c6.rotateZ(THREE.MathUtils.degToRad(90));
    scene.add(c6);

    const c7 = new THREE.Mesh(cylinder, cylinderMaterial);
    c7.position.set(x, y - 0.5, z + 0.5);
    c7.rotateZ(THREE.MathUtils.degToRad(90));
    scene.add(c7);

    const c8 = new THREE.Mesh(cylinder, cylinderMaterial);
    c8.position.set(x, y - 0.5, z - 0.5);
    c8.rotateZ(THREE.MathUtils.degToRad(90));
    scene.add(c8);

    const c9 = new THREE.Mesh(cylinder, cylinderMaterial);
    c9.position.set(x + 0.5, y, z + 0.5);
    scene.add(c9);

    const c10 = new THREE.Mesh(cylinder, cylinderMaterial);
    c10.position.set(x + 0.5, y, z - 0.5);
    scene.add(c10);

    const c11 = new THREE.Mesh(cylinder, cylinderMaterial);
    c11.position.set(x - 0.5, y, z + 0.5);
    scene.add(c11);

    const c12 = new THREE.Mesh(cylinder, cylinderMaterial);
    c12.position.set(x - 0.5, y, z - 0.5);
    scene.add(c12);
}
