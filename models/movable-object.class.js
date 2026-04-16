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
    * Checks basic AABB collision with another object.
    */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;

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
