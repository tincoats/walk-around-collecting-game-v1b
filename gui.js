// gui.js
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";

/**
 * Class to manage the GUI elements.
 * Currently handles the instructions overlay and the HUD.
 */
export class gui { // Note: Constructor name is lowercase 'gui'
    constructor(scene) {
        this.scene = scene;
        this.overlay = null; // Will hold the instructions overlay rectangle
        this.hudContainer = null; // Will hold the HUD rectangle
        this.coinCountText = null; // Will hold the coin count TextBlock
        this.keyDownHandler = null; // Store reference to event handler for cleanup
        
        this.createInstructionsOverlay();
        this.createHUD(); // Create the HUD
        this.setupKeyboardControls(); // Setup keyboard controls for 'i' key
    }

    /**
     * Create the instructions overlay using Babylon.js GUI.
     */
    createInstructionsOverlay() {
        // Create AdvancedDynamicTexture for GUI (shared with HUD)
        // Check if guiTexture already exists (e.g., from a previous Gui instance or if sharing logic changes)
        // For now, we assume this.guiTexture is created here for the first time in this instance.
        // If it exists, we reuse it.
        if (!this.guiTexture) {
            const engine = this.scene.getEngine();
            if (!engine) {
                console.error("Gui: Could not get engine from scene.");
                return;
            }
            // Use 'true' for 'requestPointerLock' if needed, often false for UI.
            this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("GuiUI", true, engine);
        }

        // Instructions overlay rectangle
        this.overlay = new Rectangle("instructionsOverlay");
        this.overlay.width = 0.8; // 80% of screen width
        this.overlay.height = 0.8; // 80% of screen height
        this.overlay.background = "rgba(0, 0, 0, 0.8)"; // Semi-transparent black
        this.overlay.cornerRadius = 10;
        this.overlay.thickness = 0;
        this.overlay.isVisible = true; // Show initially
        this.overlay.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_CENTER;
        this.overlay.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_CENTER;
        this.guiTexture.addControl(this.overlay);

        // Instructions text block
        const instructionsText = new TextBlock("instructionsText");
        instructionsText.textWrapping = true;
        instructionsText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        instructionsText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        instructionsText.fontSize = 24;
        instructionsText.color = "white";
        instructionsText.text = `
            Collect the coins to complete the level!
            Use the following controls:
            - WASD or Arrow Keys: Move
            - Shift: Run
            - 1: Third-Person Camera
            - 2: First-Person Camera
            - 3: Top-Down Camera
            - I: Toggle Instructions
            Press any key to start the game.
        `;
        this.overlay.addControl(instructionsText);
    }

    /**
     * Create the HUD using Babylon.js GUI.
     */
    createHUD() {
        // Ensure guiTexture exists (created by createInstructionsOverlay)
        if (!this.guiTexture) {
            console.error("Gui: Cannot create HUD, guiTexture not found.");
            return;
        }

        // HUD container rectangle
        this.hudContainer = new Rectangle("hudContainer");
        this.hudContainer.width = "400px"; // Fixed width as requested
        this.hudContainer.height = "30px"; // Fixed height
        // Keep default background/color; styles can be set via CSS or left as default
        // this.hudContainer.background = "transparent"; // Or omit to keep default
        this.hudContainer.cornerRadius = 0; // Sharp corners
        this.hudContainer.thickness = 0; // No border
        this.hudContainer.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_LEFT;
        this.hudContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_TOP;
        this.hudContainer.paddingTop = "10px";
        this.hudContainer.paddingLeft = "10px";
        this.hudContainer.isVisible = true; // Always visible
        this.guiTexture.addControl(this.hudContainer);
		
		
		
		
		
		
		
		
// SHADOW text
const shadow = new TextBlock("coinCountShadow");
shadow.fontSize = 16;
shadow.color = "#ffffff";        // white shadow
shadow.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
shadow.left = "1px";             // horizontal offset
shadow.top = "1px";              // vertical offset
shadow.text = " ";               // will be updated later
this.hudContainer.addControl(shadow);

// MAIN text
this.coinCountText = new TextBlock("coinCountText");
this.coinCountText.fontSize = 16;
this.coinCountText.color = "#000000";   // dark text
this.coinCountText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
this.coinCountText.text = " ";
this.hudContainer.addControl(this.coinCountText);

// Store shadow so we can update it later
this.coinShadow = shadow;		
		
		
		
		

        /*
		// HUD text block (coin count)
        this.coinCountText = new TextBlock("coinCountText");
        this.coinCountText.fontSize = 16;
        // Keep default color; styles can be set via CSS or left as default
        // this.coinCountText.color = "white"; // Or omit to keep default
        this.coinCountText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT; // Align text left within the fixed width
        this.coinCountText.text = " "; // Initial text
        this.hudContainer.addControl(this.coinCountText);
		*/
    }

