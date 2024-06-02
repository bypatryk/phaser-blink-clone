import { GameObjects } from 'phaser';

export class TextH1 extends GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string = '', style?: object) {
        super(scene, x, y, text, {
            fontFamily: 'Arial Black',
            fontSize: 54,
            color: '#fff',
            stroke: '#000',
            strokeThickness: 6,
            align: 'left',
            ...style,
        });

        this.setOrigin(0);
        this.setDepth(100);
    }
}
