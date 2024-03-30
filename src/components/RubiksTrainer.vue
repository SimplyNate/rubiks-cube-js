<template>
    <canvas id="c"></canvas>
    <div class="menu">
        <button style="display: block; margin-bottom: 0.5rem;" @click="randomize">Randomize</button>
        <button style="display: block; margin-bottom: 0.5rem;" @click="solveCube">Solve</button>
        <button>Reset</button>
        <div>
            <input type="checkbox" v-model="useAnimation"> Animate
        </div>
        <div>
            <input type="checkbox" v-model="showAxes" @change="toggleAxes"> Show Axes
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {createCube} from '../shapes.js';
import {performRotation} from '../animate.js';
import { Cube, type Face } from '../cube.js';
import { solve, translateMove } from '../solve.js';


let queue = false;

const cubes = new THREE.Group();
let scene: THREE.Scene;

const useAnimation = ref<boolean>(false);
const showAxes = ref<boolean>(false);

let cube = new Cube();

async function F() {
    await zHandler(1, -1);
}
async function cF() {
    await zHandler(1, 1);
}
async function R() {
    await xHandler(1, -1);
}
async function cR() {
    await xHandler(1, 1);
}
async function U() {
    await yHandler(1, -1);
}
async function cU() {
    await yHandler(1, 1);
}
async function L() {
    await xHandler(-1, 1);
}
async function cL() {
    await xHandler(-1, -1);
}
async function D() {
    await yHandler(-1, 1);
}
async function cD() {
    await yHandler(-1, -1);
}
async function B() {
    await zHandler(-1, 1);
}
async function cB() {
    await zHandler(-1, -1);
}
async function xHandler(x: number, direction: number) {
    await performRotation(scene, cubes, x, Math.PI / 2 * direction, 'x', useAnimation.value);
}
async function yHandler(y: number, direction: number) {
    await performRotation(scene, cubes, y, Math.PI / 2 * direction, 'y', useAnimation.value)
}
async function zHandler(z: number, direction: number) {
    await performRotation(scene, cubes, z, Math.PI / 2 * direction, 'z', useAnimation.value);
}


const moveMap: Record<string, Function> = {
    u: U,
    counter_u: cU,
    l: L,
    counter_l: cL,
    f: F,
    counter_f: cF,
    r: R,
    counter_r: cR,
    b: B,
    counter_b: cB,
    d: D,
    counter_d: cD,
};


async function randomize() {
    const iterations = 20;
    cube = Cube.scrambled(iterations);
    for (const move of cube.scrambleHistory) {
        await moveMap[move]();
    }
}

async function solveCube() {
    const originalOrientation = `yo`;
    let currentOrientation = originalOrientation;
    cube.history = [];
    const testCube = Cube.fromString(cube.toString());
    testCube.perform_reorientation('y', 'o');
    solve(cube);
    console.log(cube.history);
    const translatedHistory = [];
    for (const move of cube.history) {
        if (move.includes('reorient')) {
            currentOrientation = move.split(' ')[1];
            translatedHistory.push('reorient yo');
        }
        else {
            const isCounterClockwise = move.includes('counter');
            const parsedMove = isCounterClockwise ? move.split('_')[1] : move;
            let translatedMove: string | Face = translateMove(currentOrientation, originalOrientation, parsedMove as Face);
            testCube.performRotation(translatedMove as Face, isCounterClockwise);
            if (isCounterClockwise) {
                translatedMove = `counter_${translatedMove}`;
            }
            translatedHistory.push(translatedMove);
            await moveMap[translatedMove]();
        }
    }
    console.log(translatedHistory);
    console.log(testCube.isSolved());
    console.log(testCube.toString());
}

async function keyListener(evt: KeyboardEvent) {
    if (!queue) {
        queue = true;
        const { key } = evt;
        if (key === 'u') {
            await U();
        }
        else if (key === 'U') {
            await cU();
        }
        if (key === 'l') {
            await L();
        }
        else if (key === 'L') {
            await cL();
        }
        if (key === 'f') {
            await F();
        }
        else if (key === 'F') {
            await cF();
        }
        if (key === 'r') {
            await R();
        }
        else if (key === 'R') {
            await cR();
        }
        if (key === 'b') {
            await B();
        }
        else if (key === 'B') {
            await cB();
        }
        if (key === 'd') {
            await D();
        }
        else if (key === 'D') {
            await cD();
        }
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
    window.addEventListener('keydown', keyListener);
});

</script>
<style>
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
    max-width: 250px;
}

</style>
