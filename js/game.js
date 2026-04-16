let canvas;
let world = null;
let gameStarted = false;
let keyboard = new Keyboard();
let responsive = null;
window.GAME_ZOOM = window.innerWidth < 1060 ? 0.8 : 1;

let rotateOverlay = null;

/**
 * Returns an existing rotate overlay if present.
 */
function getExistingRotateOverlay() {
    if (rotateOverlay) return rotateOverlay;

    const existing = document.querySelector('.rotate-overlay');
    if (existing) {
        rotateOverlay = existing;
        return rotateOverlay;
    }
    return null;
}

/**
 * Initializes the rotate overlay and injects required styles.
 */
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

/**
 * Ensures a rotate overlay exists and returns it.
 */
function ensureRotateOverlay() {
    const existing = getExistingRotateOverlay();
    if (existing) return existing;

    return initRotateOverlay();
}

/**
 * Updates the size and position of the rotate overlay.
 */
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
 * Initializes the canvas and loads the start screen.
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

/**
 * Starts a new game and initializes world and controls.
 */
function startNewGame() {
    world = new World(canvas, keyboard);
    setupTouchControls(canvas, world, keyboard);
    world.start();
    gameStarted = true;
}

/**
 * Restarts the game by stopping the current world and creating a new one.
 */
function restartGame() {
    stopAllSounds();
    resetKeyboard();

    if (world) {
        world.stop();
        world = null;
    }

    startNewGame();
}

/**
 * Resets all keyboard input states.
 */
function resetKeyboard() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
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
 * Returns true if the device width indicates a mobile device.
 */
function isMobileDevice() {
    return window.innerWidth < 1060;
}

/**
 * Starts the game if the rotate overlay is not visible.
 */
function startGame() {
    if (shouldShowRotateOverlay()) return;

    startScreen.stop();
    startNewGame();
}

/**
 * Returns true if the device is a mobile or tablet.
 */
function isMobileOrTablet() {
    return window.innerWidth < 1060;
}

/**
 * Returns true if the device is currently in portrait mode.
 */
function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

/**
 * Returns true if the screen height is below a given limit.
 * @param {number} limit Maximum allowed height.
 */
function isSmallScreenHeight(limit = 900) {
    return window.innerHeight <= limit;
}

/**
 * Determines whether the rotate overlay should be shown.
 */
function shouldShowRotateOverlay() {
    return isMobileOrTablet() && isPortraitMode() && isSmallScreenHeight();
}

/**
 * Updates world logic and performs collision checks.
 * @param {World} world The active game world.
 */
function updateWorld(world) {
    if (world.gameWon) return;

    Collision.checkEnemyCollision(world);
    world.throwController.update();
    Collision.checkBottleCollision(world);
    Collision.checkCoinCollision(world);
}

/**
 * Handles keyboard input for movement and actions.
 */
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

/**
 * Resets keyboard input when keys are released.
 */
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

/**
 * Updates the rotate overlay on page load.
 */
window.addEventListener('load', () => {
    updateRotateOverlay();
});

/**
 * Updates the rotate overlay when the window is resized.
 */
window.addEventListener('resize', () => {
    updateRotateOverlay();
});

/**
 * Updates the rotate overlay when device orientation changes.
 */
window.addEventListener('orientationchange', () => {
    updateRotateOverlay();
});