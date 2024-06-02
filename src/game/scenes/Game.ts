import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';
import { TextH5 } from '../gameObjects/TextH5';
import { TextButton } from '../gameObjects/TextButton';
import { TextH3 } from '../gameObjects/TextH3';
import { BackgroundImage } from '../gameObjects/BackgroundImage';

enum GameState {
    playing,
    over,
}

export class Game extends Scene {
    bumpDifficultyBy = 20;
    bumpDifficultyEvery = 5;
    lowestRadius = 50;
    growSpeed = 100;
    precision = 0.2;

    background: GameObjects.Image;
    highScoreText: GameObjects.Text;
    scoreText: GameObjects.Text;
    gameOverText?: GameObjects.Text;
    mainMenuBtn?: GameObjects.Text;
    targetCircle: GameObjects.Arc;
    cursorCircle: GameObjects.Arc;

    clickSfx: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;
    successSfx: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;
    gameOverSfx: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

    targetCircleRadius: number;
    highScore: number;
    score: number;
    cursorCircleRadius: number;
    gameState: GameState;

    constructor() {
        super('Game');
    }

    preload() {
        this.clickSfx = this.sound.add('click');
        this.gameOverSfx = this.sound.add('gameOver');
        this.successSfx = this.sound.add('success');
    }

    create() {
        this.targetCircleRadius = 150;
        this.score = 0;
        this.cursorCircleRadius = 0;
        this.gameState = GameState.playing;

        this.background = new BackgroundImage(this);
        this.add.existing(this.background);

        this.scoreText = new TextH5(this, 24, 24);
        this.add.existing(this.scoreText);
        this.updateScoreText(this.score);

        this.highScore = parseInt(localStorage.getItem('highScore') || '0')
        this.highScoreText = new TextH5(this, this.scale.width - 24, 24, `High Score: ${this.highScore}`).setOrigin(1, 0).setAlign('right');
        this.add.existing(this.highScoreText);

        this.targetCircle = this.spawnTargetCircle();

        this.cursorCircle = this.add.circle(
            this.input.activePointer.x,
            this.input.activePointer.y,
            this.cursorCircleRadius,
        )
            .setFillStyle(0xffffff);

        this.gameState = GameState.playing;

        EventBus.emit('current-scene-ready', this);
    }

    updateScoreText(score: number) {
        this.scoreText.setText(`Score: ${score}`);
    }

    spawnTargetCircle(): GameObjects.Arc {
        const offset = 12 + this.targetCircleRadius;

        return this.add.circle(
            Phaser.Math.Between(offset, this.scale.width - offset),
            Phaser.Math.Between(offset, this.scale.height - offset),
            this.targetCircleRadius
        )
            .setStrokeStyle(8, 0xffffff);
    }

    onCircleGrewUp() {
        if (Phaser.Math.Distance.BetweenPoints(this.cursorCircle.getCenter(), this.targetCircle.getCenter()) <= this.precision * this.targetCircleRadius) {
            this.onObjectiveCleared();
        } else {
            this.onGameOver();
        }
    }

    onObjectiveCleared() {
        this.successSfx.play();

        this.updateScoreText(++this.score);
        this.cursorCircleRadius = 0;

        if (this.score % this.bumpDifficultyEvery === 0) {
            this.targetCircleRadius = Math.max(this.lowestRadius, this.targetCircleRadius - this.bumpDifficultyBy);
        }

        this.targetCircle.destroy();
        this.targetCircle = this.spawnTargetCircle();
    }

    onGameOver() {
        this.gameState = GameState.over;

        this.gameOverSfx.play();

        this.gameOverText = new TextH3(this, this.scale.width / 2, this.scale.height / 2 - 120, 'Game Over').setOrigin(0.5).setAlign('center');
        this.add.existing(this.gameOverText);

        this.scoreText.setOrigin(0).setPosition(this.scale.width / 2, this.scale.height / 2 - 80).setOrigin(0.5).setAlign('center');

        const highScore = parseInt(localStorage.getItem('highScore') || '0');
        if (this.score > highScore) {
            localStorage.setItem('highScore', String(this.score));
        }

        this.mainMenuBtn = new TextButton(this, this.scale.width / 2, this.scale.height / 2, 'Main Menu');
        this.add.existing(this.mainMenuBtn);
        this.mainMenuBtn.on('pointerdown', () => {
            this.clickSfx.play();
            this.scene.start('MainMenu');
        })
    }

    update(time: number, delta: number) {
        if (this.gameState != GameState.playing)
            return

        if (this.cursorCircleRadius < this.targetCircleRadius) {
            this.cursorCircleRadius += this.growSpeed * (delta / 1000);

            const progress = Math.min(Math.max(0, this.cursorCircleRadius / this.targetCircleRadius), 1);
            const color = Phaser.Display.Color.GetColor(255, 255 * (1 - progress), 255 * (1 - progress));

            this.cursorCircle
                .setPosition(this.input.activePointer.x, this.input.activePointer.y)
                .setRadius(this.cursorCircleRadius)
                .setFillStyle(color);

            this.targetCircle
                .setStrokeStyle(8, color);
        } else {
            this.onCircleGrewUp()
        }
    }
}
