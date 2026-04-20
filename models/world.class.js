class World {
    baseWidth = 720;
    baseHeight = 480;
    character = new Character();
    level = null;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    bottlesCollected = 0;
    winPhase = 1;
    gameWon = false;
    gameOver = false;
    gameOverPhase = 1;
    throwableObjects = [];
    canThrow = true;
    bossSoundPlaying = false;
    collectedBottles = 0;
    enemiesKilled = 0;
    bossesKilled = 0;
    totalBottles = 9;
    touchUi;
    throwController;
    intervalId = null;
    animationFrameId = null;
    isDestroyed = false;
    isPaused = false;

    /**
    * Initializes world, UI, controllers and references
    */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.canvas = canvas;

        this.initSystems();

        this.keyboard = keyboard;
        this.level = createLevel1();

        this.bossState = new WorldBossState(this);

        this.initGame();
        this.setWorld();
    }

    /**
    * Initializes all game setup steps.
    */
    initGame() {
        this.setupUI();
        this.setupScreens();
        this.setupControllers();
        this.setupSystems();
    }

    /**
    * Initializes core systems (UI, renderer, state, lifecycle).
    */
    initSystems() {
        this.ui = new UI(this.ctx, this.canvas, this);
        this.renderer = new WorldRenderer(this);
        this.state = new WorldState(this);
        this.lifecycle = new WorldLifecycle(this);
    }

    /**
    * Initializes all screen-related elements (win and game over).
    */
    setupScreens() {
        this.setupWinScreen();
        this.gameOverImage = new GameOverImage();
        this.gameOverBackground = new GameOverBackground();
    }

    /**
    * Initializes all game controllers (input, restart, throw logic).
    */
    setupControllers() {
        this.restartController = new RestartController(this, this.canvas);
        this.throwController = new ThrowController(this);
    }

    /**
    * Initializes gameplay systems (UI, pause handling, touch input).
    */
    setupSystems() {
        this.touchUi = new TouchUi(this);
        this.pauseMenu = new PauseMenu(this);
        this.bindPauseClick();
    }

    /**
    * Starts update loop and render loop
    */
    start() {
        this.run();
        this.draw();
    }

    /**
    * Initializes all UI bars.
    */
    setupUI() {
        this.statusBar = new StatusBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
    }

    /**
    * Binds click and touch handlers for the pause menu.
    */
    bindPauseClick() {
        this.canvas.addEventListener('click', (e) => this.handlePauseClick(e));
        this.canvas.addEventListener('touchend', (e) => this.handlePauseTouch(e), { passive: false });
    }

    /**
    * Handles pause button clicks.
    */
    handlePauseClick(event) {
        const { x, y } = this.getScaledPointer(event);
        this.pauseMenu.handleClick(x, y);
    }

    /**
    *  Handles pause button touches.
    */
    handlePauseTouch(e) {
        if (e.cancelable) e.preventDefault();

        const touch = e.changedTouches[0];
        if (!touch) return;

        const { x, y } = this.getScaledPointer(touch);
        this.pauseMenu.handleClick(x, y);
    }

    /**
    * Converts pointer coordinates to game‑scaled coordinates.
    */
    getScaledPointer(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.baseWidth / rect.width;
        const scaleY = this.baseHeight / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    /**
    * Creates win screen objects
    */
    setupWinScreen() {
        this.winBackground = new WinBackground();
        this.winImage = new WinImage();
    }

    /**
    * Injects world reference into character and boss
    */
    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });

        const boss = this.level.enemies.find(e => e instanceof Endboss);

        if (boss) {
            boss.world = this;
            boss.lifeBar = new LifeBarBoss(boss);
        }
    }

    /**
    * Starts the main world update loop.
    */
    run() {
        this.intervalId = setInterval(() => {
            if (this.isDestroyed || this.isPaused) return;
            updateWorld(this);
        }, 1000 / 60);
    }

    /**
    * Main render loop using requestAnimationFrame
    */
    draw() {
        if (this.isDestroyed) return;

        this.updateFrame();
        this.renderer.renderFrame();

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        this.lifecycle.stop();
    }

    /**
    *  Handles bottle pickup logic.
    */
    collectBottle(bottle) {
        SOUNDS.pickup.play();
        this.bottlesCollected++;
        this.updateBottleUI();
        bottle.markedForRemoval = true;
    }

    /**
    * Updates bottle UI percentage and count.
    */
    updateBottleUI() {
        const percentage = (this.bottlesCollected / this.totalBottles) * 100;

        this.bottleBar.setPercentage(percentage);
        this.bottleBar.setBottles(this.bottlesCollected, this.totalBottles);
    }

    /**
    * Applies damage to character and updates life bar
    */
    handleCharacterHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.life);
        }
    }

    /**
    *  Returns a random enemy instance (Chicken or SmallChicken).
    */
    randomEnemy() {
        let types = [Chicken, SmallChicken];
        let Type = types[Math.floor(Math.random() * types.length)];
        return new Type();
    }

    /**
    * Updates world state before rendering
    */
    updateFrame() {
        this.bossState.update();
        Collision.checkBottlePickup(this);
        this.cleanupObjects();
    }

    /**
    *  Exits fullscreen on mobile to avoid known browser bugs.
    */
    forceExitFullscreenIfMobileBug() {
        if (!isMobileGameControls()) return;

        const isFs = document.fullscreenElement || document.webkitFullscreenElement;
        if (!isFs) return;

        try {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } catch (e) {
            console.log("Emergency fullscreen exit failed");
        }
    }

    /**
    * Renders all UI elements depending on game state.
    */
    renderUI() {
        if (!this.gameWon && !this.gameOver) {
            this.ui.drawHUD();
            this.pauseMenu.draw(this.ctx);
            this.touchUi.draw(this.ctx);
        }

        this.state.draw();
    }

    /**
    * Toggles global sound state and stops audio if muted.
    */
    toggleSound() {
        SOUND_ENABLED = !SOUND_ENABLED;
        saveSoundState();

        if (!SOUND_ENABLED) {
            stopAllSounds();
        }
    }

    /**
    * Toggles fullscreen mode for the canvas.
    */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
            return;
        }

        document.exitFullscreen();
    }

    /**
    * Removes dead enemies and finished throwables
    */
    cleanupObjects() {
        this.level.enemies.forEach(enemy => {
            if (enemy.markedForRemoval) {
                if (!(enemy instanceof Endboss)) this.enemiesKilled++;
                if (enemy instanceof Endboss) this.bossesKilled++;
            }
        });

        this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
        this.throwableObjects = this.throwableObjects.filter(o => !o.markedForRemoval);
    }

    /**
    * Adds multiple objects to the map.
    */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
    *  Draws a single movable object with flip and rounding logic.
    */
    addToMap(mo) {
        const oldX = mo.x;
        const oldY = mo.y;

        this.roundPositionIfNeeded(mo);
        this.applyFlipIfNeeded(mo);

        mo.draw(this.ctx);

        this.resetFlipIfNeeded(mo);
        this.restoreOriginalPosition(mo, oldX, oldY);
    }

    /**
    * Rounds object position unless it's a background layer.
    */
    roundPositionIfNeeded(mo) {
        if (!(mo instanceof BackgroundObject)) {
            mo.x = Math.round(mo.x);
            mo.y = Math.round(mo.y);
        }
    }

    /**
    * Applies horizontal flip if needed.
    */
    applyFlipIfNeeded(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
    }

    /**
    *  Resets horizontal flip if applied.
    */
    resetFlipIfNeeded(mo) {
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
    * Restores original object position after drawing.
    */
    restoreOriginalPosition(mo, oldX, oldY) {
        mo.x = oldX;
        mo.y = oldY;
    }

    /**
    * Flips the image horizontally.
    */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
    * Reverts the horizontal flip.
    */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}