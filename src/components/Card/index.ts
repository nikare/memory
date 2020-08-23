export class Card extends Phaser.GameObjects.Sprite {
    opened = false;

    constructor(scene: Phaser.Scene, public value: number) {
        super(scene, 0, 0, 'CARD');
        this.scene = scene;
        this.value = value;
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.setInteractive();
    }

    open() {
        this.opened = true;
        this.setTexture('CARD' + this.value);
    }

    close() {
        this.opened = false;
        this.setTexture('CARD');
    }
}
