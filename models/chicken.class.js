class ChickenBase extends MovableObject {

    /**
     * Initializes the chicken with config values and animations.
     * @param config 
     */
    constructor(config) {
        super().loadImage(config.startImage);

        this.loadImages(config.walkImages);
        this.loadImages(config.deadImages);

        this.x = 300 + Math.random() * 1900;
        this.speed = config.minSpeed + Math.random() * config.speedRange;

        this.y = config.y;
        this.width = config.width;
        this.height = config.height;

        this.offset = config.offset;

        this.walkImages = config.walkImages;
        this.deadImages = config.deadImages;

        this.animate();
    }

    /**
     * Starts movement and animation intervals.
     */
    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 100);
    }

    /**
     * Handles leftward movement while alive.
     */
    handleMovement() {
        if (!this.isDeadEnemy) this.moveLeft();
    }

    /**
     *  Plays walking or dead animation depending on state.
     */
    handleAnimation() {
        this.playAnimation(
            this.isDeadEnemy ? this.deadImages : this.walkImages
        );
    }
}

class Chicken extends ChickenBase {
    constructor() {
        super({
            startImage: 'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            walkImages: Images.IMAGES_WALKING,
            deadImages: Images.IMAGES_DEAD_CHICKEN,

            y: 360,
            width: 80,
            height: 60,

            minSpeed: 0.15,
            speedRange: 0.4,

            offset: { top: 15, right: 12, bottom: 40, left: 12 }
        });
    }
}

class SmallChicken extends ChickenBase {
    /**
     * Smaller chicken enemy with faster movement and reduced size.
     */
    constructor() {
        super({
            startImage: 'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            walkImages: Images.IMAGES_WALKING_SMAL,
            deadImages: Images.IMAGES_DEAD_SMAL,

            y: 380,
            width: 60,
            height: 40,

            minSpeed: 0.15,
            speedRange: 0.5,

            offset: { top: 10, right: 10, bottom: 25, left: 10 }
        });
    }
}
