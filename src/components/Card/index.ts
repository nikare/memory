export class Card extends Phaser.GameObjects.Sprite {
    opened = false;

    constructor(scene: Phaser.Scene, public value: number) {
        super(scene, 0, 0, 'CARD');
        this.scene = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.setInteractive();
    }

    flip() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'linear',
            duration: 150,
            onComplete: () => {
                this.show();
            },
        });
    }

    show() {
        const texture = this.opened ? 'CARD' + this.value : 'CARD';
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'linear',
            duration: 150,
        });
    }

    open() {
        this.opened = true;
        this.flip();
    }

    close() {
        if (this.opened) {
            this.opened = false;
            this.flip();
        }
    }
}
