class World {
    baseWidth = 720;
    baseHeight = 480;
    character = new Character();
    level = lvl1;
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


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setupUI();
        this.setupWinScreen();

        this.gameOverImage = new GameOverImage();
        this.gameOverBackground = new GameOverBackground();

        this.restartController = new RestartController(this, canvas);

        this.setWorld();

    }

    setupUI() {
        this.statusBar = new StatusBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
    }

    setupWinScreen() {
        this.winBackground = new WinBackground();
        this.winImage = new WinImage();
    }

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

    setWorld() {
        this.character.world = this;

        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss) {
            boss.world = this;
            boss.lifeBar = new LifeBarBoss(boss);
        }
    }

    run() {
        setInterval(() => {
            if (this.gameWon) return;
            Collision.checkEnemyCollision(this);
            this.checkThrowObjects();
            Collision.checkBottleCollision(this);
            Collision.checkCoinCollision(this);
        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.canStartThrow()) {
            this.performThrow();
        }
    }

    canStartThrow() {
        return this.keyboard.D
            && this.canThrow
            && this.bottlesCollected > 0;
    }

    performThrow() {
        this.canThrow = false;

        const dir = this.character.otherDirection ? -1 : 1;
        const offsetX = this.character.otherDirection ? -20 : 100;

        let bottle = new ThrowableObject();
        bottle.direction = dir;

        bottle.throw(
            this.character.x + offsetX,
            this.character.y + 150
        );

        this.throwableObjects.push(bottle);

        this.bottlesCollected--;

        this.bottleBar.setPercentage(
            (this.bottlesCollected / this.totalBottles) * 100
        );

        this.bottleBar.setBottles(
            this.bottlesCollected,
            this.totalBottles
        );

        setTimeout(() => this.canThrow = true, 600);
    }


    resetThrowState() {
        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

    checkBottlePickup() {
        this.level.bottles = this.level.bottles.filter(bottle => {
            if (bottle.isColliding(this.character)) {
                this.collectBottle(bottle);
                return false;
            }
            return true;
        });
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

    draw() {
        this.tickEnemies();
        this.cleanupObjects();
        this.clearCanvas();

        const rect = this.canvas.getBoundingClientRect();

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

        this.drawBackground();
        this.drawCharacter();
        this.drawClouds();
        this.drawEnemies();
        this.checkBottlePickup();
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.drawThrowables();
        this.coinBar.setCoins(this.character.coins || 0);

        this.ctx.translate(-this.camera_x, 0);

        this.drawUI();
        this.drawGameStates();

        this.ctx.restore();

        requestAnimationFrame(() => this.draw());
    }

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
            this.gameOverImage.opacity = Math.min
                (this.gameOverImage.opacity + 0.01, 1);
            this.gameOverImage.scale = Math.max
                (this.gameOverImage.scale - 0.015, 1);

            if (this.gameOverImage.scale === 1) {
                this.gameOverPhase = 2;
            }
        }
    }

    updateWinAnimation() {
        if (!this.gameWon) return;

        if (this.winPhase === 1) {
            this.winImage.opacity = Math.min(this.winImage.opacity + 0.02, 1);
            this.winImage.scale = Math.max(this.winImage.scale - 0.03, 1);

            if (this.winImage.scale === 1)
                this.winPhase = 2;
        }

        else {
            this.winImage.opacity = Math.max(this.winImage.opacity - 0.02, 0);
        }
    }

    cleanupObjects() {
        this.level.enemies.forEach(enemy => {
            if (enemy.markedForRemoval) {

                if (!(enemy instanceof Endboss)) {
                    this.enemiesKilled++;
                }
                if (enemy instanceof Endboss) {
                    this.bossesKilled++;
                }
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

            if (enemy.lifeBar) {
                this.addToMap(enemy.lifeBar);
            }
        });
    }

    drawThrowables() {
        this.addObjectsToMap(this.throwableObjects);
    }

    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);

    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        /* mo.drawBorder(this.ctx); */

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
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
