import { Card } from './components';
import { sprites } from './assets';
import { ICoords } from 'interfaces';

export class Scene extends Phaser.Scene {
    cards: ICoords[] = [];
    rows = 2;
    cols = 5;

    constructor() {
        super('Game');
    }

    preload() {
        Object.entries(sprites).forEach(([title, url]) => {
            this.load.image(title, url);
        });
    }

    create() {
        this.createBackground();
        this.createCards();
    }

    createBackground() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
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
    }

    getCardsPositions() {
        const positions: ICoords[] = [];
        const cardTexture = this.textures.get('card').getSourceImage();
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
