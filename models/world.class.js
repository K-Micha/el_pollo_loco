class World {
    character = new Character();
    level = lvl1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
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
            this.checkCollision();
            this.checkThrowObjects();
            this.checkBottleCollision();
        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.canThrow) {
            this.canThrow = false;

            let bottle = new ThrowableObject();
            bottle.throw(this.character.x + 100,
                this.character.y + 150);
            this.throwableObjects.push(bottle);
        }

        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

    checkBottleCollision() {
        this.throwableObjects.forEach(bottle => {
            if (bottle.isBroken) return;

            this.level.enemies.forEach(enemy => {
                if (!bottle.isColliding(enemy)) return;

                if (enemy instanceof Endboss) {
                    enemy.hit(20);
                    enemy.hurt();
                } else {
                    enemy.die();
                }

                bottle.break();
            });
        });
    }

    checkCollision() {
        this.level.enemies.forEach(enemy => {
            if (this.shouldSkipEnemy(enemy)) return;

            if (!this.character.isColliding(enemy)) return;


            if (enemy instanceof Endboss) {
                this.blockCharacter(enemy);
            }

            if (this.isStomp(enemy)) {
                enemy.die();
            } else {
                this.handleCharacterHit();
            }
        });
    }

    blockCharacter(boss) {
        const padding = 150;

        if (this.character.x + this.character.width > boss.x + padding &&
            this.character.x < boss.x + boss.width / 2) {
            this.character.x = boss.x - this.character.width + padding;
        }
    }

    isStomp(enemy) {
        const char = this.character;

        const charBottom = char.y + char.height;
        const enemyTop = enemy.y;

        const charCenter = char.x + char.width / 2;

        return (
            char.speedY < 0 &&
            charBottom >= enemyTop &&
            charBottom <= enemyTop + 40 &&
            charCenter >= enemy.x &&
            charCenter <= enemy.x + enemy.width
        );
    }

    handleCharacterHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.life);
        }
    }

    shouldSkipEnemy(enemy) {
        return enemy.isDeadEnemy;
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
