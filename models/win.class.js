class WinBackground extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/pepe-win.png');
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}

class WinImage extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/You won, you lost/You won A.png');
        this.width = 400;
        this.height = 200;

        this.x = (720 - this.width) / 2;
        this.y = (480 - this.height) / 2;

        this.opacity = 0;
        this.scale = 3;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

        super.draw(ctx);

        ctx.restore();
        ctx.globalAlpha = 1;
    }
}
