const ICONS = {
    LEFT: ['◀', '<'],
    RIGHT: ['▶', '>'],
    JUMP: ['▲', '^'],
    THROW: ['🧴', '*']
};

class UI {
    /**
    * Creates a renderer with canvas and context references.
    */
    constructor(ctx, canvas, world) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.world = world;
    }

    drawHUD() {
        this.world.addToMap(this.world.statusBar);
        this.world.addToMap(this.world.coinBar);
        this.world.addToMap(this.world.bottleBar);
        this.drawBossLifeBar();
    }

    /**
    * Creates a rounded rectangle path.
    */
    roundedPath(x, y, w, h, r) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    /**
    * Draws a filled rounded rectangle.
    */
    roundedRect(x, y, w, h, r, fillStyle) {
        const ctx = this.ctx;
        ctx.fillStyle = fillStyle;
        this.roundedPath(x, y, w, h, r);
        ctx.fill();
    }

    /**
    *  Applies title text styling.
    */
    setTitleStyle() {
        const ctx = this.ctx;
        ctx.fillStyle = "#4a2500";
        ctx.font = "30px Arial";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";
    }

    /**
    * Applies body text styling.
    */
    setBodyStyle() {
        const ctx = this.ctx;
        ctx.fillStyle = "#3a1a00";
        ctx.font = "20px Arial";
        ctx.shadowBlur = 3;
        ctx.textAlign = "center";
    }

    /**
    * Draws popup background and text
    */
    drawPopup(px, py, pw, ph) {
        this.drawPopupBackground(px, py, pw, ph);
        this.drawPopupText(px, py, pw, ph);
    }

    /**
    * Draws dimmed overlay and popup box.
    */
    drawPopupBackground(px, py, pw, ph) {
        this.drawPopupOverlay();
        this.drawPopupPanel(px, py, pw, ph);
        this.drawPopupBorder(px, py, pw, ph);
    }

    /**
    * Draws the dark popup overlay.
    */
    drawPopupOverlay() {
        const ctx = this.ctx;

        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
    * Draws the popup panel with gradient and shadow.
    */
    drawPopupPanel(px, py, pw, ph) {
        const ctx = this.ctx;
        const gradient = this.createPopupGradient(px, py, ph);

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 22;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;
        this.roundedRect(px, py, pw, ph, 18, gradient);
        ctx.restore();
    }

    /**
    * Creates the popup background gradient.
    */
    createPopupGradient(px, py, ph) {
        const gradient = this.ctx.createLinearGradient(px, py, px, py + ph);

        gradient.addColorStop(0, "rgba(255, 200, 80, 0.95)");
        gradient.addColorStop(1, "rgba(230, 140, 40, 0.95)");
        return gradient;
    }

    /**
    * Draws the popup border.
    */
    drawPopupBorder(px, py, pw, ph) {
        const ctx = this.ctx;

        ctx.strokeStyle = "rgba(120, 60, 0, 0.35)";
        ctx.lineWidth = 3;
        ctx.strokeRect(px, py, pw, ph);
    }

    /**
    * Draws popup title and control instructions.
    */
    drawPopupText(px, py) {
        const centerX = this.canvas.width / 2;

        this.drawPopupTitle(centerX, py);
        this.drawPopupControls(centerX, py);
    }

    /**
    * Draws popup title.
    */
    drawPopupTitle(centerX, py) {
        this.setTitleStyle();
        this.ctx.fillText("Controls", centerX, py + 70);
    }

    /**
    * Draws control instructions list.
    */
    drawPopupControls(centerX, py) {
        this.setBodyStyle();

        const lines = this.getControlLines();
        let y = py + 130;

        for (const line of lines) {
            this.ctx.fillText(line, centerX, y);
            y += 35;
        }
    }

    /**
    * Returns control instruction lines.
    */
    getControlLines() {
        return [
            "Move Right:   →  Arrow Key",
            "Move Left:    ←  Arrow Key",
            "Jump:         ↑  Arrow Key",
            "Throw:        D Key"
        ];
    }

    /**
    *  Draws the boss life bar if the boss is visible.
    */
    drawBossLifeBar() {
        const boss = this.world.level.enemies.find(e => e instanceof Endboss);

        if (!boss || !boss.lifeBar) return;
        if (!boss.lifeBar.isBossVisible()) return;

        boss.lifeBar.draw(this.ctx);
    }
}
