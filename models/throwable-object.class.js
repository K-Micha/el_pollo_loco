class ThrowableObject extends MovableObject {
    isBroken = false;
    markedForRemoval = false;

    constructor() {
        super();
        this.width = 50;
        this.height = 60;

        this.loadImages(Images.BOTTLE_IMAGE);
        this.loadImages(Images.BOTTLE_SPLASH);

        this.img = this.imageCache[Images.BOTTLE_IMAGE[0]];
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        

        this.applyGravity();
        this.startThrowLoop();
    }

    startThrowLoop() {
        this.throwInterval = setInterval(() => this.updateThrow(), 25);
    }

    updateThrow() {

        if (this.y >= 360 && !this.isBroken) {
            this.y = 360;
            this.break();
            return;
        }

        if (!this.isBroken) {
            this.x += 10 * this.direction;
            this.playAnimation(Images.BOTTLE_IMAGE);
        }

        else {
            this.playAnimation(Images.BOTTLE_SPLASH);
        }
    }

    break() {
        SOUNDS.break.play();

        this.isBroken = true;
        this.speedX = 0;
        this.speedY = 0;

        setTimeout(() => {
            this.markedForRemoval = true;
            clearInterval(this.throwInterval);
        }, 200);
    }
}