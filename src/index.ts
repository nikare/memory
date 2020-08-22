import Phaser from 'phaser';

import { Scene } from './Scene';

new Phaser.Game({
    title: 'Memory',
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'container',
    scene: new Scene(),
});
