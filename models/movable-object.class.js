class MovableObject extends DrawableObject {
    height = 150;
    width = 100;
    speed = 0.15;
    speedY = 0;
    coins = 0;
    acceleration = 2.5;
    otherDirection = false;
    life = 100;
    lastHit = 0;
    isDeadEnemy = false;
    walkingSoundPlaying = false;

    /**
    * Applies gravity and vertical movement over time
    */
    applyGravity() {
        setInterval(() => {
            if (this.world?.isPaused) return;

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (!this.isAboveGround() && this.speedY < 0) {
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }

    /**
    * Prevents chickens from overlapping by slowing them down
    */
    checkCrowding(enemies) {
        if (!this.isChicken) return;

        const tooClose = enemies.some(other =>
            other !== this &&
            other.isChicken &&
            Math.abs(other.x - this.x) < 80
        );

        if (tooClose) {
            this.speed = 0.5;
        }
    }

    /**
    * Marks the enemy as dead and schedules removal.
    */
    die() {
        if (!this.isDeadEnemy) {
            this.isDeadEnemy = true;
            this.speed = 0;
            this.removeAfterDelay();
        }
    }

    /**
    * Removes object after a short delay
    */
    removeAfterDelay() {
        setTimeout(() => {
            this.markedForRemoval = true;
        }, 500);
    }

    /**
    * Returns true if object is above ground level.
    */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 155;
        }
    }

    /**
    * Checks collision using optional offsets (safe for all objects).
    */
    isColliding(mo) {
        const a = this.offset || { top: 0, right: 0, bottom: 0, left: 0 };
        const b = mo.offset || { top: 0, right: 0, bottom: 0, left: 0 };

        return (
            this.x + this.width - a.right > mo.x + b.left &&
            this.x + a.left < mo.x + mo.width - b.right &&
            this.y + this.height - a.bottom > mo.y + b.top &&
            this.y + a.top < mo.y + mo.height - b.bottom
        );
    }

    /**
    * Applies damage and triggers game over if life reaches zero
    */
    hit(damage = 10) {
        this.life -= damage;

        if (this.life <= 0) {
            this.life = 0;
            this.world.gameOver = true;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
    * Returns true if recently hit.
    */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
    * Returns true if life is zero.
    */
    isDead() {
        return this.life == 0;
    }

    /**
    * Moves object to the right.
    */
    moveRight() {
        if (this.world?.isPaused) return;
        this.x += this.speed;
    }

    /**
    * Moves object to the left.
    */
    moveLeft() {
        if (this.world?.isPaused) return;
        this.x -= this.speed;
    }

    /**
    * Plays next frame of an animation sequence
    */
    playAnimation(images) {
        if (this.world?.isPaused) return;

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
    * Triggers a jump by setting vertical speed.
    */
    jump() {
        this.speedY = 30;
    }
}
