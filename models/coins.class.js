class Coin extends MovableObject {
    y = 500;
    height = 100;
    width = 100;

    /**
     * Creates a coin at the given position
     */
    constructor(x, y) {
        super().loadImage('assets/img/8_coin/coin_1.png');
        this.loadImages(Images.COIN_ANIM);

        this.x = x;
        if (y !== undefined) this.y = y;

        this.animate();
    }

      /**
     * Plays coin animation frames
     */
    animate() {
        setInterval(() => this.handleAnimation(), 100);
    }

    handleAnimation() {
        this.playAnimation(Images.COIN_ANIM);
    }

     /**
     * Checks collision using reduced hitbox
     */
    isColliding(mo) {
        return this.x + 30 < mo.x + mo.width &&
            this.x + 30 + 40 > mo.x &&
            this.y + 30 < mo.y + mo.height &&
            this.y + 30 + 40 > mo.y;
    }

    drawBorder(ctx) {
        const hit = {
            x: this.x + 30,
            y: this.y + 30,
            width: 40,
            height: 40
        };

        ctx.strokeRect(hit.x, hit.y, hit.width, hit.height);
    }
}