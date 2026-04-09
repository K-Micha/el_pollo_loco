function isMobileGameControls() {
    return window.innerWidth <= 1060;
}

function setupTouchControls(canvas, world, keyboard) {
    canvas.addEventListener('touchstart', (e) => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        handleTouch(e, canvas, world, keyboard);
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        resetTouchKeys(keyboard);
    });

    canvas.addEventListener('touchcancel', () => {
        resetTouchKeys(keyboard);
    });
}

function handleTouch(event, canvas, world, keyboard) {
    if (!isMobileGameControls()) return;

    event.preventDefault();

    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.SPACE = false;
    keyboard.D = false;

    const rect = canvas.getBoundingClientRect();
    const scaleX = world.baseWidth / rect.width;
    const scaleY = world.baseHeight / rect.height;

    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        world.touchButtons.forEach(btn => {
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

function resetTouchKeys(keyboard) {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}