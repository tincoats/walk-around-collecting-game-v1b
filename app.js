// app.js
import { 
    Engine, Scene, Vector3, MeshBuilder, StandardMaterial, Color3 
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { loadCoins } from "./coins.js";
import { Boy } from "./boy.js";
import { gui } from "./gui.js";
import { loadLevel1 } from "./level1.js";
import { loadLevel2 } from "./level2.js";
import { loadLevel3 } from "./level3.js";
import { CameraManager } from "./camera.js";

class App {
    constructor() {
        this.totalCoins = 0;
        this.coins = [];
        this.score = 0;
        this.isLevelComplete = false;
        this.isGameComplete = false;
        this.lastLevel = 3;
        this.currentLevel = 1;

        // Get the game container div
        const gameContainer = document.getElementById("gameContainer");
        if (!gameContainer) {
            console.error("Game container not found!");
            return;
        }
        
        // Clear the game container
        while (gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.firstChild);
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        gameContainer.appendChild(canvas);

        // Initialize Babylon.js engine
        if (this.engine) {
            this.engine.dispose();
        }        
        this.engine = new Engine(canvas, true);

        /*// Track the current level
        this.currentLevel = this.loadCurrentLevel();
        if (this.currentLevel > 3) {
            this.resetLevel();
            this.currentLevel = this.loadCurrentLevel();
        }*/

        // Initialize the first scene
        this.initializeScene();
        
        // Run the render loop
        this.engine.runRenderLoop(() => {

			if (this.scene && this.boy && this.boy.collider && this.scene.activeCamera) {
				this.boy.update();
				this.checkCoinCollisions(this.boy.collider);
				this.cameraManager.updateCameras();
				this.scene.render();
			}


        });

        // Handle window resize
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

    }

    /**
     * Initialize a new scene for the current level.
     */
    initializeScene() {
        this.isLevelComplete = false;
		
		// Dispose of the previous scene if it exists
        if (this.scene) {
            this.scene.dispose();
        }

        // Create a new scene
        this.scene = new Scene(this.engine);        
                
        if (this.currentLevel == 1) {
            loadLevel1(this.scene);
        }
        if (this.currentLevel == 2) {
            loadLevel2(this.scene);
        }
        if (this.currentLevel == 3) {
            loadLevel3(this.scene);
        }

        // New GUI object
        this.gui = new gui(this.scene);    

        this.score = 0;
		
        this.totalCoins = 0;
        this.coins = [];        
        this.totalCoins = loadCoins(this.scene, this.currentLevel, this.coins);
		
        const hudText = `Coins: ${this.score}/${this.totalCoins} | Level: ${this.currentLevel}`;
        this.gui.updateHUDText(hudText);
		

        // Add the boy character
        this.boy = new Boy(this.scene);
		
		//console.log("World matrix:", this.boy.getWorldMatrix());
		console.log("Parent:", this.boy.parent);
		console.log(this.boy);

        // Create camera manager and cameras
        // Pass the gui reference so camera manager can show notifications
        this.cameraManager = new CameraManager(this.scene, this.engine, this.boy, this.gui);
        this.cameraManager.createCameras();
    }
	

checkCoinCollisions(boyNode) {
    if (!boyNode || this.isLevelComplete) return;

    const boyPosition = boyNode.position;
    const collectionThreshold = 1.1;

    this.coins.forEach((coin, index) => {
        if (!coin) return;

        if (Vector3.Distance(boyPosition, coin.position) < collectionThreshold) {
            coin.dispose();
            this.coins[index] = null;
            this.score++;


                if (this.gui) {
                    const hudText = `Coins: ${this.score}/${this.totalCoins} | Level: ${this.currentLevel}`;
                    this.gui.updateHUDText(hudText);
                }

                if (this.score >= this.totalCoins && !this.isLevelComplete) {
                    this.isLevelComplete = true;
                    if (this.currentLevel === this.lastLevel && !this.isGameComplete) {
                        this.isGameComplete = true;
                        //this.resetLevel();
                        this.gui.updateHUDText(`All levels completed - Game over`);
                    } 
                    else {
                        this.gui.updateHUDText(`Level Complete! Loading next level`);
                        setTimeout(() => {
                            this.dispose();
                            console.log(`Current Level ${this.currentLevel}`);
							this.currentLevel = this.currentLevel + 1;
							console.log(`Advancing to Level ${this.currentLevel}`);
							this.initializeScene();
                        }, 3000);
                    }
                }
			
        }
    });
}







/*
    // Helper functions for managing the current level in local storage
    loadCurrentLevel() {
        const savedLevel = parseInt(localStorage.getItem("currentLevel"), 10);
        return isNaN(savedLevel) ? 1 : savedLevel;
    }

    incrementLevel() {
        const savedLevel = parseInt(localStorage.getItem("currentLevel"), 10);
        var nextLevel = 1;
        if (savedLevel < 3) {
            nextLevel = savedLevel + 1;
            localStorage.setItem("currentLevel", nextLevel);
        }
        else nextLevel = 3;
        return nextLevel;
    }

    resetLevel() {
        localStorage.setItem("currentLevel", 1);
    }*/

    dispose() {
        // Dispose camera manager
        if (this.cameraManager) {
            this.cameraManager.dispose();
        }

        // Remove event listeners (only instructions now)
        // Note: Camera keyboard listener is removed in cameraManager.dispose()

        // Clear references
        this.boy = null;
        this.coins = null;
        this.cameraManager = null;

        console.log("disposed function run");
    }
}

// Start the app
new App();