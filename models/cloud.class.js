class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
    * Creates a cloud with random starting position
    */
    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.loadImages(Images.IMAGES);
        this.x = Math.random() * 2500;
        this.animate();
    }

    /**
    * Starts continuous leftward movement.
    */
    animate() {
        setInterval(() => this.moveLeft(), 1000 / 60);
    }
}
