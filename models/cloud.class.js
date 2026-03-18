class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    IMAGES = [
        'assets/img/5_background/layers/4_clouds/1.png',
        'assets/img/5_background/layers/4_clouds/2.png'
    ];

    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png')
        this.loadImages(this.IMAGES);

        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

 }
