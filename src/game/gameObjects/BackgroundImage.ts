import { GameObjects } from "phaser";

export class BackgroundImage extends GameObjects.Image {
    constructor(scene: Phaser.Scene) {
        super(scene, scene.scale.width / 2, scene.scale.height / 2, 'background');

        const scaleX = scene.scale.width / this.width;
        const scaleY = scene.scale.height / this.height;
        const scale = Math.max(scaleX, scaleY, 1);

        console.log(scale, scaleX, scaleY);
        console.log(scene.scale.width, scene.scale.height);

        this.setScale(scale).setScrollFactor(0);
    }
}
