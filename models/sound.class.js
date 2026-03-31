class Sound {
    constructor(path, volume) {
        this.audio = new Audio(path);
        this.audio.volume = volume;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }
}


const SOUNDS = {
    pickup: new Sound('assets/audio/loot.wav', 0.5),
    jump: new Sound('assets/audio/jump.wav', 0.1),
    break: new Sound('assets/audio/brocken.wav', 0.2),
    chicken_walk: new Sound('assets/audio/chicken.wav', 0.5),
    boss_sound: new Sound('assets/audio/chicken-boss.wav', 0.01),
    walking: new Sound('assets/audio/walking.wav', 0.1),
    win: new Sound('assets/audio/win.wav', 0.7),
    lose: new Sound('assets/audio/gameover.wav', 0.7)
};

SOUNDS.boss_sound.audio.loop = true;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}
