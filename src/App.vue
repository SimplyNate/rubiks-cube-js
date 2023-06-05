<template>
    <canvas id="c"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
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
    {
        const colors = [
            'red',
            'green',
            'orange',
            'blue',
            'yellow',
            'white',
        ];
        const cubeSize = 0.95;
        for (let s = 0; s < 6; s++) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    // Draw 1, 2, or 3 planes depending on x y and z
                    const plane = new THREE.PlaneGeometry(cubeSize, cubeSize);
                    const color = colors[s];
                    const mat = new THREE.MeshLambertMaterial({ color, flatShading: true, side: THREE.DoubleSide });
                    const mesh = new THREE.Mesh(plane, mat);
                    mesh.position.set(x - 1, y - 1, s);
                    mesh.rotateY(THREE.MathUtils.degToRad(0));
                    // adjust rotation depending on x y and z
                    scene.add(mesh);
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

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

export default defineComponent({
    name: 'App',
    mounted() {
        main();
    }
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