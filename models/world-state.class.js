class WorldState {
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    /**
    * Draws active game state screens.
    */
    draw() {
        if (this.world.gameOver) {
            this.drawGameOverState();
            return;
        }

        if (this.world.gameWon) {
            this.drawWinState();
        }
    }
    
    /**
    * Draws the game over screen with animation.
    */
    drawGameOverState() {
        this.world.forceExitFullscreenIfMobileBug();
        this.updateGameOverAnimation();
        this.world.gameOverBackground.draw(this.ctx, this.world);
        this.world.gameOverImage.draw(this.ctx);
    }

    /**
    * Updates the game over fade/scale animation.
    */
    updateGameOverAnimation() {
        if (!this.world.gameOver) return;

        if (this.world.gameOverPhase === 1) {
            this.world.gameOverImage.opacity = Math.min(this.world.gameOverImage.opacity + 0.01, 1);
            this.world.gameOverImage.scale = Math.max(this.world.gameOverImage.scale - 0.015, 1);

            if (this.world.gameOverImage.scale === 1) {
                this.world.gameOverPhase = 2;
            }
        }
    }

    /**
    * Draws the win screen with animation.
    */
    drawWinState() {
        this.world.forceExitFullscreenIfMobileBug();
        this.updateWinAnimation();
        this.world.winBackground.draw(this.ctx, this.world);
        this.world.winImage.draw(this.ctx);
    }

    /**
    * Updates the win animation based on current phase.
    */
    updateWinAnimation() {
        if (!this.world.gameWon) return;

        if (this.world.winPhase === 1) {
            this.animateWinPhaseOne();
        } else {
            this.animateWinPhaseTwo();
        }
    }

    /**
    * Animates the first win phase (fade in and scale down).
    */
    animateWinPhaseOne() {
        this.world.winImage.opacity = Math.min(this.world.winImage.opacity + 0.02, 1);
        this.world.winImage.scale = Math.max(this.world.winImage.scale - 0.03, 1);

        if (this.world.winImage.scale === 1) {
            this.world.winPhase = 2;
        }
    }

    /**
    * Animates the second win phase (fade out).
    */
    animateWinPhaseTwo() {
        this.world.winImage.opacity = Math.max(this.world.winImage.opacity - 0.02, 0);
    }
}