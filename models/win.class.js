class WinBackground extends DrawableObject {
    isHoveringRestart = false;

    /**
     * Initializes win screen background and buttons.
     */
    constructor() {
        super();

        this.initImage();
        this.initDimensions();
        this.initButtons();
    }

    /**
    * Loads win screen image.
    */
    initImage() {
        this.loadImage('assets/img/pepe-win.png');
    }

    /**
    * Sets base dimensions.
    */
    initDimensions() {
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }

    /**
    * Initializes UI buttons.
    */
    initButtons() {
        this.restartButton = this.createRestartButton();
        this.homeButton = this.createHomeButton();
    }

    /**
    * Creates restart button config.
    */
    createRestartButton() {
        return {
            x: 720 - 200,
            y: 480 - 70,
            width: 160,
            height: 50
        };
    }

    /**
    * Creates home button config.
    */
    createHomeButton() {
        return {
            x: 20,
            y: 20,
            width: 60,
            height: 60
        };
    }

    /**
    * Draws background, stats and restart button
    */
    draw(ctx, world) {
        super.draw(ctx);
        this.drawStats(ctx, world);
        this.drawRestart(ctx);
    }

    /**
    * Draws the restart text with hover styling.
    */
    drawRestart(ctx) {
        const pos = this.getRestartPosition();

        this.updateRestartButton(pos.x, pos.y);
        this.applyRestartTextStyle(ctx);
        this.drawRestartText(ctx, pos);
    }

    /**
    * Applies font and alignment for restart button.
    */
    applyRestartTextStyle(ctx) {
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
    }

    /**
    * Draws the Restart text with styles.
    */
    drawRestartText(ctx, pos) {
        const styles = this.getRestartStyles();

        ctx.strokeStyle = styles.stroke;
        ctx.lineWidth = styles.lineWidth;
        ctx.strokeText("Restart", pos.x, pos.y);

        ctx.fillStyle = styles.fill;
        ctx.fillText("Restart", pos.x, pos.y);
    }

    /**
    * Draws the Home button text with hover styling.
    */
    drawHome(ctx) {
        const pos = this.getHomePosition();

        this.updateHomeButton(pos.x, pos.y);
        this.applyHomeTextStyle(ctx);
        this.drawHomeText(ctx, pos);
    }

    /**
    * Applies font and alignment for home button.
    */
    applyHomeTextStyle(ctx) {
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
    }

    /**
    * Draws the Home text with styles.
    */
    drawHomeText(ctx, pos) {
        const styles = this.getHomeStyles();

        ctx.strokeStyle = styles.stroke;
        ctx.lineWidth = styles.lineWidth;
        ctx.strokeText("Home", pos.x, pos.y);

        ctx.fillStyle = styles.fill;
        ctx.fillText("Home", pos.x, pos.y);
    }

    /**
    * Calculates the Home button's text center position.
    */
    getHomePosition() {
        return {
            x: this.homeButton.x + this.homeButton.width / 2,
            y: this.homeButton.y + this.homeButton.height / 2 + 10
        };
    }

    /**
    *  Updates the Home button hitbox based on the rendered text center.
    */
    updateHomeButton(x, y) {
        this.homeButton = {
            x: x - 80,
            y: y - 35,
            width: 160,
            height: 50
        };
    }

    /**
    * Mirrors Restart button styling for visual consistency.
    */
    getHomeStyles() {
        return {
            fill: this.isHoveringHome ? "#ffe066" : "#ffd700",
            stroke: this.isHoveringHome ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)",
            lineWidth: this.isHoveringHome ? 7 : 6
        };
    }

    /**
    * Returns the restart button text position.
    */
    getRestartPosition() {
        return {
            x: this.x + this.width / 2 + 150,
            y: this.y + 200 + (5 * 40) + 40
        };
    }

    /**
    * Updates the restart button hitbox based on text position.
    */
    updateRestartButton(x, y) {
        this.restartButton = {
            x: x - 80,
            y: y - 35,
            width: 160,
            height: 50
        };
    }

    /**
    * Returns fill and stroke styles depending on hover state.
    */
    getRestartStyles() {
        return {
            fill: this.isHoveringRestart ? "#ffe066" : "#ffd700",
            stroke: this.isHoveringRestart ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)",
            lineWidth: this.isHoveringRestart ? 7 : 6
        };
    }

    /**
    * Draws the rectangular restart button variant.
    */
    drawRestartButton(ctx) {
        const button = this.restartButton;
        const center = this.getButtonCenter(button);

        this.drawRestartBox(ctx, button);
        this.applyRestartButtonStyle(ctx);
        this.drawRestartLabel(ctx, center);
    }

    /**
    * Returns the text center of a button.
    */
    getButtonCenter(button) {
        return {
            x: button.x + button.width / 2,
            y: button.y + button.height / 2 + 10
        };
    }

    /**
    * Draws the restart button background box.
    */
    drawRestartBox(ctx, button) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(button.x, button.y, button.width, button.height);
    }

    /**
    * Applies the restart button text style.
    */
    applyRestartButtonStyle(ctx) {
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.font = "26px Arial";
        ctx.textAlign = "center";
    }

    /**
    * Draws the restart button label.
    */
    drawRestartLabel(ctx, center) {
        ctx.strokeText("Restart", center.x, center.y);
        ctx.fillText("Restart", center.x, center.y);
    }

    /**
    * Sets text style for stats
    */
    setTextStyle(ctx) {
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
    }

    /**
    * Returns the position where stats should be drawn.
    */
    getStatsPosition() {
        return {
            x: this.x + this.width / 2 + 150,
            y: this.y + 200
        };
    }

    /**
    * Returns all win‑screen stats as formatted text lines.
    */

    getStatsLines(world) {
        return [
            `Enemies killed: ${world.enemiesKilled}`,
            `Bosses killed: ${world.bossesKilled}`,
            `Health left: ${Math.round(world.character.life)}`,
            `Bottles left: ${world.bottlesCollected}`,
            `Coins collected: ${world.character.coins}`
        ];
    }


    /**
    * Draws all stats lines with stroke + fill
    */
    drawStats(ctx, world) {
        this.setTextStyle(ctx);

        const pos = this.getStatsPosition();
        let y = pos.y;

        for (const line of this.getStatsLines(world)) {
            ctx.strokeText(line, pos.x, y);
            ctx.fillText(line, pos.x, y);
            y += 40;
        }
    }

}


class WinImage extends DrawableObject {

    /**
    * Initializes win image with fade/scale animation props
    */
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

    /**
    * Draws win image with scaling + fade transform
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
