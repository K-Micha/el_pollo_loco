let SOUND_ENABLED = false;

class Sound {
    /**
     * Creates a sound instance with path and volume.
     */
    constructor(path, volume) {
        this.audio = new Audio(path);
        this.audio.volume = volume;
    }

    /**
     * Plays the sound if sound is enabled.
     */
    play() {
        if (!SOUND_ENABLED) return;
        this.audio.play();
    }

    /**
     * Pauses the sound.
     */
    pause() {
        this.audio.pause();
    }
}

    /**
     * Collection of all game sound effects.
    */
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

    /**
     *  Loads saved sound state from localStorage.
     */
function loadSoundState() {
    let savedState = localStorage.getItem('soundEnabled');

    if (savedState === null) {
        SOUND_ENABLED = false;
        return;
    }

    SOUND_ENABLED = savedState === 'true';
}

    /**
     *  Saves current sound state to localStorage.
     */
function saveSoundState() {
    localStorage.setItem('soundEnabled', SOUND_ENABLED);
}

    /**
     * Toggles sound on/off and updates UI.
     */
function toggleSound() {
    SOUND_ENABLED = !SOUND_ENABLED;
    saveSoundState();
    updateSoundButton();
}

    /**
     * Initializes world, canvas and sound state.
     */
function init() {
    loadSoundState();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    updateSoundButton();
}

    /**
     * Stops all sounds and resets their playback position.
     */
function stopAllSounds() {
    Object.values(SOUNDS).forEach(sound => {
        sound.pause();
        sound.audio.currentTime = 0;
    });
}

    /**
     * Resets all keyboard input states.
     */
function resetKeyboard() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

    /**
     * lears all active intervals and timeouts.
     */
function clearAllGameIntervals() {
    for (let i = 1; i < 9999; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
}

    /**
     *  Fully restarts the game and resets all systems.
     */
function restartGame() {
    stopAllSounds();
    clearAllGameIntervals();
    resetKeyboard();
    initLevel();
    init();
}