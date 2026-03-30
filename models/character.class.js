class Character extends MovableObject {
    height = 280;
    y = 155;
    speed = 10;
    world;
    lastInputTime = Date.now();
    isSleeping = false;


    constructor() {
        super().loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png')
        this.loadImages(Images.IMAGES_WALKING_CHAR);
        this.loadImages(Images.IMAGES_JUMPING_CHAR);
        this.loadImages(Images.IMAGES_DEAD_CHAR);
        this.loadImages(Images.IMAGES_HURT_CHAR);
        this.loadImages(Images.IMAGES_SLEEP_CHAR);
        this.loadImages(Images.IMAGES_IDLE_CHAR);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.handleAnimation(), 100);
    }

    handleMovement() {
        this.updateIdleTimer();
        const kb = this.world.keyboard;

        if (kb.RIGHT && this.x < this.world.level.level_end_x) this.moveRight(), this.otherDirection = false;
        if (kb.LEFT && this.x > -300) this.moveLeft(), this.otherDirection = true;
        if (kb.UP && !this.isAboveGround()) this.jump();

        this.world.camera_x = -this.x + 100;
        
    }

    updateIdleTimer() {
        const kb = this.world.keyboard;

        if (kb.RIGHT || kb.LEFT || kb.UP || kb.DOWN || kb.SPACE || kb.D) {
            this.lastInputTime = Date.now();
            this.isSleeping = false;
        }
    }

handleAnimation() {
    const idleTime = Date.now() - this.lastInputTime;

    if (idleTime > 3000) {
        this.isSleeping = true;
    }

    if (this.isSleeping) {
        return this.playAnimation(Images.IMAGES_SLEEP_CHAR);
    }

    if (this.isDead()) return this.playAnimation(Images.IMAGES_DEAD_CHAR);
    if (this.isHurt()) return this.playAnimation(Images.IMAGES_HURT_CHAR);
    if (this.isAboveGround()) return this.playAnimation(Images.IMAGES_JUMPING_CHAR);
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
        return this.playAnimation(Images.IMAGES_WALKING_CHAR);

    return this.playAnimation(Images.IMAGES_IDLE_CHAR);
}



    jump() {
        this.speedY = 30;
    }

    drawBorder(ctx) {
        ctx.strokeStyle = 'red';
        ctx.rect(
            this.x + 15,
            this.y + 40,
            this.width - 40,
            this.height - 50
        );
        ctx.stroke();
    }

}