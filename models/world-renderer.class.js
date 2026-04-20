class WorldRenderer {
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    /**
    * Handles scaling, camera transform and world/UI rendering.
    */
    renderFrame() {
        this.clearCanvas();

        const { scale, offsetX, offsetY } = this.calculateCanvasTransform();

        this.ctx.save();
        this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

        this.applyCameraTransform();
        this.renderWorld();
        this.resetCameraTransform();

        this.world.renderUI();

        this.ctx.restore();
    }

    /**
    * Clears the entire canvas.
    */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
    * Calculates canvas scale and offsets for responsive rendering.
    */
    calculateCanvasTransform() {
        const canvasWidth = this.world.canvas.width;
        const canvasHeight = this.world.canvas.height;

        const scale = Math.min(
            canvasWidth / this.world.baseWidth,
            canvasHeight / this.world.baseHeight
        );

        const offsetX = (canvasWidth - this.world.baseWidth * scale) / 2;
        const offsetY = (canvasHeight - this.world.baseHeight * scale) / 2;

        return { scale, offsetX, offsetY };
    }

    /**
    * Applies the camera offset to the canvas.
    */
    applyCameraTransform() {
        this.ctx.translate(this.world.camera_x, 0);
    }

    /**
    * Resets the camera offset on the canvas.
    */
    resetCameraTransform() {
        this.ctx.translate(-this.world.camera_x, 0);
    }

    /**
    * Renders world objects (background, enemies, items, character).
    */
    renderWorld() {
        this.drawBackground();
        this.drawClouds();

        Collision.checkBottlePickup(this.world);
        this.world.addObjectsToMap(this.world.level.coins);
        this.world.addObjectsToMap(this.world.level.bottles);

        this.drawThrowables();
        this.drawEnemies();
        this.drawCharacter();

        this.world.coinBar.setCoins(this.world.character.coins || 0);
    }

    /**
    * Draws all background layers.
    */
    drawBackground() {
        this.world.addObjectsToMap(this.world.level.backgroundObjects);
    }

    /**
    * Draws the main character.
    */
    drawCharacter() {
        this.world.addToMap(this.world.character);
    }

    /**
    * Draws all clouds.
    */
    drawClouds() {
        this.world.addObjectsToMap(this.world.level.clouds);
    }

    /**
    * Draws all enemies.
    */
    drawEnemies() {
        this.world.level.enemies.forEach(enemy => {
            this.world.addToMap(enemy);
        });
    }

    /**
    * Draws all throwable objects.
    */
    drawThrowables() {
        this.world.addObjectsToMap(this.world.throwableObjects);
    }
}