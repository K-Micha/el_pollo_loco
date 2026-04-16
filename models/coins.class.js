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

    /**
     * Updates the coin animation.
     */
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

    /**
     * Draws the coin's hitbox for debugging.
     */
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

class CoinBar extends DrawableObject {

    /**
     * Initializes the coin UI bar
     */
    constructor() {
        super();

        this.images = Images.COIN_BAR;
        this.loadImages(this.images);

        this.x = 240;
        this.y = -20;
        this.width = 120;
        this.height = 120;

        this.currentFrame = 0;
        this.img = this.imageCache[this.images[0]];

        this.animate();
    }

    /**
     * Updates the displayed coin amount.
     */
    setCoins(amount) {
        this.coins = amount;
    }

    /**
   * Draws the coin bar and its text
   */
    draw(ctx) {
        super.draw(ctx);

        ctx.font = "32px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const textX = this.x + this.width - 30;
        const textY = this.y + this.height / 2;

        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;

        ctx.fillText(`${this.coins}/10`, textX, textY);
        ctx.shadowBlur = 0;
    }

    /**
     * Animates the coin icon by cycling frames
     */
    animate() {
        setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.images.length;
            this.img = this.imageCache[this.images[this.currentFrame]];
        }, 300);
    }
}