    /**
     * Set up keyboard controls for the 'i' key to toggle instructions
     */
    setupKeyboardControls() {
        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase();

            // If any key is pressed, except i, hide the instructions
            if ((key != "i") && this.overlay && this.overlay.isVisible) {
                this.overlay.isVisible = false;
            }

            // Toggle instructions overlay with 'i' key
            if (key === "i") {
                this.toggleInstructions();
            }
        };

        // Add event listener
        window.addEventListener("keydown", this.keyDownHandler);
    }

    // --- Instructions Overlay Methods ---

    /**
     * Show the instructions overlay.
     */
    showInstructions() {
        if (this.overlay) {
            this.overlay.isVisible = true;
        }
    }

    /**
     * Hide the instructions overlay.
     */
    hideInstructions() {
        if (this.overlay) {
            this.overlay.isVisible = false;
        }
    }

    /**
     * Toggle the visibility of the instructions overlay.
     */
    toggleInstructions() {
        if (this.overlay) {
            this.overlay.isVisible = !this.overlay.isVisible;
            console.log(`Instructions overlay toggled: ${this.overlay.isVisible ? "visible" : "hidden"}`);
        }
    }

    // --- HUD Methods ---

    /**
     * Update the HUD coin count text.
     * @param {string} text - The text to display (e.g., "Coins: 3/5").
     */
    /*
	updateHUDText(text) {
        if (this.coinCountText) {
            this.coinCountText.text = text;
        }
	*/	
updateHUDText(text) {
    if (this.coinCountText) {
        this.coinCountText.text = text;
    }
    if (this.coinShadow) {
        this.coinShadow.text = text;
    }
}
		
		
    //}

    /**
     * Show a temporary notification in the HUD (e.g., for camera switches)
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the message in milliseconds (default: 2000)
     */
    showNotification(message, duration = 4000) {
        if (!this.coinCountText) return;
        
        const originalText = this.coinCountText.text;
        this.coinCountText.text = message;
        
        // Restore original text after duration
        setTimeout(() => {
            if (this.coinCountText && this.coinCountText.text === message) {
                this.coinCountText.text = originalText;
            }
        }, duration);
    }

    /**
     * Show camera switch notification (can be used by CameraManager)
     * @param {string} cameraName - Name of the camera switched to
     */
    showCameraNotification(cameraName) {
        this.showNotification(`${cameraName} - Press 'I' for instructions`, 1500);
    }

    // --- Cleanup ---

    /**
     * Dispose of the GUI resources and remove event listeners.
     */
    dispose() {
        // Remove keyboard event listener
        if (this.keyDownHandler) {
            window.removeEventListener("keydown", this.keyDownHandler);
            this.keyDownHandler = null;
        }

        // Dispose instructions overlay
        if (this.overlay) {
            this.overlay.dispose();
            this.overlay = null;
        }

        // Dispose HUD container (this should also dispose its children like coinCountText)
        if (this.hudContainer) {
            this.hudContainer.dispose();
            this.hudContainer = null;
        }

        // Dispose the shared AdvancedDynamicTexture
        // Be cautious here: if this texture is shared or managed elsewhere (e.g., by Babylon on scene dispose),
        // disposing it here might cause issues. Often, it's left to Babylon's scene/engine cleanup.
        // If you are sure it's owned by this Gui instance and needs explicit disposal:
        if (this.guiTexture) {
            this.guiTexture.dispose();
            this.guiTexture = null;
        }

        // Nullify references to text elements
        this.coinCountText = null;
        
        console.log("GUI disposed");
    }
}