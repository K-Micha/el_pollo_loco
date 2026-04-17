class StartScreenRenderer {
    /**
    * Creates a renderer for the start screen.
    */
    constructor(screen) {
        this.screen = screen;
        this.canvas = screen.canvas;
        this.ctx = screen.ctx;
        this.ui = screen.ui;
    }

    /**
    * Renders the complete start screen.
    */
    draw() {
        const size = this.getCanvasSize();

        this.clearCanvas(size);
        this.drawStartScreen(size);
        this.drawPopupIfNeeded();
        this.drawUI(size.w);
    }

    /**
    * Returns current canvas dimensions.
    */
    getCanvasSize() {
        return {
            w: this.canvas.width,
            h: this.canvas.height
        };
    }

    /**
    * Clears the entire canvas.
    * @param {{w:number, h:number}} size Canvas size
    */
    clearCanvas({ w, h }) {
        this.ctx.clearRect(0, 0, w, h);
    }

    /**
    * Draws background and start button.
    */
    drawStartScreen({ w, h }) {
        this.drawBackground(w, h);

        const rect = this.screen.getStartTextRect();
        const x = rect.x + rect.width / 2;
        const y = rect.y + rect.height * 0.7;

        this.drawStartText(x, y);
    }

    /**
    * Draws popup if it is active.
    */
    drawPopupIfNeeded() {
        if (!this.screen.showInfoPopup) return;

        const { px, py, pw, ph } = this.screen.getPopupRect();
        this.ui.drawPopup(px, py, pw, ph);
    }

    /**
    * Draws the background image.
    */
    drawBackground(w, h) {
        this.ctx.drawImage(this.screen.img, 0, 0, w, h);
    }

    /**
    * Draws UI icons (info, sound, fullscreen).
    */
    drawUI(w) {
        this.drawIcon(this.screen.iconInfo, 20, 20);
        this.drawIcon(
            this.screen.isMuted ? this.screen.iconMute : this.screen.iconVolume,
            w - 140,
            20
        );
        this.drawIcon(this.screen.iconFullscreen, w - 70, 20);
    }

    /**
    * Draws a single icon.
    */
    drawIcon(img, x, y) {
        const size = 48;
        this.ctx.drawImage(img, x, y, size, size);
    }

    /**
    * Draws the start button text.
    */
    drawStartText(x, y) {
        const ctx = this.ctx;
        const text = this.getStartText();

        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.lineWidth = this.screen.isHoveringStart ? 6 : 3;
        ctx.strokeStyle = "#8b3a00";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = "#ffcc33";
        ctx.fillText(text, x, y);
    }

    /**
    * Returns start button text based on screen size.
    */
    getStartText() {
        return window.innerWidth < 910 ? "START" : "START GAME";
    }
}