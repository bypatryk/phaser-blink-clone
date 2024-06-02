import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { TextButton } from '../gameObjects/TextButton';
import { TextH5 } from '../gameObjects/TextH5';
import { BackgroundImage } from '../gameObjects/BackgroundImage';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    startGameBtn: GameObjects.Text;
    resetGameBtn: GameObjects.Text;
    highScoreText: GameObjects.Text;

    clickSfx: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

    highScore: number;

    constructor() {
        super('MainMenu');
    }

    preload() {
        this.clickSfx = this.sound.add('click');
    }

    create() {
        this.background = new BackgroundImage(this);
        this.add.existing(this.background);

        this.startGameBtn = new TextButton(this, this.scale.width / 2, this.scale.height / 2 - 40, 'Start Game');
        this.add.existing(this.startGameBtn);
        this.startGameBtn.on('pointerup', () => {
            this.clickSfx.play();
            this.scene.start('Game');
        });

        this.resetGameBtn = new TextButton(this, this.scale.width / 2, this.scale.height / 2 + 40, 'Reset');
        this.add.existing(this.resetGameBtn);
        this.resetGameBtn.on('pointerup', () => {
            this.clickSfx.play();
            localStorage.clear();
            this.updateHighScore();
        });

        this.highScoreText = new TextH5(this, this.scale.width - 24, 24).setOrigin(1, 0).setAlign('right');
        this.add.existing(this.highScoreText);
        this.updateHighScore();

        EventBus.emit('current-scene-ready', this);
    }

    updateHighScore() {
        this.highScore = parseInt(localStorage.getItem('highScore') || '0')
        this.highScoreText.setText(`High Score: ${this.highScore}`);
    }
}
