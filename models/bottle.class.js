class Bottle extends MovableObject {
    width = 60;
    height = 80;

    constructor(x, variant = 'ground1') {
        super();

        const variants = {
            ground1: 'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            ground2: 'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        };

        this.loadImage(variants[variant] || variants.ground1);

        this.x = x;

        const groundLine = 155 + 280;
        this.y = groundLine - this.height; 

        this.speedY = 0;
        this.acceleration = 0;
        this.applyGravity = () => {};
        this.offsetX = 0;
        this.offsetY = 0;
    }
}
