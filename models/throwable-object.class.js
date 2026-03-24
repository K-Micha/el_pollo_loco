class ThrowableObject extends MovableObject {
    isBroken = false;

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
        this.x += 10;

        if (this.isBroken) {
            this.playAnimation(Images.BOTTLE_SPLASH);
        } else {
            this.playAnimation(Images.BOTTLE_IMAGE);
        }

    }, 25);
}

    break() {
    this.isBroken = true;

    // Splash-Bilder laden
    this.loadImages(Images.BOTTLE_SPLASH);

    // Splash anzeigen
    this.playAnimation(Images.BOTTLE_SPLASH);

    // Bewegung stoppen
    this.speedX = 0;
    this.speedY = 0;
}

}