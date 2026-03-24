class World {
    character = new Character();
    level = lvl1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollision();
            this.checkThrowObjects();
            this.checkBottleCollision();
            this.throwableObjects = this.throwableObjects.filter(obj => !obj.markedForRemoval);
        }, 1000 / 60); // 60 FPS
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject();
            bottle.throw(this.character.x + 100, this.character.y + 100);

            this.throwableObjects.push(bottle);
        }
    }

    checkBottleCollision() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {

                if (!bottle.isBroken && bottle.isColliding(enemy)) {
                    enemy.die();
                    bottle.break();
                }

            });
        });
    }

 checkCollision() {
    this.level.enemies.forEach((enemy) => {

        if (enemy.isDeadEnemy) return;

        const isNormalHit = this.character.isColliding(enemy);
        if (!isNormalHit) return;

        const charBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y;

        // --- HORIZONTALE STOMP-BREITE ---
        const charCenter = this.character.x + this.character.width / 2;
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;

        // Wie breit darf der Stomp-Bereich sein? (60% der Gegnerbreite)
        const stompWidth = enemy.width * 0.8;
        const stompLeft = enemyLeft + (enemy.width - stompWidth) / 2;
        const stompRight = enemyRight - (enemy.width - stompWidth) / 2;

        // --- STOMP-CHECK ---
        const stomp =
            this.character.speedY < 0 &&
            charBottom >= enemyTop &&
            charBottom <= enemyTop + 40 &&
            charCenter >= stompLeft &&
            charCenter <= stompRight;

        if (stomp) {
            enemy.die();
        } else {
            if (!this.character.isHurt()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.life);
            }
        }
    });
}


    randomEnemy() {
        let types = [Chicken, SmallChicken];
        let Type = types[Math.floor(Math.random() * types.length)];
        return new Type();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBar);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();

        });
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
