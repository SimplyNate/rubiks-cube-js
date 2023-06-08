import * as THREE from 'three';

export default class {
    private raycaster: THREE.Raycaster;
    public pickedObject: null | THREE.Object3D;
    public position: THREE.Vector2;
    public canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.position = new THREE.Vector2(0, 0);
        this.canvas = canvas;
    }

    pick(scene: THREE.Scene, camera: THREE.Camera) {
        if (this.pickedObject) {
            this.pickedObject.translateX(-2);
            this.pickedObject = null;
        }
        this.raycaster.setFromCamera(this.position, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length > 0) {
            console.log(intersectedObjects);
            this.pickedObject = intersectedObjects[0].object;
            this.pickedObject.translateX(2);
        }
    }

    getCanvasRelativePosition(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * this.canvas.width / rect.width,
            y: (event.clientY - rect.top) * this.canvas.height / rect.height,
        };
    }

    setPickPosition(event: MouseEvent) {
        const pos = this.getCanvasRelativePosition(event);
        this.position.x = (pos.x / this.canvas.width) * 2 - 1;
        this.position.y = (pos.y / this.canvas.height) * -2 + 1;
    }

    clearPickPosition() {
        this.position.x = -Infinity;
        this.position.y = -Infinity;
    }
}