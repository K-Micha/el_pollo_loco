class WinBackground extends DrawableObject {
    isHoveringRestart = false;

    /**
     * Initializes win screen background and restart button
     */
    constructor() {
        super();
        this.loadImage('assets/img/pepe-win.png');
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;

        this.restartButton = {
            x: 720 - 200,
            y: 480 - 70,
            width: 160,
            height: 50
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

    drawRestart(ctx) {
        ctx.font = "28px Arial";
        ctx.textAlign = "center";

        const x = this.x + this.width / 2 + 150;
        const y = this.y + 200 + (5 * 40) + 40;

        this.restartButton = {
            x: x - 80,
            y: y - 35,
            width: 160,
            height: 50
        };

        const fill = this.isHoveringRestart ? "#ffe066" : "#ffd700";
        const stroke = this.isHoveringRestart ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)";
        const lineWidth = this.isHoveringRestart ? 7 : 6;

        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.strokeText("Restart", x, y);

        ctx.fillStyle = fill;
        ctx.fillText("Restart", x, y);
    }

    getStatsLines(world) {
        return [
            `Enemies killed: ${world.character.enemiesKilled}`,
            `Bosses killed: ${world.character.bossesKilled}`,
            `Health left: ${world.character.life}`,
            `Bottles left: ${world.bottlesCollected}`,
            `Coins collected: ${world.character.coins}`
        ];
    }

    drawRestartButton(ctx) {
        const b = this.restartButton;

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(b.x, b.y, b.width, b.height);

        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.font = "26px Arial";
        ctx.textAlign = "center";

        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2 + 10;

        ctx.strokeText("Restart", cx, cy);
        ctx.fillText("Restart", cx, cy);
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

    getStatsPosition() {
        return {
            x: this.x + this.width / 2 + 150,
            y: this.y + 200
        };
    }

    getStatsLines(world) {
        return [
            `Enemies killed: ${world.enemiesKilled}`,
            `Bosses killed: ${world.bossesKilled}`,
            `Health left: ${world.character.life}`,
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
