class StatusBar extends DrawableObject {
    percentage = 100;
    type = "life";

    /**
    * Initializes the status bar with default life images
    */
    constructor() {
        super();
        this.loadImages(Images.IMAGES);
        this.x = 30;
        this.y = 35;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
    * Updates percentage and selects correct bar image
    */
    setPercentage(percentage) {
        this.percentage = percentage;
        let Path = Images.IMAGES[this.resolvImageIndex()];
        this.img = this.imageCache[Path];
    }

    resolvImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        if (this.percentage > 0) return 0;
        return 0;
    }

    /**
   * Draws the text value (life %, coins, potions)
   */
    drawText(ctx) {
        this.applyTextStyle(ctx);

        const { text, x, y } = this.getCenteredTextData();
        this.drawShadowedText(ctx, text, x, y);
    }

    applyTextStyle(ctx) {
        ctx.font = "22px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }

    getCenteredTextData() {
        return {
            text: this.getText(),
            x: this.x + this.width / 2,
            y: this.y + this.height / 2 + 10.5
        };
    }

    drawShadowedText(ctx, text, x, y) {
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;

        ctx.fillText(text, x, y);

        ctx.shadowBlur = 0;
    }

    /**
     * Returns the displayed text based on bar type
     */
    getText() {
        if (this.type === "life") {
            return `${Math.round(this.percentage)}%`;
        }
        if (this.type === "coins") {
            return `${this.world.character.coins}`;
        }
        if (this.type === "potions") {
            return `${this.world.character.potions}`;
        }
        return "";
    }
}
