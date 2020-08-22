import { Sprites } from './assets';

export class Scene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('background', `${Sprites.BACKGROUND}`);
    }

    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    }
}
