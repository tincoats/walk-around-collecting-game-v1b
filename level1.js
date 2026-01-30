// level1.js
import { SceneLoader, MeshBuilder, Vector3 } from "@babylonjs/core";
import { commonBackground } from "./background.js";

export function loadLevel1(scene) {
    const rocksUrl = "./assets/low_poly_rocks.glb"; // Path to your rocks model
	
	commonBackground(scene);


    // Define rock positions based on the level
    const rockPositions = [
            new Vector3(-5, 0, -10),
			new Vector3(3, 0, -5),
        ];

		console.log(`rock positions ${rockPositions}`);		


    const rockPositionOffset = new Vector3(0, 0.7, 0); // Adjust vertical placement
    const rockCollisionOffset = new Vector3(0, -0.5, 0); // Collision sphere offset

    SceneLoader.ImportMesh("", rocksUrl, "", scene, (meshes) => {
        const rockMesh = meshes[0]; // Assume the first mesh is the main rock mesh
        rockMesh.scaling.set(1.5, 1.5, 1.5);

        rockPositions.forEach((position, index) => {
            const rock = index === 0 ? rockMesh : rockMesh.clone(`rock-${index}`);
            rock.position = position.add(rockPositionOffset);

            // Add a collision sphere
            const collisionSphere = MeshBuilder.CreateSphere(`collision-${index}`, { diameter: 2 }, scene);
            collisionSphere.parent = rock;
            collisionSphere.position = rockCollisionOffset;
            collisionSphere.isVisible = false;
            collisionSphere.checkCollisions = true;
        });
    });


    const treesUrl = "./assets/pine_tree_low_poly.glb"; // Path to your trees model

    // Define tree positions based on the level
    const treePositions = [
            new Vector3(-5, 0, 15),
            new Vector3(15, 0, -5),
            new Vector3(-15, 0, -5),
            new Vector3(-10, 0, 5),
            new Vector3(10, 0, 15),
            new Vector3(10, 0, -15),
            new Vector3(-10, 0, -15),
            new Vector3(20, 0, 5),
            new Vector3(-20, 0, -10),
            new Vector3(0, 0, -20),
        ];

    const treePositionOffset = new Vector3(0, 0, 0); // Adjust vertical placement
    const treeCollisionOffset = new Vector3(-3, 0, 3.2); // Collision sphere offset

    SceneLoader.ImportMesh("", treesUrl, "", scene, (meshes) => {
        const treeMesh = meshes[0]; // Assume the first mesh is the main tree mesh

        treePositions.forEach((position, index) => {
            const tree = index === 0 ? treeMesh : treeMesh.clone(`tree-${index}`);

            // Align the tree with the ground
            const boundingBox = tree.getBoundingInfo().boundingBox;
            const treeHeight = boundingBox.maximum.y - boundingBox.minimum.y;
            tree.position = position.add(treePositionOffset);
            tree.position.y -= boundingBox.minimum.y;

            // Add a collision sphere
            const collisionSphere = MeshBuilder.CreateSphere(`collision-${index}`, { diameter: 1 }, scene);
            collisionSphere.parent = tree;
            collisionSphere.position = treeCollisionOffset;
            collisionSphere.isVisible = false;
            collisionSphere.checkCollisions = true;
        });

    });


}
