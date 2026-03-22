class Endboss extends MovableObject {

    y = 110;
    height = 340;
    width = 240;


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