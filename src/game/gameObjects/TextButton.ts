import { GameObjects } from 'phaser';

export class TextButton extends GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style?: object) {
        super(scene, x, y, text.toUpperCase(), {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#fff',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center',
            ...style,
        });

        this.setOrigin(0.5);
        this.setDepth(100);

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.enterStartButtonHoverState();
            })
            .on('pointerout', () => {
                this.enterStartButtonRestState();
            })
            .on('pointerdown', () => {
                this.enterStartButtonActiveState();
            })
            .on('pointerup', () => {
                this.enterStartButtonHoverState();
            })
    }

    enterStartButtonHoverState() {
        this.setFill('#ff0');
    }

    enterStartButtonRestState() {
        this.setFill('#fff');
    }

    enterStartButtonActiveState() {
        this.setFill('#0ff');
    }
}
