class RestartController {
    /**
     * Handles restart button input for game over / win screens
     */
    constructor(world, canvas) {
        this.world = world;
        this.canvas = canvas;
        this.registerEvents();
    }

    /**
   * Registers mouse and touch listeners for restart interaction
   */
    registerEvents() {
        this.canvas.addEventListener("click", (e) => this.onClick(e));
        this.canvas.addEventListener("mousemove", (e) => this.onMove(e));

        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.onClick(e.touches[0]);
        }, { passive: false });

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            this.onMove(e.touches[0]);
        }, { passive: false });
    }

    /**
    * Handles restart button clicks for win/lose screens
    */
    onClick(e) {
        const { x, y } = this.getMousePos(e);

        if (this.world.gameWon) {
            const b = this.world.winBackground.restartButton;
            const inside =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;

            if (inside) location.reload();
        }

        if (this.world.gameOver) {
            const b = this.world.gameOverBackground.restartButton;
            const inside =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height;

            if (inside) location.reload();
        }
    }

      /**
     * Updates hover state for restart button
     */
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

     /**
     * Converts mouse/touch coordinates to scaled canvas space
     */
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
