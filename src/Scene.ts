import { Card } from '~/components';
import { Sprites } from '~/assets';
import { ICoords } from '~/interfaces';

export class Scene extends Phaser.Scene {
    cards: ICoords[] = [];
    openedCard: Card | null = null;
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

    create() {
        this.createBackground();
        this.createCards();
        this.openedCard = null;
    }

    createBackground() {
        this.add.sprite(0, 0, 'BACKGROUND').setOrigin(0, 0);
    }

    createCards() {
        this.cards = [];
        const positions = this.getCardsPositions();

        for (let col = this.cols; col--; ) {
            for (let row = this.rows; row--; ) {
                const lastPosition = positions.pop();

                if (lastPosition) {
                    this.cards.push(new Card(this, col + 1, lastPosition));
                }
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    onCardClicked(pointer: any, card: Card) {
        if (card.opened) {
            return false;
        }

        if (this.openedCard) {
            // уже есть открытая карта
            if (this.openedCard.value === card.value) {
                // картинки равны - запомнить
                this.openedCard = null;
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
    }

    getCardsPositions() {
        const positions: ICoords[] = [];
        const cardTexture = this.textures.get('CARD').getSourceImage();
        const width = cardTexture.width + 4;
        const height = cardTexture.height + 4;
        const offset = {
            x: (+this.sys.game.config.width - width * this.cols) / 2,
            y: (+this.sys.game.config.height - height * this.rows) / 2,
        };

        for (let col = this.cols; col--; ) {
            for (let row = this.rows; row--; ) {
                positions.push({ x: offset.x + col * width, y: offset.y + row * height });
            }
        }

        return Phaser.Utils.Array.Shuffle(positions);
    }
}
