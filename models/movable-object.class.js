class MovableObject extends DrawableObject {
    height = 150;
    width = 100;
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    life = 100;
    lastHit = 0;
    isDeadEnemy = false;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (!this.isAboveGround() && this.speedY < 0) {
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }


    die() {
        if (!this.isDeadEnemy) {
            this.isDeadEnemy = true;
            this.speed = 0;
            this.removeAfterDelay();
        }
    }

    removeAfterDelay() {
        setTimeout(() => {
            this.markedForRemoval = true;
        }, 500);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 155;
        }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;

    }


    hit() {
        this.life -= 5;
        if (this.life < 0) {
            this.life = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    isDead() {
        return this.life == 0;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;

    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 30;
    }
}
