class WorldLifecycle {
    constructor(world) {
        this.world = world;
    }

    /**
    *  Stops all world loops and destroys restart controller.
    */
    stop() {
        this.world.isDestroyed = true;

        this.stopInterval();
        this.stopAnimationFrame();
        this.destroyRestartController();
    }

    /**
    * Clears the running interval if active.
    */
    stopInterval() {
        if (this.world.intervalId) {
            clearInterval(this.world.intervalId);
            this.world.intervalId = null;
        }
    }

    /**
    * Cancels the active animation frame if running.
    */
    stopAnimationFrame() {
        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }
    }

    /**
    * Destroys the restart controller if present.
    */
    destroyRestartController() {
        if (this.world.restartController) {
            this.world.restartController.destroy();
        }
    }
}