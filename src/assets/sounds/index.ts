import card from './card.mp3';
import complete from './complete.mp3';
import success from './success.mp3';
import theme from './theme.mp3';
import timeout from './timeout.mp3';

export interface ISounds {
    card: Phaser.Sound.BaseSound;
    complete: Phaser.Sound.BaseSound;
    success: Phaser.Sound.BaseSound;
    theme: Phaser.Sound.BaseSound;
    timeout: Phaser.Sound.BaseSound;
}

export enum Sounds {
    CARD = card,
    COMPLETE = complete,
    SUCCESS = success,
    THEME = theme,
    TIMEOUT = timeout,
}
