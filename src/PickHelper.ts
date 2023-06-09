import * as THREE from 'three';

export default class {
    private raycaster: THREE.Raycaster;
    public pickedObject: null | THREE.Object3D;
    public cache: any;
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.cache = null;
    }

    pick(position: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera) {
        if (this.pickedObject) {
            // @ts-ignore
            this.pickedObject.material.color = this.cache;
            this.pickedObject.translateX(0);
            this.pickedObject = null;
            this.cache = null;
        }
        this.raycaster.setFromCamera(position, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length > 0) {
            this.pickedObject = intersectedObjects[0].object;
            // @ts-ignore
            this.cache = this.pickedObject.material.color;
            // @ts-ignore
            this.pickedObject.material.color = new THREE.Color(0xffffff);
        }
    }
}