// coins.js
import { SceneLoader, Vector3 } from "@babylonjs/core";

export function loadCoins(scene, level, coins) {
    const coinsUrl = "./assets/stylized_coin.glb"; // Path to your coins model

	//have to return totalCoins explicitly or have to make the function async
	let totalCoins = 0;
	if (level === 1) {totalCoins = 3;}
	if (level === 2) {totalCoins = 2;}
	if (level === 3) {totalCoins = 2;}
	console.log('total coins ', totalCoins);

    // Define coin positions based on the level
    const coinPositions = level === 1
        ? [
            new Vector3(0, 0, -7),
            new Vector3(0, 0, -15),
			new Vector3(0, 0, -25),
        ]
        : level === 2
        ? [
            new Vector3(4, 0, -9),
            new Vector3(-4, 0, -11),
        ]
        : [
            new Vector3(0, 0, -4), // Level 3
            new Vector3(0, 0, -8),
        ];

    const coinPositionOffset = new Vector3(0, 0, 0); // Adjust vertical placement

    SceneLoader.ImportMesh("", coinsUrl, "", scene, (meshes) => {
        const coinMesh = meshes[0]; // Assume the first mesh is the main coin mesh

        coinPositions.forEach((position, index) => {
            const coin = index === 0 ? coinMesh : coinMesh.clone(`coin-${index}`);

            // Align the coin with the ground
            const boundingBox = coin.getBoundingInfo().boundingBox;
            const coinHeight = boundingBox.maximum.y - boundingBox.minimum.y;
            coin.position = position.add(coinPositionOffset);
            coin.position.y -= boundingBox.minimum.y;

			coins.push(coin);
			
			console.log('coin ', index);
        });
    });
    return totalCoins;
	//return { coins: totalCoins };

}
