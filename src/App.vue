<template>
    <canvas id="c"></canvas>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PickHelper from './PickHelper';

function main() {
    const canvas: HTMLCanvasElement = document.querySelector('#c');
    const pickHelper = new PickHelper(canvas);
    window.addEventListener('mousemove', pickHelper.setPickPosition);
    window.addEventListener('mouseout', pickHelper.clearPickPosition);
    window.addEventListener('mouseleave', pickHelper.clearPickPosition);
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
    camera.position.set(0, 0, -10);

    const controls = new OrbitControls(camera, canvas);
    // @ts-ignore
    controls.target.set(0, 0, 0);
    // @ts-ignore
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#add8e6');
    const cubes = [];
    {
        const colors = [
            'red',
            'green',
            'orange',
            'blue',
            'yellow',
            'white',
        ];
        const materials = colors.map(c => new THREE.MeshLambertMaterial({ color: c, flatShading: false }));
        const cubeSize = 0.99;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    if (x === 1 && y === 1 && z === 1) {
                        continue;
                    }
                    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    // const cubeMat = new THREE.MeshNormalMaterial();
                    const cubeMesh = new THREE.Mesh(cubeGeo, materials);
                    cubeMesh.position.set(x - 1, y - 1, z - 1);
                    scene.add(cubeMesh);
                    cubes.push(cubeMesh);
                }
            }
        }
        const innerCubeGeo = new THREE.BoxGeometry(4, 4, 4);
        const innerMesh = new THREE.Mesh(innerCubeGeo, new THREE.MeshBasicMaterial({ color: 'black', wireframe: true }));
        innerMesh.position.set(0, 0, 0);
        scene.add(innerMesh);
    }
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(15, 5, 5);
    scene.add(light);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
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
        pickHelper.pick(scene, camera);
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

onMounted(() => {
    main();
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

</style>