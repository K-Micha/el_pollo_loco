class GameOverBackground {
    constructor() {
        this.layers = [
            new BackgroundObject('assets/img/5_background/layers/air.png', 0),
            new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0)
        ];

        this.restartButton = { x: 0, y: 0, width: 160, height: 50 };
        this.isHoveringRestart = false;
    }

     /**
     * Draws background layers and restart button when active
     */
    draw(ctx, world) {
        this.layers.forEach(l => l.draw(ctx));

        if (world.gameOverPhase >= 2) {
            this.drawRestart(ctx);
        }
    }

     /**
     * Draws the restart button with hover styling
     */
    drawRestart(ctx) {
        const x = 360;
        const y = 480 / 2 + 120;

        this.restartButton = { x: x - 80, y: y - 25, width: 160, height: 50 };

        ctx.font = "28px Arial";
        ctx.textAlign = "center";

        ctx.lineWidth = this.isHoveringRestart ? 7 : 6;
        ctx.strokeStyle = this.isHoveringRestart ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)";
        ctx.fillStyle = this.isHoveringRestart ? "#ffe066" : "#ffd700";

        ctx.strokeText("Restart", x, y);
        ctx.fillText("Restart", x, y);
    }
}

    /**
     * Loads and centers the game‑over image with fade/scale props
     */
class GameOverImage extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/You won, you lost/Game Over.png');

        this.width = 400;
        this.height = 200; 0

        this.x = (720 - this.width) / 2;
        this.y = (480 - this.height) / 2;

        this.opacity = 0;
        this.scale = 3;
    }

      /**
     * Draws the image with scaling and fade‑in transform
     */
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
