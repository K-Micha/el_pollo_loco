class MovableObject extends DrawableObject{
    height = 150;
    width = 100;
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    life = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 155;
    }

    drawBorder(ctx) {

        if ([Character, Chicken, SmallChicken, Endboss]
            .some(c => this instanceof c)){

            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    isColliding(mo){
    return this.x + this.width > mo.x &&
           this.y + this.height > mo.y &&
           this.x < mo.x + mo.width &&
           this.y < mo.y + mo.height;

    }

    hit(){
        this.life -= 5;
        if(this.life < 0) {
            this.life = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    isDead(){
        return this.life == 0;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;

    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 30;
    }
}
