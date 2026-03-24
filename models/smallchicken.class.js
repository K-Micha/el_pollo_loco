class SmallChicken extends MovableObject {

    y = 380;
    height = 40;
    width = 60;


    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png')
        this.loadImages(Images.IMAGES_WALKING_SMAL);

        this.x = 200 + Math.random() * 1900;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (!this.isDeadEnemy) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(Images.IMAGES_WALKING_SMAL);
        }, 100);

    }
}
