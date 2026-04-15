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
        this.keyboard = keyboard;
        this.level = createLevel1();

        this.setupUI();
        this.setupWinScreen();

        this.gameOverImage = new GameOverImage();
        this.gameOverBackground = new GameOverBackground();

        this.restartController = new RestartController(this, canvas);
        this.touchUi = new TouchUi(this);
        this.pauseMenu = new PauseMenu(this);
        this.bindPauseClick();
        this.throwController = new ThrowController(this);

        this.setWorld();
    }

    /**
     * Starts update loop and render loop
     */
    start() {
        this.run();
        this.draw();
    }

    setupUI() {
        this.statusBar = new StatusBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
    }

    bindPauseClick() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.baseWidth / rect.width;
            const scaleY = this.baseHeight / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            this.pauseMenu.handleClick(x, y);
        });
    }

    /**
     * Creates win screen objects
     */
    setupWinScreen() {
        this.winBackground = new WinBackground();
        this.winImage = new WinImage();
    }

    /**
    * Handles boss sound, win detection and win animation
    */
    tickEnemies() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);

        if (boss && !boss.isDeadEnemy) {
            if (!this.bossSoundPlaying) {
                SOUNDS.boss_sound.play();
                this.bossSoundPlaying = true;
            }
        } else {
            if (this.bossSoundPlaying) {
                SOUNDS.boss_sound.pause();
                this.bossSoundPlaying = false;
            }
        }

        if (boss && boss.isDeadEnemy) {
            this.gameWon = true;
        }

        if (this.gameWon) {
            this.updateWinAnimation();
        }
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

    run() {
        this.intervalId = setInterval(() => {
            if (this.isDestroyed || this.isPaused) return;
            updateWorld(this);
        }, 1000 / 60);
    }

    checkBottlePickup() {
        this.level.bottles = this.level.bottles.filter(bottle => {
            if (!this.isBottleTouching(bottle)) return true;
            this.collectBottle(bottle);
            return false;
        });
    }

    isBottleTouching(bottle) {
        const charHit = this.getCharBottleHitbox();
        const bottleHit = this.getBottleHitbox(bottle);

        return (
            charHit.x + charHit.width >= bottleHit.x &&
            charHit.y + charHit.height >= bottleHit.y &&
            charHit.x <= bottleHit.x + bottleHit.width &&
            charHit.y <= bottleHit.y + bottleHit.height
        );
    }

    getCharBottleHitbox() {
        return {
            x: this.character.x + 10,
            y: this.character.y + 20,
            width: this.character.width - 20,
            height: this.character.height - 20
        };
    }

    getBottleHitbox(bottle) {
        return {
            x: bottle.x + 18,
            y: bottle.y + 14,
            width: bottle.width - 70,
            height: bottle.height - 28
        };
    }

    collectBottle(bottle) {
        SOUNDS.pickup.play();

        this.bottlesCollected++;

        this.bottleBar.setPercentage(
            (this.bottlesCollected / this.totalBottles) * 100
        );

        this.bottleBar.setBottles(
            this.bottlesCollected,
            this.totalBottles
        );

        bottle.markedForRemoval = true;
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

    randomEnemy() {
        let types = [Chicken, SmallChicken];
        let Type = types[Math.floor(Math.random() * types.length)];
        return new Type();
    }

    /**
   * Main render loop using requestAnimationFrame
   */
    draw() {
        if (this.isDestroyed) return;

        this.updateFrame();
        this.renderFrame();

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        this.isDestroyed = true;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.restartController) {
            this.restartController.destroy();
        }
    }

    drawBossLifeBar() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);

        if (!boss || !boss.lifeBar) return;
        if (!boss.lifeBar.isBossVisible()) return;

        boss.lifeBar.draw(this.ctx);
    }

    /**
  * Updates world state before rendering
  */
    updateFrame() {
        this.tickEnemies();
        this.cleanupObjects();
    }

    /**
     * Handles scaling, camera transform and world/UI rendering
     */
    renderFrame() {
        this.clearCanvas();

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        const scale = Math.min(
            canvasWidth / this.baseWidth,
            canvasHeight / this.baseHeight
        );

        const offsetX = (canvasWidth - this.baseWidth * scale) / 2;
        const offsetY = (canvasHeight - this.baseHeight * scale) / 2;

        this.ctx.save();
        this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

        this.ctx.translate(this.camera_x, 0);

        this.renderWorld();

        this.ctx.translate(-this.camera_x, 0);

        this.renderUI();

        this.ctx.restore();
    }

    /**
    * Renders world objects (background, enemies, items, character)
    */
    renderWorld() {
        this.drawBackground();
        this.drawCharacter();
        this.drawClouds();
        this.drawEnemies();
        this.checkBottlePickup();
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.drawThrowables();

        this.coinBar.setCoins(this.character.coins || 0);
    }

    renderUI() {
        this.drawUI();
        this.pauseMenu.draw(this.ctx);
        this.drawGameStates();
        this.touchUi.draw(this.ctx);
    }

    /**
    * Draws win/game over screens and animations
    */
    drawGameStates() {
        if (this.gameOver) {
            this.updateGameOverAnimation();
            this.gameOverBackground.draw(this.ctx, this);
            this.gameOverImage.draw(this.ctx);
            return;
        }

        if (this.gameWon) {
            this.updateWinAnimation();
            this.winBackground.draw(this.ctx, this);
            this.winImage.draw(this.ctx);
        }
    }

    updateGameOverAnimation() {
        if (!this.gameOver) return;

        if (this.gameOverPhase === 1) {
            this.gameOverImage.opacity = Math.min(this.gameOverImage.opacity + 0.01, 1);
            this.gameOverImage.scale = Math.max(this.gameOverImage.scale - 0.015, 1);

            if (this.gameOverImage.scale === 1) {
                this.gameOverPhase = 2;
            }
        }
    }

  toggleSound() {
    SOUND_ENABLED = !SOUND_ENABLED;
    saveSoundState();

    if (!SOUND_ENABLED) {
        stopAllSounds();
    }
}

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
            return;
        }

        document.exitFullscreen();
    }

    updateWinAnimation() {
        if (!this.gameWon) return;

        if (this.winPhase === 1) {
            this.winImage.opacity = Math.min(this.winImage.opacity + 0.02, 1);
            this.winImage.scale = Math.max(this.winImage.scale - 0.03, 1);

            if (this.winImage.scale === 1) {
                this.winPhase = 2;
            }
        } else {
            this.winImage.opacity = Math.max(this.winImage.opacity - 0.02, 0);
        }
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

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
    }

    drawCharacter() {
        this.addToMap(this.character);
    }

    drawClouds() {
        this.addObjectsToMap(this.level.clouds);
    }

    drawEnemies() {
        this.level.enemies.forEach(enemy => {
            this.addToMap(enemy);
        });
    }

    drawThrowables() {
        this.addObjectsToMap(this.throwableObjects);
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.drawBossLifeBar();
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const oldX = mo.x;
        const oldY = mo.y;

        if (!(mo instanceof BackgroundObject)) {
            mo.x = Math.round(mo.x);
            mo.y = Math.round(mo.y);
        }

        if (mo.otherDirection) this.flipImage(mo);

        mo.draw(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);

        mo.x = oldX;
        mo.y = oldY;
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}