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
    canvas.addEventListener('touchstart', (e) => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.UP = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    });

    canvas.addEventListener('touchcancel', () => {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.UP = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    });
}

/**
 * Processes touch input and maps it to virtual keys
 */
function handleTouch(event, canvas, world, keyboard) {
    if (!isMobileGameControls()) return;

    if (event.cancelable) {
        event.preventDefault();
    }

    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.SPACE = false;
    keyboard.D = false;

    const rect = canvas.getBoundingClientRect();
    const scaleX = world.baseWidth / rect.width;
    const scaleY = world.baseHeight / rect.height;

    const buttons = world.touchUi.getButtons();

    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        buttons.forEach(btn => {
            if (isInsideButton(x, y, btn)) {
                setTouchKey(keyboard, btn.key, true);
            }
        });
    }
}

function isInsideButton(x, y, btn) {
    return x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height;
}

function setTouchKey(keyboard, key, value) {
    if (key === 'LEFT') keyboard.LEFT = value;
    if (key === 'RIGHT') keyboard.RIGHT = value;

    if (key === 'JUMP') {
        keyboard.UP = value;
        keyboard.SPACE = value;
    }

    if (key === 'THROW') keyboard.D = value;
}

function handleTouch(event, canvas, world, keyboard) {
    if (!isMobileGameControls()) return;

    if (event.cancelable) {
        event.preventDefault();
    }

    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.SPACE = false;
    keyboard.D = false;

    const rect = canvas.getBoundingClientRect();
    const scaleX = world.baseWidth / rect.width;
    const scaleY = world.baseHeight / rect.height;
    const buttons = world.touchUi.getButtons();

    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        if (world.pauseMenu.handleClick(x, y)) return;

        buttons.forEach(btn => {
            if (isInsideButton(x, y, btn)) {
                setTouchKey(keyboard, btn.key, true);
            }
        });
    }
}