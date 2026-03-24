class Endboss extends MovableObject {
    y = 110;
    height = 340;
    width = 240;
    life = 100;

    hit(dmg) {
        this.life -= dmg;

        if (this.life <= 0) {
            this.life = 0;
            this.isDeadEnemy = true;
            this.removeAfterDelay();
        }
    }

    constructor() {
        super();
        this.loadImage(Images.IMAGES_BOSS[0]);
        this.loadImages(Images.IMAGES_BOSS);
        this.x = 2500;
        this.animate();
    }

    animate() {

        setInterval(() => {
            this.playAnimation(Images.IMAGES_BOSS);
        }, 100);
    }
}