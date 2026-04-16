class ThrowableObject extends MovableObject {
    isBroken = false;
    markedForRemoval = false;

    /**
    * Initializes throwable bottle with images and size
    */
    constructor() {
        super();
        this.width = 50;
        this.height = 60;

        this.loadImages(Images.BOTTLE_IMAGE);
        this.loadImages(Images.BOTTLE_SPLASH);

        this.img = this.imageCache[Images.BOTTLE_IMAGE[0]];
    }

    /**
    * Starts a throw from given position with upward force
    */
    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;


        this.applyGravity();
        this.startThrowLoop();
    }

    /**
    * Starts interval loop for movement + animation
    */
    startThrowLoop() {
        this.throwInterval = setInterval(() => this.updateThrow(), 25);
    }

    /**
    * Updates bottle movement, collision and animation state
    */
    updateThrow() {
        if (this.shouldBreakOnGround()) return this.break();
        this.handleThrowState();
    }

    /**
     * Returns true if the bottle should break after hitting the ground.
     */
    shouldBreakOnGround() {
        return this.y >= 360 && !this.isBroken;
    }

    /**
     * Updates bottle movement or splash animation depending on state.
     */
    handleThrowState() {
        if (!this.isBroken) {
            this.x += 10 * this.direction;
            this.playAnimation(Images.BOTTLE_IMAGE);
        } else {
            this.playAnimation(Images.BOTTLE_SPLASH);
        }
    }

    /**
    * Plays break sound, switches to splash animation and schedules removal
    */
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