class SmallChicken extends MovableObject {
    y = 380;
    height = 40;
    width = 60;

    /**
     * Initializes a small chicken with random position and speed
     */
    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(Images.IMAGES_WALKING_SMAL);
        this.loadImages(Images.IMAGES_DEAD_SMAL);

        this.x = 300 + Math.random() * 1900;
        this.speed = 0.15 + Math.random() * 0.5;

        this.offset = {
            top: 15,
            right: 10,
            bottom: 25,
            left: 10
        };

        this.animate();
    }

    /**
     * Starts movement and animation loops
     */
    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 100);
    }

    handleMovement() {
        if (!this.isDeadEnemy) this.moveLeft();
    }

    /**
     * Plays walking or dead animation depending on state
     */
    handleAnimation() {
        this.playAnimation(
            this.isDeadEnemy
                ? Images.IMAGES_DEAD_SMAL
                : Images.IMAGES_WALKING_SMAL
        );
    }
}