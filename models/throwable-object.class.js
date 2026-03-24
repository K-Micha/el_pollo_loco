class ThrowableObject extends MovableObject {
    isBroken = false;
    markedForRemoval = false;

    constructor() {
        super();
        this.width = 50;
        this.height = 60;
        this.throw();
        this.loadImages(Images.BOTTLE_IMAGE);
        this.loadImages(Images.BOTTLE_SPLASH);
        this.img = this.imageCache[Images.BOTTLE_IMAGE[0]];
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();

        setInterval(() => {
            if (this.y >= 360) {
                this.y = 360;
                this.break();
            }

            if (!this.isBroken) {
                this.x += 10;
                this.playAnimation(Images.BOTTLE_IMAGE);
            } else {
                this.playAnimation(Images.BOTTLE_SPLASH);
            }
        }, 25);
    }

    break() {
        this.isBroken = true;

        this.loadImages(Images.BOTTLE_SPLASH);

        this.playAnimation(Images.BOTTLE_SPLASH);

        this.speedX = 0;
        this.speedY = 0;

        setTimeout(() => {
            this.markedForRemoval = true;
        }, 200);
    }

}