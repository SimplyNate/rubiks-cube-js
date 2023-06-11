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
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

const cylinder = new THREE.CylinderGeometry(0.03, 0.03, 1.00);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

export function createCube(x: number, y: number, z: number) {
    const cubeMesh = new THREE.Mesh(cubeGeo, materials);
    cubeMesh.position.set(x, y, z);
    
    const c1 = new THREE.Mesh(cylinder, cylinderMaterial);
    c1.position.set(-0.5, -0.5, 0);
    c1.rotateX(THREE.MathUtils.degToRad(90));

    const c2 = new THREE.Mesh(cylinder, cylinderMaterial);
    c2.position.set(0.5, -0.5, 0);
    c2.rotateX(THREE.MathUtils.degToRad(90));

    const c3 = new THREE.Mesh(cylinder, cylinderMaterial);
    c3.position.set(-0.5, 0.5, 0);
    c3.rotateX(THREE.MathUtils.degToRad(90));

    const c4 = new THREE.Mesh(cylinder, cylinderMaterial);
    c4.position.set(0.5, 0.5, 0);
    c4.rotateX(THREE.MathUtils.degToRad(90));

    const c5 = new THREE.Mesh(cylinder, cylinderMaterial);
    c5.position.set(0, 0.5, 0.5);
    c5.rotateZ(THREE.MathUtils.degToRad(90));

    const c6 = new THREE.Mesh(cylinder, cylinderMaterial);
    c6.position.set(0, 0.5, -0.5);
    c6.rotateZ(THREE.MathUtils.degToRad(90));

    const c7 = new THREE.Mesh(cylinder, cylinderMaterial);
    c7.position.set(0, -0.5, 0.5);
    c7.rotateZ(THREE.MathUtils.degToRad(90));

    const c8 = new THREE.Mesh(cylinder, cylinderMaterial);
    c8.position.set(0, -0.5, -0.5);
    c8.rotateZ(THREE.MathUtils.degToRad(90));

    const c9 = new THREE.Mesh(cylinder, cylinderMaterial);
    c9.position.set(0.5, 0, 0.5);

    const c10 = new THREE.Mesh(cylinder, cylinderMaterial);
    c10.position.set(0.5, 0, -0.5);

    const c11 = new THREE.Mesh(cylinder, cylinderMaterial);
    c11.position.set(-0.5, 0, 0.5);

    const c12 = new THREE.Mesh(cylinder, cylinderMaterial);
    c12.position.set(-0.5, 0, -0.5);

    cubeMesh.add(
        c1, c2, c3, c4, c5, c6,
        c7, c8, c9, c10, c11, c12
    );
    return cubeMesh;
}
