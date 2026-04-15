const ICONS = {
    LEFT: ['◀', '<'],
    RIGHT: ['▶', '>'],
    JUMP: ['▲', '^'],
    THROW: ['🧴', '*']
};

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

    /**
     * Draws popup background and text
     */
    drawPopup(px, py, pw, ph) {
        this.drawPopupBackground(px, py, pw, ph);
        this.drawPopupText(px, py, pw, ph);
    }

    /**
  * Draws dimmed overlay and popup box
  */
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

    /**
    * Draws popup title and control instructions
    */
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

class TouchUi {
    constructor(world) {
        this.world = world;
        this.buttons = [];
    }

    /**
  * Updates mobile button layout based on screen size
  */
    updateButtons() {
        if (!isMobileGameControls()) {
            this.buttons = [];
            return;
        }

        const w = this.world.baseWidth;
        const h = this.world.baseHeight;
        const size = 85;
        const gap = 25;
        const bottom = h - size - 4;

        this.buttons = [
            {
                key: 'LEFT',
                x: 23,
                y: bottom,
                width: size,
                height: size,
                label: '◀'
            },
            {
                key: 'RIGHT',
                x: 23 + size + gap,
                y: bottom,
                width: size,
                height: size,
                label: '▶'
            },
            {
                key: 'JUMP',
                x: w - (size * 2 + gap) - 23,
                y: bottom,
                width: size,
                height: size,
                label: '▲'
            },
            {
                key: 'THROW',
                x: w - size - 23,
                y: bottom,
                width: size,
                height: size,
                label: '🧴'
            }
        ];
    }

    /**
    * Draws all mobile control buttons
    */
    draw(ctx) {
        if (!isMobileGameControls()) return;

        this.updateButtons();
        this.buttons.forEach(btn => this.drawButton(ctx, btn));
    }

    drawButton(ctx, btn) {
        ctx.save();

        ctx.shadowColor = 'transparent';

        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 16);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const [primary, fallback] = ICONS[btn.key];
        const icon = primary || fallback;

        ctx.fillText(
            icon,
            btn.x + btn.width / 2,
            btn.y + btn.height / 2
        );

        ctx.restore();
    }

    getButtons() {
        return this.buttons;
    }
}
