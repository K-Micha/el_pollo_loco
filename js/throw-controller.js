class ThrowController {
    /**
    * Manages bottle throwing logic for the world.
    */
    constructor(world) {
        this.world = world;
    }

    /**
    * Updates throw state and triggers a throw if allowed.
    */
    update() {
        if (this.canThrow()) {
            this.throwBottle();
        }
    }

    /**
    * Returns true if the player can currently throw a bottle.
    */
    canThrow() {
        return this.world.keyboard.D
            && this.world.canThrow
            && this.world.bottlesCollected > 0;
    }

    /**
    * Spawns and throws a new bottle object.
    */
    throwBottle() {
        this.disableThrow();

        const bottle = this.createBottle();
        this.launchBottle(bottle);
        this.registerBottle(bottle);

        this.updateBottleUi();
        this.enableThrowWithDelay();
    }

    /**
    * Disables throwing temporarily.
    */
    disableThrow() {
        this.world.canThrow = false;
    }

    /**
    * Creates a new bottle with direction.
    */
    createBottle() {
        const bottle = new ThrowableObject();
        bottle.direction = this.getThrowDirection();
        return bottle;
    }

    /**
    * Returns throw direction based on character.
    */
    getThrowDirection() {
        return this.world.character.otherDirection ? -1 : 1;
    }

    /**
    * Launches the bottle from character position.
    */
    launchBottle(bottle) {
        const char = this.world.character;
        const offsetX = char.otherDirection ? -20 : 100;

        bottle.throw(
            char.x + offsetX,
            char.y + 150
        );
    }

    /**
    * Adds bottle to world and updates count.
    */
    registerBottle(bottle) {
        this.world.throwableObjects.push(bottle);
        this.world.bottlesCollected--;
    }

    /**
    * Enables throwing again after delay.
    */
    enableThrowWithDelay() {
        setTimeout(() => {
            this.world.canThrow = true;
        }, 600);
    }

    /**
    * Updates the UI elements for bottle count and percentage.
    */
    updateBottleUi() {
        this.world.bottleBar.setPercentage(
            (this.world.bottlesCollected / this.world.totalBottles) * 100
        );

        this.world.bottleBar.setBottles(
            this.world.bottlesCollected,
            this.world.totalBottles
        );
    }

    /**
    * Resets throw state when the throw key is released.
    */
    resetState() {
        if (!this.world.keyboard.D) {
            this.world.canThrow = true;
        }
    }
}