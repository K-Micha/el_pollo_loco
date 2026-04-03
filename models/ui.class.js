class UI {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

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

    roundedRect(x, y, w, h, r, fillStyle) {
        const ctx = this.ctx;
        ctx.fillStyle = fillStyle;
        this.roundedPath(x, y, w, h, r);
        ctx.fill();
    }

    setTitleStyle() {
        const ctx = this.ctx;
        ctx.fillStyle = "#4a2500";
        ctx.font = "30px Arial";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";
    }

    setBodyStyle() {
        const ctx = this.ctx;
        ctx.fillStyle = "#3a1a00";
        ctx.font = "20px Arial";
        ctx.shadowBlur = 3;
        ctx.textAlign = "center";
    }

    drawPopup(px, py, pw, ph) {
        this.drawPopupBackground(px, py, pw, ph);
        this.drawPopupText(px, py, pw, ph);
    }

    drawPopupBackground(px, py, pw, ph) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 22;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;

        const gradient = ctx.createLinearGradient(px, py, px, py + ph);
        gradient.addColorStop(0, "rgba(255, 200, 80, 0.95)");
        gradient.addColorStop(1, "rgba(230, 140, 40, 0.95)");

        this.roundedRect(px, py, pw, ph, 18, gradient);
        ctx.restore();

        ctx.strokeStyle = "rgba(120, 60, 0, 0.35)";
        ctx.lineWidth = 3;
        ctx.strokeRect(px, py, pw, ph);
    }

    drawPopupText(px, py, pw, ph) {
        const ctx = this.ctx;
        const w = this.canvas.width;

        this.setTitleStyle();
        ctx.fillText("Controls", w / 2, py + 70);

        this.setBodyStyle();
        const lines = [
            "Move Right:   →  Arrow Key",
            "Move Left:    ←  Arrow Key",
            "Jump:         ↑  Arrow Key",
            "Throw:        D Key"
        ];

        let y = py + 130;
        for (const line of lines) {
            ctx.fillText(line, w / 2, y);
            y += 35;
        }
    }
}