class CoinBar extends DrawableObject {

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

    setCoins(amount) {
        this.coins = amount;
    }

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

    animate() {
        setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.images.length;
            this.img = this.imageCache[this.images[this.currentFrame]];
        }, 300);
    }
}
