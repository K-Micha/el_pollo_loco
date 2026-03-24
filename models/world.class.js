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
        }, 200);
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

    setTimeout(() => {
        this.throwableObjects = this.throwableObjects.filter(obj => obj !== bottle);
    }, 300);
}

        });
    });
}

    checkCollision() {
        this.level.enemies.forEach((enemy) => {
            let isNormalHit = this.character.isColliding(enemy);
            let isTopHit = this.character.isCollidingTop(enemy);

            if (isNormalHit && isTopHit && this.character.speedY < 0) {
                enemy.die();
            } else if (isNormalHit) {
                if (!this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.life);
                }
            }
        });
    }

    isTopHit(enemy) {
        let charBottom = this.character.y + this.character.height - 10; // Füße
        let enemyTop = enemy.y;

        let isFalling = this.character.speedY < 0;

        return isFalling && charBottom < enemyTop + 30;
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
