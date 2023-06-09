import * as THREE from 'three';

export default class {
    private raycaster: THREE.Raycaster;
    public pickedObject: null | THREE.Object3D;
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
    }

    pick(position: THREE.Vector2, scene: THREE.Scene, camera: THREE.Camera) {
        if (this.pickedObject) {
            this.pickedObject.translateX(0);
            this.pickedObject = null;
        }
        this.raycaster.setFromCamera(position, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length > 0) {
            this.pickedObject = intersectedObjects[0].object;
            this.pickedObject.translateX(0);
        }
    }
}