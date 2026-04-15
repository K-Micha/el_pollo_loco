let canvas;
let world = null;
let gameStarted = false;
let keyboard = new Keyboard();
let responsive = null;
window.GAME_ZOOM = window.innerWidth < 1060 ? 0.8 : 1;

let rotateOverlay = null;

function getExistingRotateOverlay() {
    if (rotateOverlay) return rotateOverlay;

    const existing = document.querySelector('.rotate-overlay');
    if (existing) {
        rotateOverlay = existing;
        return rotateOverlay;
    }
    return null;
}

function initRotateOverlay() {
    if (typeof injectRotateStyles === 'function') {
        injectRotateStyles();
    }

    if (typeof createRotateOverlay !== 'function') {
        return null;
    }

    rotateOverlay = createRotateOverlay();
    document.body.appendChild(rotateOverlay);
    return rotateOverlay;
}

function ensureRotateOverlay() {
    const existing = getExistingRotateOverlay();
    if (existing) return existing;

    return initRotateOverlay();
}


function updateRotateOverlay() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const overlay = ensureRotateOverlay();
    if (!overlay) return;

    const rect = canvas.getBoundingClientRect();

    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.display = shouldShowRotateOverlay() ? 'flex' : 'none';
}

/**
* Initializes canvas and loads start screen
*/
function init() {
    canvas = document.getElementById('canvas');

    updateRotateOverlay();

    if (isMobileOrTablet()) {
        responsive = new ResponsiveCanvas(canvas);
    }

    startScreen = new StartScreen(canvas);

    startScreen.img.onload = () => {
        startScreen.draw();
        updateRotateOverlay();
    };
}

function startNewGame() {
    world = new World(canvas, keyboard);
    setupTouchControls(canvas, world, keyboard);
    world.start();
    gameStarted = true;
}

function restartGame() {
    stopAllSounds();
    resetKeyboard();

    if (world) {
        world.stop();
        world = null;
    }

    startNewGame();
}

function resetKeyboard() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

function stopAllSounds() {
    Object.values(SOUNDS).forEach(sound => {
        sound.pause();
        sound.audio.currentTime = 0;
    });
}

function isMobileDevice() {
    return window.innerWidth < 1060;
}

/**
* Starts the game and initializes world + controls
*/
function startGame() {
    if (shouldShowRotateOverlay()) return;

    startScreen.stop();
    startNewGame();
}

function isMobileOrTablet() {
    return window.innerWidth < 1060;
}

function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

function isSmallScreenHeight(limit = 900) {
    return window.innerHeight <= limit;
}

function shouldShowRotateOverlay() {
    return isMobileOrTablet() && isPortraitMode() && isSmallScreenHeight();
}

/**
* Updates world logic and collision checks
*/
function updateWorld(world) {
    if (world.gameWon) return;

    Collision.checkEnemyCollision(world);
    world.throwController.update();
    Collision.checkBottleCollision(world);
    Collision.checkCoinCollision(world);
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }

});

window.addEventListener('load', () => {
    updateRotateOverlay();
});

window.addEventListener('resize', () => {
    updateRotateOverlay();
});

window.addEventListener('orientationchange', () => {
    updateRotateOverlay();
});