export class Card extends Phaser.GameObjects.Sprite {
    opened = false;
    delay = 0;
    position = { x: 0, y: 0 };

    constructor(scene: Phaser.Scene, public value: number) {
        super(scene, 0, 0, 'CARD');
        this.scene = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.setInteractive({
            useHandCursor: true,
        });
    }

    init(params: { x: number; y: number; delay: number }) {
        const { delay, ...position } = params;
        this.delay = delay;
        this.position = position;
        this.close();
        this.setPosition(-this.width, -this.height);
    }

    move(params: { x: number; y: number; delay: number; callback?: () => void }) {
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            ease: 'Linear',
            duration: 250,
            delay: params.delay,
            onComplete: () => {
                if (params.callback) {
                    params.callback();
                }
            },
        });
    }

    flip() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 1,
            ease: 'Linear',
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
            scaleY: 1,
            ease: 'Linear',
            duration: 150,
        });
    }

    scaleCard(scale: number) {
        if (!this.scene.tweens.isTweening(this) && !this.opened) {
            this.scene.tweens.add({
                targets: this,
                scale: scale,
                ease: 'Linear',
                duration: 100,
            });
        }
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
