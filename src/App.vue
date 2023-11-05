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
        <div style="margin-top: 1rem;">
            <h3>Config</h3>
            <div style="margin-bottom: 1rem;">
                <div style="font-weight: bold;">Game</div>
                <div>Difficulty</div>
                <input type="number" v-model="gameArgs.difficulty">
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="font-weight: bold;">Agent</div>
                <div>Replay Buffer Size</div>
                <input type="number" v-model="agentConfig.replayBufferSize">
                <div>Learning Rate</div>
                <input type="number" v-model="agentConfig.learningRate">
                <div>Epsilon Init</div>
                <input type="number" v-model="agentConfig.epsilonInit">
                <div>Epsilon Final</div>
                <input type="number" v-model="agentConfig.epsilonFinal">
                <div>Epsilon Decay Frames</div>
                <input type="number" v-model="agentConfig.epsilonDecayFrames">
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="font-weight: bold;">Train</div>
                <div>Batch Size</div>
                <input type="number" v-model="trainingConfig.batchSize">
                <div>Gamma</div>
                <input type="number" v-model="trainingConfig.gamma">
                <div>Learning Rate</div>
                <input type="number" v-model="trainingConfig.learningRate">
                <div>Cumulative Reward Threshold</div>
                <input type="number" v-model="trainingConfig.cumulativeRewardThreshold">
                <div>Max Num Frames</div>
                <input type="number" v-model="trainingConfig.maxNumFrames">
                <div>Sync Every Frames</div>
                <input type="number" v-model="trainingConfig.maxNumFrames">
            </div>
            <h3>Learn</h3>
            <div>
                <div>Current Reward: {{ agent.cumulativeReward }}</div>
                <div>Best Reward: {{ bestReward }}</div>
                <div>Iteration: {{ iteration }}</div>
            </div>
            <div>
                <button @click="createNewAgent">Create New Agent</button>
            </div>
            <div>
                <button>Step</button>
            </div>
            <div>
                <button>Train</button>
            </div>
            <div>
                <button>Export Current Model</button>
            </div>
            <div>
                <button>Load Model</button>
            </div>
            <div>
                <button>Export Configuration</button>
            </div>
            <div>
                <button>Load Configuration</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCube } from './shapes';
import {performRotation} from './animate';
import { CubeAgent, AgentConfig } from './models/rl/agent.js';
import { CubeGame, GameArgs } from './models/game.js';
import { TrainingParams } from './models/rl/train.js';


let queue = false;

const cubes = new THREE.Group();
let scene: THREE.Scene;

const useAnimation = ref<boolean>(false);
const showAxes = ref<boolean>(false);
const gameArgs = ref<GameArgs>({
    difficulty: 1,
    gameType: 'randomLevels',
});
const agentConfig = ref<AgentConfig>({
    replayBufferSize: 1e4,
    learningRate: 1e-3,
    epsilonInit: 0.5,
    epsilonFinal: 0.01,
    epsilonDecayFrames: 1e5,
});
const agent = ref<CubeAgent>(new CubeAgent(new CubeGame(gameArgs.value), agentConfig.value));
const trainingConfig = ref<TrainingParams>({
    batchSize: 64,
    gamma: 0.99,
    learningRate: 1e-3,
    cumulativeRewardThreshold: 100,
    maxNumFrames: 1e6,
    syncEveryFrames: 1e3,
});
function createNewAgent() {
    agent.value = new CubeAgent(new CubeGame(gameArgs.value), agentConfig.value);
}
const bestReward = ref<number>(0);
const iteration = ref<number>(0);

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
    await zHandler(-1, -1);
}
async function cB() {
    await zHandler(-1, 1);
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
        xHandler,
        yHandler,
        zHandler,
    ];
    return handlers[getRandomInt(0, handlers.length)];
}

async function randomize() {
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
        const index = randomIndex();
        const direction = randomDirection();
        const handler = randomHandler();
        await handler(index, direction);
    }
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
    max-width: 250px;
}

</style>
