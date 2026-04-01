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
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}
