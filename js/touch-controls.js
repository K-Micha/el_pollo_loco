/**
* Returns true if mobile touch controls should be enabled.
*/
function isMobileGameControls() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const shortSide = Math.min(vw, vh);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isTouch && shortSide <= 1060;
}

/**
* Sets up touch input handling for mobile gameplay
*/
function setupTouchControls(canvas, world, keyboard) {
    setupTouchStart(canvas, world, keyboard);
    setupTouchMove(canvas, world, keyboard);
    setupTouchEnd(canvas, keyboard);
    setupTouchCancel(canvas, keyboard);
}

/**
* Registers touchstart handling for movement and actions.
*/
function setupTouchStart(canvas, world, keyboard) {
    canvas.addEventListener('touchstart', e => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });
}

/**
* Registers touchmove handling for continuous input.
*/
function setupTouchMove(canvas, world, keyboard) {
    canvas.addEventListener('touchmove', e => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });
}

/**
* Registers touchend handling to reset input.
*/
function setupTouchEnd(canvas, keyboard) {
    canvas.addEventListener('touchend', () => {
        resetTouchKeys(keyboard);
    });
}

/**
* Registers touchcancel handling to reset input.
*/
function setupTouchCancel(canvas, keyboard) {
    canvas.addEventListener('touchcancel', () => {
        resetTouchKeys(keyboard);
    });
}

/**
* Resets all virtual touch keys.
*/
function resetTouchKeys(keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

/**
* Processes touch input and maps it to virtual keys
*/
function handleTouch(event, canvas, world, keyboard) {
    if (!isMobileGameControls()) return;
    if (event.cancelable) event.preventDefault();

    resetKeys(keyboard);

    const rect = canvas.getBoundingClientRect();
    const scaleX = world.baseWidth / rect.width;
    const scaleY = world.baseHeight / rect.height;

    return processTouches(event, rect, scaleX, scaleY, world, keyboard);
}

/**
* Processes all active touches and triggers UI interactions.
*/
function processTouches(event, rect, scaleX, scaleY, world, keyboard) {
    const touches = event.touches;
    const buttons = world.touchUi.getButtons();

    for (let i = 0; i < touches.length; i++) {
        const { x, y } = getTouchPosition(touches[i], rect, scaleX, scaleY);

        if (world.pauseMenu.handleClick(x, y)) return true;

        handleButtonTouches(x, y, buttons, keyboard);
    }
}

/**
* Converts a touch position to scaled canvas coordinates.
*/
function getTouchPosition(touch, rect, scaleX, scaleY) {
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

/**
* Checks which virtual buttons are touched and sets keys.
*/
function handleButtonTouches(x, y, buttons, keyboard) {
    buttons.forEach(btn => {
        if (isInsideButton(x, y, btn)) {
            setTouchKey(keyboard, btn.key, true);
        }
    });
}

/**
* Resets all keyboard movement and action keys.
*/
function resetKeys(keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

/**
* Returns true if a touch is inside a button's bounds.
*/
function isInsideButton(x, y, btn) {
    return x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height;
}

/**
* Sets a virtual key based on a button mapping.
*/
function setTouchKey(keyboard, key, value) {
    if (key === 'LEFT') keyboard.LEFT = value;
    if (key === 'RIGHT') keyboard.RIGHT = value;

    if (key === 'JUMP') {
        keyboard.UP = value;
        keyboard.SPACE = value;
    }

    if (key === 'THROW') keyboard.D = value;
}
