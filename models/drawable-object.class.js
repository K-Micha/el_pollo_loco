class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
    * Loads a single image.
    */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
    * Preloads multiple images into the cache
    */
    loadImages(imgCache) {
        imgCache.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
    * Draws the object and optional text overlay
    */
    draw(ctx) {
        if (this instanceof BackgroundObject) {
            ctx.drawImage(
                this.img,
                1, 0, this.img.width - 1, this.img.height,
                Math.floor(this.x) - 1,
                this.y,
                this.width + 2,
                this.height
            );
        } else {
            ctx.drawImage(this.img, Math.floor(this.x), this.y, this.width, this.height);
        }

        if (this.drawText) {
            this.drawText(ctx);
        }
    }

    /**
    * Draws the object's hitbox for debugging
    */
    drawBorder(ctx) {

        if ([Character, Chicken, SmallChicken, Endboss]
            .some(c => this instanceof c)) {

            ctx.beginPath();
            /* ctx.lineWidth = '5'; */
            /* ctx.strokeStyle = 'blue'; */
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}