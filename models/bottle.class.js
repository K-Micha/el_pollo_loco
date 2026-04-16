class Bottle extends MovableObject {
    width = 60;
    height = 80;

    /**
    * Creates a ground bottle with the chosen variant.
    */
    constructor(x, variant = 'ground1') {
        super();
        this.loadBottleImage(variant);
        this.x = x;
        this.y = this.getGroundY();
        this.speedY = 0;
        this.acceleration = 0;
        this.applyGravity = () => {};
    }

    /**
    * Loads the correct bottle image.
    */
    loadBottleImage(variant) {
        const variants = {
            ground1: 'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            ground2: 'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        };

        this.loadImage(variants[variant] || variants.ground1);
    }

    /**
    * Returns the bottle ground position.
    */
    getGroundY() {
        return 155 + 280 - this.height;
    }

    /**
    * Checks collision with a smaller bottle hitbox.
    */
    isColliding(obj) {
        return (
            this.x + this.width - 18 > obj.x &&
            this.x + 18 < obj.x + obj.width &&
            this.y + this.height - 12 > obj.y &&
            this.y + 12 < obj.y + obj.height
        );
    }
}