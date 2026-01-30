       import { 
            Engine, 
            Scene, 
            ArcRotateCamera, 
            Vector3, 
            HemisphericLight, 
            DirectionalLight,
            MeshBuilder, 
            StandardMaterial, 
            Color3, 
            ShadowGenerator,
            TransformNode
        } from "@babylonjs/core";

import { commonBackground } from "./background.js";

export function loadLevel2(scene) {
	
	scene.collisionsEnabled = true;
	
	commonBackground(scene);


        // --- Helper: Create Material ---
        const createMat = (name, colorHex, scene) => {
            const mat = new StandardMaterial(name, scene);
            mat.diffuseColor = Color3.FromHexString(colorHex);
            mat.specularColor = new Color3(0, 0, 0); // Matte finish for low poly look
            return mat;
        };

            // --- Materials ---
			const matBase = createMat("baseMat", "#f5f5dc", scene);
//            const matBase = createMat("baseMat", "#000000", scene);
//            const matRoof = createMat("roofMat", "#cc3333", scene);
            const matRoof = createMat("roofMat", "#cc3333", scene);
            const matDoor = createMat("doorMat", "#4a3c31", scene);
            const matKnob = createMat("knobMat", "#ffd700", scene);
            const matGlass = createMat("glassMat", "#87CEEB", scene);
            const matChimney = createMat("chimneyMat", "#666666", scene);
            const matGround = createMat("groundMat", "#4caf50", scene);
            const matTrunk = createMat("trunkMat", "#8b4513", scene);
            const matLeaves = createMat("leavesMat", "#2e7d32", scene);
            const matPath = createMat("pathMat", "#c2b280", scene);
            const matSmoke = createMat("smokeMat", "#eeeeee", scene);
            matSmoke.alpha = 0.6;

            // --- House Group ---
            const houseNode = new TransformNode("houseNode", scene);
			houseNode.position.z = -10;

            // 1. Base
            const base = MeshBuilder.CreateBox("base", { width: 4, height: 2.5, depth: 4 }, scene);
            base.position.y = 1.25;
            base.material = matBase;
            base.parent = houseNode;
			base.checkCollisions = true;
            //shadowGenerator.addShadowCaster(base);
            base.receiveShadows = true;

            // 2. Roof (Cylinder with 4 subdivisions acts as a pyramid/cone)
            const roof = MeshBuilder.CreateCylinder("roof", { 
                diameterTop: 0, 
                diameterBottom: 6, // Slightly larger than base (sqrt(4^2+4^2) ~ 5.6)
                height: 2, 
                tessellation: 4 
            }, scene);
            roof.position.y = 2.5 + 1; // Base height + half roof height
            roof.rotation.y = Math.PI / 4; // Align square to base
            roof.material = matRoof;
            roof.parent = houseNode;
            //shadowGenerator.addShadowCaster(roof);

            // 3. Door
            const door = MeshBuilder.CreateBox("door", { width: 0.8, height: 1.5, depth: 0.2 }, scene);
            door.position.set(0, 0.75, 2); // Z is forward
            door.material = matDoor;
            door.parent = houseNode;
            //shadowGenerator.addShadowCaster(door);

            // 4. Doorknob
            const knob = MeshBuilder.CreateSphere("knob", { diameter: 0.15 }, scene);
            knob.position.set(0.25, 0.75, 2.15);
            knob.material = matKnob;
            knob.parent = houseNode;

            // 5. Windows
            const createWindow = (pos, rotY) => {
                const winNode = new TransformNode("win", scene);
                winNode.parent = houseNode;
                winNode.position = pos;
                winNode.rotation.y = rotY;

                const glass = MeshBuilder.CreateBox("glass", { width: 1, height: 1, depth: 0.1 }, scene);
                glass.material = matGlass;
                glass.parent = winNode;

                // Simple frame logic (vertical and horizontal bars)
                const vBar = MeshBuilder.CreateBox("vBar", { width: 0.1, height: 1, depth: 0.15 }, scene);
                vBar.material = matDoor; // Reuse dark wood color
                vBar.parent = winNode;

                const hBar = MeshBuilder.CreateBox("hBar", { width: 1, height: 0.1, depth: 0.15 }, scene);
                hBar.material = matDoor;
                hBar.parent = winNode;
                
                return winNode;
            };

            createWindow(new Vector3(-1.2, 1.5, 2.05), 0);
            createWindow(new Vector3(2.05, 1.5, 0), Math.PI / 2);
            createWindow(new Vector3(-2.05, 1.5, 0), Math.PI / 2);

            // 6. Chimney
            const chimney = MeshBuilder.CreateBox("chimney", { width: 0.8, height: 2, depth: 0.8 }, scene);
            chimney.position.set(1.2, 3, -1);
            chimney.material = matChimney;
            chimney.parent = houseNode;
            //shadowGenerator.addShadowCaster(chimney);

            // --- Smoke Animation ---
            const smokeParticles = [];
            for(let i = 0; i < 3; i++) {
                const smoke = MeshBuilder.CreateBox("smoke" + i, { size: 0.4 }, scene);
                smoke.material = matSmoke;
                smoke.position.set(1.2, 4 + i * 0.8, -1);
                smoke.rotation.x = Math.random();
                smoke.rotation.y = Math.random();
                smoke.parent = houseNode;
                
                // Store metadata for animation on the mesh object
                smoke.metadata = { 
                    speed: 0.01 + Math.random() * 0.01,
                    initialY: 4 + i * 0.8 
                };
                smokeParticles.push(smoke);
            }

            // --- Environment ---
            const envNode = new TransformNode("envNode", scene);

            /* Ground
            const ground = MeshBuilder.CreateCylinder("ground", { diameter: 20, height: 1, tessellation: 8 }, scene);
            ground.position.y = -0.5;
            ground.material = matGround;
            ground.receiveShadows = true;
            ground.parent = envNode;
			ground.visible = false;*/

            /* Path
            const path = MeshBuilder.CreateBox("path", { width: 2, height: 0.1, depth: 6 }, scene);
            path.position.set(0, 0.05, 5); // Slightly above ground to avoid z-fighting
            path.material = matPath;
            path.receiveShadows = true;
            path.parent = envNode;*/

            // Trees
            const createTree = (x, z) => {
                const treeGroup = new TransformNode("tree", scene);
                treeGroup.position.set(x, 0, z);
                
                const scale = 0.8 + Math.random() * 0.4;
                treeGroup.scaling.setAll(scale);
                treeGroup.parent = envNode;

                const trunk = MeshBuilder.CreateBox("trunk", { width: 0.4, height: 1.5, depth: 0.4 }, scene);
                trunk.position.y = 0.75;
                trunk.material = matTrunk;
                trunk.parent = treeGroup;
				trunk.checkCollisions = true;
                //shadowGenerator.addShadowCaster(trunk);

                // Low poly foliage (cone with low tessellation)
                const leaves = MeshBuilder.CreateCylinder("leaves", { diameterTop: 0, diameterBottom: 2.5, height: 2.5, tessellation: 4 }, scene);
                leaves.position.y = 2;
                leaves.material = matLeaves;
                leaves.convertToFlatShadedMesh(); // Ensure sharp edges
                leaves.parent = treeGroup;
                //shadowGenerator.addShadowCaster(leaves);
            };

            createTree(5, -6);
            createTree(-6, -8);
            createTree(-4, -15);
            createTree(6, -13);

            // --- Animation Loop Hook ---
            scene.registerBeforeRender(() => {
                smokeParticles.forEach(p => {
                    p.position.y += p.metadata.speed;
                    p.rotation.y += p.metadata.speed;
                    
                    if (p.position.y > p.metadata.initialY + 2) {
                        p.position.y = p.metadata.initialY;
                        p.visibility = 0.6; // Reset opacity
                    } else {
                        p.visibility -= 0.005; // Fade out
                    }
                });
            });

            //return scene;
        };




