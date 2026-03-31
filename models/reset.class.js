class RestartController {
    constructor(world, canvas) {
        this.world = world;
        this.canvas = canvas;
        this.registerEvents();
    }

    registerEvents() {
        this.canvas.addEventListener("click", (e) => this.onClick(e));
        this.canvas.addEventListener("mousemove", (e) => this.onMove(e));
    }

    onClick(e) {
        if (!this.world.gameWon) return;

        const { x, y } = this.getMousePos(e);
        const b = this.world.winBackground.restartButton;

        const inside =
            x >= b.x && x <= b.x + b.width &&
            y >= b.y && y <= b.y + b.height;

        if (inside) location.reload();
    }

    onMove(e) {
        if (!this.world.gameWon) return;

        const { x, y } = this.getMousePos(e);
        const b = this.world.winBackground.restartButton;

        this.world.winBackground.isHoveringRestart =
            x >= b.x && x <= b.x + b.width &&
            y >= b.y && y <= b.y + b.height;
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}
