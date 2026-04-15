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
        const pos = this.getMousePos(e);

        if (this.world.gameWon) this.handleWinClick(pos);
        if (this.world.gameOver) this.handleGameOverClick(pos);
    }

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

    isInsideButton(pos, btn) {
        return (
            pos.x >= btn.x &&
            pos.x <= btn.x + btn.width &&
            pos.y >= btn.y &&
            pos.y <= btn.y + btn.height
        );
    }

    onMove(e) {
        const pos = this.getMousePos(e);

        if (this.world.gameWon) this.updateWinHover(pos);
        if (this.world.gameOver) this.updateGameOverHover(pos);
    }

    updateWinHover(pos) {
        const b = this.world.winBackground.restartButton;
        this.world.winBackground.isHoveringRestart = this.isInsideButton(pos, b);
    }

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

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const { scale, offsetX, offsetY } = this.getCanvasScale(rect);

        return {
            x: (e.clientX - rect.left - offsetX) / scale,
            y: (e.clientY - rect.top - offsetY) / scale
        };
    }

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