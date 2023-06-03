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
    camera.position.set(10, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    // @ts-ignore
    controls.target.set(0, 0, 0);
    // @ts-ignore
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#add8e6');

    {
        const planeSize = 200;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        mesh.position.y = -10;
        scene.add(mesh);
    }
    {
        const cubeSize = 1;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshLambertMaterial({ color: '#ff0000', flatShading: true });
        const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
        cubeMesh.position.set(0, 0, 0);
        scene.add(cubeMesh);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 3);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
        const helper = new THREE.DirectionalLightHelper(light);
        scene.add(helper);

        const secondary_intensity = 0.40;
        const secondary_light = new THREE.DirectionalLight(color, secondary_intensity);
        secondary_light.position.set(-5, -10, -3);
        secondary_light.target.position.set(0, 0, 0);
        scene.add(secondary_light);
        scene.add(secondary_light.target);
        const secondary_helper = new THREE.DirectionalLightHelper(secondary_light);
        scene.add(secondary_helper);
    }

    {
        const near = 50;
        const far = 100;
        const color = '#add8e6';
        scene.fog = new THREE.Fog(color, near, far);

    }

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