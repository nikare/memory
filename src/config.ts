import { Scene } from '~/Scene';

interface IConfig {
    timer: number;
}

export const config: IConfig & Phaser.Types.Core.GameConfig = {
    title: 'Memory',
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'container',
    scene: new Scene(),
    timer: 30,
};
