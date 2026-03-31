class Sound {
    constructor(path, volume = 1) {
        this.audio = new Audio(path);
        this.audio.volume = volume;
    }

    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }

}

const SOUNDS = {
    pickup: new Sound('assets/audio/loot.wav', 0.5),
    throw: new Sound('assets/audio/jump.wav', 0.5),
    break: new Sound('assets/audio/brocken.wav', 0.5),
    chicken: new Sound('assets/audio/chicken.wav', 0.5),
    boss: new Sound('assets/audio/chicken-boss.wav', 0.5),
    walking: new Sound('assets/audio/walking.wav', 0.3),
    win: new Sound('assets/audio/win.wav', 0.7),
    lose: new Sound('assets/audio/gameover.wav', 0.7)
};


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}
