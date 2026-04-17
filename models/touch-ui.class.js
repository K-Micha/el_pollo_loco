class TouchUi {
    constructor(world) {
        this.world = world;
        this.buttons = [];
    }

    /**
    * Updates mobile button layout based on screen size.
    */
    updateButtons() {
        if (!isMobileGameControls()) {
            this.buttons = [];
            return;
        }

        const layout = this.getButtonLayout();
        this.buttons = this.createButtons(layout);
    }

    /**
    * Returns base layout values.
    */
    getButtonLayout() {
        const w = this.world.baseWidth;
        const h = this.world.baseHeight;
        const size = 85;
        const gap = 25;

        return {
            w,
            size,
            gap,
            bottom: h - size - 4
        };
    }

    /**
    * Creates all control buttons.
    */
    createButtons(layout) {
        return [
            this.createLeftButton(layout),
            this.createRightButton(layout),
            this.createJumpButton(layout),
            this.createThrowButton(layout)
        ];
    }

    /**
    * Creates LEFT button.
    */
    createLeftButton({ size, bottom }) {
        return {
            key: 'LEFT',
            x: 23,
            y: bottom,
            width: size,
            height: size,
            label: '◀'
        };
    }

    /**
    * Creates RIGHT button.
    */
    createRightButton({ size, gap, bottom }) {
        return {
            key: 'RIGHT',
            x: 23 + size + gap,
            y: bottom,
            width: size,
            height: size,
            label: '▶'
        };
    }

    /**
    * Creates JUMP button.
    */
    createJumpButton({ w, size, gap, bottom }) {
        return {
            key: 'JUMP',
            x: w - (size * 2 + gap) - 23,
            y: bottom,
            width: size,
            height: size,
            label: '▲'
        };
    }

    /**
    * Creates THROW button.
    */
    createThrowButton({ w, size, bottom }) {
        return {
            key: 'THROW',
            x: w - size - 23,
            y: bottom,
            width: size,
            height: size,
            label: '🧴'
        };
    }

    /**
    * Draws all mobile control buttons
    */
    draw(ctx) {
        if (!isMobileGameControls()) return;

        this.updateButtons();
        this.buttons.forEach(btn => this.drawButton(ctx, btn));
    }

    /**
    * Draws a rounded icon button with its assigned symbol.
    */
    drawButton(ctx, btn) {
        ctx.save();

        this.drawButtonShape(ctx, btn);
        this.applyButtonTextStyle(ctx);
        this.drawButtonIcon(ctx, btn);

        ctx.restore();
    }

    /**
    * Draws button shape (border + fill).
    */
    drawButtonShape(ctx, btn) {
        ctx.shadowColor = 'transparent';

        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 16);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
    }

    /**
    * Applies icon text style.
    */
    applyButtonTextStyle(ctx) {
        ctx.fillStyle = '#fff';
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    /**
    * Draws the button icon.
    */
    drawButtonIcon(ctx, btn) {
        const [primary, fallback] = ICONS[btn.key];
        const icon = primary || fallback;

        const x = btn.x + btn.width / 2;
        const y = btn.y + btn.height / 2;

        ctx.fillText(icon, x, y);
    }

    /**
    * Returns the list of interactive buttons.
    */
    getButtons() {
        return this.buttons;
    }
}
