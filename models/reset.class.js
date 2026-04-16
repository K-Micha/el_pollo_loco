class RestartController {
    /**
     * Initializes restart input handling and registers all events.
     */
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

    /**
     * Handles touch start and forwards it as a click.
     */
    onTouchStart(e) {
        e.preventDefault();
        this.onClick(e.touches[0]);
    }

    /**
     * Handles touch movement and forwards it as hover.
     */
    onTouchMove(e) {
        e.preventDefault();
        this.onMove(e.touches[0]);
    }

    /**
     * Removes all registered event listeners.
     */
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
        const pos = this.getMousePos(e);

        if (this.world.gameWon) {
            this.handleWinClick(pos);
            this.handleHomeClick(pos);
        }

        if (this.world.gameOver) {
            this.handleGameOverClick(pos);
            this.handleHomeClick(pos);
        }
    }

    /**
     * Handles click detection for the Home button on win/game‑over screens.
     */
    handleHomeClick(pos) {
        const b = this.world.winBackground.homeButton;
        if (this.isInsideButton(pos, b)) {
            window.location.href = "index.html";
        }
    }

    /**
     * Handles restart click during win screen.
     */
    handleWinClick(pos) {
        const b = this.world.winBackground.restartButton;

        if (this.isInsideButton(pos, b)) {

            this.world.gameWon = false;
            this.world.gameOver = false;
            this.world.winPhase = 1;
            this.world.gameOverPhase = 1;

            restartGame();
        }
    }

    /**
     * Handles restart click during game‑over screen.
     */
    handleGameOverClick(pos) {
        const b = this.world.gameOverBackground.restartButton;

        if (this.isInsideButton(pos, b)) {

            this.world.gameWon = false;
            this.world.gameOver = false;
            this.world.winPhase = 1;
            this.world.gameOverPhase = 1;

            restartGame();
        }
    }

    /**
     * Returns true if the position is inside the button hitbox.
     */
    isInsideButton(pos, btn) {
        return (
            pos.x >= btn.x &&
            pos.x <= btn.x + btn.width &&
            pos.y >= btn.y &&
            pos.y <= btn.y + btn.height
        );
    }

    /**
     * Handles hover detection for win and game‑over screens.
     */
    onMove(e) {
        const pos = this.getMousePos(e);

        if (this.world.gameWon) this.updateWinHover(pos);
        if (this.world.gameOver) this.updateGameOverHover(pos);
    }

    /**
     * Updates hover state for win screen.
     */
    updateWinHover(pos) {
        const b = this.world.winBackground.restartButton;
        this.world.winBackground.isHoveringRestart = this.isInsideButton(pos, b);
    }

    /**
     * Updates hover state for game‑over screen.
     */
    updateGameOverHover(pos) {
        const b = this.world.gameOverBackground.restartButton;
        this.world.gameOverBackground.isHoveringRestart = this.isInsideButton(pos, b);
    }

    isInsideButton(pos, btn) {
        return (
            pos.x >= btn.x &&
            pos.x <= btn.x + btn.width &&
            pos.y >= btn.y &&
            pos.y <= btn.y + btn.height
        );
    }

    /**
     * Converts mouse/touch coordinates to canvas coordinates.
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const { scale, offsetX, offsetY } = this.getCanvasScale(rect);

        return {
            x: (e.clientX - rect.left - offsetX) / scale,
            y: (e.clientY - rect.top - offsetY) / scale
        };
    }

    /**
     *  Calculates canvas scale and offsets for responsive layout.
     */
    getCanvasScale(rect) {
        const baseW = 720;
        const baseH = 480;

        const scaleX = rect.width / baseW;
        const scaleY = rect.height / baseH;
        const scale = Math.min(scaleX, scaleY);

        return {
            scale,
            offsetX: (rect.width - baseW * scale) / 2,
            offsetY: (rect.height - baseH * scale) / 2
        };
    }
}