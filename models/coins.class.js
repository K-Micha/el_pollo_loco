class Coin extends MovableObject {
    y = 500;
    height = 100;
    width = 100;

    constructor(x, y) {
        super().loadImage('assets/img/8_coin/coin_1.png');
        this.loadImages(Images.COIN_ANIM);

        this.x = x;
        if (y !== undefined) this.y = y;

        this.animate();
    }

    animate() {
        setInterval(() => this.handleAnimation(), 100);
    }

    handleAnimation() {
        this.playAnimation(Images.COIN_ANIM);
    }

    drawBorder(ctx) {
        const hit = {
            x: this.x + 30,
            y: this.y + 30,
            width: 40,
            height: 40
        };

       /*  ctx.strokeStyle = 'yellow'; */
        ctx.strokeRect(hit.x, hit.y, hit.width, hit.height);
    }
}
