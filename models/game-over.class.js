class GameOverBackground {
    /**
    * Initializes background and button states.
    */
    constructor() {
        this.layers = Images.IMAGES_GAMEOVER_BG.map(path =>
            new BackgroundObject(path, 0)
        );

        this.restartButton = { x: 0, y: 0, width: 160, height: 50 };
        this.homeButton = { x: 0, y: 0, width: 100, height: 50 };

        this.isHoveringRestart = false;
        this.isHoveringHome = false;
    }

    /**
    * Draws background and buttons.
    */
    draw(ctx, world) {
        this.layers.forEach(layer => layer.draw(ctx));

        if (world.gameOverPhase < 2) return;

        this.drawRestart(ctx);
        this.drawHome(ctx);
    }

    /**
    * Draws the restart button.
    */
    drawRestart(ctx) {
        const { x, y } = this.getRestartPosition();
        this.setRestartButton(x, y);
        this.drawRestartText(ctx, x, y);
    }

    /**
    * Returns restart button position.
    */
    getRestartPosition() {
        return {
            x: 360,
            y: 240 + 120
        };
    }

    /**
    * Updates restart button hitbox.
    */
    setRestartButton(x, y) {
        this.restartButton = {
            x: x - 80,
            y: y - 25,
            width: 160,
            height: 50
        };
    }

    /**
    * Draws restart button text.
    */
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

    /**
    * Draws the home button.
    */
    drawHome(ctx) {
        const { x, y } = this.getHomePosition();
        this.setHomeButton(x, y);
        this.drawHomeText(ctx, x, y);
    }

    /**
    * Returns home button position.
    */
    getHomePosition() {
        return {
            x: 60,
            y: 55
        };
    }

    /**
    * Updates home button hitbox.
    */
    setHomeButton(x, y) {
        this.homeButton = {
            x: x - 50,
            y: y - 25,
            width: 100,
            height: 50
        };
    }

    /**
    * Draws home button text.
    */
    drawHomeText(ctx, x, y) {
        const hover = this.isHoveringHome;

        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.lineWidth = hover ? 7 : 6;
        ctx.strokeStyle = hover ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)";
        ctx.fillStyle = hover ? "#ffe066" : "#ffd700";

        ctx.strokeText("Home", x, y);
        ctx.fillText("Home", x, y);
    }
}

class GameOverImage extends DrawableObject {
    constructor() {
        super();
        this.loadImage('assets/img/You won, you lost/Game Over.png');

        this.width = 400;
        this.height = 200;

        this.x = (720 - this.width) / 2;
        this.y = (480 - this.height) / 2;

        this.opacity = 0;
        this.scale = 3;
    }

    /**
    * Draws image with fade and scale.
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