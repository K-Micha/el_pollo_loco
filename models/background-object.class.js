class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

      /**
     * Loads the background image and positions it at the given x‑coordinate.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}