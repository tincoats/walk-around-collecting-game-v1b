// boy.js
import { SceneLoader, Vector3, Tools, MeshBuilder, Mesh } from "@babylonjs/core";

export class Boy {
    constructor(scene) {
        this.scene = scene;

        // Visual model (GLB)
        this.model = null;

        // Collision body
        this.collider = null;

        // Movement
        this.walkSpeed = 2;
        this.runSpeed = 4;
        this.isRunning = false;

        // Rotation
        this.rotationSpeed = 30; // degrees per second

        // Input
        this.inputMap = {};

        // Animations
        this.animations = {};
        this.currentAnimation = null;

        this._loadModel();
        this._setupInput();
    }

    // ------------------------------------------------------------
    // Load model + create collider
    // ------------------------------------------------------------
    _loadModel() {
        const url = "./assets/majd_the_boy.glb";

        SceneLoader.ImportMesh("", url, "", this.scene, (meshes, _, skeletons, animationGroups) => {

            // Find the first real mesh (skip transform nodes)
            this.model = meshes.find(m => m instanceof Mesh);

            if (!this.model) {
                console.error("Boy model has no mesh!");
                return;
            }

            // Create collision capsule (invisible)
            this.collider = MeshBuilder.CreateCapsule("boyCollider", {
                height: 2,
                radius: 0.5
            }, this.scene);

            this.collider.isVisible = false;
            this.collider.checkCollisions = true;

            // Parent model to collider
            this.model.parent = this.collider;

            // Adjust model so feet touch ground
            const bb = this.model.getBoundingInfo().boundingBox;
            this.model.position.y = -bb.minimum.y;

            // Rotate model to face forward
            this.collider.rotation.y = Math.PI;

            // Load animations
            animationGroups.forEach(group => {
                if (group.name === "Idel") this.animations.idle = group;
                if (group.name === "Walk") this.animations.walk = group;
                if (group.name === "Running") this.animations.run = group;
                if (group.name === "WalkingBackword") this.animations.walkBackward = group;
            });

            this._play("idle");
        });
    }

    // ------------------------------------------------------------
    // Keyboard input
    // ------------------------------------------------------------
    _setupInput() {
        window.addEventListener("keydown", e => {
            this.inputMap[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === "shift") this.isRunning = true;
        });

        window.addEventListener("keyup", e => {
            this.inputMap[e.key.toLowerCase()] = false;
            if (e.key.toLowerCase() === "shift") this.isRunning = false;
        });
    }

    // ------------------------------------------------------------
    // Update loop
    // ------------------------------------------------------------
    update() {
        if (!this.collider) return;

        const dt = this.scene.getEngine().getDeltaTime() / 1000;
        const speed = this.isRunning ? this.runSpeed : this.walkSpeed;

        let moving = false;

        // Forward
        if (this.inputMap["w"] || this.inputMap["arrowup"]) {
            const forward = this.collider.forward.scale(speed * dt);
            this.collider.moveWithCollisions(forward);
            this._play(this.isRunning ? "run" : "walk");
            moving = true;
        }

        // Backward
        if (this.inputMap["s"] || this.inputMap["arrowdown"]) {
            const backward = this.collider.forward.scale(-speed * dt);
            this.collider.moveWithCollisions(backward);
            this._play("walkBackward");
            moving = true;
        }

        // Rotate left
        if (this.inputMap["a"] || this.inputMap["arrowleft"]) {
            this.collider.rotation.y -= Tools.ToRadians(this.rotationSpeed * dt);
            this._play("walk");
            moving = true;
        }

        // Rotate right
        if (this.inputMap["d"] || this.inputMap["arrowright"]) {
            this.collider.rotation.y += Tools.ToRadians(this.rotationSpeed * dt);
            this._play("walk");
            moving = true;
        }

        if (!moving) {
            this._play("idle");
        }
    }

    // ------------------------------------------------------------
    // Animation control
    // ------------------------------------------------------------
    _play(name) {
        const anim = this.animations[name];
        if (!anim) return;

        if (this.currentAnimation === name && anim.isPlaying) return;

        // Stop others
        Object.values(this.animations).forEach(a => {
            if (a !== anim && a.isPlaying) a.stop();
        });

        anim.start(true);
        this.currentAnimation = name;
    }
}