import { Card } from '~/components';
import { Sprites, Sounds } from '~/assets';
import { config } from './config';
import { ISounds } from './assets/sounds';

export class Scene extends Phaser.Scene {
    cards: Card[] = [];
    sounds: ISounds | null = null;
    openedCard: Card | null = null;
    openedCardsCount = 0;
    rows = 2;
    cols = 5;
    timeout = 3;
    timeoutText: Phaser.GameObjects.Text | null = null;

    constructor() {
        super('Game');
    }

    preload() {
        const sprites = Object.entries(Sprites).filter((_, index) => index % 2 === 0);
        const sounds = Object.entries(Sounds).filter((_, index) => index % 2 === 0);

        sprites.forEach(([title, url]) => {
            this.load.image(title, url.toString());
        });

        sounds.forEach(([title, url]) => {
            this.load.audio(title, url.toString());
        });
    }

    createText() {
        this.timeoutText = this.add.text(10, 330, '', {
            font: '36px CurseCasual',
            fill: '#fff',
        });
    }

    onTimerTick() {
        if (this.timeoutText) {
            this.timeoutText.setText(`Time: ${this.timeout}`);
        }

        if (this.timeout <= 0) {
            if (this.sounds) {
                this.sounds.timeout.play();
            }
            this.start();
        } else {
            --this.timeout;
        }
    }

    createTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true,
        });
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('CARD'),
            complete: this.sound.add('COMPLETE'),
            success: this.sound.add('SUCCESS'),
            theme: this.sound.add('THEME'),
            timeout: this.sound.add('TIMEOUT'),
        };

        this.sounds.theme.play({
            volume: 0.1,
            loop: true,
        });
    }

    create() {
        this.timeout = config.timer;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        this.createText();
        this.createCards();
        this.start();
    }

    start() {
        this.timeout = config.timer;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.initCards();
        this.showCards();
    }

    initCards() {
        const paramsArr = this.getCardsParams();

        this.cards.forEach((card) => {
            const params = paramsArr.pop();
            if (params) {
                card.init(params);
            }
        });
    }

    showCards() {
        this.cards.forEach((card) => {
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.delay,
            });
        });
    }

    createBackground() {
        this.add.sprite(0, 0, 'BACKGROUND').setOrigin(0, 0);
    }

    createCards() {
        this.cards = [];

        for (let col = this.cols; col--; ) {
            for (let row = this.rows; row--; ) {
                this.cards.push(new Card(this, col + 1));
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    onCardClicked(_: Phaser.Events.EventEmitter, card: Card) {
        if (card.opened) {
            return false;
        }

        if (this.sounds) {
            this.sounds.card.play();
        }

        if (this.openedCard) {
            // уже есть открытая карта
            if (this.openedCard.value === card.value) {
                // картинки равны - запомнить
                if (this.sounds) {
                    this.sounds.success.play();
                }
                this.openedCard = null;
                ++this.openedCardsCount;
            } else {
                // картинки разные - скрыть прошлую
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            // уже есть открытая карта
            this.openedCard = card;
        }

        card.open();

        if (this.openedCardsCount === this.cards.length / 2) {
            if (this.sounds) {
                this.sounds.complete.play();
            }
            this.start();
        }
    }

    getCardsParams() {
        const params = [];
        const cardTexture = this.textures.get('CARD').getSourceImage();
        const width = cardTexture.width + 4;
        const height = cardTexture.height + 4;
        const offset = {
            x: (Number(config.width) - width * this.cols) / 2 + width / 2,
            y: (Number(config.height) - height * this.rows) / 2 + height / 2,
        };

        let id = 0;

        for (let col = this.cols; col--; ) {
            for (let row = this.rows; row--; ) {
                params.push({
                    x: offset.x + col * width,
                    y: offset.y + row * height,
                    delay: ++id * 100,
                });
            }
        }

        return Phaser.Utils.Array.Shuffle(params);
    }
}
