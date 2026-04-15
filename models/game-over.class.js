class GameOverBackground {
    constructor() {
        this.layers = Images.IMAGES_GAMEOVER_BG.map(path =>
            new BackgroundObject(path, 0)
        );

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
        const { x, y } = this.getRestartPosition();
        this.setRestartButton(x, y);
        this.drawRestartText(ctx, x, y);
    }

    getRestartPosition() {
        return {
            x: 360,
            y: 240 + 120
        };
    }

    setRestartButton(x, y) {
        this.restartButton = {
            x: x - 80,
            y: y - 25,
            width: 160,
            height: 50
        };
    }

    drawRestartText(ctx, x, y) {
        const hover = this.isHoveringRestart;

        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.lineWidth = hover ? 7 : 6;
        ctx.strokeStyle = hover ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)";
        ctx.fillStyle = hover ? "#ffe066" : "#ffd700";

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
