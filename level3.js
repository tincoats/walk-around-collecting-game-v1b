// level3.js
import { Vector3, Color3, Color4 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export function loadLevel3(scene) {
    // Clear scene color for indoor gallery
    scene.clearColor = new Color4(0.05, 0.05, 0.1, 1.0);
    
    // Create gallery lighting (indoor specific)
    createGalleryLighting(scene);
    
    // Create the gallery room
    createGalleryRoom(scene);
    
    // Create plinths and artworks
    createArtworks(scene);
	
	// Setup collisions
    setupSimpleCollisions(scene);

}

function createGalleryLighting(scene) {
    // Main ambient light
    const ambientLight = new HemisphericLight("galleryAmbient", 
        new Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.4;
    ambientLight.groundColor = new Color3(0.1, 0.1, 0.2);
    ambientLight.diffuse = new Color3(0.8, 0.8, 0.9);
    
    // Gallery spotlights
    const spotPositions = [
        new Vector3(-4, 5, -8),
        new Vector3(-4, 5, 0),
        new Vector3(-4, 5, 8),
        new Vector3(4, 5, -8),
        new Vector3(4, 5, 0),
        new Vector3(4, 5, 8),
        new Vector3(0, 5, -4)
    ];
    
    spotPositions.forEach((pos, index) => {
        const spotlight = new PointLight(`galleryLight${index}`, pos, scene);
        spotlight.intensity = 0.6;
        spotlight.diffuse = new Color3(1, 1, 0.9);
        spotlight.specular = new Color3(1, 1, 0.95);
        spotlight.range = 10;
    });
    
    // Back wall lighting
    const backLight = new DirectionalLight("backWallLight", 
        new Vector3(0, -0.5, -1), scene);
    backLight.intensity = 0.3;
    backLight.position = new Vector3(0, 6, 14);
    backLight.diffuse = new Color3(0.9, 0.9, 1);
}

function createGalleryRoom(scene) {
    const roomWidth = 18;
    const roomDepth = 24;
    const roomHeight = 3.5;
    const wallThickness = 0.3;
    
    // Floor - polished wood/stone
    const floor = MeshBuilder.CreateGround("galleryFloor", {
        width: roomWidth,
        height: roomDepth
    }, scene);
    floor.position.y = 0;
    
    const floorMat = new StandardMaterial("floorMat", scene);
    floorMat.diffuseColor = new Color3(0.25, 0.25, 0.3);
    floorMat.specularColor = new Color3(0.2, 0.2, 0.2);
    floorMat.specularPower = 64;
    floor.material = floorMat;
    
    // Ceiling
    const ceiling = MeshBuilder.CreateGround("galleryCeiling", {
        width: roomWidth,
        height: roomDepth
    }, scene);
    ceiling.position.y = roomHeight;
    ceiling.rotation.x = Math.PI;
    
    const ceilingMat = new StandardMaterial("ceilingMat", scene);
    ceilingMat.diffuseColor = new Color3(0.85, 0.85, 0.9);
    ceilingMat.specularColor = new Color3(0.1, 0.1, 0.1);
    ceiling.material = ceilingMat;
    
    // Walls
    const wallColor = new Color3(0.92, 0.9, 0.85); // Gallery white
    
    // Back wall
    const backWall = MeshBuilder.CreateBox("backWall", {
        width: roomWidth,
        height: roomHeight,
        depth: wallThickness
    }, scene);
    backWall.position = new Vector3(0, roomHeight/2, roomDepth/2);
    
    // Front wall (with entrance opening)
    const frontWall = MeshBuilder.CreateBox("frontWall", {
        width: roomWidth,
        height: roomHeight,
        depth: wallThickness
    }, scene);
    frontWall.position = new Vector3(0, roomHeight/2, -roomDepth/2);
    
    // Left wall
    const leftWall = MeshBuilder.CreateBox("leftWall", {
        width: wallThickness,
        height: roomHeight,
        depth: roomDepth
    }, scene);
    leftWall.position = new Vector3(-roomWidth/2, roomHeight/2, 0);
    
    // Right wall
    const rightWall = MeshBuilder.CreateBox("rightWall", {
        width: wallThickness,
        height: roomHeight,
        depth: roomDepth
    }, scene);
    rightWall.position = new Vector3(roomWidth/2, roomHeight/2, 0);
    
    // Apply wall material to all walls
    [backWall, frontWall, leftWall, rightWall].forEach(wall => {
        const wallMat = new StandardMaterial("wallMat", scene);
        wallMat.diffuseColor = wallColor;
        wallMat.specularColor = new Color3(0.15, 0.15, 0.15);
        wall.material = wallMat;
    });
    
    // Store room dimensions for reference
    scene.galleryRoom = {
        width: roomWidth,
        depth: roomDepth,
        height: roomHeight,
        walls: [backWall, frontWall, leftWall, rightWall],
        floor: floor,
        ceiling: ceiling
    };
}

function createArtworks(scene) {
    const artworks = [];
    const artworkColors = [
        new Color3(0.9, 0.2, 0.2),   // Red
        new Color3(0.2, 0.8, 0.3),   // Green
        new Color3(0.2, 0.4, 0.9),   // Blue
        new Color3(0.95, 0.85, 0.2), // Gold
        new Color3(0.8, 0.3, 0.8),   // Purple
        new Color3(0.2, 0.8, 0.8),   // Cyan
        new Color3(0.9, 0.5, 0.2),   // Orange
    ];
    
    // Plinth positions - arranged in two rows with centerpiece
    const positions = [
        // Left row
        new Vector3(-6, 0, -9),
        new Vector3(-6, 0, -3),
        new Vector3(-6, 0, 3),
        new Vector3(-6, 0, 9),
        
        // Right row
        new Vector3(6, 0, -9),
        new Vector3(6, 0, -3),
        new Vector3(6, 0, 3),
        new Vector3(6, 0, 9),
        
        // Centerpiece
        new Vector3(0, 0, -6),
    ];
    
    // Create each artwork
    positions.forEach((pos, index) => {
        const artwork = createArtworkOnPlinth(scene, pos, index, artworkColors);
        artworks.push(artwork);
    });
    
    // Store artworks in scene for reference
    scene.artworks = artworks;
    
    return artworks;
}

function createArtworkOnPlinth(scene, position, id, colors) {
    // Create plinth (marble-like column)
    const plinth = MeshBuilder.CreateCylinder(`plinth${id}`, {
        diameterBottom: 1.4,
        diameterTop: 1.2,
        height: 1.0,
        tessellation: 32
    }, scene);
    
    plinth.position = position.clone();
    plinth.position.y = 0.5; // Half height
    
    const plinthMat = new StandardMaterial(`plinthMat${id}`, scene);
    plinthMat.diffuseColor = new Color3(0.85, 0.85, 0.88);
    plinthMat.specularColor = new Color3(0.4, 0.4, 0.4);
    plinthMat.specularPower = 128;
    plinth.material = plinthMat;
    
    // Create artwork (cube placeholder)
    const artwork = MeshBuilder.CreateBox(`artwork${id}`, {
        size: 0.9
    }, scene);
    
    artwork.position = position.clone();
    artwork.position.y = 1.6; // On top of plinth
    
    const colorIndex = id % colors.length;
    const artworkMat = new StandardMaterial(`artworkMat${id}`, scene);
    artworkMat.diffuseColor = colors[colorIndex];
    artworkMat.specularColor = new Color3(0.6, 0.6, 0.6);
    artworkMat.emissiveColor = colors[colorIndex].scale(0.1);
    artwork.material = artworkMat;
    
    // Add slight rotation animation
    scene.onBeforeRenderObservable.add(() => {
        artwork.rotation.y += 0.002;
    });
    
    // Make centerpiece larger
    if (id === 8) { // Centerpiece (last one)
        artwork.scaling = new Vector3(1.3, 1.3, 1.3);
        plinth.scaling = new Vector3(1.2, 1.2, 1.2);
        artwork.position.y = 1.8;
    }
    
    return {
        plinth: plinth,
        artwork: artwork,
        id: id,
        position: position
    };
}

// Simplified collisions
function setupSimpleCollisions(scene) {
    // Enable collisions globally
    scene.collisionsEnabled = true;
    
    // Make all walls, floor, and plinths check for collisions
    if (scene.galleryRoom) {
        scene.galleryRoom.floor.checkCollisions = true;
        scene.galleryRoom.walls.forEach(wall => {
            wall.checkCollisions = true;
        });
    }
    
    // Make all artworks and plinths check for collisions
    if (scene.artworks) {
        scene.artworks.forEach(artworkObj => {
            if (artworkObj.plinth) artworkObj.plinth.checkCollisions = true;
            if (artworkObj.artwork) artworkObj.artwork.checkCollisions = true;
        });
    }
    
    // Simple ground check to prevent falling through floor
    /*scene.onBeforeRenderObservable.add(() => {
        if (scene.activeCamera && scene.activeCamera.position.y < 0.5) {
            scene.activeCamera.position.y = 0.5;
        }
    });*/
}
