<template>
    <canvas id="c"></canvas>
    <div class="menu">
        <button style="display: block; margin-bottom: 0.5rem;" @click="randomize">Randomize</button>
        <div>
            <input type="checkbox" v-model="useAnimation"> Animate
        </div>
        <div>
            <input type="checkbox" v-model="showAxes" @change="toggleAxes"> Show Axes
        </div>
        <div>
            <h3>Controls</h3>
            <table>
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Q</td>
                    <td>Rotate -90 degrees</td>
                </tr>
                <tr>
                    <td>W</td>
                    <td>Rotate 90 degrees</td>
                </tr>
                <tr>
                    <td>&udarr;</td>
                    <td>Cycle Axis of rotation</td>
                </tr>
                <tr>
                    <td>&lrarr;</td>
                    <td>Cycle index of axis</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div style="margin-top: 1rem;">
            <h3>Train</h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCube } from './shapes';
import {select, performRotation} from './animate';
import { CubeAgent } from './models/rl/agent.js';

/*
Use [up, down] to cycle through [x, y, z] rotation
Use [left, right] to cycle through the indexes for that axis
Use [q, w] to make [-1] and [1] direction spins
Highlight the selection area
 */

let queue = false;

const cubes = new THREE.Group();
let scene: THREE.Scene;

const useAnimation = ref<boolean>(false);
const showAxes = ref<boolean>(false);

async function F() {
    await zHandler(-1, 1);
}

async function R() {
    await verticalHandler(1, 1);
}

async function U() {
    await horizontalHandler(1, -1);
}

async function L() {
    await verticalHandler(-1, -1);
}

async function D() {
    await horizontalHandler(-1, 1);
}

async function B() {
    await zHandler(1, -1);
}

async function cF() {
    await zHandler(-1, -1);
}

async function cR() {
    await verticalHandler(1, -1);
}

async function cU() {
    await horizontalHandler(1, 1);
}

async function cL() {
    await verticalHandler(-1, 1);
}

async function cD() {
    await horizontalHandler(-1, -1);
}

async function cB() {
    await zHandler(1, 1);
}

async function verticalHandler(x: number, direction: number) {
    await performRotation(scene, cubes, x, Math.PI / 2 * direction, 'x', useAnimation.value);
}

async function horizontalHandler(y: number, direction: number) {
    await performRotation(scene, cubes, y, Math.PI / 2 * direction, 'y', useAnimation.value)
}

async function zHandler(z: number, direction: number) {
    await performRotation(scene, cubes, z, Math.PI / 2 * direction, 'z', useAnimation.value);
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function randomIndex() {
    const indexes = [-1, 1];
    return indexes[getRandomInt(0, indexes.length)];
}

function randomDirection() {
    const directions = [-1, 1];
    return directions[getRandomInt(0, directions.length)];
}

function randomHandler() {
    const handlers = [
        verticalHandler,
        horizontalHandler,
        zHandler,
    ];
    return handlers[getRandomInt(0, handlers.length)];
}

async function randomize() {
    deselect();
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
        const index = randomIndex();
        const direction = randomDirection();
        const handler = randomHandler();
        await handler(index, direction);
    }
    makeSelection();
}

interface AxisHandlers {
    [index: string]: (index: number, direction: number) => Promise<void>;
    x: (index: number, direction: number) => Promise<void>;
    y: (index: number, direction: number) => Promise<void>;
    z: (index: number, direction: number) => Promise<void>;
}

const settings = {
    last: [] as THREE.Object3D[],
    index: 0,
    handlers: ['x', 'y', 'z'],
    axis: {
        x: verticalHandler,
        y: horizontalHandler,
        z: zHandler,
    } as AxisHandlers,
    handler: 0,
};

function deselect() {
    for (const cube of settings.last) {
        for (const child of cube.children) {
            // @ts-ignore
            child.material = new THREE.MeshBasicMaterial({ color: 'black' });
        }
    }
    settings.last = [];
}

function makeSelection() {
    // @ts-ignore
    const axis: 'x' | 'y' | 'z' = settings.handlers[settings.handler];
    const selection = select(cubes, settings.index, axis);
    deselect();
    for (const cube of selection) {
        settings.last.push(cube);
        // Iterate over all outlining meshes
        for (const child of cube.children) {
            // @ts-ignore
            child.material = new THREE.MeshBasicMaterial({ color: 'silver' });
        }
    }
}

async function keyListener(evt: KeyboardEvent) {
    if (!queue) {
        const { key } = evt;
        if (key === 'q') {
            queue = true;
            await settings.axis[settings.handlers[settings.handler]](settings.index, -1);
        }
        else if (key === 'w') {
            queue = true;
            await settings.axis[settings.handlers[settings.handler]](settings.index, 1);
        }
        else if (key === 'ArrowLeft') {
            if (settings.index === -1) {
                settings.index = 1;
            }
            else {
                settings.index -= 1;
            }
        }
        else if (key === 'ArrowRight') {
            if (settings.index === 1) {
                settings.index = -1;
            }
            else {
                settings.index += 1;
            }
        }
        else if (key === 'ArrowUp') {
            if (settings.handler === 2) {
                settings.handler = 0;
            }
            else {
                settings.handler += 1;
            }
        }
        else if (key === 'ArrowDown') {
            if (settings.handler === 0) {
                settings.handler = 2;
            }
            else {
                settings.handler -= 1;
            }
        }
        makeSelection();
        queue = false;
    }
}

interface AxesTracker {
    x: null | THREE.Object3D;
    y: null | THREE.Object3D;
    z: null | THREE.Object3D;
}

const axesTracker: AxesTracker = {
    x: null,
    y: null,
    z: null,
};

function toggleAxes() {
    if (showAxes.value) {
        const x = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 0),
        ]);
        const xMesh = new THREE.Line(x, new THREE.LineBasicMaterial({ color: 'red' }));
        scene.add(xMesh);
        axesTracker.x = xMesh;
        const y = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 20, 0),
        ]);
        const yMesh = new THREE.Line(y, new THREE.LineBasicMaterial({ color: 'green' }));
        scene.add(yMesh);
        axesTracker.y = yMesh;
        const z = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 20),
        ]);
        const zMesh = new THREE.Line(z, new THREE.LineBasicMaterial({ color: 'blue' }));
        scene.add(zMesh);
        axesTracker.z = zMesh;
    }
    else if (axesTracker.x && axesTracker.y && axesTracker.z) {
        scene.remove(axesTracker.x, axesTracker.y, axesTracker.z);
    }
}

onMounted(() => {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
        antialias: true,
    });
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.00001;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 10);

    const controls = new OrbitControls(camera, canvas);
    // @ts-ignore
    controls.target.set(0, 0, 0);
    // @ts-ignore
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#add8e6');
    {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    if (x === 1 && y === 1 && z === 1) {
                        continue;
                    }
                    const cube = createCube(x - 1, y - 1, z - 1);
                    cubes.add(cube);
                }
            }
        }
    }
    scene.add(cubes);
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(15, 5, 5);
    scene.add(light);

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
        const canvas: HTMLCanvasElement = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    makeSelection();
    window.addEventListener('keydown', keyListener);
});

</script>
<style>
html, body {
    margin: 0;
    height: 100vh;
    width: 100vw;
}
#app {
    margin: 0;
    padding: 0;
    border: 0;
    height: 100%;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
}
.menu {
    position: fixed;
    top: 1em;
    right: 1em;
    padding: 1rem;
    background-color: white;
}

</style>
