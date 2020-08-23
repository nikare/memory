import { ICoords } from 'interfaces';

export class Card extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, public value: number, position: ICoords) {
        super(scene, position.x, position.y, `card${value}`);
        this.scene = scene;
        this.value = value;
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }
}
