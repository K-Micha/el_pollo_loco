class RestartController {
    constructor(world, canvas) {
        this.world = world;
        this.canvas = canvas;
        this.handleClick = (e) => this.onClick(e);
        this.handleMove = (e) => this.onMove(e);
        this.handleTouchStart = (e) => this.onTouchStart(e);
        this.handleTouchMove = (e) => this.onTouchMove(e);
        this.registerEvents();
    }

    /**
    * Registers all mouse and touch events for the restart button
    */
    registerEvents() {
        this.canvas.addEventListener("click", this.handleClick);
        this.canvas.addEventListener("mousemove", this.handleMove);
        this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
        this.canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    }

    onTouchStart(e) {
        e.preventDefault();
        this.onClick(e.touches[0]);
    }

    onTouchMove(e) {
        e.preventDefault();
        this.onMove(e.touches[0]);
    }

    destroy() {
        this.canvas.removeEventListener("click", this.handleClick);
        this.canvas.removeEventListener("mousemove", this.handleMove);
        this.canvas.removeEventListener("touchstart", this.handleTouchStart);
        this.canvas.removeEventListener("touchmove", this.handleTouchMove);
    }

    /**
    * Detects clicks on the restart button in win or game‑over screens
    */
    onClick(e) {
        const { x, y } = this.getMousePos(e);

        if (this.world.gameWon) {
            const b = this.world.winBackground.restartButton;
            const inside =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;

            if (inside) restartGame();
        }

        if (this.world.gameOver) {
            const b = this.world.gameOverBackground.restartButton;
            const inside =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;

            if (inside) restartGame();
        }
    }

    onMove(e) {
        const { x, y } = this.getMousePos(e);

        if (this.world.gameWon) {
            const b = this.world.winBackground.restartButton;
            this.world.winBackground.isHoveringRestart =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;
        }

        if (this.world.gameOver) {
            const b = this.world.gameOverBackground.restartButton;
            this.world.gameOverBackground.isHoveringRestart =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const baseW = 720;
        const baseH = 480;
        const scaleX = rect.width / baseW;
        const scaleY = rect.height / baseH;
        const scale = Math.min(scaleX, scaleY);
        const offsetX = (rect.width - baseW * scale) / 2;
        const offsetY = (rect.height - baseH * scale) / 2;

        return {
            x: (e.clientX - rect.left - offsetX) / scale,
            y: (e.clientY - rect.top - offsetY) / scale
        };
    }
}