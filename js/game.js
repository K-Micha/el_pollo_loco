let canvas;
let world = null;
let gameStarted = false;
let keyboard = new Keyboard();
let responsive = null;
window.GAME_ZOOM = window.innerWidth < 1060 ? 0.8 : 1;

/**
 * Initializes canvas and loads start screen
 */
function init() {
    canvas = document.getElementById('canvas');

    if (isMobileOrTablet()) {
        responsive = new ResponsiveCanvas(canvas);
    }

    startScreen = new StartScreen(canvas);

    startScreen.img.onload = () => {
        startScreen.draw();
    };
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

    world = new World(canvas, keyboard);
    setupTouchControls(canvas, world, keyboard);
    
    world.start();

    gameStarted = true;
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