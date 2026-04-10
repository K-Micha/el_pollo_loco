class ThrowController {
    constructor(world) {
        this.world = world;
    }

    update() {
        if (this.canThrow()) {
            this.throwBottle();
        }
    }

    canThrow() {
        return this.world.keyboard.D
            && this.world.canThrow
            && this.world.bottlesCollected > 0;
    }

    /**
    * Spawns and throws a new bottle object
    */
    throwBottle() {
        this.world.canThrow = false;

        const char = this.world.character;
        const dir = char.otherDirection ? -1 : 1;
        const offsetX = char.otherDirection ? -20 : 100;

        let bottle = new ThrowableObject();
        bottle.direction = dir;

        bottle.throw(
            char.x + offsetX,
            char.y + 150
        );

        this.world.throwableObjects.push(bottle);
        this.world.bottlesCollected--;

        this.updateBottleUi();

        setTimeout(() => {
            this.world.canThrow = true;
        }, 600);
    }

    updateBottleUi() {
        this.world.bottleBar.setPercentage(
            (this.world.bottlesCollected / this.world.totalBottles) * 100
        );

        this.world.bottleBar.setBottles(
            this.world.bottlesCollected,
            this.world.totalBottles
        );
    }

    resetState() {
        if (!this.world.keyboard.D) {
            this.world.canThrow = true;
        }
    }
}