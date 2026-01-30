// camera.js
import { ArcRotateCamera, FreeCamera, Vector3 } from "@babylonjs/core";

export class CameraManager {
    constructor(scene, engine, boy, gui = null) {
        this.scene = scene;
        this.engine = engine;
        this.boy = boy;
        this.gui = gui;
        this.activeCamera = null;
        this.cameras = {};
        this.keyDownHandler = null;
    }

    /**
     * Create all cameras for the game
     */
    createCameras() {
        // Create third-person camera
        this.cameras.thirdPerson = new ArcRotateCamera(
            "thirdPersonCamera",
            -Math.PI / 2, // Alpha (horizontal angle)
            Math.PI / 3,  // Beta (vertical angle)
            10,           // Radius (distance from target)
            new Vector3(0, 2, 0), // Initial target
            this.scene
        );
        this.cameras.thirdPerson.attachControl(this.engine.getRenderingCanvas(), true);

        // Create first-person camera
        this.cameras.firstPerson = new FreeCamera(
            "firstPersonCamera",
            new Vector3(0, 1.7, 0), // Initial position at eye level
            this.scene
        );

        // Create top-down camera
        this.cameras.topDown = new ArcRotateCamera(
            "topDownCamera",
            Math.PI,       // Alpha (horizontal angle, facing behind the boy)
            Math.PI / 6,   // Beta (tilt angle, slightly angled down)
            50,            // Radius (distance from target)
            new Vector3(0, 0, 0), // Initial target
            this.scene
        );

        // Set default camera
        this.activeCamera = this.cameras.thirdPerson;
        this.scene.activeCamera = this.activeCamera;

        // Setup keyboard controls for camera switching
        this.setupKeyboardControls();

        return this.cameras;
    }

    /**
     * Set up keyboard controls for switching cameras
     */
    setupKeyboardControls() {
        // Store reference to the handler so we can remove it later
        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase();

            // Switch cameras
            if (key === "1") {
                this.switchCamera("thirdPerson");
            } else if (key === "2") {
                this.switchCamera("firstPerson");
            } else if (key === "3") {
                this.switchCamera("topDown");
            }
        };

        // Add event listener
        window.addEventListener("keydown", this.keyDownHandler);
    }

    /**
     * Switch to a different camera
     */
    switchCamera(cameraType) {
        if (!this.cameras[cameraType]) {
            console.error(`Camera type '${cameraType}' not found!`);
            return;
        }

        // Detach current camera controls
        this.activeCamera.detachControl();
        
        // Set new active camera
        this.activeCamera = this.cameras[cameraType];
        this.scene.activeCamera = this.activeCamera;
        
        // Attach control to the new camera
        this.activeCamera.attachControl(this.engine.getRenderingCanvas(), true);
        
        console.log(`Switched to ${cameraType} camera`);
        
        // Optional: Update HUD if GUI is available
        if (this.gui) {
            const cameraNames = {
                "thirdPerson": "Third-Person",
                "firstPerson": "First-Person", 
                "topDown": "Top-Down"
            };
            this.gui.showCameraNotification(`Camera: ${cameraNames[cameraType]}`);
        }
    }

    /**
     * Update camera positions based on boy's position
     * Should be called in the render loop
     */

updateCameras() {
    if (!this.boy || !this.boy.collider) return;

    const collider = this.boy.collider;

    // Third-person camera follows collider
    if (this.activeCamera === this.cameras.thirdPerson) {
        this.cameras.thirdPerson.parent = collider;
    }

    // First-person camera follows collider
    if (this.activeCamera === this.cameras.firstPerson) {
        this.cameras.firstPerson.position.copyFrom(collider.position);
        this.cameras.firstPerson.position.y += 1.7;
        this.cameras.firstPerson.rotation.y = collider.rotation.y;
    }

    // Top-down camera follows collider
    if (this.activeCamera === this.cameras.topDown) {
        this.cameras.topDown.target = collider.position;
    }
}

    /**
     * Get the current active camera
     */
    getActiveCamera() {
        return this.activeCamera;
    }

    /**
     * Get camera by type
     */
    getCamera(type) {
        return this.cameras[type];
    }

    /**
     * Get all available camera types
     */
    getCameraTypes() {
        return Object.keys(this.cameras);
    }

    /**
     * Set GUI reference (if not provided in constructor)
     */
    setGUI(gui) {
        this.gui = gui;
    }

    /**
     * Dispose of all cameras and clean up event listeners
     */
    dispose() {
        // Remove keyboard event listener
        if (this.keyDownHandler) {
            window.removeEventListener("keydown", this.keyDownHandler);
            this.keyDownHandler = null;
        }

        // Dispose of cameras
        Object.values(this.cameras).forEach(camera => {
            if (camera && camera.dispose) {
                camera.dispose();
            }
        });
        
        this.cameras = {};
        this.activeCamera = null;
        this.gui = null;
    }
}