import { Card } from '~/components';
import { Sprites } from '~/assets';

export class Scene extends Phaser.Scene {
    cards: Card[] = [];
    openedCard: Card | null = null;
    openedCardsCount = 0;
    timeoutText: any;
    rows = 2;
    cols = 5;

    constructor() {
        super('Game');
    }

    preload() {
        const entries = Object.entries(Sprites).filter((_, index) => index % 2 === 0);
        entries.forEach(([title, url]) => {
            this.load.image(title, url.toString());
        });
    }

    createText() {
        this.timeoutText = this.add.text(10, 330, 'Time:', {
            font: '36px CurseCasual',
            fill: '#fff',
        });
    }

    create() {
        this.createBackground();
        this.createText();
        this.createCards();
        this.start();
    }

    start() {
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.initCards();
    }

    initCards() {
        const positions = this.getCardsPositions();

        this.cards.forEach((card) => {
            const position = positions.pop();
            if (position) {
                card.close();
                card.setPosition(position.x, position.y);
            }
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

        if (this.openedCard) {
            // уже есть открытая карта
            if (this.openedCard.value === card.value) {
                // картинки равны - запомнить
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
            this.start();
        }
    }

    getCardsPositions() {
        const positions = [];
        const cardTexture = this.textures.get('CARD').getSourceImage();
        const width = cardTexture.width + 4;
        const height = cardTexture.height + 4;
        const offset = {
            x: (+this.sys.game.config.width - width * this.cols) / 2 + width / 2,
            y: (+this.sys.game.config.height - height * this.rows) / 2 + height / 2,
        };

        for (let col = this.cols; col--; ) {
            for (let row = this.rows; row--; ) {
                positions.push({ x: offset.x + col * width, y: offset.y + row * height });
            }
        }

        return Phaser.Utils.Array.Shuffle(positions);
    }
}
