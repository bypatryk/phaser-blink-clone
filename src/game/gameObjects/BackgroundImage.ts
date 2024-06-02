import { GameObjects } from "phaser";

export class BackgroundImage extends GameObjects.Image {
    resizeObserver: ResizeObserver;

    constructor(scene: Phaser.Scene) {
        super(scene, scene.game.canvas.width / 2, scene.game.canvas.height / 2, 'background');
        this.setOrigin(0.5);
        this.scaleImage();


        this.resizeObserver = new ResizeObserver(() => {
            this.scaleImage();
        })
    }

    addedToScene() {
        this.resizeObserver.observe(this.scene.game.canvas);
    }

    scaleImage() {
        const scaleX = this.scene.game.canvas.width / this.width;
        const scaleY = this.scene.game.canvas.height / this.height;
        const scale = Math.max(scaleX, scaleY, 1);

        this.setScale(scale);
        this.setPosition(this.scene.game.canvas.width / 2, this.scene.game.canvas.height / 2);
    }

    removedFromScene() {
        this.resizeObserver.unobserve(this.scene.game.canvas);
    }
}
