class Chicken extends MovableObject {

    y = 360;
    height = 60;
    width = 80;

    constructor() {
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.loadImages(Images.IMAGES_WALKING);

        this.x = 200 + Math.random() * 1900;
        this.speed = 0.15 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(Images.IMAGES_WALKING);
        }, 100);

    }
}
