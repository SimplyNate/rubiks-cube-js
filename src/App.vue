<template>
    <canvas id="c"></canvas>
    <div class="menu">
        <button @click="randomize">Randomize</button>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PickHelper from './PickHelper';
import { createCube } from './shapes';
import { rotateHorizontal, rotateVertical, rotateZ } from './animate';

/*
Use [up, down] to cycle through [x, y, z] rotation
Use [left, right] to cycle through the indexes for that axis
Use [q, w] to make [-1] and [1] direction spins
Highlight the selection area
 */

const cubes = new THREE.Group();
let scene: THREE.Scene;

function verticalHandler(x: number, direction: number) {
    rotateVertical(scene, cubes, x, Math.PI / 2 * direction);
}

function horizontalHandler(y: number, direction: number) {
    rotateHorizontal(scene, cubes, y, Math.PI / 2 * direction)
}

function zHandler(z: number, direction: number) {
    rotateZ(scene, cubes, z, Math.PI / 2 * direction);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function randomIndex() {
    const indexes = [-1, 0, 1];
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

function randomize() {
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
        const index = randomIndex();
        const direction = randomDirection();
        const handler = randomHandler();
        handler(index, direction);
    }
}

function keyListener(evt) {
    const { key } = evt;
    if (key === 'q') {
        horizontalHandler(1, -1);
    }
    else if (key === 'w') {
        horizontalHandler(1, 1);
    }
    else if (key === 'a') {
        horizontalHandler(0, -1);
    }
    else if (key === 's') {
        horizontalHandler(0, 1);
    }
    else if (key === 'z') {
        horizontalHandler(-1, -1);
    }
    else if (key === 'x') {
        horizontalHandler(-1, 1);
    }
    else if (key === 'e') {
        verticalHandler(-1, -1);
    }
    else if (key === 'd') {
        verticalHandler(-1, 1);
    }
    else if (key === 'r') {
        verticalHandler(0, -1);
    }
    else if (key === 'f') {
        verticalHandler(0, 1);
    }
    else if (key === 't') {
        verticalHandler(1, -1);
    }
    else if (key === 'g') {
        verticalHandler(1, 1);
    }
    else if (key === 'y') {
        zHandler(-1, -1);
    }
    else if (key === 'u') {
        zHandler(-1, 1);
    }
    else if (key === 'h') {
        zHandler(0, -1);
    }
    else if (key === 'j') {
        zHandler(0, 1);
    }
    else if (key === 'n') {
        zHandler(1, -1);
    }
    else if (key === 'm') {
        zHandler(1, 1);
    }
}

onMounted(() => {
    const position = new THREE.Vector2(0, 0);
    const canvas: HTMLCanvasElement = document.querySelector('#c');
    function getCanvasRelativePosition(event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function setPickPosition(event: MouseEvent) {
        const pos = getCanvasRelativePosition(event);
        position.x = (pos.x / canvas.width) * 2 - 1;
        position.y = (pos.y / canvas.height) * -2 + 1;
    }

    function clearPickPosition() {
        position.x = -Infinity;
        position.y = -Infinity;
    }

    const pickHelper = new PickHelper();
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
    {
        const x = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 0),
        ]);
        const xMesh = new THREE.Line(x, new THREE.LineBasicMaterial({ color: 'red' }));
        scene.add(xMesh);
        const y = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 20, 0),
        ]);
        const yMesh = new THREE.Line(y, new THREE.LineBasicMaterial({ color: 'green' }));
        scene.add(yMesh);
        const z = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 20),
        ]);
        const zMesh = new THREE.Line(z, new THREE.LineBasicMaterial({ color: 'blue' }));
        scene.add(zMesh);
    }
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

    function resizeRendererToDisplaySize(renderer) {
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
        // pickHelper.pick(position, scene, camera);
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    // window.addEventListener('mousemove', setPickPosition);
    // window.addEventListener('mouseout', clearPickPosition);
    // window.addEventListener('mouseleave', clearPickPosition);
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
    top: 0;
    right: 0;
    padding: 1rem;
}

</style>