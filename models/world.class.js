class World {
    character = new Character();
    level = lvl1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    bottlesCollected = 0;
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    throwableObjects = [];
    canThrow = true;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    tickEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isChicken) {
                enemy.checkCrowding?.(this.level.enemies);
            }
        });
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

        this.resetThrowState();
    }

    canStartThrow() {
        return this.keyboard.D
            && this.canThrow
            && this.bottlesCollected > 0;
    }

    performThrow() {
        this.canThrow = false;

        let bottle = new ThrowableObject();
        bottle.throw(
            this.character.x + 100,
            this.character.y + 150
        );
        this.throwableObjects.push(bottle);

        this.bottlesCollected--;
        this.bottleBar.setPercentage(this.bottlesCollected * 20);
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
        this.bottlesCollected++;
        this.bottleBar.setPercentage(this.bottlesCollected * 20);
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

        requestAnimationFrame(() => this.draw());
    }

    cleanupObjects() {
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
        mo.drawBorder(this.ctx);

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
