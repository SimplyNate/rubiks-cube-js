<template>
    <canvas id="c"></canvas>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PickHelper from './PickHelper';


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
        const cubeSize = 1;
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
                    {
                        /*
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
                         */
                        const edgeSize = cubeSize + 0.0005;
                        const edgeCubeGeo = new THREE.BoxGeometry(edgeSize, edgeSize, edgeSize);
                        const edgeGeometry = new THREE.EdgesGeometry(edgeCubeGeo);
                        const lines = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0x000000 }));
                        lines.position.set(x - 1, y - 1, z - 1);
                        scene.add(lines);
                    }
                }
            }
        }
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
        pickHelper.pick(position, scene, camera);
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
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