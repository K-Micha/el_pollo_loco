class BottleBar extends DrawableObject {
    percentage = 0;
    collected = 0;
    total = 9;

    /**
    * Initializes the bottle UI bar
    */
    constructor() {
        super();
        this.loadImages(Images.BOTTLE_BAR);
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }

    /**
    * Updates collected and total bottle values.
    */
    setBottles(collected, total) {
        this.collected = collected;
        this.total = total;
    }

    /**
    * Updates the bar image based on percentage.
    */
    setPercentage(p) {
        this.percentage = p;
        const path = Images.BOTTLE_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
    * Draws the bar and its text
    */
    draw(ctx) {
        super.draw(ctx);
        this.drawText(ctx);
    }

    /**
    * Returns the text value (e.g., "3/9").
    */
    getTextValue() {
        return `${this.collected}/${this.total}`;
    }

    /**
    * Returns the position where the text should be drawn.
    */
    getTextPosition() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2 + 10.5
        };
    }

    /**
    * Draws the bottle count text on the bar.
    */
    drawText(ctx) {
        const text = this.getTextValue();
        const pos = this.getTextPosition();

        ctx.font = "22px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.fillText(text, pos.x, pos.y);
        ctx.shadowBlur = 0;
    }

    /**
    * Resolves the image index based on percentage.
    */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}