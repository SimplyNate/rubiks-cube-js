import * as THREE from 'three';
import {Cube} from "./cube.ts";

const cubeSize = 0.97;
const colors = [
    '#0046ad', // blue
    '#009b48', // green
    '#ffd500', // yellow
    '#fefefe', // white
    '#ff5800', // orange
    '#b71234', // red
];
export const colorMap: Record<string, string> = {
    b: '#0046ad',
    g: '#009b48',
    y: '#ffd500',
    w: '#fefefe',
    o: '#ff5800',
    r: '#b71234',
}
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

export function createColorOverlay(cube: Cube) {
    const planes: Record<string, THREE.Mesh[]> = {
        u: [],
        l: [],
        f: [],
        r: [],
        b: [],
        d: [],
    };
    const distance = 1.5;
    const configs: Record<string, {x: number | null, y: number | null, z: number | null, rotation: string | null}> = {
        u: {
            x: null,
            y: distance,
            z: null,
            rotation: 'rotateX',
        },
        d: {
            x: null,
            y: -distance,
            z: null,
            rotation: 'rotateX',
        },
        l: {
            x: -distance,
            y: null,
            z: null,
            rotation: 'rotateY',
        },
        r: {
            x: distance,
            y: null,
            z: null,
            rotation: 'rotateY',
        },
        f: {
            x: null,
            y: null,
            z: distance,
            rotation: null,
        },
        b: {
            x: null,
            y: null,
            z: -distance,
            rotation: null,
        }
    }
    const plane = new THREE.PlaneGeometry(0.98, 0.98);
    for (const face of ['u', 'l', 'f', 'r', 'b', 'd']) {
        const config = configs[face];
        let index = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const material = new THREE.MeshBasicMaterial({ color: colorMap[cube.cube[face][index % 9]], side: THREE.DoubleSide});
                const planeMesh = new THREE.Mesh(plane, material);
                if (config.x) {
                    planeMesh.position.set(config.x, i, j);
                }
                else if (config.y) {
                    planeMesh.position.set(i, config.y, j);
                }
                else if (config.z) {
                    planeMesh.position.set(i, j, config.z);
                }
                if (config.rotation) {
                    // @ts-ignore
                    planeMesh[config.rotation](THREE.MathUtils.degToRad(90));
                }
                planes[face].push(planeMesh);
                index += 1;
            }
        }
    }
    return planes;
}
