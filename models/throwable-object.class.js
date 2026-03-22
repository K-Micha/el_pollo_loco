class ThrowableObject extends MovableObject {

    constructor() {
        super();
        this.width = 50;
        this.height = 60;
        this.throw();
        this.loadImages(Images.BOTTLE_IMAGE);
        this.img = this.imageCache[Images.BOTTLE_IMAGE[0]];
    }
    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
            this.playAnimation(Images.BOTTLE_IMAGE);
        }, 25);
    }
}