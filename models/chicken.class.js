class ChickenBase extends MovableObject {

    /**
     * Initializes the chicken with config values and animations.
     * @param {Object} config Chicken configuration.
     */
    constructor(config) {
        super().loadImage(config.startImage);

        this.loadAnimationImages(config);
        this.applyConfig(config);
        this.animate();
    }

    /**
    * Loads all animation images.
    */
    loadAnimationImages(config) {
        this.loadImages(config.walkImages);
        this.loadImages(config.deadImages);
    }

    /**
    * Applies config values to the chicken.
    */
    applyConfig(config) {
        this.x = this.getRandomStartX();
        this.speed = this.getRandomSpeed(config);
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.offset = config.offset;
        this.walkImages = config.walkImages;
        this.deadImages = config.deadImages;
    }

    /**
    * Returns a random start position.
    */
    getRandomStartX() {
        return 300 + Math.random() * 1900;
    }

    /**
    * Returns a random speed based on config.
    */
    getRandomSpeed(config) {
        return config.minSpeed + Math.random() * config.speedRange;
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

            offset: { top: 10, right: 5, bottom: 25, left: 5 }
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

            offset: { top: 8, right: 4, bottom: 18, left: 4 }
        });
    }
}
