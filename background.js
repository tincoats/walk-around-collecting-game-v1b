import { MeshBuilder, StandardMaterial, Vector3, HemisphericLight, DirectionalLight, Color3 } from "@babylonjs/core";


export function commonBackground(scene) {

        // Set the scene's background color (sky blue)
        scene.clearColor = new Color3(0.529, 0.808, 0.922);

        // Add lights
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.7;

        const sun = new DirectionalLight("sun", new Vector3(0.5, -1, 0.5), scene);
        sun.position = new Vector3(-10, 10, -10);
        sun.intensity = 0.5;
        sun.diffuse = new Color3(1, 0.9, 0.8);

        // Add ground plane
        const ground = MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0.6, 0.4);
        ground.material = groundMaterial;
        ground.checkCollisions = false;
}